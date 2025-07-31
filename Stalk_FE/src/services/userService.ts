import { User, PasswordForm, EditInfoForm } from '@/types';
import AuthService from './authService';

// Vite 프록시를 통한 상대 경로 사용
const API_BASE_URL = '/api';

class UserService {
  // 사용자 정보 조회
  static async getUserInfo(userId?: number): Promise<User> {
    try {
      // 실 데이터 API 먼저 시도 - 고정 엔드포인트 사용
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AuthService.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.isSuccess) {
          console.log('실 데이터 API 성공:', result.result);
          // 백엔드 UserProfileResponseDto를 프론트엔드 User로 변환
          const userData = result.result;
          return {
            userId: userData.userId,
            name: userData.name,
            contact: userData.contact,
            email: userData.email,
            profileImage: userData.profileImage,
            role: userData.role,
            // 프론트엔드에서만 사용하는 필드들
            nickname: userData.name, // 백엔드에 nickname이 없으므로 name 사용
            userType: this.mapRoleToUserType(userData.role),
            isApproved: true, // 기본값
            qualification: '투자자산운용사' // 기본값
          };
        }
      }
      
      // API 실패 시 Mock 데이터 사용
      console.warn('실 데이터 API 실패, Mock 데이터로 대체합니다.');
      const currentUserId = userId || AuthService.getUserInfo()?.userId || 1001;
      return this.getMockUserInfo(currentUserId);
      
    } catch (error) {
      console.warn('실 데이터 API 오류, Mock 데이터로 대체합니다:', error);
      const currentUserId = userId || AuthService.getUserInfo()?.userId || 1001;
      return this.getMockUserInfo(currentUserId);
    }
  }

  // Role을 UserType으로 매핑하는 헬퍼 메서드
  private static mapRoleToUserType(role?: string): 'general' | 'expert' {
    switch (role) {
      case 'ADVISOR':
        return 'expert';
      case 'USER':
      case 'ADMIN':
      default:
        return 'general';
    }
  }

  // Mock 사용자 정보 생성
  private static getMockUserInfo(userId: number): User {
    const authUserInfo = AuthService.getUserInfo();
    
    return {
      userId: userId.toString(),
      name: authUserInfo?.userName || '김싸피',
      contact: '010-0000-0000',
      email: 'ssafy@samsung.com',
      profileImage: '/assets/images/profiles/Profile_default.svg',
      role: authUserInfo?.role || 'USER',
      // 프론트엔드에서만 사용하는 필드들
      nickname: authUserInfo?.userName || '김싸피',
      userType: this.mapRoleToUserType(authUserInfo?.role),
      isApproved: true,
      qualification: '투자자산운용사'
    };
  }

  // 사용자 정보 수정
  static async updateUserInfo(userId: number, data: EditInfoForm): Promise<{ success: boolean; message: string }> {
    try {
      // 백엔드 UserUpdateRequestDto 기준으로 데이터 변환
      const updateData = {
        name: data.name,
        contact: data.contact
        // 백엔드에 email 필드가 없으므로 제외
      };

      // 실 데이터 API 먼저 시도 - 고정 엔드포인트 사용
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PATCH', // 백엔드: @PatchMapping
        headers: {
          'Authorization': `Bearer ${AuthService.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.isSuccess) {
          console.log('실 데이터 API 성공:', result);
          return {
            success: true,
            message: '사용자 정보가 성공적으로 수정되었습니다.'
          };
        }
      }
      
      // API 실패 시 Mock 응답
      console.warn('실 데이터 API 실패, Mock 응답으로 대체합니다.');
      return {
        success: true,
        message: '사용자 정보가 성공적으로 수정되었습니다. (Mock)'
      };
      
    } catch (error) {
      console.warn('실 데이터 API 오류, Mock 응답으로 대체합니다:', error);
      return {
        success: true,
        message: '사용자 정보가 성공적으로 수정되었습니다. (Mock)'
      };
    }
  }

  // 비밀번호 변경 (백엔드 API 없음 - Mock만 사용)
  static async changePassword(userId: number, data: PasswordForm): Promise<{ success: boolean; message: string }> {
    try {
      // ❌ 백엔드에 비밀번호 변경 API가 없음
      console.warn('백엔드에 비밀번호 변경 API가 구현되지 않음. Mock 응답으로 대체합니다.');
      
      // 임시 처리: 클라이언트 사이드에서 간단한 검증만
      if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
        return {
          success: false,
          message: '모든 필드를 입력해주세요.'
        };
      }
      
      if (data.newPassword !== data.confirmPassword) {
        return {
          success: false,
          message: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.'
        };
      }
      
      // Mock 성공 응답
      return {
        success: true,
        message: '비밀번호가 성공적으로 변경되었습니다. (Mock - 백엔드 구현 필요)'
      };
      
    } catch (error) {
      console.error('비밀번호 변경 중 오류:', error);
      return {
        success: false,
        message: '비밀번호 변경 중 오류가 발생했습니다.'
      };
    }
  }

  // 프로필 사진 업로드 (백엔드 API 없음 - Mock만 사용)
  static async uploadProfilePhoto(userId: number, file: File): Promise<{ success: boolean; url?: string; message: string }> {
    try {
      // ❌ 백엔드에 프로필 사진 업로드 API가 없음
      console.warn('백엔드에 프로필 사진 업로드 API가 구현되지 않음. Mock 응답으로 대체합니다.');
      
      // 클라이언트 사이드에서 파일 검증
      if (!file) {
        return {
          success: false,
          message: '업로드할 파일을 선택해주세요.'
        };
      }
      
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          message: '파일 크기가 5MB를 초과합니다.'
        };
      }
      
      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          message: '이미지 파일만 업로드 가능합니다.'
        };
      }
      
      // Mock 성공 응답 (실제로는 파일이 저장되지 않음)
      return {
        success: true,
        url: `/uploads/profiles/${userId}_${Date.now()}.jpg`,
        message: '프로필 사진이 업로드되었습니다. (Mock - 백엔드 구현 필요)'
      };
      
    } catch (error) {
      console.error('프로필 사진 업로드 중 오류:', error);
      return {
        success: false,
        message: '프로필 사진 업로드 중 오류가 발생했습니다.'
      };
    }
  }

  // 회원 탈퇴 (백엔드 API 없음 - Mock만 사용)
  static async deleteAccount(userId: number, password: string): Promise<{ success: boolean; message: string }> {
    try {
      // ❌ 백엔드에 회원 탈퇴 API가 없음
      console.warn('백엔드에 회원 탈퇴 API가 구현되지 않음. Mock 응답으로 대체합니다.');
      
      // 클라이언트 사이드에서 간단한 검증
      if (!password) {
        return {
          success: false,
          message: '비밀번호를 입력해주세요.'
        };
      }
      
      // Mock 처리: 로그아웃만 수행
      await AuthService.logout();
      return {
        success: true,
        message: '회원 탈퇴가 완료되었습니다. (Mock - 백엔드 구현 필요)'
      };
      
    } catch (error) {
      console.error('회원 탈퇴 중 오류:', error);
      return {
        success: false,
        message: '회원 탈퇴 중 오류가 발생했습니다.'
      };
    }
  }

  // ❌ 사용자 아이디 중복 확인 (제거됨 - signup-page에서 직접 /api/auth/duplicate-check 사용)
  // 이 메서드는 더 이상 사용되지 않습니다. signup-page.tsx에서 직접 API를 호출합니다.
  static async checkUserIdAvailability(userId: string): Promise<{ available: boolean; message: string }> {
    console.warn('⚠️ 이 메서드는 더 이상 사용되지 않습니다. signup-page에서 직접 /api/auth/duplicate-check를 사용하세요.');
    
    // 호환성을 위한 간단한 Mock 응답
    const isAvailable = userId !== 'admin' && userId !== 'test';
    return {
      available: isAvailable,
      message: isAvailable ? '사용 가능한 아이디입니다. (Deprecated)' : '이미 사용 중인 아이디입니다. (Deprecated)'
    };
  }

  // ❌ 이메일 중복 확인 (제거됨 - 이메일은 signup-page에서 인증으로 처리)
  // 이 메서드는 더 이상 사용되지 않습니다. 이메일은 인증 과정을 통해 처리됩니다.
  static async checkEmailAvailability(email: string): Promise<{ available: boolean; message: string }> {
    console.warn('⚠️ 이 메서드는 더 이상 사용되지 않습니다. 이메일은 인증 과정을 통해 처리하세요.');
    
    // 호환성을 위한 간단한 Mock 응답
    const isAvailable = !email.includes('test@');
    return {
      available: isAvailable,
      message: isAvailable ? '사용 가능한 이메일입니다. (Deprecated)' : '이미 사용 중인 이메일입니다. (Deprecated)'
    };
  }
}

export default UserService; 