import React from 'react';
import AdBanner from '../components/AdBanner';
import MonthlyExperts from '../components/MonthlyExperts';
import Footer from '../components/Footer';

const HomeLoggedInPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <AdBanner />
        <MonthlyExperts />
      </main>

      <Footer />
    </div>
  );
};

export default HomeLoggedInPage; 