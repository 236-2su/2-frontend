import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConsultationsPage = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const consultations = [
    {
      id: 1,
      expertName: '박주현',
      expertTitle: '투자 입문 컨설턴트',
      date: '2024.01.15',
      time: '14:00',
      status: 'completed',
      rating: 5,
      review: '매우 친절하고 이해하기 쉽게 설명해주셨습니다.'
    },
    {
      id: 2,
      expertName: '제임스',
      expertTitle: 'CFP 전문가',
      date: '2024.01.20',
      time: '16:00',
      status: 'upcoming',
      rating: null,
      review: null
    },
    {
      id: 3,
      expertName: '김미영',
      expertTitle: '부동산 투자 전문가',
      date: '2024.01.10',
      time: '10:00',
      status: 'completed',
      rating: 4,
      review: '실용적인 조언을 많이 받았습니다.'
    },
    {
      id: 4,
      expertName: '이준호',
      expertTitle: '암호화폐 전문가',
      date: '2024.01.25',
      time: '19:00',
      status: 'cancelled',
      rating: null,
      review: null
    }
  ];

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return '상담 완료';
      case 'upcoming': return '상담 예정';
      case 'cancelled': return '취소됨';
      default: return '알 수 없음';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredConsultations = selectedStatus === 'all' 
    ? consultations 
    : consultations.filter(consultation => consultation.status === selectedStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8">상담 내역</h1>

          {/* Status Filter */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedStatus('upcoming')}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-colors ${
                selectedStatus === 'upcoming'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              상담 예정
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-colors ${
                selectedStatus === 'completed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              상담 완료
            </button>
            <button
              onClick={() => setSelectedStatus('cancelled')}
              className={`px-6 py-3 rounded-full text-lg font-medium transition-colors ${
                selectedStatus === 'cancelled'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              취소됨
            </button>
          </div>

          {/* Consultations List */}
          <div className="space-y-6">
            {filteredConsultations.map((consultation) => (
              <div key={consultation.id} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                      👨‍💼
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{consultation.expertName}</h3>
                      <p className="text-gray-600">{consultation.expertTitle}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                    {getStatusText(consultation.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">상담 일시</p>
                    <p className="font-semibold">{consultation.date} {consultation.time}</p>
                  </div>
                  {consultation.rating && (
                    <div>
                      <p className="text-gray-600">평점</p>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < consultation.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 font-semibold">{consultation.rating}/5</span>
                      </div>
                    </div>
                  )}
                </div>

                {consultation.review && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 mb-2">후기</p>
                    <p className="text-gray-900">{consultation.review}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-4">
                  {consultation.status === 'upcoming' && (
                    <>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        취소 요청
                      </button>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        상담 입장
                      </button>
                    </>
                  )}
                  {consultation.status === 'completed' && (
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                      재상담 예약
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredConsultations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">상담 내역이 없습니다</h3>
              <p className="text-gray-600 mb-4">전문가와 상담을 예약해보세요</p>
              <button
                onClick={() => navigate('/experts')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                전문가 찾기
              </button>
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default ConsultationsPage; 