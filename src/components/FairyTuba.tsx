
import React, { useState, useEffect } from 'react';
import FairyTubaDialog from './FairyTubaDialog';
import { useAuth } from '@/context/AuthContext';
import { mockApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const FairyTuba: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [canCollect, setCanCollect] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  // Check if user can collect coins
  useEffect(() => {
    if (user?.lastFairyReward) {
      updateTimeLeft();
      const timer = setInterval(updateTimeLeft, 60000); // Check every minute
      return () => clearInterval(timer);
    } else {
      // If no previous collection, user can collect
      setCanCollect(true);
    }
  }, [user]);

  const updateTimeLeft = () => {
    if (!user?.lastFairyReward) {
      setCanCollect(true);
      return;
    }

    const lastReward = new Date(user.lastFairyReward);
    const currentTime = new Date();
    
    // Add 1 hour to last reward time
    const nextRewardTime = new Date(lastReward.getTime() + 60 * 60 * 1000);
    
    // Calculate time difference
    const diff = nextRewardTime.getTime() - currentTime.getTime();
    
    if (diff <= 0) {
      setCanCollect(true);
      setTimeLeft(null);
    } else {
      setCanCollect(false);
      const minutes = Math.floor(diff / (1000 * 60));
      setTimeLeft(`${minutes}m`);
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCollectReward = async () => {
    if (!canCollect) return;

    try {
      const response = await mockApiService.collectFairyReward();
      updateUser(response.user);
      
      toast({
        title: "Coin Collected!",
        description: "You received 1 coin from Fairy Tuba.",
      });
      
      // Play coin sound
      const coinSound = new Audio('/coin.mp3');
      coinSound.volume = 0.5;
      coinSound.play().catch(error => console.error('Error playing sound:', error));
      
      setCanCollect(false);
      updateTimeLeft();
    } catch (error: any) {
      toast({
        title: "Failed to collect",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative cursor-pointer w-16 h-16 rounded-full overflow-hidden border-4 ${
          canCollect ? 'border-purple-400 animate-pulse' : 'border-gray-300'
        }`}
        onClick={handleOpenDialog}
      >
        <img 
          src="/fairy.png" 
          alt="Fairy Tuba"
          className="w-full h-full object-cover"
        />
        {timeLeft && (
          <div className="absolute -bottom-1 inset-x-0 bg-gray-800 bg-opacity-70 text-white text-[10px] text-center py-0.5">
            {timeLeft}
          </div>
        )}
      </div>
      <span className="text-xs text-center mt-1 text-blue-300 pokemon-font">Fairy Tuba</span>

      <FairyTubaDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onCollect={handleCollectReward}
        canCollect={canCollect}
      />
    </div>
  );
};

export default FairyTuba;
