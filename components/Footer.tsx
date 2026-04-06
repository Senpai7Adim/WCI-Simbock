import React from 'react';
import { Youtube, Facebook, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <img src="https://faithtabernacle.org.ng/vendor/images/lfw_.png" alt="WCI Simbock Logo" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
          <span className="font-serif font-bold text-lg tracking-wide text-white">
            WCI Simbock
          </span>
        </div>
        
        <div className="flex gap-6">
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-nobel-gold transition-colors">
            <Youtube size={24} />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61574795353364" target="_blank" rel="noopener noreferrer" className="hover:text-nobel-gold transition-colors">
            <Facebook size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-nobel-gold transition-colors">
            <Instagram size={24} />
          </a>
        </div>
        
        <div className="text-sm">
          &copy; {new Date().getFullYear()} WCI Simbock. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
