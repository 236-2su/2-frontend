import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import Footer from './components/footer';

// Pages
import HomePage from './pages/home-page';
import HomeLoggedInPage from './pages/home-logged-in-page';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';
import SignupComplete from './pages/signup-complete';

import ExpertsPage from './pages/experts-page';
import ProductsPage from './pages/products-page';
import CommunityPage from './pages/community-page';
import MyPage from './pages/my-page';
import SettingsPage from './pages/settings-page';
import WritePostPage from './pages/write-post-page';
import ConsultationsPage from './pages/consultations-page';
import FavoritesPage from './pages/favorites-page';
import SignupChoicePage from './pages/signup-choice-page';
import SearchPage from './pages/search-page';

// Navbar를 숨길 페이지 목록
const hideNavbarRoutes: string[] = ['/login', '/signup', '/SignupChoicePage', '/signup-complete'];

// Sidebar를 보여줄 페이지 목록 (모든 페이지에 적용)
const showSidebarRoutes: string[] = [
  '/', 
  '/home-logged-in', 
  '/experts', 
  '/community', 
  '/products', 
  '/mypage', 
  '/settings', 
  '/write-post', 
  '/consultations', 
  '/favorites',
  '/search',
  '/notifications',
  '/watchlist',
  '/holdings',
  '/reservations'
];

// Footer를 숨길 페이지 목록
const hideFooterRoutes: string[] = ['/login', '/signup', '/SignupChoicePage', '/signup-complete'];

const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavbar: boolean = !hideNavbarRoutes.includes(location.pathname);
  const showSidebar: boolean = showSidebarRoutes.includes(location.pathname);
  const showFooter: boolean = !hideFooterRoutes.includes(location.pathname);
  
  console.log('Current path:', location.pathname);
  console.log('Show footer:', showFooter);
  console.log('Hide footer routes:', hideFooterRoutes);

  return (
    <div className="App min-h-screen bg-white flex flex-col">
      {showNavbar && <Navbar />}
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 ${showSidebar ? 'mr-0' : ''} flex flex-col`}>
          <main className="flex-1 overflow-auto">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signup-complete" element={<SignupComplete />} />

              <Route path="/SignupChoicePage" element={<SignupChoicePage />} />
              <Route path="/search" element={<SearchPage />} />
              
              {/* Protected Routes */}
              <Route path="/home-logged-in" element={<HomeLoggedInPage />} />
              <Route path="/experts" element={<ExpertsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/write-post" element={<WritePostPage />} />
              <Route path="/consultations" element={<ConsultationsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              
              {/* Sidebar Routes */}
              <Route path="/notifications" element={<div className="p-4"><h1>알림</h1></div>} />
              <Route path="/watchlist" element={<div className="p-4"><h1>관심종목</h1></div>} />
              <Route path="/holdings" element={<div className="p-4"><h1>보유종목</h1></div>} />
              <Route path="/reservations" element={<div className="p-4"><h1>예약내역</h1></div>} />
              
              {/* Redirect to home if route not found */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        {showSidebar && <Sidebar />}
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
