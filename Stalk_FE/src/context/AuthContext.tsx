import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '@/services/authService';
import UserService from '@/services/userService';
import { UserInfo } from '@/types';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  userInfo: UserInfo | null;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // 자동 로그인 체크
  const checkAuth = async (): Promise<boolean> => {
    try {
      // 1단계: 메모리에 access token이 있는지 확인
      if (AuthService.checkAutoLogin()) {
        const storedUserInfo = AuthService.getUserInfo();
        if (storedUserInfo) {
          setIsLoggedIn(true);
          setUserInfo(storedUserInfo);
          return true;
        }
      }
      
      // 2단계: 메모리에 access token이 없으면 서버에 refresh token 요청
      try {
        const newAccessToken = await AuthService.refreshToken();
        if (newAccessToken) {
          // 새로운 access token으로 로그인 상태 유지
          setIsLoggedIn(true);
          // 사용자 정보도 다시 가져오기
          const userData = await UserService.getUserInfo();
          // User 타입을 UserInfo 타입으로 변환
          // userId가 문자열인 경우 안전하게 처리
          const userIdNumber = parseInt(userData.userId);
          const userInfo: UserInfo = {
            userId: isNaN(userIdNumber) ? 0 : userIdNumber, // NaN 방지
            userName: userData.name, // name을 userName으로 매핑
            role: userData.role as 'USER' | 'ADVISOR' | 'ADMIN' // role 매핑
          };
          setUserInfo(userInfo);
          return true;
        } else {
          // refresh token도 실패하면 로그아웃
          setIsLoggedIn(false);
          setUserInfo(null);
          return false;
        }
      } catch (error) {
        console.error('자동로그인 실패:', error);
        setIsLoggedIn(false);
        setUserInfo(null);
        return false;
      }
    } catch (error) {
      console.error('인증 체크 실패:', error);
      setIsLoggedIn(false);
      setUserInfo(null);
      return false;
    }
  };

  // 로그인 처리
  const login = (userInfo: UserInfo) => {
    setIsLoggedIn(true);
    setUserInfo(userInfo);
  };

  // 로그아웃 처리
  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('로그아웃 중 에러 발생:', error);
    } finally {
      // 에러가 발생해도 상태는 확실히 초기화
      setIsLoggedIn(false);
      setUserInfo(null);
      setIsLoggingOut(false);
    }
  };

  // 컴포넌트 마운트 시 자동 로그인 체크
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await checkAuth();
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const value: AuthContextType = {
    isLoggedIn,
    isLoading,
    isLoggingOut,
    userInfo,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 