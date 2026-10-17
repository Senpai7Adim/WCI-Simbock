import React, { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AnimatePresence, motion } from 'motion/react';
import { JoinUsPopup } from './JoinUsPopup';
import { WhatsAppFloatingIcon } from './WhatsAppFloatingIcon';

export const Layout: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 flex flex-col pt-14">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <JoinUsPopup />
      <WhatsAppFloatingIcon />
    </div>
  );
};
