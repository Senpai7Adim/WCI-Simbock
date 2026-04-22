import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-6 text-center">
      <Helmet>
        <title>Page Not Found | WCI Simbock</title>
      </Helmet>
      <h1 className="font-serif text-9xl text-nobel-gold mb-4">404</h1>
      <h2 className="font-serif text-4xl text-stone-900 mb-6">Page Not Found</h2>
      <p className="text-lg text-stone-600 mb-8 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="inline-block px-8 py-4 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors font-bold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold focus-visible:ring-offset-2"
      >
        Return to Home
      </Link>
    </div>
  );
};
