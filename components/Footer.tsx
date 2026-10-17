import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Facebook, Instagram, MapPin, Phone, Mail, Heart, ExternalLink } from 'lucide-react';

const socialLinks = [
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: <Youtube size={18} />,
    color: 'hover:bg-red-600',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61574795353364',
    icon: <Facebook size={18} />,
    color: 'hover:bg-blue-600',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/winners_chapel_intl_simbock?igsh=eWtqZzRybjJpeGF2',
    icon: <Instagram size={18} />,
    color: 'hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600',
  },
];

const quickLinks = [
  { name: 'Home',         path: '/' },
  { name: 'Events',       path: '/events' },
  { name: 'Services',     path: '/services' },
  { name: 'Testimonies',  path: '/testimonies' },
  { name: 'Gallery',      path: '/gallery' },
  { name: 'Contact',      path: '/contact' },
];

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-400 relative overflow-hidden">
      {/* Decorative radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-nobel-gold/5 blur-[80px] pointer-events-none" />

      {/* Top divider line */}
      <div className="h-px bg-gradient-to-r from-transparent via-nobel-gold/40 to-transparent" />

      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 sm:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <img
                src="https://faithtabernacle.org.ng/vendor/images/lfw_.png"
                alt="WCI Simbock Logo"
                className="w-10 h-10 object-contain transition-transform group-hover:scale-110 duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="font-serif font-bold text-xl text-white tracking-wide leading-tight">
                WCI<span className="text-nobel-gold"> Simbock</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-stone-500 mb-5 max-w-[260px]">
              Winners Chapel International Simbock — a vibrant, faith-filled community in Yaoundé, Cameroon.
            </p>
            {/* Social Icons */}
            <div className="flex gap-2">
              {socialLinks.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${s.label}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg bg-stone-800 text-stone-400 hover:text-white transition-all duration-200 ${s.color} hover:scale-110`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(l => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-sm text-stone-400 hover:text-nobel-gold transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-nobel-gold transition-all duration-200 inline-block" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-5">Services</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/services" className="hover:text-nobel-gold transition-colors">
                  Sunday Celebration
                </Link>
                <p className="text-xs text-stone-600 mt-0.5">7:00 AM & 9:30 AM</p>
              </li>
              <li className="mt-3">
                <Link to="/services" className="hover:text-nobel-gold transition-colors">
                  Wednesday Communion
                </Link>
                <p className="text-xs text-stone-600 mt-0.5">5:30 PM</p>
              </li>
              <li className="mt-3">
                <a
                  href="/services#homecells"
                  className="hover:text-nobel-gold transition-colors"
                >
                  WSF Homecell Centers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-5">Find Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-nobel-gold mt-0.5 shrink-0" />
                <span className="text-stone-400 leading-snug">
                  Simbock (Entrée Onana),<br />Yaoundé, Cameroon
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-nobel-gold shrink-0" />
                <span className="text-stone-400">+237 6XX XXX XXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-nobel-gold shrink-0" />
                <a href="mailto:contact@wcsimbock.org" className="text-stone-400 hover:text-nobel-gold transition-colors">
                  contact@wcsimbock.org
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=RF9C%2B8HF%2C+Yaound%C3%A9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-nobel-gold hover:text-red-400 transition-colors mt-1"
                >
                  <ExternalLink size={12} /> Get Directions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <p>
            &copy; {year}{' '}
            <span className="text-stone-400 font-medium">Winners Chapel International Simbock</span>
            . All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={12} className="text-nobel-gold animate-pulse" fill="currentColor" /> for the Kingdom
          </p>
        </div>
      </div>
    </footer>
  );
};
