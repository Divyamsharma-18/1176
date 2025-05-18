
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface TrainerIntroProps {
  onContinue: () => void;
}

const TrainerIntro: React.FC<TrainerIntroProps> = ({ onContinue }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Content appears with fade-in effect on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="night-sky min-h-screen flex items-center justify-center p-4">
      <div className={`max-w-4xl w-full bg-[#152642] border border-blue-700 rounded-lg p-8 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Trainer image and title */}
          <div className="md:w-1/3 flex flex-col items-center text-center">
            <div className="w-40 h-40 bg-[#4285F4] rounded-full mb-4"></div>
            <h2 className="pokemon-font text-xl text-white mb-1">Trainer Uddeshya</h2>
            <p className="text-blue-300 text-sm">Founder & Lead Trainer</p>
          </div>
          
          {/* Right side - Text content */}
          <div className="md:w-2/3 text-white space-y-6">
            <p>
              Hey there, future Pokémon trainer! I'm Uddeshya, and I've dedicated my life to rescuing and rehabilitating Pokémon in need.
            </p>
            <p>
              At Hyathi's Adoption Center, we believe every Pokémon deserves a loving home. Some of our rescued friends are quite special – we even have a Porygon who helps with our website coding!
            </p>
            <p>
              People often call me the "Pokémon Whisperer" because of my unique ability to understand and connect with these amazing creatures. But I believe everyone has this gift; they just need the right opportunity.
            </p>
            <p>
              Our center isn't just about adoption – it's about creating lasting bonds between trainers and Pokémon. Each adoption story adds another chapter to our growing family.
            </p>
            
            {/* Continue button */}
            <div className="flex justify-end pt-2">
              <Button 
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded uppercase font-bold"
                onClick={onContinue}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerIntro;
