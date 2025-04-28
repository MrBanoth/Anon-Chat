import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/authentication/LoginPage';
import { RegisterPage } from './pages/authentication/RegisterPage';
import { ChatPage } from './pages/chat/ChatPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { OtherProfilePage } from './pages/profile/OtherProfilePage';
import { SubscriptionPage } from './pages/subscription/SubscriptionPage';
import { useAuthStore } from './store/authStore';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { useState } from 'react';
import { ChatbotModal } from './components/ChatbotModal';

function App() {
  const { isLoggedIn, user } = useAuthStore();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const openChatbot = () => setIsChatbotOpen(true);
  const closeChatbot = () => setIsChatbotOpen(false);
  
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage openHelpChatbot={openChatbot} />} />
          
          <Route path="/auth/login" element={
            isLoggedIn ? <Navigate to="/chat" /> : <LoginPage />
          } />
          
          <Route path="/auth/register" element={
            isLoggedIn ? <Navigate to="/chat" /> : <RegisterPage />
          } />
          
          <Route path="/chat" element={
            isLoggedIn ? <ChatPage isChatbotOpen={isChatbotOpen} /> : <Navigate to="/auth/login" />
          } />
          
          <Route path="/profile" element={
            isLoggedIn ? <ProfilePage /> : <Navigate to="/auth/login" />
          } />
          
          <Route path="/profile/:userId" element={
            isLoggedIn ? <OtherProfilePage /> : <Navigate to="/auth/login" />
          } />
          
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ChatbotModal isOpen={isChatbotOpen} onClose={closeChatbot} userId={user?.id} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
