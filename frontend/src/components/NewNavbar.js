import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import stalkLogoBlue from '../assets/Stalk_logo_blue.svg';

const NewNavbar = ({ userType, onUserTypeChange, showUserTypeToggle = false }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav className="w-full h-20 flex items-center justify-between relative px-5 mb-10">
      <Link to="/">
        <img src={stalkLogoBlue} alt="Stalk Logo" className="w-36 h-12" />
      </Link>
      
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
          className={`w-10 h-10 cursor-pointer text-3xl border-none rounded-full transition-colors duration-300 flex items-center justify-center pb-1 ${
            isHovered ? 'bg-gray-100' : 'bg-transparent'
          }`}
          onClick={() => navigate('/')}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          &times;
        </button>
      </div>
    </nav>
  );
};

export default NewNavbar;
