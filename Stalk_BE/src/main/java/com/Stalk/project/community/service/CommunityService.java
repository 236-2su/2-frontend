package com.Stalk.project.community.service;

import com.Stalk.project.auth.mock.util.TokenUtils;
import com.Stalk.project.community.dao.CommunityMapper;
import com.Stalk.project.community.dto.in.CommunityCommentCreateRequestDto;
import com.Stalk.project.community.dto.in.CommunityCommentListRequestDto;
import com.Stalk.project.community.dto.in.CommunityCommentUpdateRequestDto;
import com.Stalk.project.community.dto.in.CommunityPostCreateRequestDto;
import com.Stalk.project.community.dto.in.CommunityPostDetailRequestDto;
import com.Stalk.project.community.dto.in.CommunityPostListRequestDto;
import com.Stalk.project.community.dto.in.CommunityPostUpdateRequestDto;
import com.Stalk.project.community.dto.in.PostCategory;
import com.Stalk.project.community.dto.out.CommunityCommentCreateResponseDto;
import com.Stalk.project.community.dto.out.CommunityCommentDeleteResponseDto;
import com.Stalk.project.community.dto.out.CommunityCommentDto;
import com.Stalk.project.community.dto.out.CommunityCommentPermissionDto;
import com.Stalk.project.community.dto.out.CommunityCommentUpdateResponseDto;
import com.Stalk.project.community.dto.out.CommunityPostCreateResponseDto;
import com.Stalk.project.community.dto.out.CommunityPostDeleteResponseDto;
import com.Stalk.project.community.dto.out.CommunityPostDetailDto;
import com.Stalk.project.community.dto.out.CommunityPostPermissionDto;
import com.Stalk.project.community.dto.out.CommunityPostSummaryDto;
import com.Stalk.project.community.dto.out.CommunityPostUpdateResponseDto;
import com.Stalk.project.community.dto.out.WritePermissionResponseDto;
import com.Stalk.project.exception.BaseException;
import com.Stalk.project.response.BaseResponseStatus;
import com.Stalk.project.util.CursorPage;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityService {

  private final CommunityMapper communityMapper;

  /**
   * 커뮤니티 글 목록 조회
   */
  public CursorPage<CommunityPostSummaryDto> getCommunityPosts(
      CommunityPostListRequestDto requestDto) {
    log.info("커뮤니티 글 목록 조회 - 카테고리: {}, 페이지: {}",
        requestDto.getCategory(), requestDto.getPageNo());

    // 입력 검증
    validatePageRequest(requestDto);

    // 카테고리 처리
    PostCategory postCategory = requestDto.getCategory();
    String categoryFilter = postCategory == PostCategory.ALL ? null : postCategory.name();

    // 데이터 조회
    List<CommunityPostSummaryDto> posts = communityMapper.findCommunityPosts(
        categoryFilter, requestDto);

    // 카테고리 표시명 설정
    posts.forEach(post -> {
      PostCategory category = PostCategory.valueOf(post.getCategory());
      post.setCategoryDisplayName(category.getDisplayName());
    });

    // CursorPage 처리
    boolean hasNext = posts.size() > requestDto.getPageSize();
    if (hasNext) {
      posts.remove(posts.size() - 1);
    }

    return CursorPage.<CommunityPostSummaryDto>builder()
        .content(posts)
        .nextCursor(null) // 커뮤니티는 단순 페이지네이션으로 처리
        .hasNext(hasNext)
        .pageSize(requestDto.getPageSize())
        .pageNo(requestDto.getPageNo())
        .build();
  }

  /**
   * 글쓰기 권한 체크
   */
  public WritePermissionResponseDto checkWritePermission(String authorizationHeader) {
    log.info("글쓰기 권한 체크 시작");

    try {
      // 토큰에서 사용자 정보 추출
      Long userId = TokenUtils.extractUserId(authorizationHeader);
      String userRole = TokenUtils.extractRole(authorizationHeader);

      log.info("토큰에서 추출된 사용자 정보 - userId: {}, role: {}", userId, userRole);

      // 사용자 정보 조회
      String userName = communityMapper.findUserNameById(userId);
      if (userName == null) {
        throw new BaseException(BaseResponseStatus.USER_NOT_FOUND);
      }

      // 권한 확인 (모든 사용자 글 작성 가능)
      boolean canWrite = true;

      // 사용자 역할에 따른 사용 가능 카테고리 결정
      List<String> availableCategories;
      if ("USER".equals(userRole)) {
        // 일반 사용자: QUESTION만 작성 가능
        availableCategories = Arrays.asList("QUESTION");
      } else {
        // 전문가: 모든 카테고리 작성 가능
        availableCategories = Arrays.stream(PostCategory.values())
            .filter(category -> category != PostCategory.ALL)
            .map(PostCategory::name)
            .collect(Collectors.toList());
      }

      return WritePermissionResponseDto.builder()
          .canWrite(canWrite)
          .userRole(userRole)
          .userName(userName)
          .availableCategories(availableCategories)
          .message("글 작성이 가능합니다.")
          .build();

    } catch (BaseException e) {
      log.warn("권한 체크 실패: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("권한 체크 중 오류 발생", e);
      throw new BaseException(BaseResponseStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 커뮤니티 글 작성
   */
  @Transactional
  public CommunityPostCreateResponseDto createCommunityPost(String authorizationHeader,
      CommunityPostCreateRequestDto requestDto) {
    log.info("커뮤니티 글 작성 시작: {}", requestDto);

    try {
      // 토큰에서 사용자 정보 추출
      Long userId = TokenUtils.extractUserId(authorizationHeader);
      String userRole = TokenUtils.extractRole(authorizationHeader);

      log.info("글 작성자 정보 - userId: {}, role: {}", userId, userRole);

      // 권한 검증
      validateWritePermission(userRole, requestDto.getCategory());

      // 글 작성
      int insertedRows = communityMapper.createCommunityPost(userId, requestDto);
      if (insertedRows != 1) {
        throw new BaseException(BaseResponseStatus.COMMUNITY_POST_CREATE_FAILED);
      }

      // 생성된 글 ID 조회
      Long postId = communityMapper.getLastInsertedPostId();
      if (postId == null) {
        throw new BaseException(BaseResponseStatus.COMMUNITY_POST_CREATE_FAILED);
      }

      log.info("커뮤니티 글 작성 완료 - postId: {}", postId);

      return CommunityPostCreateResponseDto.builder()
          .postId(postId)
          .title(requestDto.getTitle())
          .category(requestDto.getCategory().name())
          .message("글이 성공적으로 작성되었습니다.")
          .createdAt(LocalDateTime.now())
          .build();

    } catch (BaseException e) {
      log.warn("글 작성 실패: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      log.error("글 작성 중 오류 발생", e);
      throw new BaseException(BaseResponseStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 글 작성 권한 검증
   */
  private void validateWritePermission(String userRole, PostCategory category) {
    // 일반 사용자는 QUESTION만 작성 가능
    if ("USER".equals(userRole) && category != PostCategory.QUESTION) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_WRITE_PERMISSION_DENIED);
    }

    // ADVISOR는 모든 카테고리 작성 가능 (추가 검증 없음)
  }

  /**
   * 페이지 요청 검증
   */
  private void validatePageRequest(CommunityPostListRequestDto requestDto) {
    if (requestDto.getPageNo() < 1) {
      throw new IllegalArgumentException("페이지 번호는 1 이상이어야 합니다.");
    }

    if (requestDto.getPageSize() < 1 || requestDto.getPageSize() > 50) {
      throw new IllegalArgumentException("페이지 크기는 1~50 사이여야 합니다.");
    }
  }

  /**
   * 커뮤니티 글 상세 조회
   */
  public CommunityPostDetailDto getCommunityPostDetail(Long postId,
      CommunityPostDetailRequestDto requestDto) {
    // 1. 글 상세 정보 조회
    CommunityPostDetailDto postDetail = communityMapper.findCommunityPostDetail(postId);

    if (postDetail == null) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_POST_NOT_FOUND);
    }

    // 2. 댓글 목록 조회 (페이징 적용)
    List<CommunityCommentDto> comments = communityMapper.findCommunityPostComments(
        postId,
        requestDto.getCommentOffset(),
        requestDto.getCommentLimitPlusOne()
    );

    // 3. hasNext 판단 및 마지막 항목 제거
    boolean hasNext = comments.size() > requestDto.getCommentPageSize();
    if (hasNext) {
      comments.remove(comments.size() - 1);
    }

    // 4. CursorPage로 댓글 래핑
    CursorPage<CommunityCommentDto> commentPage = CursorPage.<CommunityCommentDto>builder()
        .content(comments)
        .nextCursor(hasNext ? (long) (requestDto.getCommentPageNo() + 1) : null)
        .hasNext(hasNext)
        .pageSize(requestDto.getCommentPageSize())
        .pageNo(requestDto.getCommentPageNo())
        .build();

    // 5. 댓글 페이지 정보를 글 상세 정보에 설정
    postDetail.setComments(commentPage);

    return postDetail;
  }

  /**
   * 커뮤니티 글 수정
   */
  public CommunityPostUpdateResponseDto updateCommunityPost(
      Long postId,
      Long currentUserId,
      String currentUserRole,
      CommunityPostUpdateRequestDto requestDto
  ) {
    // 1. 글 존재 및 권한 확인
    CommunityPostPermissionDto permission = communityMapper.findPostPermission(postId);

    if (permission == null) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_POST_NOT_FOUND);
    }

    if (permission.isDeleted()) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_POST_NOT_FOUND);
    }

    if (!permission.hasPermission(currentUserId, currentUserRole)) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_ACCESS_DENIED);
    }

    // 2. 권한별 카테고리 제한 확인
    if ("USER".equals(currentUserRole) && requestDto.getCategory() != PostCategory.QUESTION) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_ACCESS_DENIED);
    }

    // 3. 글 수정 실행
    int updatedRows = communityMapper.updateCommunityPost(
        postId,
        requestDto.getTitle(),
        requestDto.getContent(),
        requestDto.getCategory().name()
    );

    if (updatedRows == 0) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_ACCESS_DENIED);
    }

    // 4. 응답 생성
    return CommunityPostUpdateResponseDto.builder()
        .postId(postId)
        .updatedAt(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX")
            .format(ZonedDateTime.now(ZoneId.of("Asia/Seoul"))))
        .message("글이 성공적으로 수정되었습니다.")
        .build();
  }

  /**
   * 커뮤니티 글 삭제
   */
  public CommunityPostDeleteResponseDto deleteCommunityPost(
      Long postId,
      Long currentUserId,
      String currentUserRole
  ) {
    // 1. 글 존재 및 권한 확인
    CommunityPostPermissionDto permission = communityMapper.findPostPermission(postId);

    if (permission == null) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_POST_NOT_FOUND);
    }

    if (permission.isDeleted()) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_POST_NOT_FOUND);
    }

    if (!permission.hasPermission(currentUserId, currentUserRole)) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_ACCESS_DENIED);
    }

    // 2. 트랜잭션으로 댓글 삭제 후 글 삭제
    try {
      // 2-1. 글에 달린 모든 댓글 물리적 삭제
      communityMapper.deleteAllCommentsOfPost(postId);

      // 2-2. 글 논리적 삭제
      int deletedRows = communityMapper.deleteCommunityPost(postId);

      if (deletedRows == 0) {
        throw new BaseException(BaseResponseStatus.POST_DELETE_FAILED);
      }

    } catch (Exception e) {
      throw new BaseException(BaseResponseStatus.POST_DELETE_FAILED);
    }

    // 3. 응답 생성
    return CommunityPostDeleteResponseDto.builder()
        .postId(postId)
        .deletedAt(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssXXX")
            .format(ZonedDateTime.now(ZoneId.of("Asia/Seoul"))))
        .message("글이 성공적으로 삭제되었습니다.")
        .build();
  }

  // CommunityService.java에 추가할 댓글 관련 메서드들

  /**
   * 댓글 작성
   */
  public CommunityCommentCreateResponseDto createComment(Long postId, Long userId,
      CommunityCommentCreateRequestDto requestDto) {
    // 1. 글 존재 여부 확인
    if (!communityMapper.existsPostById(postId)) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_POST_NOT_FOUND);
    }

    // 2. 댓글 생성
    try {
      communityMapper.createComment(postId, userId, requestDto.getContent());
      Long commentId = communityMapper.getLastInsertedCommentId();

      return CommunityCommentCreateResponseDto.builder()
          .commentId(commentId)
          .createdAt(LocalDateTime.now()
              .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'+09:00'")))
          .message("댓글이 성공적으로 작성되었습니다.")
          .build();

    } catch (Exception e) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_COMMENT_CREATE_FAILED);
    }
  }

  /**
   * 댓글 목록 조회 (더보기용)
   */
  public CursorPage<CommunityCommentDto> getCommentList(Long postId,
      CommunityCommentListRequestDto requestDto) {
    // 1. 글 존재 여부 확인
    if (!communityMapper.existsPostById(postId)) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_POST_NOT_FOUND);
    }

    // 2. 댓글 목록 조회
    List<CommunityCommentDto> comments = communityMapper.findCommentsByPostId(postId, requestDto);

    // 3. 페이징 처리
    boolean hasNext = comments.size() > requestDto.getPageSize();
    if (hasNext) {
      comments.remove(comments.size() - 1);
    }

    return CursorPage.<CommunityCommentDto>builder()
        .content(comments)
        .nextCursor(null) // 댓글은 단순 페이징으로 cursor 불필요
        .hasNext(hasNext)
        .pageSize(requestDto.getPageSize())
        .pageNo(requestDto.getPageNo())
        .build();
  }

  /**
   * 댓글 수정
   */
  public CommunityCommentUpdateResponseDto updateComment(Long commentId, Long userId,
      String userRole, CommunityCommentUpdateRequestDto requestDto) {
    // 1. 댓글 존재 및 권한 확인
    CommunityCommentPermissionDto permission = communityMapper.findCommentPermission(commentId);
    if (permission == null) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_COMMENT_NOT_FOUND);
    }

    // 2. 수정 권한 확인 (작성자 본인 또는 관리자)
    if (!permission.getUserId().equals(userId) && !"ADMIN".equals(userRole)) {
      throw new BaseException(BaseResponseStatus.COMMENT_UPDATE_FORBIDDEN);
    }

    // 3. 댓글 수정
    try {
      int updatedRows = communityMapper.updateComment(commentId, requestDto.getContent());
      if (updatedRows == 0) {
        throw new BaseException(BaseResponseStatus.COMMENT_UPDATE_FAILED);
      }

      return CommunityCommentUpdateResponseDto.builder()
          .commentId(commentId)
          .updatedAt(LocalDateTime.now()
              .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'+09:00'")))
          .message("댓글이 성공적으로 수정되었습니다.")
          .build();

    } catch (BaseException e) {
      throw e;
    } catch (Exception e) {
      throw new BaseException(BaseResponseStatus.COMMENT_UPDATE_FAILED);
    }
  }

  /**
   * 댓글 삭제
   */
  public CommunityCommentDeleteResponseDto deleteComment(Long commentId, Long userId,
      String userRole) {
    // 1. 댓글 존재 및 권한 확인
    CommunityCommentPermissionDto permission = communityMapper.findCommentPermission(commentId);
    if (permission == null) {
      throw new BaseException(BaseResponseStatus.COMMUNITY_COMMENT_NOT_FOUND);
    }

    // 2. 삭제 권한 확인 (작성자 본인 또는 관리자)
    if (!permission.getUserId().equals(userId) && !"ADMIN".equals(userRole)) {
      throw new BaseException(BaseResponseStatus.COMMENT_DELETE_FORBIDDEN);
    }

    // 3. 댓글 삭제
    try {
      int deletedRows = communityMapper.deleteComment(commentId);
      if (deletedRows == 0) {
        throw new BaseException(BaseResponseStatus.COMMENT_DELETE_FAILED);
      }

      return CommunityCommentDeleteResponseDto.builder()
          .commentId(commentId)
          .deletedAt(LocalDateTime.now()
              .format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'+09:00'")))
          .message("댓글이 성공적으로 삭제되었습니다.")
          .build();

    } catch (BaseException e) {
      throw e;
    } catch (Exception e) {
      throw new BaseException(BaseResponseStatus.COMMENT_DELETE_FAILED);
    }
  }
}