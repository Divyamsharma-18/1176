
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';

interface FairyTubaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCollect: () => void;
  canCollect: boolean;
}

const FairyTubaDialog: React.FC<FairyTubaDialogProps> = ({
  isOpen,
  onClose,
  onCollect,
  canCollect,
}) => {
  const handleCollect = () => {
    onCollect();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-purple-50 border-2 border-purple-300 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-purple-700 text-xl">Fairy Tuba</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <img
              src="https://i.ibb.co/2WNz3XF/fairy-tuba.png"
              alt="Fairy Tuba"
              className="w-full h-full object-cover"
            />
          </div>
          <DialogDescription className="text-purple-600">
            {canCollect
              ? "Hi, I'm fairy Tuba! Here are your coins. Do visit after every hour to get more coins, byeee!"
              : "Hi, I'm fairy Tuba! I don't have any coins for you right now. Please come back later when I've gathered more, byeee!"}
          </DialogDescription>
        </div>

        <DialogFooter>
          {canCollect ? (
            <Button onClick={handleCollect} className="bg-purple-600 hover:bg-purple-700">
              <Coins className="w-4 h-4 mr-2" />
              Collect 1 Coin
            </Button>
          ) : (
            <Button onClick={onClose}>Come Back Later</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FairyTubaDialog;
