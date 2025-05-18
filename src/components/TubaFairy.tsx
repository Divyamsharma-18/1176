
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const TubaFairy: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [canCollect, setCanCollect] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  // Check if the user can collect coins
  useEffect(() => {
    const checkCollectStatus = () => {
      if (!user || !user.lastTubaReward) {
        setCanCollect(true);
        return;
      }

      const lastReward = new Date(user.lastTubaReward);
      const now = new Date();
      const hoursSinceLastReward = (now.getTime() - lastReward.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastReward >= 1) {
        setCanCollect(true);
        setTimeRemaining(0);
      } else {
        setCanCollect(false);
        // Calculate remaining time in milliseconds
        const remainingMs = (1 * 60 * 60 * 1000) - (now.getTime() - lastReward.getTime());
        setTimeRemaining(Math.ceil(remainingMs / 1000));
      }
    };

    checkCollectStatus();
    const interval = setInterval(checkCollectStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  // Update time remaining countdown
  useEffect(() => {
    if (timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanCollect(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Format remaining time
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle coin collection
  const handleCollectCoins = async () => {
    try {
      if (!canCollect) return;
      
      // Call API to collect coins (using mock API for now)
      const updatedUser = { 
        ...user,
        coins: (user?.coins || 0) + 1,
        lastTubaReward: new Date().toISOString()
      };
      
      // Update user data in context
      updateUser(updatedUser);
      
      // Play coin sound
      const coinSound = new Audio('/coin.mp3');
      coinSound.volume = 0.5;
      coinSound.play().catch(error => console.error('Error playing sound:', error));
      
      // Show success toast
      toast({
        title: 'Coin Collected',
        description: 'You received 1 coin from Tuba Fairy!',
      });
      
      // Reset collection status and start cooldown
      setCanCollect(false);
      setTimeRemaining(60 * 60); // 1 hour in seconds
      
    } catch (error) {
      console.error('Failed to collect coins:', error);
      toast({
        title: 'Collection Failed',
        description: 'Failed to collect coins. Please try again later.',
        variant: 'destructive',
      });
    }
    
    // Close the dialog
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`rounded-full w-12 h-12 flex items-center justify-center border-2 ${
          canCollect ? 'border-pokemon-yellow animate-pulse bg-blue-900/70' : 'border-gray-600 bg-blue-900/30'
        }`}
        title="Tuba Fairy"
      >
        <span className="text-2xl">✨</span>
      </button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="pixel-card max-w-sm bg-[#102340] text-white border-blue-600">
          <DialogHeader>
            <DialogTitle className="pokemon-font text-blue-300 text-center">FAIRY TUBA</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-4">
            <div className="w-24 h-24 rounded-full bg-blue-700 mb-4 flex items-center justify-center">
              <span className="text-4xl">✨</span>
            </div>
            
            <DialogDescription className="text-center text-white mb-4">
              {canCollect 
                ? "Hi I'm fairy Tuba, here's your 1 coin! Do visit after every hour to get more coins, byeee!" 
                : `I'll have another coin for you in ${formatTimeRemaining()}. Come back later!`}
            </DialogDescription>
            
            <button
              onClick={handleCollectCoins}
              disabled={!canCollect}
              className={`pixel-button w-full ${!canCollect ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {canCollect ? 'COLLECT 1 COIN' : 'COME BACK LATER'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TubaFairy;
