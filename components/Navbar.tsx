import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Users, Briefcase, MessageSquare, Image as ImageIcon, Phone, UserCircle, Search, Grid } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin, login, logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/', icon: <Home size={24} /> },
    { name: 'Events', path: '/events', icon: <Users size={24} /> },
    { name: 'Services', path: '/services', icon: <Briefcase size={24} /> },
    { name: 'Testimonies', path: '/testimonies', icon: <MessageSquare size={24} /> },
    { name: 'Gallery', path: '/gallery', icon: <ImageIcon size={24} /> },
    { name: 'Contact', path: '/contact', icon: <Phone size={24} /> },
  ];

  if (isAdmin) {
    links.push({ name: 'Admin', path: '/admin', icon: <Grid size={24} /> });
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center relative z-50">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 cursor-pointer" onClick={() => setMenuOpen(false)}>
              <img src="https://faithtabernacle.org.ng/vendor/images/lfw_.png" alt="WCI Simbock Logo" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
              <span className="font-serif font-bold text-xl tracking-wide text-stone-900 hidden sm:block">
                WCI Simbock
              </span>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-1 md:gap-6 text-sm font-medium text-stone-500">
            {links.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center min-w-[80px] min-h-[52px] hover:text-nobel-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-md ${isActive ? 'text-nobel-gold border-b-2 border-nobel-gold rounded-none' : ''}`}
                >
                  <div className="mb-1">{link.icon}</div>
                  <span className="hidden md:block">{link.name}</span>
                </Link>
              );
            })}
            
            <div className="flex flex-col items-center justify-center min-w-[80px] min-h-[52px] border-l border-stone-200 pl-6 ml-2">
              {user ? (
                <button onClick={logout} aria-label="Sign Out" className="flex flex-col items-center hover:text-nobel-gold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-md p-1">
                  <img src={user.photoURL || "https://ui-avatars.com/api/?name=" + user.email} alt="Profile" className="w-6 h-6 rounded-full mb-1" referrerPolicy="no-referrer" />
                  <span className="hidden md:flex items-center gap-1">Me <span className="text-[10px]">▼</span></span>
                </button>
              ) : (
                <button onClick={login} aria-label="Sign In" className="flex flex-col items-center hover:text-nobel-gold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-md p-1">
                  <UserCircle size={24} className="mb-1" />
                  <span className="hidden md:block">Sign In</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <button 
              className="text-stone-600 p-2 hover:text-nobel-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-md" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-[100dvh] z-40 bg-white flex flex-col pt-16 pb-12 overflow-y-auto transition-transform duration-300 ease-in-out lg:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col px-4 py-2">
          {links.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-4 py-4 border-b border-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-md px-2 ${isActive ? 'text-nobel-gold font-semibold' : 'text-stone-600'}`}
              >
                {link.icon}
                <span className="text-lg">{link.name}</span>
              </Link>
            );
          })}
          <div className="py-6">
            {user ? (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full py-3 bg-white border border-stone-400 text-stone-600 rounded-full font-semibold hover:bg-stone-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold focus-visible:ring-offset-2">
                Sign Out
              </button>
            ) : (
              <button onClick={() => { login(); setMenuOpen(false); }} className="w-full py-3 bg-nobel-gold text-white rounded-full font-semibold hover:bg-red-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold focus-visible:ring-offset-2">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
