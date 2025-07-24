import React from 'react';
import ExpertCard from './exper-card';

const MonthlyExperts = () => {
  const experts = [
    {
      id: 1,
      name: '박주현',
      title: '컨설턴트',
      tags: ['# 금융', '# 입문자 대상'],
      rating: null,
      isActive: true
    },
    {
      id: 2,
      name: '제임스',
      title: '입문 컨설턴트',
      tags: ['# CFP', '# 중급자 대상', '# 금융투자 분석사', '# CFA'],
      rating: '4.5 (100)',
      isActive: false
    },
    {
      id: 3,
      name: '박주현',
      title: '컨설턴트',
      tags: ['# 금융', '# 입문자 대상'],
      rating: null,
      isActive: true
    },
    {
      id: 4,
      name: '제임스',
      title: '입문 컨설턴트',
      tags: ['# CFP', '# 중급자 대상', '# 금융투자 분석사', '# CFA'],
      rating: '4.5 (100)',
      isActive: false
    },
    {
      id: 5,
      name: '박주현',
      title: '컨설턴트',
      tags: ['# 금융', '# 입문자 대상'],
      rating: null,
      isActive: true
    },
    {
      id: 6,
      name: '제임스',
      title: '입문 컨설턴트',
      tags: ['# CFP', '# 중급자 대상', '# 금융투자 분석사', '# CFA'],
      rating: '4.5 (100)',
      isActive: false
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-modern">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">이달의 전문가</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            투자 경험과 전문성을 갖춘 우수한 전문가들을 만나보세요
          </p>
        </div>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert, index) => (
            <div
              key={expert.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ExpertCard expert={expert} isActive={expert.isActive} />
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="group bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 shadow-soft hover:shadow-modern transform hover:scale-105">
            <span className="flex items-center space-x-2">
              <span>전문가 더 보기</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MonthlyExperts; 