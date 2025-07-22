import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const ExpertsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: '전체', icon: '👥' },
    { id: 'stock', name: '주식', icon: '📈' },
    { id: 'fund', name: '펀드', icon: '💰' },
    { id: 'crypto', name: '암호화폐', icon: '₿' },
    { id: 'realestate', name: '부동산', icon: '🏠' },
    { id: 'insurance', name: '보험', icon: '🛡️' }
  ];

  const experts = [
    {
      id: 1,
      name: '박주현',
      title: '주식 투자 전문가',
      category: 'stock',
      rating: '4.8',
      reviews: 127,
      tags: ['# 주식', '# 초급자 대상', '# 단기 투자'],
      price: '50,000원',
      image: '👨‍💼'
    },
    {
      id: 2,
      name: '김미영',
      title: '펀드 상담사',
      category: 'fund',
      rating: '4.6',
      reviews: 89,
      tags: ['# 펀드', '# 중급자 대상', '# 장기 투자'],
      price: '40,000원',
      image: '👩‍💼'
    },
    {
      id: 3,
      name: '이준호',
      title: '암호화폐 전문가',
      category: 'crypto',
      rating: '4.9',
      reviews: 203,
      tags: ['# 암호화폐', '# 고급자 대상', '# 리스크 관리'],
      price: '60,000원',
      image: '👨‍💻'
    },
    {
      id: 4,
      name: '최수진',
      title: '부동산 투자 상담사',
      category: 'realestate',
      rating: '4.7',
      reviews: 156,
      tags: ['# 부동산', '# 중급자 대상', '# 투자 분석'],
      price: '45,000원',
      image: '👩‍🏫'
    },
    {
      id: 5,
      name: '정민수',
      title: '보험 설계사',
      category: 'insurance',
      rating: '4.5',
      reviews: 78,
      tags: ['# 보험', '# 초급자 대상', '# 자산 보호'],
      price: '35,000원',
      image: '👨‍⚕️'
    },
    {
      id: 6,
      name: '한지영',
      title: '종합 투자 전문가',
      category: 'stock',
      rating: '4.9',
      reviews: 234,
      tags: ['# 종합 투자', '# 고급자 대상', '# 포트폴리오'],
      price: '70,000원',
      image: '👩‍🎓'
    }
  ];

  const filteredExperts = experts.filter(expert => {
    const matchesCategory = selectedCategory === 'all' || expert.category === selectedCategory;
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              투자 전문가 찾기
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              다양한 분야의 전문가들과 상담하여 더 나은 투자 결정을 내려보세요
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-modern border border-white/20 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="전문가 이름, 분야, 키워드로 검색하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white shadow-modern'
                      : 'bg-white/50 text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              총 <span className="font-semibold text-blue-600">{filteredExperts.length}</span>명의 전문가
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>정렬:</span>
              <select className="bg-white/50 border border-gray-200 rounded-xl px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>평점순</option>
                <option>리뷰순</option>
                <option>가격순</option>
              </select>
            </div>
          </div>

          {/* Experts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert, index) => (
              <div
                key={expert.id}
                className="group bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-modern border border-white/20 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Expert Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl shadow-modern">
                      {expert.image}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{expert.name}</h3>
                      <p className="text-gray-600 text-sm">{expert.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-gray-700">{expert.rating}</span>
                    <span className="text-gray-500 text-xs">({expert.reviews})</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {expert.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">상담료</p>
                    <p className="text-xl font-bold text-blue-600">{expert.price}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/expert/${expert.id}`)}
                    className="group/btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-2xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105"
                  >
                    <span className="flex items-center space-x-1">
                      <span>예약하기</span>
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredExperts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 키워드로 검색해보세요</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExpertsPage; 