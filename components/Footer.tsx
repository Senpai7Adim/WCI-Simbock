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
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our YouTube channel" className="hover:text-nobel-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-md p-1">
            <Youtube size={24} aria-hidden="true" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61574795353364" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page" className="hover:text-nobel-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-md p-1">
            <Facebook size={24} aria-hidden="true" />
          </a>
          <a href="https://www.instagram.com/winners_chapel_intl_simbock?igsh=eWtqZzRybjJpeGF2" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page" className="hover:text-nobel-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-md p-1">
            <Instagram size={24} aria-hidden="true" />
          </a>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <a href="/services#homecells" className="hover:text-nobel-gold transition-colors">
            WSF Homecell Centers
          </a>
          <a href="/services" className="hover:text-nobel-gold transition-colors">
            Weekly Services
          </a>
          <a href="/contact" className="hover:text-nobel-gold transition-colors">
            Sanctuary Location & Offerings
          </a>
        </div>
        
        <div className="text-sm">
          &copy; {new Date().getFullYear()} WCI Simbock. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
