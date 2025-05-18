
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="night-sky py-4 border-t border-blue-700/30">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <p className="text-white text-sm flex items-center gap-1">
          Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by Divyam Sharma
        </p>
      </div>
    </footer>
  );
};

export default Footer;
