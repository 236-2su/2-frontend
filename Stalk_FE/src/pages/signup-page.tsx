import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NewNavbar from '@/components/new-navbar';
import { SignupFormData } from '@/types';
import certificationExample from '@/assets/images/dummy/certification_example.svg';
import stalkLogoBlue from '@/assets/images/logos/Stalk_logo_blue.svg';

const SignupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState('general');
  const [timeLeft, setTimeLeft] = useState(300); // 5분 타이머
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 완료 상태
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showThirdPartyModal, setShowThirdPartyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 중복확인 상태 추가
  const [userIdChecked, setUserIdChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [userIdAvailable, setUserIdAvailable] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);
  


  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    userId: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    contact: '',
    email: '',
    emailDomain: 'gmail.com',
    verificationCode: '',
    agreedTerms: false,
    agreedPrivacy: false
  });

  // URL 파라미터에서 사용자 타입 읽기
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'expert' || typeParam === 'general') {
      setUserType(typeParam);
    }
  }, [searchParams]);

  // 타이머 효과
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`;
  };

  const handleUserTypeChange = (type: string) => {
    setUserType(type);
    navigate(`/signup?type=${type}`);
  };

  // 아이디 중복확인
  const handleUserIdCheck = async () => {
    if (!formData.userId.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }

    try {
      const requestUrl = `/api/auth/duplicate-check?id%7Cnickname=id&value=${encodeURIComponent(formData.userId.trim())}`;
      console.log('아이디 중복확인 시도 - URL:', requestUrl);
      
      const response = await fetch(requestUrl, {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('아이디 중복확인 결과:', result);
        
        if (result.success) {
          if (!result.duplicated) {
            setUserIdAvailable(true);
            setUserIdChecked(true);
            alert('사용 가능한 아이디입니다. (실제 DB 확인 완료)');
          } else {
            setUserIdAvailable(false);
            setUserIdChecked(true);
            alert('이미 사용 중인 아이디입니다. (실제 DB 확인 결과)');
          }
          return;
        } else {
          alert('중복확인 중 오류가 발생했습니다: ' + (result.message || '알 수 없는 오류'));
          return;
        }
      } else {
        console.error(`아이디 중복확인 실패 (${response.status})`);
        alert(`아이디 중복확인에 실패했습니다.\n서버에서 오류가 발생했습니다. (HTTP ${response.status})\n잠시 후 다시 시도해주세요.`);
        return;
      }
    } catch (error) {
      console.error('아이디 중복확인 실패:', error);
      alert('네트워크 오류로 아이디 중복확인에 실패했습니다.\n' + 
            '인터넷 연결을 확인하고 다시 시도해주세요.\n\n' +
            `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      return;
    }
  };

  // 닉네임 중복확인
  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    try {
      const requestUrl = `/api/auth/duplicate-check?id%7Cnickname=nickname&value=${encodeURIComponent(formData.nickname.trim())}`;
      console.log('닉네임 중복확인 시도 - URL:', requestUrl);
      
      const response = await fetch(requestUrl, {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('닉네임 중복확인 결과:', result);
        
        if (result.success) {
          if (!result.duplicated) {
            setNicknameAvailable(true);
            setNicknameChecked(true);
            alert('사용 가능한 닉네임입니다. (실제 DB 확인 완료)');
          } else {
            setNicknameAvailable(false);
            setNicknameChecked(true);
            alert('이미 사용 중인 닉네임입니다. (실제 DB 확인 결과)');
          }
          return;
        } else {
          alert('중복확인 중 오류가 발생했습니다: ' + (result.message || '알 수 없는 오류'));
          return;
        }
      } else {
        console.error(`닉네임 중복확인 실패 (${response.status})`);
        const errorText = await response.text();
        alert(`닉네임 중복확인에 실패했습니다.\nHTTP ${response.status}: ${errorText || response.statusText}`);
        return;
      }
    } catch (error) {
      console.error('닉네임 중복확인 실패:', error);
      alert('네트워크 오류로 닉네임 중복확인에 실패했습니다.\n' + 
            '인터넷 연결을 확인하고 다시 시도해주세요.\n\n' +
            `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 중복확인 검증
    if (!userIdChecked) {
      alert('아이디 중복확인을 해주세요.');
      return;
    }
    if (!userIdAvailable) {
      alert('사용할 수 없는 아이디입니다.');
      return;
    }
    if (!nicknameChecked) {
      alert('닉네임 중복확인을 해주세요.');
      return;
    }
    if (!nicknameAvailable) {
      alert('사용할 수 없는 닉네임입니다.');
      return;
    }
    
    // 비밀번호 확인 검증
    if (formData.password !== formData.passwordConfirm) {
      setPasswordsMatch(false);
      return;
    }
    
    // 백엔드 비밀번호 패턴 검증 (8~20자, 숫자·대문자·소문자·특수문자 모두 포함)
    const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,20}$/;
    if (!passwordPattern.test(formData.password)) {
      alert('비밀번호는 8~20자이며, 숫자·대문자·소문자·특수문자(@#$%^&+=!)를 모두 포함해야 합니다.');
      return;
    }
    
    // 연락처 패턴 검증 (숫자 9~11자리)
    const contactPattern = /^\d{9,11}$/;
    if (!contactPattern.test(formData.contact)) {
      alert('연락처는 숫자 9~11자리여야 합니다. (- 없이 입력)');
      return;
    }
    
    // 이메일 인증 확인
    if (!isEmailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }
    
    // 약관 동의 확인
    if (!formData.agreedTerms || !formData.agreedPrivacy) {
      alert('약관 및 개인정보 수집에 동의해주세요.');
      return;
    }
    
    setIsLoading(true);
    
    // 완전한 이메일 주소 생성
    const fullEmail = `${formData.email}@${formData.emailDomain}`;
    
    // 직접 API 호출로 실제 DB 저장
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`회원가입 시도 ${retryCount + 1}/${maxRetries}`);
        
        const signupData = {
          name: formData.name,
          userId: formData.userId,
          nickname: formData.nickname,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          contact: formData.contact,
          email: fullEmail,
          agreedTerms: formData.agreedTerms,
          agreedPrivacy: formData.agreedPrivacy
        };
        
        console.log('회원가입 요청 데이터:', signupData);
        
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        });

        console.log('회원가입 응답 상태:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('회원가입 결과:', result);
          
          if (result.success) {
            alert('회원가입이 완료되었습니다! 실제 DB에 저장되었습니다.');
            navigate('/signup-complete');
            return;
    } else {
            alert(result.message || '회원가입에 실패했습니다.');
            return;
          }
        } else {
          const errorText = await response.text();
          console.error(`회원가입 실패 (${response.status}):`, errorText);
          
          if (response.status === 403) {
            if (retryCount < maxRetries - 1) {
              console.log('403 에러 - 재시도합니다...');
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // 점진적 지연
              continue;
            } else {
              alert('서버 접근 권한이 없습니다. 관리자에게 문의하세요.\n(403 Forbidden)');
              return;
            }
          } else if (response.status === 400) {
            alert('입력 정보를 확인해주세요.\n' + (errorText || '잘못된 요청입니다.'));
            return;
          } else if (response.status === 409) {
            alert('이미 가입된 정보입니다. 아이디나 이메일을 확인해주세요.');
            return;
          } else {
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
          }
        }
      } catch (error) {
        console.error(`회원가입 시도 ${retryCount + 1} 실패:`, error);
        
        if (retryCount < maxRetries - 1) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        } else {
          alert('네트워크 오류로 회원가입에 실패했습니다.\n' + 
                '인터넷 연결을 확인하고 다시 시도해주세요.\n\n' +
                `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
          return;
        }
      }
    }
    
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
      setFormData({
        ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // 비밀번호 확인 검증
    if (name === 'password' || name === 'passwordConfirm') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'passwordConfirm' ? value : formData.passwordConfirm;
      setPasswordsMatch(password === confirmPassword);
    }

    // 아이디나 닉네임이 변경되면 중복확인 상태 초기화
    if (name === 'userId') {
      setUserIdChecked(false);
      setUserIdAvailable(false);
    }
    if (name === 'nickname') {
      setNicknameChecked(false);
      setNicknameAvailable(false);
    }
    // 이메일 또는 이메일 도메인이 변경되면 인증 상태 초기화
    if (name === 'email' || name === 'emailDomain') {
      setIsEmailVerified(false);
      setIsEmailSent(false);
      setIsTimerActive(false);
      setTimeLeft(600); // 10분으로 재설정
    }
  };

  const handleSendVerification = async () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    
    // 완전한 이메일 주소 생성
    const fullEmail = `${formData.email}@${formData.emailDomain}`;
    
    try {
      console.log('이메일 인증 코드 발송 시도 - 이메일:', fullEmail);
      console.log('브라우저 정보:', navigator.userAgent);
      console.log('현재 시간:', new Date().toISOString());
      
      const emailData = { email: fullEmail };
      console.log('이메일 발송 요청 데이터:', emailData);
      console.log('이메일 발송 JSON 문자열:', JSON.stringify(emailData));
      console.log('formData.email:', formData.email);
      console.log('formData.emailDomain:', formData.emailDomain);
      
      // XMLHttpRequest 방식으로 JSON 전송 (백엔드 @RequestBody에 맞춤)
      console.log('XMLHttpRequest + JSON 방식으로 이메일 발송 시도');
      
      const response = await new Promise<Response>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/api/auth/email/send?_t=${Date.now()}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
          console.log('XMLHttpRequest 응답:', xhr.status, xhr.responseText);
          const mockResponse = {
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            statusText: xhr.statusText,
            json: async () => {
              try {
                return JSON.parse(xhr.responseText);
              } catch {
                return { success: xhr.status === 200 };
              }
            },
            text: async () => xhr.responseText,
            headers: new Headers(),
            url: `/api/auth/email/send?_t=${Date.now()}`
          } as Response;
          resolve(mockResponse);
        };
        
        xhr.onerror = function() {
          console.error('XMLHttpRequest 네트워크 에러');
          reject(new Error('Network error'));
        };
        
        // JSON 형식으로 전송 (백엔드 SendEmailRequest DTO에 맞춤)
        const jsonData = JSON.stringify({ email: fullEmail });
        console.log('XMLHttpRequest 전송 데이터:', jsonData);
        xhr.send(jsonData);
      });

      if (response.ok) {
        const result = await response.json();
        console.log('이메일 인증 코드 발송 결과:', result);
        
        if (result.success) {
          setIsEmailSent(true);
          setIsTimerActive(true);
          setTimeLeft(600); // 10분 = 600초
          alert('인증 코드가 발송되었습니다. (실제 이메일 전송)\n10분 안에 입력해주세요.');
          return;
        } else {
          alert('인증 코드 발송에 실패했습니다: ' + (result.message || '알 수 없는 오류'));
          return;
        }
      } else {
        console.error(`이메일 인증 코드 발송 실패 (${response.status})`);
        console.log('실패한 이메일:', fullEmail);
        console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));
        console.log('요청 URL:', response.url);
        
        const errorText = await response.text().catch(() => '응답 읽기 실패');
        console.error('에러 응답 내용:', errorText);
        
        alert(`이메일 인증 코드 발송에 실패했습니다.\nHTTP ${response.status}: ${errorText || response.statusText}`);
        return;
      }
    } catch (error) {
      console.error('XMLHttpRequest 방식 실패:', error);
      
      // 백업 1: authService 사용
      try {
        console.log('authService 백업 방식 시도');
        const AuthService = (await import('../services/authService')).default;
        const result = await AuthService.sendEmailVerification({ email: fullEmail });
        
        if (result.success) {
          setIsEmailSent(true);
          setIsTimerActive(true);
          setTimeLeft(600);
          alert('인증 코드가 발송되었습니다. (백업 방식)\n10분 안에 입력해주세요.');
          return;
        }
      } catch (authError) {
        console.error('authService 백업 방식도 실패:', authError);
      }
      
      // 백업 2: 헤더 없이 fetch 시도
      try {
        console.log('헤더 없는 fetch 백업 방식 시도');
        const backupResponse = await fetch(`/api/auth/email/send?_t=${Date.now()}&email=${encodeURIComponent(fullEmail)}`, {
          method: 'POST',
          body: JSON.stringify({ email: fullEmail }),
        });
        
        if (backupResponse.ok) {
          const result = await backupResponse.json();
          if (result.success) {
            setIsEmailSent(true);
            setIsTimerActive(true);
            setTimeLeft(600);
            alert('인증 코드가 발송되었습니다. (헤더 없는 방식)\n10분 안에 입력해주세요.');
            return;
          }
        }
      } catch (backupError) {
        console.error('헤더 없는 fetch 백업 방식도 실패:', backupError);
      }
      
      alert('네트워크 오류로 이메일 인증 코드 발송에 실패했습니다.\n' + 
            '인터넷 연결을 확인하고 다시 시도해주세요.\n\n' +
            `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      return;
    }
  };

  const handleVerifyEmail = async () => {
    if (!formData.email || !formData.verificationCode) {
      alert('이메일과 인증 코드를 입력해주세요.');
      return;
    }
    
    // 완전한 이메일 주소 생성
    const fullEmail = `${formData.email}@${formData.emailDomain}`;
    
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`이메일 인증 코드 검증 시도 ${retryCount + 1}/${maxRetries}`);
        
        const verifyData = {
          email: fullEmail,
          code: formData.verificationCode
        };
        
        const response = await fetch('/api/auth/email/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(verifyData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('이메일 인증 코드 검증 결과:', result);
          
          if (result.success) {
            alert('이메일 인증이 완료되었습니다. (실제 DB 검증 완료)');
            setIsEmailSent(false);
            setIsTimerActive(false);
            setIsEmailVerified(true); // 이메일 인증 완료 상태 설정
            return;
          } else {
            alert('이메일 인증에 실패했습니다: ' + (result.message || '인증 코드가 올바르지 않습니다.'));
            return;
          }
        } else {
          console.error(`이메일 인증 코드 검증 실패 (${response.status})`);
          
          if (response.status === 403 && retryCount < maxRetries - 1) {
            console.log('403 에러 - 재시도합니다...');
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
            continue;
          } else {
            const errorText = await response.text();
            alert(`이메일 인증 코드 검증에 실패했습니다.\nHTTP ${response.status}: ${errorText || response.statusText}`);
            return;
          }
        }
      } catch (error) {
        console.error(`이메일 인증 코드 검증 시도 ${retryCount + 1} 실패:`, error);
        
        if (retryCount < maxRetries - 1) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        } else {
          alert('네트워크 오류로 이메일 인증 코드 검증에 실패했습니다.\n' + 
                '인터넷 연결을 확인하고 다시 시도해주세요.\n\n' +
                `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
          return;
        }
      }
    }
  };

  const handleAllTermsAgreement = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreedTerms: checked,
      agreedPrivacy: checked
    }));
  };

  const handleIndividualAgreement = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // 모든 필수 약관이 체크되었는지 확인
  const isAllTermsAgreed = formData.agreedTerms && formData.agreedPrivacy;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <NewNavbar 
        userType={userType}
        onUserTypeChange={handleUserTypeChange}
        showUserTypeToggle={true}
      />

      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        {/* Signup Form */}
        <div className="bg-white rounded-3xl py-12 px-16 shadow-lg border border-gray-200">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
            <p className="text-lg text-gray-600">Sign up</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Photo Section (Expert only) */}
            {userType === 'expert' && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 text-left mb-4">프로필 사진</h3>
                <div className="flex items-start space-x-6">
                  <div className="aspect-[3/4] w-1/6 max-w-[250px] bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                  </div>
                  <div className="w-5/6 flex-1 flex flex-col gap-4">
                    <div className="w-full mb-3 flex flex-row justify-between">
                      <input
                        type="text"
                        readOnly
                        value=""
                        className="w-4/6 px-4 py-3 border border-gray-300 rounded text-m bg-gray-50 focus:outline-none"
                        placeholder="파일명"
                      />
                      <div className="w-2/6 flex space-x-2">
                        <button
                          type="button"
                          className="w-full bg-blue-500 text-white px-4 py-3 rounded text-m cursor-pointer hover:bg-blue-600 hover:font-bold transition-colors"
                        >
                          파일 등록
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-m text-gray-500 space-y-1 text-left flex flex-col gap-2">
                      <p>• 프로필 사진은 300x400px 사이즈를 권장합니다.</p>
                      <p>• 파일 형식은 JPGE(.jpg, .jpeg) 또는 PNG(.png)만 지원합니다.</p>
                      <p>• 업로드 파일 용량은 2MB 이하만 가능합니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              {/* Left Column */}
              <div className="space-y-6">
                {/* User ID */}
                <div className='flex flex-row items-center mb-2'>
                  <h3 className="text-sm font-medium text-gray-700 w-2/6 text-left">
                    아이디
                  </h3>
                  <div className="w-full flex space-x-2">
                    <input
                      type="text"
                      id="userId"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      placeholder="아이디를 입력하세요"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleUserIdCheck}
                      className="bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-600 hover:font-bold transition-colors whitespace-nowrap"
                    >
                      중복확인
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-row items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700 w-2/6 text-left">
                  이름
                </h3>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                  placeholder="이름을 입력해주세요"
                  required
                />
              </div>

                {/* Nickname */}
                <div className='flex flex-row items-center mb-2'>
                  <h3 className="text-sm font-medium text-gray-700 w-2/6 text-left">
                    닉네임
                  </h3>
                  <div className="w-full flex space-x-2">
                    <input
                      type="text"
                      id="nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      placeholder="닉네임을 입력하세요"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleNicknameCheck}
                      className="bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-600 hover:font-bold transition-colors whitespace-nowrap"
                    >
                      중복확인
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className='flex flex-row items-center mb-2'>
                  <h3 className="text-sm font-medium text-gray-700 w-2/6 text-left">
                    비밀번호
                  </h3>
                  <div className="w-full">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      placeholder="비밀번호를 입력해주세요"
                      required
                    />
                    {formData.password && (
                      <div className="mt-2 text-xs text-gray-600">
                        <div className="mb-1">비밀번호는 다음 조건을 모두 만족해야 합니다:</div>
                        <div className="space-y-1">
                          <div className={`flex items-center space-x-1 ${formData.password.length >= 8 && formData.password.length <= 20 ? 'text-green-600' : 'text-red-600'}`}>
                            <span>• 8~20자</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
                            <span>• 숫자 포함</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
                            <span>• 소문자 포함</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
                            <span>• 대문자 포함</span>
                          </div>
                          <div className={`flex items-center space-x-1 ${/[@#$%^&+=!]/.test(formData.password) ? 'text-green-600' : 'text-red-600'}`}>
                            <span>• 특수문자 포함 (@#$%^&+=!)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className='flex flex-row items-center mb-2'>
                  <h3 className="w-2/6 text-sm font-medium text-gray-700 mb-2 text-left">
                    비밀번호 확인
                  </h3>
                  <div className="relative w-full">
                    <input
                      type="password"
                      id="passwordConfirm"
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
                        !passwordsMatch && formData.passwordConfirm 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="비밀번호를 한 번 더 입력해주세요"
                      required
                    />
                    {/* 비밀번호 확인 메시지 - 절대 위치로 배치 */}
                    {formData.password && formData.passwordConfirm && (
                      <div className="left-0 top-full mt-6 z-10">
                        {passwordsMatch ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm">입력한 비밀번호와 일치합니다.</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-red-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-sm">비밀번호가 일치하지 않습니다.</span>
                          </div>
                                                )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Contact */}
                <div className='flex flex-row items-center mb-2'>
                    <h3 className="w-2/6 text-sm font-medium text-gray-700 mb-2 text-left">
                      연락처
                    </h3>
    <div className="w-full">
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                        placeholder="01012345678 (숫자만 9~11자리)"
                        required
                      />
                      {formData.contact && !/^\d{9,11}$/.test(formData.contact) && (
                        <div className="mt-1 text-xs text-red-600">
                          연락처는 숫자만 9~11자리 입력해주세요 (예: 01012345678)
                        </div>
                      )}
                    </div>
                  </div>
                {/* Email */}
                <div className='flex flex-row items-start mb-2'>
                  <h3 className="mt-3 w-2/6 text-sm font-medium text-gray-700 mb-2 text-left">
                    이메일
                  </h3>
                    <div className="flex flex-col w-full gap-2">
                      <div className="w-full flex space-x-2">
                        <input
                          type="text"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                          placeholder="이메일을 입력하세요"
                          required
                        />
                        <span className="flex items-center px-3 text-gray-500 font-medium">@</span>
                        
                      </div>
                        <div className="w-full flex justify-end gap-3">
                        <select
                        name="emailDomain"
                        value={formData.emailDomain}
                        onChange={handleChange}
                        className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300 text-black`}
                      >
                        <option value="gmail.com">gmail.com</option>
                        <option value="naver.com">naver.com</option>
                        <option value="daum.net">daum.net</option>
                        <option value="hanmail.net">hanmail.net</option>
                        <option value="outlook.com">outlook.com</option>
                      </select>

                        
                      </div>
                      <button
                          type="button"
                          onClick={handleSendVerification}
                          className="w-full bg-gray-200 text-gray-600 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-300 hover:text-gray-800 hover:font-bold transition-colors"
                        >
                          {isEmailSent ? '인증번호 재발송' : '인증번호 보내기'}
                        </button>
                    </div>
                  
                </div>

                {/* Email Verification */}
                <div className='flex flex-row items-start mb-2'>
                  <div className="mt-3 w-2/6 text-sm text-gray-600 mb-2 text-left">
                    {isTimerActive ? `${formatTime(timeLeft)} 안에 인증을 완료하세요` : '인증하기'}
                  </div>
                  <div className="flex flex-col w-full gap-2">
                    <input
                      type="text"
                      id="verificationCode"
                      name="verificationCode"
                      value={formData.verificationCode}
                      onChange={handleChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      placeholder="6자리 인증번호"
                      maxLength={6}
                    />
                      {formData.verificationCode && (
                        <div className="flex items-center space-x-2 mt-2 text-green-600 justify-start">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm">정상적으로 인증되었습니다.</span>
                        </div>
                      )}
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      className="bg-gray-200 text-gray-600 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-300 hover:text-gray-800 hover:font-bold transition-colors whitespace-nowrap"
                    >
                      인증하기
                    </button>
                  </div>
                </div>



                
              </div>
            </div>
            {userType === 'expert' && (
              <div className="border-t border-gray-200 pt-6 w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">전문 자격 인증</h3>

                {/* Certificate Example Image */}
                <div className="mb-6">
                  <img 
                    src={certificationExample} 
                    alt="Certificate Example" 
                    className="w-full max-w-2xl mx-auto"
                  />
                </div>

                {/* Instructions */}
                <div className="w-full pl-10 text-left border border-gray-200 rounded-lg p-4 mb-6">
                  <ul className="text-left text-sm text-gray-700 space-y-3 py-3">
                    <li>• 위 합격증 원본대조 번호 입력 방식을 보고 아래 창에 입력해주세요.</li>
                    <li>• 입력 시 하이픈('-') 없이 숫자만 입력하시기 바랍니다.</li>
                  </ul>
                </div>

                {/* Form 제목 라벨 */}
                

                {/* 자격증 폼들 */}
                <div className="w-full flex flex-row gap-4 mb-4">
                    {/* Select */}
                    <div className='w-1/4 flex flex-col gap-3'>
                      <h3 className="text-left pl-5">전문 자격명</h3>
                    
                      <div className='w-full'>
                        <select
                        name="qualification"
                          className="text-sm text-gray-500 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">전문 자격을 선택하세요</option>
                          <option value="financial_advisor">금융투자상담사</option>
                          <option value="securities_analyst">증권분석사</option>
                          <option value="cfa">CFA</option>
                          <option value="cpa">CPA</option>
                        </select>
                      </div>
                    </div>

                    {/* Input 1 */}
                    <div className='w-3/4 flex flex-col gap-3'>
                      <h3 className='text-left pl-5'>인증번호 입력</h3>
                      <div className='grid grid-cols-3 gap-4'>
                      {/* Input 1 */}
                        <div className="flex flex-col">
                          <input
                            type="text"
                            placeholder="('-') 없이 숫자만 입력"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          />
                          <p className="text-xs text-gray-500 mt-1">중앙에 위치한 합격증 번호</p>
                        </div>

                        {/* Input 2 */}
                        <div className="flex flex-col">
                          <input
                            type="text"
                            placeholder="('-') 없이 숫자만 입력"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          />
                          <p className="text-xs text-gray-500 mt-1">합격증에 표기된 생년월일</p>
                        </div>

                        {/* Input 3 */}
                        <div className="flex flex-col">
                          <input
                            type="text"
                            placeholder="('-') 없이 숫자만 입력"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                          />
                          <p className="text-xs text-gray-500 mt-1">하단 발급번호의 마지막 6자리</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            )}

            <div className="space-y-2 pt-5 border-t border-gray-200">
              {/* 개인정보 수집·이용 동의 */}
              <div className="flex items-start space-x-3">
                <input
                  id="agreedPrivacy"
                  name="agreedPrivacy"
                  type="checkbox"
                  checked={formData.agreedPrivacy}
                  onChange={(e) =>
                    handleIndividualAgreement('agreedPrivacy', e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div className="flex-1 flex items-center">
                  <label
                    htmlFor="agreedPrivacy"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    (필수) 개인정보 수집·이용 동의
                  </label>
                  <button 
                    type="button" 
                    className="ml-auto text-blue-500 hover:text-blue-700"
                    onClick={() => setShowPrivacyModal(true)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              

              {/* 개인정보 제3자 제공 동의 */}
              <div className="flex items-start space-x-3 py-2">
                <input
                  id="agreedThirdParty"
                  name="agreedThirdParty"
                  type="checkbox"
                                     checked={false}
                   onChange={(_e) => {}}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div className="flex-1 flex items-center">
                  <label
                    htmlFor="agreedThirdParty"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    (필수) 개인정보 제3자 제공 동의
                  </label>
                  <button 
                    type="button" 
                    className="ml-auto text-blue-500 hover:text-blue-700"
                    onClick={() => setShowThirdPartyModal(true)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />

              {/* 필수 약관 전체 동의 */}
              <div className="flex items-start space-x-3 py-2">
                <input
                  id="agreedTerms"
                  name="agreedTerms"
                  type="checkbox"
                  checked={formData.agreedTerms}
                  onChange={(e) => handleAllTermsAgreement(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div className="flex-1 flex items-center">
                  <label
                    htmlFor="agreedTerms"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    (필수) 필수 약관에 모두 동의
                  </label>
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="text-center mt-6">
                <button
                  type="submit"
                  disabled={!isAllTermsAgreed || isLoading}
                  className={`w-full font-semibold py-4 px-6 rounded-lg transition duration-300 shadow-md ${
                    isAllTermsAgreed && !isLoading
                      ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? '처리 중...' : '회원가입 완료'}
                </button>
                {!isAllTermsAgreed && (
                  <p className="text-red-500 text-sm mt-5">
                    필수 약관에 모두 동의해주세요.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* 개인정보 수집·이용 동의 모달 */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img src={stalkLogoBlue} alt="Stalk Logo" className="h-8" />
                <h2 className="text-xl font-bold text-blue-600">개인정보 수집·이용 동의</h2>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            {/* 모달 내용 */}
            <div className="p-6 text-left">
              <p className="text-gray-700 mb-6">
                Stalk는 회원가입 및 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">1. 수집 항목</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">- 필수: 이름, 이메일, 비밀번호, 휴대폰 번호</p>
                      <p className="text-sm text-gray-600">- 선택: 생년월일, 프로필 이미지</p>
                    </div>
                    
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">2. 수집 및 이용 목적</h3>
                  <p className="text-sm text-gray-600"> - 회원 식별 및 가입 의사 확인</p>
                  <p className="text-sm text-gray-600"> - 서비스 제공 및 이용자 관리</p>
                  <p className="text-sm text-gray-600"> - 고객 문의 대응 및 공지사항 전달</p>
                  <p className="text-sm text-gray-600"> - 맞춤형 콘텐츠 추천 및 서비스 개선</p>
                  
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">3. 보유 및 이용 기간</h3>
                  <p className="text-sm text-gray-600 mb-2"> - 회원 탈퇴 시까지</p>
                  <p className="text-sm text-gray-600">
                   - 단, 관련 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안 보관됩니다.
                  </p>
                  <ul className="text-sm text-gray-600 ml-4 mt-2 space-y-1">
                    <li>• 계약 또는 청약철회 기록: 5년</li>
                    <li>• 대금 결제 및 재화 공급 기록: 5년</li>
                    <li>• 소비자 불만 또는 분쟁처리 기록: 3년</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* 모달 푸터 */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  handleIndividualAgreement('agreedPrivacy', true);
                  setShowPrivacyModal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 개인정보 제3자 제공 동의 모달 */}
      {showThirdPartyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img src={stalkLogoBlue} alt="Stalk Logo" className="h-8" />
                <h2 className="text-xl font-bold text-blue-600">개인정보 제3자 제공 동의</h2>
              </div>
              <button
                onClick={() => setShowThirdPartyModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            {/* 모달 내용 */}
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Stalk는 서비스 제공을 위해 아래와 같이 개인정보를 제3자에게 제공할 수 있습니다.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">제공 항목</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 이름, 이메일, 휴대폰 번호</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">제공 목적</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 서비스 제공 및 운영</li>
                    <li>• 고객 지원 및 문의 응대</li>
                    <li>• 법적 의무 이행</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">보유 및 이용 기간</h3>
                  <p className="text-sm text-gray-600">
                    서비스 제공 목적 달성 시까지 또는 회원 탈퇴 시까지
                  </p>
                </div>
              </div>
            </div>
            
            {/* 모달 푸터 */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowThirdPartyModal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage; 