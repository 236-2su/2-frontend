import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 p-8 md:p-12 max-w-7xl mx-auto my-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative flex flex-col lg:flex-row items-center justify-between">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl mb-8 lg:mb-0">
          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-white/70 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-medium shadow-soft">
              #초급(1년 미만)
            </span>
            <span className="bg-white/70 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-medium shadow-soft">
              #단기 투자
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            주식이 처음이신가요?
          </h1>

          {/* Consultant Name */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            박주현 컨설턴트와 함께 시작하세요
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/experts')}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-modern hover:shadow-glow transform hover:scale-105"
          >
            <span className="flex items-center space-x-2">
              <span>예약하기</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl flex items-center justify-center shadow-modern animate-float">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl md:text-3xl font-bold">👨‍💼</span>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce-gentle"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-bounce-gentle" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>
      </div>

      {/* AD Badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-modern">
        AD
      </div>
    </div>
  );
};

export default AdBanner; 