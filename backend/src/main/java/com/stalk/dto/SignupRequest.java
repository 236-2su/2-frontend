package com.stalk.dto;

import com.stalk.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class SignupRequest {
    
    @NotBlank(message = "아이디는 필수입니다")
    private String userId;
    
    @NotBlank(message = "이름은 필수입니다")
    private String name;
    
    @NotBlank(message = "닉네임은 필수입니다")
    private String nickname;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;
    
    @NotBlank(message = "연락처는 필수입니다")
    private String contact;
    
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @NotBlank(message = "이메일은 필수입니다")
    private String email;
    
    @NotNull(message = "사용자 타입은 필수입니다")
    private User.UserType userType;
    
    // 전문가 관련 필드
    private String qualification;
    private MultipartFile profilePhoto;
    private MultipartFile qualificationFile;
    
    // 약관 동의
    @NotNull(message = "개인정보 수집·이용 동의는 필수입니다")
    private Boolean privacyAgreement;
    
    @NotNull(message = "개인정보 제3자 제공 동의는 필수입니다")
    private Boolean thirdPartyAgreement;
    
    @NotNull(message = "필수 약관 동의는 필수입니다")
    private Boolean termsAgreement;
} 