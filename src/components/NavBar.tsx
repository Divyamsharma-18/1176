
import React, { useState, useEffect } from 'react';
import { Coins, VolumeX, Volume2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavBarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onLoginClick, onRegisterClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  
  // Handle background music
  useEffect(() => {
    const bgMusic = document.getElementById('bgMusic') as HTMLAudioElement | null;
    if (bgMusic) {
      bgMusic.muted = isMuted;
    }
  }, [isMuted]);
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  return (
    <nav className="bg-[#0a1128] border-b border-blue-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="w-8 h-8 bg-pokemon-blue rounded-full mr-2 flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="pokemon-font text-lg text-blue-300">Hyathi Center</span>
          </div>
          
          {/* Nav actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* Coins display */}
                <div className="flex items-center gap-1 bg-pokemon-gold/20 px-3 py-1 rounded-full">
                  <Coins size={16} className="text-pokemon-yellow" />
                  <span className="text-pokemon-yellow pokemon-font text-xs">{user?.coins || 0}</span>
                </div>
                
                {/* Volume icon */}
                <button className="text-white hover:text-blue-300" onClick={toggleMute}>
                  <span className="sr-only">Toggle sound</span>
                  {isMuted ? (
                    <VolumeX size={18} />
                  ) : (
                    <Volume2 size={18} />
                  )}
                </button>
                
                {/* Username */}
                <div className="text-white ml-2">
                  {user.username}
                </div>
                
                {/* Logout button */}
                <button 
                  onClick={logout}
                  className="text-white hover:text-blue-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  className="text-white hover:text-blue-300"
                  onClick={onLoginClick}
                >
                  Login
                </button>
                <button 
                  className="text-white bg-blue-800 px-3 py-1 rounded hover:bg-blue-700"
                  onClick={onRegisterClick}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
