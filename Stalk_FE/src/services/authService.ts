import { SignupFormData, User, LoginRequest, LoginResponse, BaseApiResponse } from '@/types';

// 전역 변수 선언
let accessToken: string | null = null;
let userInfo: any = null;

// Vite 프록시를 통한 상대 경로 사용
const API_BASE_URL = '/api';

interface EmailVerificationRequest {
  email: string;
}

interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

class AuthService {
  // 로그인
  static async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      // 입력 데이터 검증
      if (!data.userId || !data.password) {
        throw new Error('아이디와 비밀번호를 모두 입력해주세요.');
      }
      
      // 공백 제거
      const cleanData = {
        userId: data.userId.trim(),
        password: data.password.trim()
      };
      
      console.log('로그인 요청 데이터:', cleanData);
      console.log('로그인 요청 URL:', `${API_BASE_URL}/auth/login`);
      console.log('요청 본문:', JSON.stringify(cleanData));
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        console.error('API 응답 오류:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        
        const errorData = await response.json().catch(() => ({}));
        console.error('에러 응답 데이터:', errorData);
        
        // Spring Boot 기본 에러 응답 처리
        if (errorData.error === 'Bad Request' && errorData.status === 400) {
          console.error('Spring Boot 검증 실패 - 요청 데이터:', cleanData);
          throw new Error('입력 데이터가 올바르지 않습니다. 아이디와 비밀번호를 확인해주세요.');
        }
        
        // 백엔드 커스텀 에러 메시지가 있는 경우
        if (errorData.message) {
          throw new Error(errorData.message);
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: BaseApiResponse<LoginResponse> = await response.json();
      
      if (!result.isSuccess) {
        throw new Error(result.message);
      }

          // Access Token을 메모리에 저장
    accessToken = result.result.accessToken;

    // Refresh Token을 localStorage에 저장 (자동 로그인용)
    if (result.result.refreshToken) {
      localStorage.setItem('refreshToken', result.result.refreshToken);
      console.log('Refresh token이 localStorage에 저장되었습니다.');
    }

    // 사용자 정보를 메모리에 저장 (자동 로그인용)
    userInfo = {
      userId: result.result.userId,
      userName: result.result.userName,
      role: result.result.role
    };
      
      return result.result;
    } catch (error) {
      console.error('로그인 API 호출 실패:', error);
      
      // 개발 환경에서 Mock 데이터로 대체 (네트워크 에러, 400, 500 에러 모두 포함)
      if (import.meta.env.DEV) {
        console.warn('개발 환경: 백엔드 서버 오류, Mock 데이터로 대체합니다.');
        
        // 백엔드에 등록된 사용자만 Mock 로그인 허용
        const validUsers: Record<string, { userId: number; userName: string; role: 'USER' | 'ADVISOR' | 'ADMIN'; password: string }> = {
          'user001': { userId: 1001, userName: '김철수', role: 'USER', password: 'password123' },
          'user002': { userId: 1002, userName: '이영희', role: 'USER', password: 'password123' },
          'advisor001': { userId: 2001, userName: '한승우', role: 'ADVISOR', password: 'password123' },
          'advisor002': { userId: 2002, userName: '이수진', role: 'ADVISOR', password: 'password123' },
          'advisor003': { userId: 2003, userName: '박미승', role: 'ADVISOR', password: 'password123' },
          'admin001': { userId: 3001, userName: '관리자', role: 'ADMIN', password: 'password123' }
        };
        
        const userData = validUsers[data.userId as keyof typeof validUsers];
        
        if (!userData) {
          throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
        
        // 비밀번호 검증
        if (userData.password !== data.password) {
          throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
        
        // Mock 응답 생성
        const mockResponse: LoginResponse = {
          accessToken: `MOCK_TOKEN_${Date.now()}_ACCESS_${data.userId}`,
          refreshToken: `MOCK_TOKEN_${Date.now()}_REFRESH_${data.userId}`,
          userId: userData.userId,
          userName: userData.userName,
          role: userData.role,
          message: 'Mock 로그인 성공'
        };
        
        // Mock 토큰을 메모리에 저장
        accessToken = mockResponse.accessToken;
        
        // Mock Refresh Token을 localStorage에 저장 (자동 로그인용)
        if (mockResponse.refreshToken) {
          localStorage.setItem('refreshToken', mockResponse.refreshToken);
          console.log('Mock Refresh token이 localStorage에 저장되었습니다.');
        }
        
        // 사용자 정보를 메모리에 저장
        userInfo = {
          userId: mockResponse.userId,
          userName: mockResponse.userName,
          role: mockResponse.role
        };
        
        return mockResponse;
      }
      
      throw error;
    }
  }

  // 회원가입
  static async signup(data: SignupFormData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }

      return {
        success: true,
        message: '회원가입이 완료되었습니다.'
      };
    } catch (error) {
      console.error('회원가입 API 호출 실패:', error);
      
      // 개발 환경에서 Mock 응답
      if (import.meta.env.DEV) {
        console.warn('개발 환경: 백엔드 서버 오류, Mock 응답으로 대체합니다.');
        return {
          success: true,
          message: '회원가입이 완료되었습니다. (Mock)'
        };
      }
      
      throw error;
    }
  }

