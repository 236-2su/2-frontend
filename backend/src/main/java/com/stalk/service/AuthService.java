package com.stalk.service;

import com.stalk.dto.LoginRequest;
import com.stalk.dto.SignupRequest;
import com.stalk.dto.AuthResponse;
import com.stalk.dto.UserResponse;
import com.stalk.entity.User;
import com.stalk.repository.UserRepository;
import com.stalk.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final FileStorageService fileStorageService;
    private final EmailService emailService;
    
    public AuthResponse signup(SignupRequest request) {
        // 중복 검사
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new RuntimeException("이미 존재하는 닉네임입니다.");
        }
        
        // 파일 업로드 처리
        String profilePhotoPath = null;
        String qualificationFilePath = null;
        
        if (request.getProfilePhoto() != null && !request.getProfilePhoto().isEmpty()) {
            profilePhotoPath = fileStorageService.storeFile(request.getProfilePhoto(), "profiles");
        }
        
        if (request.getQualificationFile() != null && !request.getQualificationFile().isEmpty()) {
            qualificationFilePath = fileStorageService.storeFile(request.getQualificationFile(), "qualifications");
        }
        
        // 사용자 생성
        User user = User.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .nickname(request.getNickname())
                .password(passwordEncoder.encode(request.getPassword()))
                .contact(request.getContact())
                .email(request.getEmail())
                .userType(request.getUserType())
                .profilePhotoPath(profilePhotoPath)
                .qualification(request.getQualification())
                .qualificationFilePath(qualificationFilePath)
                .emailVerified(false)
                .enabled(true)
                .build();
        
        User savedUser = userRepository.save(user);
        
        // 이메일 인증 메일 발송
        emailService.sendEmailVerification(savedUser.getEmail(), savedUser.getUserId());
        
        // JWT 토큰 생성
        String token = tokenProvider.generateToken(savedUser.getUserId());
        
        return new AuthResponse(token, UserResponse.from(savedUser));
    }
    
    public AuthResponse login(LoginRequest request) {
        // 사용자 인증
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUserId(), request.getPassword())
        );
        
        // JWT 토큰 생성
        String token = tokenProvider.generateToken(request.getUserId());
        
        // 사용자 정보 조회
        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        return new AuthResponse(token, UserResponse.from(user));
    }
    
    public boolean checkUserIdDuplicate(String userId) {
        return userRepository.existsByUserId(userId);
    }
    
    public boolean checkNicknameDuplicate(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
    
    public void sendEmailVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        emailService.sendEmailVerification(email, user.getUserId());
    }
    
    public void verifyEmail(String userId, String verificationCode) {
        if (emailService.verifyEmailCode(userId, verificationCode)) {
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            
            user.setEmailVerified(true);
            userRepository.save(user);
        } else {
            throw new RuntimeException("인증 코드가 올바르지 않습니다.");
        }
    }
} 