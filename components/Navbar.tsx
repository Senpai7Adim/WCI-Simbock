import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Home, Users, Briefcase, MessageSquare,
  Image as ImageIcon, Phone, UserCircle, Grid, LogOut,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { NotificationCenter } from './NotificationCenter';

const links = [
  { name: 'Home',        path: '/',           icon: <Home      size={20} /> },
  { name: 'Events',      path: '/events',     icon: <Users     size={20} /> },
  { name: 'Services',    path: '/services',   icon: <Briefcase size={20} /> },
  { name: 'Testimonies', path: '/testimonies',icon: <MessageSquare size={20} /> },
  { name: 'Gallery',     path: '/gallery',    icon: <ImageIcon size={20} /> },
  { name: 'Contact',     path: '/contact',    icon: <Phone     size={20} /> },
];

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, login, logout } = useAuth();
  const location = useLocation();

  const navLinks = isAdmin
    ? [...links, { name: 'Admin', path: '/admin', icon: <Grid size={20} /> }]
    : links;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 nav-frosted py-1 ${scrolled ? 'nav-scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="WCI Simbock — go to homepage"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-nobel-gold/20 blur-md group-hover:bg-nobel-gold/35 transition-all duration-300" />
              <img
                src="https://faithtabernacle.org.ng/vendor/images/lfw_.png"
                alt="WCI Simbock Logo"
                className="relative w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif font-bold text-lg tracking-wide text-stone-900 hidden sm:block leading-none">
              WCI<span className="text-nobel-gold"> Simbock</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Notifications */}
            <div className="hidden lg:flex">
              <NotificationCenter />
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-8 bg-stone-200 mx-2" />

            {/* Auth */}
            <div className="hidden lg:block">
              {user ? (
                <div className="flex items-center gap-2">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'U')}&background=E3000F&color=fff`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-nobel-gold/30"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={logout}
                    aria-label="Sign Out"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 hover:text-nobel-gold hover:bg-stone-100 transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  aria-label="Sign In with Google"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-nobel-gold text-white hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                >
                  <UserCircle size={15} />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile: notifications + burger */}
            <div className="lg:hidden flex items-center gap-1">
              <NotificationCenter />
              <button
                className="p-2 rounded-xl text-stone-600 hover:text-nobel-gold hover:bg-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Mobile navigation"
        className={`fixed top-0 right-0 h-[100dvh] w-[min(320px,88vw)] z-50 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <img
              src="https://faithtabernacle.org.ng/vendor/images/lfw_.png"
              alt="WCI Simbock"
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-serif font-bold text-stone-900">WCI<span className="text-nobel-gold"> Simbock</span></span>
          </Link>
          <button
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3" aria-label="Mobile links">
          {navLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl mb-1 transition-all duration-150 ${
                  isActive
                    ? 'bg-nobel-gold/10 text-nobel-gold font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span className={isActive ? 'text-nobel-gold' : 'text-stone-400'}>
                  {link.icon}
                </span>
                <span className="text-base">{link.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-nobel-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="p-4 border-t border-stone-100">
          {user ? (
            <div className="flex items-center gap-3 mb-3">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'U')}&background=E3000F&color=fff`}
                alt="Profile"
                className="w-10 h-10 rounded-full ring-2 ring-nobel-gold/30"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-stone-900 truncate">{user.displayName || 'Member'}</p>
                <p className="text-xs text-stone-500 truncate">{user.email}</p>
              </div>
            </div>
          ) : null}
          {user ? (
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-3 border border-stone-300 text-stone-700 rounded-xl font-semibold text-sm hover:bg-stone-50 transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <button
              onClick={() => { login(); setMenuOpen(false); }}
              className="w-full py-3 bg-nobel-gold text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <UserCircle size={18} /> Sign In
            </button>
          )}
        </div>
      </div>
    </>
  );
};
