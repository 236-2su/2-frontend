package com.stalk.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();
    
    public void sendEmailVerification(String email, String userId) {
        String verificationCode = generateVerificationCode();
        
        // 메모리에 인증 코드 저장
        verificationCodes.put("email_verification:" + userId, verificationCode);
        
        // 이메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[Stalk] 이메일 인증 코드");
        message.setText(String.format(
            "안녕하세요, Stalk입니다.\n\n" +
            "회원가입을 위한 이메일 인증 코드는 다음과 같습니다:\n\n" +
            "인증 코드: %s\n\n" +
            "이 코드는 5분 후에 만료됩니다.\n\n" +
            "감사합니다.",
            verificationCode
        ));
        
        try {
            mailSender.send(message);
            log.info("Verification email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", email, e);
            throw new RuntimeException("이메일 발송에 실패했습니다.");
        }
    }
    
    public boolean verifyEmailCode(String userId, String inputCode) {
        String storedCode = verificationCodes.get("email_verification:" + userId);
        
        if (storedCode != null && storedCode.equals(inputCode)) {
            // 인증 성공 시 코드 삭제
            verificationCodes.remove("email_verification:" + userId);
            return true;
        }
        
        return false;
    }
    
    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
} 