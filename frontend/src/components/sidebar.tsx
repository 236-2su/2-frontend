import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

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

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div className={`fixed right-0 top-0 h-full bg-white shadow-lg border-l border-gray-200 transition-all duration-300 z-50 ${
      isCollapsed ? 'w-12' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-bold text-gray-900">내 투자관심</h2>
          )}
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
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
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

      {/* Recent Section */}
      {!isCollapsed && (
        <div className="px-3 py-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">최근 본</h3>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">현</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">현대차</p>
                <p className="text-xs text-gray-500">219,000원</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Icons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 space-y-2">
        <button className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors shadow-lg">
          <span className="text-sm">💬</span>
        </button>
        <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
          <span className="text-xs">↑</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
