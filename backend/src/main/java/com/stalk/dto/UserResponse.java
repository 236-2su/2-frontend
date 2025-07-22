package com.stalk.dto;

import com.stalk.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    
    private Long id;
    private String userId;
    private String name;
    private String nickname;
    private String contact;
    private String email;
    private User.UserType userType;
    private String profilePhotoPath;
    private String qualification;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
    
    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .name(user.getName())
                .nickname(user.getNickname())
                .contact(user.getContact())
                .email(user.getEmail())
                .userType(user.getUserType())
                .profilePhotoPath(user.getProfilePhotoPath())
                .qualification(user.getQualification())
                .emailVerified(user.getEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
} 