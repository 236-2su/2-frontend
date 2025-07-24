import React from 'react';
import AdBanner from '../components/ad-banner';
import MonthlyExperts from '../components/monthly-experts';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <AdBanner />
        <MonthlyExperts />
      </main>
    </div>
  );
};

export default HomePage; 