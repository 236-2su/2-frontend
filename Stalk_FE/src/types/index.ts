// 사용자 관련 타입
export interface User {
  userId: string;  // 백엔드 UserProfileResponseDto 기준: String 타입
  name: string;    // 백엔드: name
  contact: string; // 백엔드: contact
  email: string;   // 백엔드: email
  profileImage?: string; // 백엔드: profileImage
  role: string;    // 백엔드: role (USER/ADVISOR/ADMIN)
  // 프론트엔드에서만 사용하는 필드들
  nickname?: string;
  qualification?: string;
  isApproved?: boolean;
  userType?: 'general' | 'expert';
}

// 백엔드 API 응답 타입
export interface LoginRequest {
  userId: string;  // 로그인 요청은 문자열 (사용자 입력)
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;  // 백엔드 LoginResponseDto: Long 타입
  userName: string;
  role: 'USER' | 'ADVISOR' | 'ADMIN';
  message: string;
}

export interface UserInfo {
  userId: number;  // 백엔드 LoginResponseDto 기준: Long 타입
  userName: string;
  role: 'USER' | 'ADVISOR' | 'ADMIN';
}

export interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  userInfo: UserInfo | null;
}

export interface BaseApiResponse<T> {
  httpStatus: string;
  isSuccess: boolean;
  message: string;
  code: number;
  result: T;
}

// 상담 관련 타입
export interface ConsultationItem {
  id: string;
  date: string;
  time: string;
  content: string;
  expert: string;
  videoConsultation: string;
  action: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// 전문가 자격증 정보
export interface QualificationData {
  qualification: string;
  certificateNumber: string;
  birthDate: string;
  verificationNumber: string;
}

// 관심종목 타입 (기존에서 이동)
export interface WatchlistItem {
  code: string;
  name: string;
  price: number;
  change: number;
}

// 폼 데이터 타입들
export interface PasswordForm extends Record<string, unknown> {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EditInfoForm extends Record<string, unknown> {
  name: string;
  contact: string;
  email: string;
}

export interface ProfileForm extends Record<string, unknown> {
  nickname: string;
  selectedAvatar: string;
}

export interface SignupFormData {
  name: string;
  userId: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
  contact: string;
  email: string;
  emailDomain: string;
  verificationCode: string;
  agreedTerms: boolean;
  agreedPrivacy: boolean;
}

// 스케줄 관련 타입
export interface ScheduleData {
  [key: string]: {
    operating: string[];
    isRestDay: boolean;
  };
}

// 탭 타입
export interface TabItem {
  id: string;
  label: string;
} 