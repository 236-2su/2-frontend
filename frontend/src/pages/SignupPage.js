import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NewNavbar from '../components/NewNavbar';
import Footer from '../components/Footer';

const SignupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userType, setUserType] = useState('general');
  const [timeLeft, setTimeLeft] = useState(300); // 5분 타이머
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    contact: '',
    email: '',
    emailDomain: '',
    verificationCode: '',
    userType: 'general',
    profilePhoto: null,
    qualification: '',
    qualificationFile: null,
    termsAgreement: false,
    privacyAgreement: false,
    thirdPartyAgreement: false
  });

  // URL 파라미터에서 사용자 타입 읽기
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'expert' || typeParam === 'general') {
      setUserType(typeParam);
      setFormData(prev => ({ ...prev, userType: typeParam }));
    }
  }, [searchParams]);

  // 타이머 효과
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}분 ${secs.toString().padStart(2, '0')}초`;
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setFormData(prev => ({ ...prev, userType: type }));
    navigate(`/signup?type=${type}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userType === 'expert') {
      navigate('/signup-expert');
    } else {
      navigate('/home-logged-in');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 비밀번호 확인 검증
    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (confirmPassword) {
        setPasswordsMatch(password === confirmPassword);
      } else {
        setPasswordsMatch(true); // 입력하지 않았으면 에러 표시 안함
      }
    }
  };

  const handleSendVerification = () => {
    setIsTimerActive(true);
    setTimeLeft(300);
    setIsEmailSent(true);
  };

  const handleAllTermsAgreement = (checked) => {
    setFormData({
      ...formData,
      privacyAgreement: checked,
      thirdPartyAgreement: checked,
      termsAgreement: checked
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <NewNavbar 
        userType={userType}
        onUserTypeChange={handleUserTypeChange}
        showUserTypeToggle={true}
      />
      <div className="w-full max-w-6xl mx-auto px-4 ">
       
        {/* Signup Form */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
           {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-lg text-gray-600">Sign up</p>
        </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Photo Section (Expert only) */}
            {userType === 'expert' && (
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">프로필 사진</h3>
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                    {formData.profilePhoto ? (
                      <img src={URL.createObjectURL(formData.profilePhoto)} alt="Profile" className="w-24 h-32 rounded-lg object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="mb-3 flex flex-row justify-between">
                      <input
                        type="text"
                        readOnly
                        value={formData.profilePhoto ? formData.profilePhoto.name : ''}
                        className="w-3/4 px-3 py-3 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                        placeholder="파일명"
                      />
                      <div className="flex space-x-2 mb-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFormData({...formData, profilePhoto: e.target.files[0]})}
                          className="hidden"
                          id="profilePhoto"
                        />
                        <label htmlFor="profilePhoto" className="bg-blue-500 text-white px-4 py-3 rounded text-sm cursor-pointer hover:bg-blue-600 transition-colors">
                          사진 등록
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, profilePhoto: null})}
                          className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          사진 삭제
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1 text-left">
                      <p>프로필 사진은 300x400px 사이즈를 권장합니다.</p>
                      <p>파일 형식은 JPGE(.jpg, .jpeg) 또는 PNG(.png)만 지원합니다.</p>
                      <p>업로드 파일 용량은 2MB 이하만 가능합니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* User ID */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 text-left">
                    아이디
                  </h3>
                  <div className="flex space-x-2">
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
                      className="bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                      중복확인
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 text-left">
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
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 text-left">
                    닉네임
                  </h3>
                  <div className="flex space-x-2">
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
                      className="bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                      중복확인
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 text-left">
                    비밀번호
                  </h3>
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
                </div>

                {/* Confirm Password */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 text-left">
                    비밀번호 확인
                  </h3>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
                      !passwordsMatch && formData.confirmPassword 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="비밀번호를 한 번 더 입력해주세요"
                    required
                  />
                  {formData.password && formData.confirmPassword && passwordsMatch && (
                    <div className="flex items-center space-x-2 mt-2 text-green-600 justify-start">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">입력한 비밀번호와 일치합니다.</span>
                    </div>
                  )}
                  {!passwordsMatch && formData.confirmPassword && (
                    <div className="flex items-center space-x-2 mt-2 text-red-600 justify-start">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm">비밀번호가 일치하지 않습니다.</span>
                    </div>
                  )}
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 text-left">
                    연락처
                  </h3>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                    placeholder="연락처를 입력해주세요"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 text-left">
                    이메일
                  </h3>
                  {userType === 'general' ? (
                    // 일반 사용자: @ 이후 도메인을 버튼과 같은 줄에
                    <div className="space-y-2">
                                              <input
                          type="text"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                          placeholder="이메일을 입력하세요"
                          required
                        />
                      <div className="flex space-x-2 items-center">
                        <span className="text-gray-500 font-medium">@</span>
                        <select
                          name="emailDomain"
                          value={formData.emailDomain}
                          onChange={handleChange}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                        >
                          <option value="">이메일 주소를 입력하세요</option>
                          <option value="gmail.com">gmail.com</option>
                          <option value="naver.com">naver.com</option>
                          <option value="daum.net">daum.net</option>
                          <option value="hanmail.net">hanmail.net</option>
                          <option value="outlook.com">outlook.com</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleSendVerification}
                          className="bg-gray-200 text-gray-600 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-300 hover:text-gray-800 transition-colors whitespace-nowrap"
                        >
                          {isEmailSent ? '인증번호 재발송' : '인증번호 보내기'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 전문가: 기존 레이아웃 유지
                    <div>
                      <div className="flex space-x-2 mb-2">
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
                        <select
                          name="emailDomain"
                          value={formData.emailDomain}
                          onChange={handleChange}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                        >
                          <option value="">이메일 주소를 입력하세요</option>
                          <option value="gmail.com">gmail.com</option>
                          <option value="naver.com">naver.com</option>
                          <option value="daum.net">daum.net</option>
                          <option value="hanmail.net">hanmail.net</option>
                          <option value="outlook.com">outlook.com</option>
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleSendVerification}
                          className="bg-gray-200 text-gray-600 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-300 hover:text-gray-800 transition-colors"
                        >
                          {isEmailSent ? '인증번호 재발송' : '인증번호 보내기'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Verification */}
                <div>
                  <div className="text-sm text-gray-600 mb-2 text-left">
                    {isTimerActive ? `${formatTime(timeLeft)} 안에 인증을 완료하세요` : '인증번호를 입력하세요'}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="verificationCode"
                      name="verificationCode"
                      value={formData.verificationCode}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      placeholder="6자리 인증번호"
                      maxLength="6"
                    />
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-600 px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-300 hover:text-gray-800 transition-colors whitespace-nowrap"
                    >
                      인증하기
                    </button>
                  </div>
                  {formData.verificationCode && (
                    <div className="flex items-center space-x-2 mt-2 text-green-600 justify-start">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">정상적으로 인증되었습니다.</span>
                    </div>
                  )}
                </div>

                {/* Qualification (Expert only) */}
                {userType === 'expert' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 text-left">
                      전문 자격 인증
                    </h3>
                    <select
                      id="qualification"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-300 mb-3"
                    >
                      <option value="">전문 자격을 선택하세요</option>
                      <option value="financial_advisor">금융투자상담사</option>
                      <option value="securities_analyst">증권분석사</option>
                      <option value="cpa">CFA</option>
                      <option value="tax_accountant">CPA</option>
                    </select>
                    <div className="mb-2">
                                          <input
                      type="text"
                      readOnly
                      value={formData.qualificationFile ? formData.qualificationFile.name : ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-50 focus:outline-none"
                      placeholder="등록된 파일명"
                    />
                    </div>
                    <div className="flex justify-end">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({...formData, qualificationFile: e.target.files[0]})}
                      className="hidden"
                      id="qualificationFile"
                    />
                    <label htmlFor="qualificationFile" className="bg-blue-500 text-white px-4 py-3 rounded text-sm font-medium cursor-pointer hover:bg-blue-600 transition-colors inline-block">
                      파일등록
                    </label>
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-5 border-t border-gray-200">
                  {/* 개인정보 수집·이용 동의 */}
                  <div className="flex items-start space-x-3">
                    <input
                      id="privacyAgreement"
                      name="privacyAgreement"
                      type="checkbox"
                      checked={formData.privacyAgreement}
                      onChange={(e) =>
                        setFormData({ ...formData, privacyAgreement: e.target.checked })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <div className="flex-1 flex items-center">
                      <label
                        htmlFor="privacyAgreement"
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        개인정보 수집·이용 동의
                      </label>
                      <button type="button" className="ml-auto text-blue-500 hover:text-blue-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                 

                  {/* 개인정보 제3자 제공 동의 */}
                  <div className="flex items-start space-x-3">
                    <input
                      id="thirdPartyAgreement"
                      name="thirdPartyAgreement"
                      type="checkbox"
                      checked={formData.thirdPartyAgreement}
                      onChange={(e) =>
                        setFormData({ ...formData, thirdPartyAgreement: e.target.checked })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <div className="flex-1 flex items-center">
                      <label
                        htmlFor="thirdPartyAgreement"
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        개인정보 제3자 제공 동의
                      </label>
                      <button type="button" className="ml-auto text-blue-500 hover:text-blue-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <hr className="my-2 border-gray-200" />

                  {/* 필수 약관 전체 동의 */}
                  <div className="flex items-start space-x-3">
                    <input
                      id="termsAgreement"
                      name="termsAgreement"
                      type="checkbox"
                      checked={formData.termsAgreement}
                      onChange={(e) => handleAllTermsAgreement(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <div className="flex-1 flex items-center">
                      <label
                        htmlFor="termsAgreement"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        필수 약관에 모두 동의
                      </label>
                    </div>
                  </div>
                  <hr className="my-2 border-gray-200" />

                  {/* 제출 버튼 */}
                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      회원가입 완료
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </form>
        </div>

        </div>
      <Footer />
    </div>
  );
};

export default SignupPage; 