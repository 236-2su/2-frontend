import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Expert {
  id: string;
  name: string;
  title: string;
  rating?: number;
  tags: string[];
}

interface ExpertCardProps {
  expert: Expert;
  isActive?: boolean;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert, isActive = false }) => {
  const navigate = useNavigate();

  return (
    <div className={`group relative overflow-hidden rounded-3xl p-6 h-auto ${
      isActive 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50' 
        : 'bg-white border border-gray-200 hover:border-blue-300'
    } transition-all duration-300 hover:shadow-modern hover:-translate-y-1`}>
      
      {/* Background Pattern */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
      )}
      
      <div className="relative">
        {/* Profile Image and Rating */}
        <div className="flex items-start justify-between mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-modern group-hover:shadow-glow transition-all duration-300">
              <span className="text-white text-2xl font-bold">👨‍💼</span>
            </div>
            {isActive && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          
          {expert.rating && (
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-soft">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-700 font-semibold text-sm">{expert.rating}</span>
            </div>
          )}
        </div>

        {/* Expert Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{expert.name}</h3>
            <p className="text-gray-600 text-sm">{expert.title}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {expert.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200/50"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate(`/expert-detail/${expert.id}`)}
            className="w-full group/btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-soft hover:shadow-glow transform hover:scale-105"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>예약하기</span>
              <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertCard; 