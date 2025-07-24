import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Toss_symbol from '../assets/Toss_Symbol_Primary.svg';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

interface Notification {
  id: string;
  timestamp: string;
  type: 'cancel' | 'complete';
  message: string;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string>('notifications');

  const menuItems: MenuItem[] = [
    {
      id: 'notifications',
      label: '알림',
      path: '/notifications',
      icon: '🔔'
    },
    {
      id: 'watchlist',
      label: '관심종목',
      path: '/watchlist',
      icon: '❤️'
    },
    {
      id: 'holdings',
      label: '보유종목',
      path: '/holdings',
      icon: '🛒'
    },
    {
      id: 'reservations',
      label: '예약내역',
      path: '/reservations',
      icon: '📅'
    }
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      timestamp: '2025.08.01 11:00',
      type: 'cancel',
      message: '김범주 전문가님의 요청으로 2025년 08월 14일 14시에 예약된 상담이 취소되었습니다.'
    },
    {
      id: '2',
      timestamp: '2025.08.01 10:05',
      type: 'complete',
      message: '김범주 전문가님에게 2025년 08월 14일 14시에 상담 예약이 완료되었습니다.'
    }
  ];

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleMenuClick = (item: MenuItem) => {
    setSelectedMenu(item.id);
    setShowContent(true);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'notifications':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">알림</h2>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                모두 비우기
              </button>
            </div>
            <div className="space-y-6">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'cancel' ? 'bg-red-500' : 'bg-blue-500'
                    }`}>
                      <span className="text-white text-sm font-bold">
                        {notification.type === 'cancel' ? '!' : '✓'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-500 mb-2">
                        {notification.timestamp}
                      </div>
                      <div className="text-gray-900 leading-relaxed">
                        {notification.message}
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && (
                    <div className="border-t border-gray-200 mt-6 pt-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'watchlist':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">관심종목</h2>
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">❤️</div>
              <p className="text-lg">관심종목이 없습니다</p>
            </div>
          </div>
        );
      case 'holdings':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">보유종목</h2>
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-lg">보유종목이 없습니다</p>
            </div>
          </div>
        );
      case 'reservations':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">예약내역</h2>
            <div className="text-center text-gray-500 py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-lg">예약내역이 없습니다</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full bg-white shadow-lg border-l border-gray-200 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-15' : 'w-64'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    selectedMenu === item.id && showContent
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Icons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-y-2">
          <button 
            onClick={() => window.open('https://www.tossinvest.com/', '_blank')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg border border-gray-200"
          >
            <img src={Toss_symbol} alt="" className='w-6 h-6' />
          </button>
          <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
            <span className="text-xs">↑</span>
          </button>
        </div>
      </div>

      {/* Content Panel */}
      {showContent && (
        <div className="fixed right-16 top-0 h-full bg-white shadow-lg border-l border-gray-200 w-80 z-40">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              {menuItems.find(item => item.id === selectedMenu)?.label}
            </h3>
            <button
              onClick={() => window.open('https://www.tossinvest.com/', '_blank')}
              className="p-1 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto h-full">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
