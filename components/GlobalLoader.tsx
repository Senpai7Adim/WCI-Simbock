import React from 'react';

export const GlobalLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center h-screen w-full bg-white">
      <img 
        src="https://faithtabernacle.org.ng/vendor/images/lfw_.png" 
        alt="WCI Simbock Loading" 
        className="w-32 h-auto animate-pulse origin-center" 
      />
      <p className="mt-4 text-stone-500 font-serif animate-pulse text-lg">Loading...</p>
    </div>
  );
};
