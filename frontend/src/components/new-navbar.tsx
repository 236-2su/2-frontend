import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import stalkLogoBlue from '../assets/stalk_logo_blue.svg';

interface NewNavbarProps {
  userType?: string;
  onUserTypeChange?: (type: string) => void;
  showUserTypeToggle?: boolean;
}

const NewNavbar: React.FC<NewNavbarProps> = ({ userType = 'general', onUserTypeChange = () => {}, showUserTypeToggle = false }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav className="w-full h-20 flex items-center justify-between relative px-5 mb-10">
       {/* Brand Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-300"
            >
              
              <img src={stalkLogoBlue} alt="Stalk Logo" className="w-30 h-10" />
            </button>
            
          </div>
      
      <div className="flex items-center gap-4">
        {/* User Type Toggle - Only show when showUserTypeToggle is true */}
        {showUserTypeToggle && (
          <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20">
            <button
              onClick={() => onUserTypeChange('general')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                userType === 'general'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              일반 사용자
            </button>
            <button
              onClick={() => onUserTypeChange('expert')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                userType === 'expert'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              전문가
            </button>
          </div>
        )}
        
        <button 
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-2.5 rounded-2xl text-sm transition-all duration-300 transform hover:scale-105"
        >
          로그인
        </button>
      </div>
    </nav>
  );
};

export default NewNavbar;
