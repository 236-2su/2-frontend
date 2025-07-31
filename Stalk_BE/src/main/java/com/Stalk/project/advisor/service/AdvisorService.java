package com.Stalk.project.advisor.service;

import com.Stalk.project.advisor.dao.AdvisorMapper;
import com.Stalk.project.advisor.dto.in.AdvisorBlockedTimesRequestDto;
import com.Stalk.project.advisor.dto.in.AdvisorListRequestDto;
import com.Stalk.project.advisor.dto.out.*;
import com.Stalk.project.exception.BaseException;
import com.Stalk.project.response.BaseResponseStatus;
import com.Stalk.project.util.CursorPage;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdvisorService {

  private final AdvisorMapper advisorMapper;

  public CursorPage<AdvisorResponseDto> getAdvisorList(AdvisorListRequestDto requestDto) {
    // cursor가 null인 경우 첫 페이지 조회
    if (requestDto.getCursor() == null) {
      requestDto.setCursor(0L); // 1L → 0L로 변경
    }

    // limit + 1로 조회하여 다음 페이지 존재 여부 확인
    List<AdvisorResponseDto> advisors = advisorMapper.findAllAdvisorsSummary(requestDto);

    boolean hasNext = advisors.size() > requestDto.getPageSize();
    Long nextCursor = null;

    // 다음 페이지가 있으면 마지막 요소 제거하고 nextCursor 설정
    if (hasNext) {
      AdvisorResponseDto lastAdvisor = advisors.remove(advisors.size() - 1);
      nextCursor = lastAdvisor.getId();
    }

    return CursorPage.<AdvisorResponseDto>builder()
        .content(advisors)
        .nextCursor(nextCursor)
        .hasNext(hasNext)
        .pageSize(requestDto.getPageSize())
        .pageNo(requestDto.getPageNo())
        .build();
  }

  /**
   * 어드바이저 상세 정보 조회 (확장된 버전)
   */
  public AdvisorDetailResponseDto getAdvisorDetail(Long advisorId) {
    // 1. 어드바이저 기본 정보 조회
    AdvisorDetailResponseDto advisorDetail = advisorMapper.findAdvisorDetailById(advisorId);

    if (advisorDetail == null) {
      throw new BaseException(BaseResponseStatus.ADVISOR_NOT_FOUND); // 404 에러
    }

    // 2. 경력사항 조회
    List<AdvisorDetailResponseDto.CareerDto> careers = advisorMapper.findAdvisorCareers(advisorId);
    advisorDetail.setCareers(careers);

    // 3. 자격증 조회
    List<AdvisorDetailResponseDto.CertificationDto> certificates = advisorMapper.findAdvisorCertificates(advisorId);
    advisorDetail.setCertificates(certificates);

    // 4. 리뷰 조회 (커뮤니티 프로필 이미지 포함)
    List<AdvisorDetailResponseDto.ReviewDto> reviews = advisorMapper.findAdvisorReviewsWithProfile(advisorId);
    advisorDetail.setReviews(reviews);

    // 5. 더 많은 리뷰가 있는지 확인 (10개를 가져왔으므로 정확히 10개면 더 있을 수 있음)
    boolean hasMoreReviews = reviews.size() == 10;
    advisorDetail.setHas_more_reviews(hasMoreReviews);

    // 6. preferredTradeStyle enum을 한글로 변환
    String preferredTradeStyleKorean = convertTradeStyleToKorean(
        advisorDetail.getPreferred_trade_style());
    advisorDetail.setPreferred_trade_style(preferredTradeStyleKorean);

    return advisorDetail;
  }

  /**
   * 투자 성향 enum을 한글로 변환
   */
  private String convertTradeStyleToKorean(String tradeStyle) {
    if (tradeStyle == null) return null;

    return switch (tradeStyle.toUpperCase()) {
      case "SHORT" -> "단기";
      case "MID_SHORT" -> "단중기";     // 새로 추가
      case "MID" -> "중기";
      case "MID_LONG" -> "중장기";      // 새로 추가
      case "LONG" -> "장기";
      default -> tradeStyle;
    };
  }

  /**
   * 전문가의 예약 가능한 시간 슬롯 조회 (디버깅 버전)
   */
  public AvailableTimeSlotsResponseDto getAvailableTimeSlots(Long advisorId, LocalDate date) {
    System.out.println("=== 시간 슬롯 조회 시작 ===");
    System.out.println("advisorId: " + advisorId + ", date: " + date);

    // 1. 기본 검증
    validateDateAndAdvisor(advisorId, date);

    // 2. 주말인 경우 빈 배열 반환
    if (isWeekend(date)) {
      return AvailableTimeSlotsResponseDto.builder()
          .date(date)
          .timeSlots(new ArrayList<>())
          .build();
    }

    // 3. 기본 시간 슬롯 생성 (09:00 ~ 20:00, 1시간 간격)
    List<LocalTime> baseTimeSlots = generateBaseTimeSlots();
    System.out.println("기본 시간 슬롯: " + baseTimeSlots);

    // 4. 차단된 시간과 예약된 시간 조회
    List<BlockedTimeDto> blockedTimes = advisorMapper.getBlockedTimes(advisorId, date);
    List<ReservedTimeDto> reservedTimes = advisorMapper.getReservedTimes(advisorId, date);

    System.out.println("차단된 시간 조회 결과: " + blockedTimes);
    System.out.println("예약된 시간 조회 결과: " + reservedTimes);

    // 5. 차단/예약된 시간 Set으로 변환 (각각 별도 메서드로 처리)
    Set<LocalTime> blockedTimeSet = convertBlockedTimesToSet(blockedTimes);
    Set<LocalTime> reservedTimeSet = convertReservedTimesToSet(reservedTimes);

    System.out.println("변환된 차단 시간 Set: " + blockedTimeSet);
    System.out.println("변환된 예약 시간 Set: " + reservedTimeSet);

    // 6. 시간 슬롯별 가용성 판단
    List<AvailableTimeSlotsResponseDto.TimeSlot> timeSlots = baseTimeSlots.stream()
        .map(time -> createTimeSlot(time, blockedTimeSet, reservedTimeSet))
        .collect(Collectors.toList());

    System.out.println("최종 시간 슬롯 결과:");
    timeSlots.forEach(slot ->
        System.out.println("  " + slot.getTime() + " - available: " + slot.getIsAvailable() +
            ", blocked: " + slot.getIsBlocked() + ", reserved: " + slot.getIsReserved())
    );
    System.out.println("=== 시간 슬롯 조회 완료 ===");

    return AvailableTimeSlotsResponseDto.builder()
        .date(date)
        .timeSlots(timeSlots)
        .build();
  }

  /**
   * 날짜와 전문가 검증
   */
  private void validateDateAndAdvisor(Long advisorId, LocalDate date) {
    // 과거 날짜 체크
    if (date.isBefore(LocalDate.now())) {
      throw new BaseException(BaseResponseStatus.PAST_DATE_NOT_ALLOWED);
    }

    // 당일 예약 불가 체크
    if (date.equals(LocalDate.now())) {
      throw new BaseException(BaseResponseStatus.SAME_DAY_RESERVATION_NOT_ALLOWED_NEW);
    }

    // 전문가 존재 여부 확인
    try {
      AdvisorDetailResponseDto advisor = getAdvisorDetail(advisorId);
      if (advisor == null) {
        throw new BaseException(BaseResponseStatus.ADVISOR_NOT_FOUND);
      }
    } catch (Exception e) {
      throw new BaseException(BaseResponseStatus.ADVISOR_NOT_FOUND);
    }
  }

  /**
   * 주말 여부 확인
   */
  private boolean isWeekend(LocalDate date) {
    DayOfWeek dayOfWeek = date.getDayOfWeek();
    return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
  }

  /**
   * 기본 시간 슬롯 생성 (09:00 ~ 20:00)
   */
  private List<LocalTime> generateBaseTimeSlots() {
    List<LocalTime> timeSlots = new ArrayList<>();
    for (int hour = 9; hour < 21; hour++) { // 09:00 ~ 20:00 (21시 제외)
      timeSlots.add(LocalTime.of(hour, 0));
    }
    return timeSlots;
  }

  /**
   * 차단된 시간을 LocalTime Set으로 변환
   */
  private Set<LocalTime> convertBlockedTimesToSet(List<BlockedTimeDto> blockedTimes) {
    return blockedTimes.stream()
        .flatMap(blocked -> {
          // 시작 시간부터 종료 시간까지의 모든 시간 생성
          List<LocalTime> times = new ArrayList<>();
          LocalTime current = blocked.getStartTime();
          while (current.isBefore(blocked.getEndTime())) {
            times.add(current);
            current = current.plusHours(1);
          }
          return times.stream();
        })
        .collect(Collectors.toSet());
  }

  /**
   * 예약된 시간을 LocalTime Set으로 변환
   */
  private Set<LocalTime> convertReservedTimesToSet(List<ReservedTimeDto> reservedTimes) {
    return reservedTimes.stream()
        .flatMap(reserved -> {
          // 시작 시간부터 종료 시간까지의 모든 시간 생성
          List<LocalTime> times = new ArrayList<>();
          LocalTime current = reserved.getStartTime();
          while (current.isBefore(reserved.getEndTime())) {
            times.add(current);
            current = current.plusHours(1);
          }
          return times.stream();
        })
        .collect(Collectors.toSet());
  }

  /**
   * 개별 시간 슬롯 생성
   */
  private AvailableTimeSlotsResponseDto.TimeSlot createTimeSlot(LocalTime time,
      Set<LocalTime> blockedTimes,
      Set<LocalTime> reservedTimes) {
    boolean isBlocked = blockedTimes.contains(time);
    boolean isReserved = reservedTimes.contains(time);
    boolean isAvailable = !isBlocked && !isReserved;

    return AvailableTimeSlotsResponseDto.TimeSlot.builder()
        .time(time.toString()) // "09:00" 형식으로 변환
        .isAvailable(isAvailable)
        .isReserved(isReserved)
        .isBlocked(isBlocked)
        .build();
  }

  /**
   * 전문가의 특정 날짜 차단 시간 조회
   */
  public AdvisorBlockedTimesResponseDto getAdvisorBlockedTimes(Long advisorId, String date) {
    // 1. 날짜 형식 검증
    validateDateFormat(date);

    // 2. 전문가 존재 및 승인 여부 확인
    if (!advisorMapper.isAdvisorExistsAndApproved(advisorId)) {
      throw new BaseException(BaseResponseStatus.ADVISOR_NOT_FOUND);
    }

    // 3. 차단 시간 조회
    List<String> blockedTimes = advisorMapper.getAdvisorBlockedTimes(advisorId, date);

    return new AdvisorBlockedTimesResponseDto(date, blockedTimes);
  }

  /**
   * 전문가의 특정 날짜 차단 시간 업데이트
   */
  @Transactional
  public AdvisorBlockedTimesUpdateResponseDto updateAdvisorBlockedTimes(
      Long advisorId, String date, AdvisorBlockedTimesRequestDto requestDto) {

    // 1. 날짜 형식 검증
    validateDateFormat(date);

    // 2. 과거 날짜 차단 방지
    if (isDateInPast(date)) {
      throw new BaseException(BaseResponseStatus.PAST_DATE_BLOCK_NOT_ALLOWED);
    }

    // 3. 전문가 존재 및 승인 여부 확인
    if (!advisorMapper.isAdvisorExistsAndApproved(advisorId)) {
      throw new BaseException(BaseResponseStatus.ADVISOR_NOT_FOUND);
    }

    // 4. 시간 형식 검증
    List<String> blockedTimes = requestDto.getBlockedTimes();
    validateTimeSlots(blockedTimes);

    // 5. 예약된 시간과 충돌 확인
    List<String> reservedTimes = advisorMapper.getReservedTimesForDate(advisorId, date);
    List<String> conflictTimes = blockedTimes.stream()
        .filter(reservedTimes::contains)
        .toList();

    if (!conflictTimes.isEmpty()) {
      throw new BaseException(BaseResponseStatus.RESERVED_TIME_CANNOT_BE_BLOCKED);
    }

    // 6. 기존 차단 시간 삭제
    advisorMapper.deleteBlockedTimesByDate(advisorId, date);

    // 7. 새로운 차단 시간 추가
    if (!blockedTimes.isEmpty()) {
      advisorMapper.insertBlockedTimes(advisorId, date, blockedTimes);
    }

    return new AdvisorBlockedTimesUpdateResponseDto(date, blockedTimes);
  }

  /**
   * 날짜 형식 검증 (YYYY-MM-DD)
   */
  private void validateDateFormat(String date) {
    if (!date.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
      throw new BaseException(BaseResponseStatus.INVALID_DATE_FORMAT);
    }
  }

  /**
   * 과거 날짜 여부 확인
   */
  private boolean isDateInPast(String date) {
    try {
      LocalDate targetDate = LocalDate.parse(date);
      return targetDate.isBefore(LocalDate.now());
    } catch (Exception e) {
      throw new BaseException(BaseResponseStatus.INVALID_DATE_FORMAT);
    }
  }

  /**
   * 시간 슬롯 검증 (09:00~20:00, 정시만)
   */
  private void validateTimeSlots(List<String> timeSlots) {
    List<String> validTimeSlots = Arrays.asList(
        "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
        "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
    );

    for (String timeSlot : timeSlots) {
      if (!validTimeSlots.contains(timeSlot)) {
        throw new BaseException(BaseResponseStatus.INVALID_TIME_SLOT);
      }
    }
  }
}