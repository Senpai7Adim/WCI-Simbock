import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, Instagram, Youtube, X, Bell, UserPlus } from 'lucide-react';
import { useAuth } from '../AuthContext';

export const JoinUsPopup: React.FC = () => {
  const { user, login, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup if user is not logged in and hasn't dismissed it in this session
    const hasDismissed = sessionStorage.getItem('join_us_popup_dismissed');
    
    if (!loading && !user && !hasDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('join_us_popup_dismissed', 'true');
  };

  const handleRegister = async () => {
    await login();
    handleDismiss();
  };

  if (loading || user) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full relative"
          >
            {/* Header with Pattern */}
            <div className="h-32 bg-nobel-gold relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:20px_20px]" />
              </div>
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/20 p-4 rounded-full"
              >
                <Bell className="text-white w-12 h-12" />
              </motion.div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="p-8 text-center">
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">
                Stay Updated!
              </h2>
              <p className="text-stone-600 mb-8 font-sans">
                Register now to receive the latest news, events, and testimonies from WCI Simbock directly in your inbox.
              </p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleRegister}
                  className="flex items-center justify-center gap-2 bg-nobel-gold text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-red-100 hover:bg-red-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <UserPlus size={20} />
                  Register Now
                </button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-stone-400 font-sans">Follow us on social media</span>
                  </div>
                </div>

                <div className="flex justify-center gap-6">
                  <a
                    href="https://www.facebook.com/profile.php?id=61574795353364"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-stone-50 rounded-full text-[#1877F2] hover:bg-nobel-gold hover:text-white transition-all transform hover:scale-110 shadow-sm"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="https://www.instagram.com/winners_chapel_intl_simbock?igsh=eWtqZzRybjJpeGF2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-stone-50 rounded-full text-[#E4405F] hover:bg-nobel-gold hover:text-white transition-all transform hover:scale-110 shadow-sm"
                  >
                    <Instagram size={24} />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-stone-50 rounded-full text-[#FF0000] hover:bg-nobel-gold hover:text-white transition-all transform hover:scale-110 shadow-sm"
                  >
                    <Youtube size={24} />
                  </a>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="mt-8 text-stone-400 hover:text-nobel-gold text-sm font-medium transition-colors font-sans"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
