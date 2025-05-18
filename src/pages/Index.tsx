
import React, { useState, useEffect } from 'react';
import EntryScreen from '@/components/EntryScreen';
import TrainerIntro from '@/components/TrainerIntro';
import AdoptionCenter from '@/pages/AdoptionCenter';
import NavBar from '@/components/NavBar';
import AuthForms from '@/components/AuthForms';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

enum AppState {
  Entry,
  TrainerIntro,
  AdoptionCenter
}

const Index: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Entry);
  const [showAuthForms, setShowAuthForms] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Function to handle progression through app states
  const handleProgressToState = (state: AppState) => {
    setAppState(state);
  };
  
  // Handle login modal
  const handleOpenLogin = () => {
    setAuthTab('login');
    setShowAuthForms(true);
  };
  
  // Handle register modal
  const handleOpenRegister = () => {
    setAuthTab('register');
    setShowAuthForms(true);
  };
  
  const handleCloseAuth = () => {
    setShowAuthForms(false);
  };

  // Add background music
  useEffect(() => {
    const audio = new Audio('/sounds/background-music.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.id = 'bgMusic';
    document.body.appendChild(audio);
    
    // Don't autoplay since browsers block it
    // Instead we'll play it on first user interaction
    const playMusic = () => {
      audio.play().catch(err => console.error('Error playing background music:', err));
      document.removeEventListener('click', playMusic);
    };
    
    document.addEventListener('click', playMusic);
    
    return () => {
      audio.pause();
      audio.remove();
      document.removeEventListener('click', playMusic);
    };
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {appState === AppState.Entry && (
          <EntryScreen onEnter={() => handleProgressToState(AppState.TrainerIntro)} />
        )}
        
        {appState > AppState.Entry && (
          <NavBar
            onLoginClick={handleOpenLogin}
            onRegisterClick={handleOpenRegister}
          />
        )}
        
        {appState === AppState.TrainerIntro && (
          <TrainerIntro onContinue={() => handleProgressToState(AppState.AdoptionCenter)} />
        )}
        
        {appState === AppState.AdoptionCenter && (
          <div className="flex-grow">
            <AdoptionCenter />
          </div>
        )}
        
        {appState > AppState.Entry && <Footer />}
        
        <AuthForms
          isOpen={showAuthForms}
          onClose={handleCloseAuth}
          defaultTab={authTab}
        />
      </div>
    </AuthProvider>
  );
};

export default Index;
