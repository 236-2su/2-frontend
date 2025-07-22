package com.stalk.controller;

import com.stalk.dto.AuthResponse;
import com.stalk.dto.LoginRequest;
import com.stalk.dto.SignupRequest;
import com.stalk.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @ModelAttribute SignupRequest request) {
        try {
            AuthResponse response = authService.signup(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/check-userid/{userId}")
    public ResponseEntity<Boolean> checkUserIdDuplicate(@PathVariable String userId) {
        boolean isDuplicate = authService.checkUserIdDuplicate(userId);
        return ResponseEntity.ok(isDuplicate);
    }
    
    @GetMapping("/check-nickname/{nickname}")
    public ResponseEntity<Boolean> checkNicknameDuplicate(@PathVariable String nickname) {
        boolean isDuplicate = authService.checkNicknameDuplicate(nickname);
        return ResponseEntity.ok(isDuplicate);
    }
    
    @PostMapping("/send-email-verification")
    public ResponseEntity<String> sendEmailVerification(@RequestParam String email) {
        try {
            authService.sendEmailVerification(email);
            return ResponseEntity.ok("인증 이메일이 발송되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String userId, 
                                            @RequestParam String verificationCode) {
        try {
            authService.verifyEmail(userId, verificationCode);
            return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 