  // 이메일 인증 코드 발송
  static async sendEmailVerification(data: EmailVerificationRequest): Promise<EmailVerificationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }

      return {
        success: true,
        message: '인증 코드가 발송되었습니다.'
      };
    } catch (error) {
      console.error('이메일 인증 코드 발송 실패:', error);
      
      // 개발 환경에서 Mock 응답
      if (import.meta.env.DEV) {
        console.warn('개발 환경: 백엔드 서버 오류, Mock 응답으로 대체합니다.');
        return {
          success: true,
          message: '인증 코드가 발송되었습니다. (Mock)'
        };
      }
      
      throw error;
    }
  }

  // 이메일 인증 코드 확인
  static async verifyEmailCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/email/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }

      return {
        success: true,
        message: '인증이 완료되었습니다.'
      };
    } catch (error) {
      console.error('이메일 인증 코드 확인 실패:', error);
      
      // 개발 환경에서 Mock 응답
      if (import.meta.env.DEV) {
        console.warn('개발 환경: 백엔드 서버 오류, Mock 응답으로 대체합니다.');
        return {
          success: code === '123456', // 임시 검증 로직
          message: code === '123456' ? '인증이 완료되었습니다. (Mock)' : '인증 코드가 올바르지 않습니다. (Mock)'
        };
      }
      
      throw error;
    }
  }

  // 로그아웃
  static async logout(): Promise<void> {
    if (accessToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        });
      } catch (error) {
        console.error('로그아웃 API 호출 실패:', error);
        // 개발 환경에서 CORS 에러나 네트워크 에러인 경우 Mock 처리
        if (import.meta.env.DEV && (error instanceof TypeError || (error instanceof Error && error.message.includes('Failed to fetch')))) {
          console.warn('개발 환경: 백엔드 서버 연결 실패, 로컬 로그아웃만 진행합니다.');
        }
        // CORS 에러나 네트워크 에러가 발생해도 로컬 정리는 계속 진행
      }
    }
    
    // 메모리에서 인증 정보 제거
    accessToken = null;
    userInfo = null;
    
    // localStorage에서 refresh token 제거
    localStorage.removeItem('refreshToken');
    console.log('로그아웃: 모든 토큰이 제거되었습니다.');
  }

  // 토큰 가져오기
  static getAccessToken(): string | null {
    return accessToken;
  }

  // 토큰 갱신 (백엔드 스펙에 맞춰 refreshToken 전송)
  static async refreshToken(): Promise<string | null> {
    try {
      // ❌ 문제: 메모리에만 저장된 refresh token이 새로고침 시 사라짐
      // 현재 로그인 응답에서 받은 refresh token을 어디에 저장해야 하는가?
      
      // 임시: localStorage에서 refresh token 가져오기 (보안 위험)
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) {
        console.warn('저장된 refresh token이 없습니다. 로그인이 필요합니다.');
        return null;
      }

      console.log('리프레시 토큰 갱신 시도:', {
        endpoint: `${API_BASE_URL}/auth/refresh`,
        hasRefreshToken: !!storedRefreshToken
      });

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          refreshToken: storedRefreshToken  // ✅ 백엔드 스펙에 맞춰 refreshToken 전송
        }),
      });

      if (!response.ok) {
        console.error('토큰 갱신 실패:', {
          status: response.status,
          statusText: response.statusText
        });
        
        if (response.status === 401 || response.status === 403) {
          // Refresh token이 만료되거나 유효하지 않음
          localStorage.removeItem('refreshToken');
          console.warn('Refresh token이 만료되었습니다. 다시 로그인해주세요.');
        }
        
        throw new Error(`토큰 갱신 실패: HTTP ${response.status}`);
      }

      // 백엔드에서 새로운 access token만 반환한다고 가정
      const newAccessToken = await response.text(); // String 응답
      
      console.log('토큰 갱신 성공:', {
        hasNewToken: !!newAccessToken
      });

      if (newAccessToken && newAccessToken.trim()) {
        // 새로운 Access Token을 메모리에 저장
        accessToken = newAccessToken.trim();
        return accessToken;
      }
      
      return null;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      
      // CORS 에러나 네트워크 에러인 경우 로그아웃 처리하지 않고 null 반환
      if (error instanceof TypeError || (error instanceof Error && error.message.includes('Failed to fetch'))) {
        console.warn('네트워크 에러로 인한 토큰 갱신 실패, 로그아웃 처리하지 않음');
        return null;
      }
      
      // 토큰 갱신 실패 시 저장된 refresh token 제거
      localStorage.removeItem('refreshToken');
      return null;
    }
  }

  // 인증된 API 요청 헬퍼 (토큰 갱신 포함)
  static async authenticatedRequest(url: string, options: any = {}) {
    let token = accessToken;
    
    // 토큰이 없으면 갱신 시도
    if (!token) {
      token = await this.refreshToken();
    }
    
    const config = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    };
    
    const response = await fetch(url, config);
    
    // 401 에러 시 토큰 갱신 재시도
    if (response.status === 401) {
      const newToken = await this.refreshToken();
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        return fetch(url, config);
      }
    }
    
    return response;
  }

  // 자동 로그인 체크
  static checkAutoLogin(): boolean {
    return !!accessToken;
  }

  // 사용자 정보 가져오기
  static getUserInfo(): any {
    return userInfo;
  }

  // 토큰 검증
  static async validateToken(_token: string): Promise<{ valid: boolean; user?: User }> {
    // TODO: 실제 토큰 검증 로직
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          valid: true,
          user: {
            userId: 'ssafy_kim',
            name: '김싸피',
            contact: '010-0000-0000',
            email: 'ssafy@samsung.com',
            nickname: '김싸피',
            userType: 'general'
          }
        });
      }, 500);
    });
  }
}

export default AuthService; 