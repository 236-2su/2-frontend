package com.Stalk.project.community.dto.in;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommunityCommentUpdateRequestDto {

  @NotBlank(message = "댓글 내용은 필수입니다.")
  @Size(max = 1000, message = "댓글은 1000자 이내로 작성해주세요.")
  private String content;

}