
import React, { useEffect, useState } from 'react';

interface EntryScreenProps {
  onEnter: () => void;
}

const EntryScreen: React.FC<EntryScreenProps> = ({ onEnter }) => {
  const [fadeOut, setFadeOut] = useState(false);

  // Auto fade effect and transition to next screen
  useEffect(() => {
    // First fade in
    const fadeInTimeout = setTimeout(() => {
      // After 2 seconds, start fade out
      setFadeOut(true);
      
      // After 3 seconds total (1s for fade out), proceed to next screen
      const fadeOutTimeout = setTimeout(() => {
        onEnter();
      }, 1000);
      
      return () => clearTimeout(fadeOutTimeout);
    }, 2000);
    
    return () => clearTimeout(fadeInTimeout);
  }, [onEnter]);

  return (
    <div className="night-sky flex flex-col items-center justify-center min-h-screen w-full">
      <div 
        className={`text-center transition-opacity duration-1000 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <h1 className="pixelated-heading text-3xl sm:text-4xl md:text-5xl mb-6">
          Welcome to Hyathi's
        </h1>
        <h2 className="pixelated-heading text-2xl sm:text-3xl md:text-4xl">
          Pokémon Adoption Center
        </h2>
      </div>
    </div>
  );
};

export default EntryScreen;
