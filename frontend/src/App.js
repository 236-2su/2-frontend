import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import HomeLoggedInPage from './pages/HomeLoggedInPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SignupComplete from './pages/SignupComplete';

import ExpertsPage from './pages/ExpertsPage';
import ProductsPage from './pages/ProductsPage';
import CommunityPage from './pages/CommunityPage';
import MyPage from './pages/MyPage';
import SettingsPage from './pages/SettingsPage';
import WritePostPage from './pages/WritePostPage';
import ConsultationsPage from './pages/ConsultationsPage';
import FavoritesPage from './pages/FavoritesPage';
import SignupChoicePage from './pages/SignupChoicePage';
import SearchPage from './pages/SearchPage';
// Navbar를 숨길 페이지 목록
const hideNavbarRoutes = ['/login', '/signup', '/SignupChoicePage', '/signup-complete'];

function AppContent() {
  const location = useLocation();
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="App min-h-screen bg-white">
      {showNavbar && <Navbar />}
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
        
        {/* Redirect to home if route not found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
