import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const [section, key] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 설정 저장 로직
    alert('설정이 저장되었습니다.');
  };

  const tabs = [
    { id: 'profile', name: '프로필 설정', icon: '👤' },
    { id: 'notifications', name: '알림 설정', icon: '🔔' },
    { id: 'privacy', name: '개인정보', icon: '🔒' },
    { id: 'security', name: '보안', icon: '🛡️' },
    { id: 'preferences', name: '환경설정', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">설정</h1>
            <p className="text-gray-600">계정 설정을 관리하세요</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-modern border border-white/20">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white shadow-modern'
                          : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-modern border border-white/20">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl text-white shadow-modern">
                        👤
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">프로필 설정</h2>
                        <p className="text-gray-600">기본 정보를 수정하세요</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            이름
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            이메일
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          전화번호
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-modern hover:shadow-glow transform hover:scale-105"
                      >
                        저장하기
                      </button>
                    </form>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl text-white shadow-modern">
                        🔔
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">알림 설정</h2>
                        <p className="text-gray-600">알림을 받을 방법을 선택하세요</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                        <div>
                          <h3 className="font-semibold text-gray-900">이메일 알림</h3>
                          <p className="text-sm text-gray-600">중요한 업데이트를 이메일로 받습니다</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.email"
                            checked={formData.notifications.email}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                        <div>
                          <h3 className="font-semibold text-gray-900">푸시 알림</h3>
                          <p className="text-sm text-gray-600">실시간 알림을 받습니다</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.push"
                            checked={formData.notifications.push}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                        <div>
                          <h3 className="font-semibold text-gray-900">SMS 알림</h3>
                          <p className="text-sm text-gray-600">문자 메시지로 알림을 받습니다</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications.sms"
                            checked={formData.notifications.sms}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl text-white shadow-modern">
                        🔒
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">개인정보 설정</h2>
                        <p className="text-gray-600">개인정보 노출 범위를 설정하세요</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                        <div>
                          <h3 className="font-semibold text-gray-900">프로필 공개</h3>
                          <p className="text-sm text-gray-600">다른 사용자가 내 프로필을 볼 수 있습니다</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="privacy.profileVisible"
                            checked={formData.privacy.profileVisible}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                        <div>
                          <h3 className="font-semibold text-gray-900">이메일 공개</h3>
                          <p className="text-sm text-gray-600">다른 사용자가 내 이메일을 볼 수 있습니다</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="privacy.showEmail"
                            checked={formData.privacy.showEmail}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                        <div>
                          <h3 className="font-semibold text-gray-900">전화번호 공개</h3>
                          <p className="text-sm text-gray-600">다른 사용자가 내 전화번호를 볼 수 있습니다</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="privacy.showPhone"
                            checked={formData.privacy.showPhone}
                            onChange={handleChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center text-2xl text-white shadow-modern">
                        🛡️
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">보안 설정</h2>
                        <p className="text-gray-600">계정 보안을 관리하세요</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200 hover:bg-white/70 transition-all duration-300">
                        <div>
                          <h3 className="font-semibold text-gray-900">비밀번호 변경</h3>
                          <p className="text-sm text-gray-600">계정 보안을 위해 정기적으로 변경하세요</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <button className="w-full flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200 hover:bg-white/70 transition-all duration-300">
                        <div>
                          <h3 className="font-semibold text-gray-900">2단계 인증</h3>
                          <p className="text-sm text-gray-600">추가 보안을 위해 2단계 인증을 설정하세요</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <button className="w-full flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200 hover:bg-white/70 transition-all duration-300">
                        <div>
                          <h3 className="font-semibold text-gray-900">로그인 기록</h3>
                          <p className="text-sm text-gray-600">최근 로그인 활동을 확인하세요</p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Preferences */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl text-white shadow-modern">
                        ⚙️
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">환경설정</h2>
                        <p className="text-gray-600">앱 사용 환경을 맞춤 설정하세요</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                        <div>
                          <h3 className="font-semibold text-gray-900">다크 모드</h3>
                          <p className="text-sm text-gray-600">어두운 테마로 변경합니다</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                        <div>
                          <h3 className="font-semibold text-gray-900">자동 로그인</h3>
                          <p className="text-sm text-gray-600">앱을 다시 열 때 자동으로 로그인합니다</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-gray-200">
                        <div>
                          <h3 className="font-semibold text-gray-900">언어 설정</h3>
                          <p className="text-sm text-gray-600">앱 언어를 변경합니다</p>
                        </div>
                        <select className="bg-white/50 border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>한국어</option>
                          <option>English</option>
                          <option>日本語</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SettingsPage; 