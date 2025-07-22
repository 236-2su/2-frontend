import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState('news');

  // URL 파라미터에서 탭 정보 읽기
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'news' || tabParam === 'free') {
      setSelectedTab(tabParam);
    }
  }, [searchParams]);

  const posts = [
    {
      id: 1,
      title: '주식 투자 초보자를 위한 가이드',
      author: '투자왕',
      date: '2024.01.15',
      views: 1234,
      likes: 89,
      category: 'news',
      content: '주식 투자를 처음 시작하는 분들을 위한 기본 가이드입니다...'
    },
    {
      id: 2,
      title: '부동산 투자 시장 동향 분석',
      author: '부동산전문가',
      date: '2024.01.14',
      views: 856,
      likes: 67,
      category: 'news',
      content: '2024년 부동산 시장의 전망과 투자 전략에 대해 알아보겠습니다...'
    },
    {
      id: 3,
      title: '암호화폐 투자 경험 공유',
      author: '코인러버',
      date: '2024.01.13',
      views: 2341,
      likes: 156,
      category: 'free',
      content: '암호화폐 투자 3년간의 경험을 공유합니다...'
    },
    {
      id: 4,
      title: '펀드 투자 성공 사례',
      author: '펀드마스터',
      date: '2024.01.12',
      views: 567,
      likes: 34,
      category: 'free',
      content: '펀드 투자로 수익을 낸 경험을 공유합니다...'
    }
  ];

  const filteredPosts = selectedTab === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">커뮤니티</h1>
            <p className="text-lg text-gray-600">투자 정보와 경험을 공유하세요</p>
          </div>

          {/* Write Post Button */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/write-post')}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-2xl transition-all duration-300 shadow-modern hover:shadow-glow transform hover:scale-105"
            >
              <span className="flex items-center space-x-2">
                <span>글쓰기</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-2 shadow-modern border border-white/20 mb-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTab('all')}
                className={`flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-300 ${
                  selectedTab === 'all'
                    ? 'bg-blue-500 text-white shadow-modern'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setSelectedTab('news')}
                className={`flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-300 ${
                  selectedTab === 'news'
                    ? 'bg-blue-500 text-white shadow-modern'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                뉴스
              </button>
              <button
                onClick={() => setSelectedTab('free')}
                className={`flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-300 ${
                  selectedTab === 'free'
                    ? 'bg-blue-500 text-white shadow-modern'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                자유게시판
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <div
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="group bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-modern border border-white/20 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                    <p className="text-gray-600 line-clamp-2">{post.content}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ml-4 ${
                    post.category === 'news' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {post.category === 'news' ? '뉴스' : '자유게시판'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{post.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.likes}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityPage; 