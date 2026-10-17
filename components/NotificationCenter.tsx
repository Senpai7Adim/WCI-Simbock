import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bell, 
  BellRing, 
  X, 
  Clock, 
  Calendar, 
  Sparkles, 
  Check, 
  Send, 
  MapPin, 
  Flame, 
  Volume2, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  CHURCH_SERVICES, 
  getStoredPreferences, 
  savePreferences, 
  ReminderPreferences, 
  getNextUpcomingService, 
  NextServiceInfo,
  getNotificationPermission,
  requestNotificationPermission,
  sendTestNotification,
  isNotificationSupported
} from '../utils/notificationService';
import toast from 'react-hot-toast';

interface AnnouncementItem {
  id: string;
  subject: string;
  message: string;
  createdAt: string;
}

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'announcements'>('services');
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [prefs, setPrefs] = useState<ReminderPreferences>(getStoredPreferences());
  const [nextService, setNextService] = useState<NextServiceInfo | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [testingNotification, setTestingNotification] = useState(false);
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setPermission(getNotificationPermission());
    setNextService(getNextUpcomingService());

    // Update countdown every minute
    const interval = setInterval(() => {
      setNextService(getNextUpcomingService());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Close panel whenever route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Fetch announcements when opened or tab changed
  useEffect(() => {
    if (isOpen && activeTab === 'announcements' && announcements.length === 0) {
      fetchAnnouncements();
    }
  }, [isOpen, activeTab]);

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'desc'), limit(6));
      const snap = await getDocs(q);
      const items: AnnouncementItem[] = snap.docs.map(doc => ({
        id: doc.id,
        subject: `Program: ${doc.data().date || 'Special Service'}`,
        message: doc.data().text || '',
        createdAt: doc.data().createdAt || new Date().toISOString()
      }));
      setAnnouncements(items);
    } catch (e) {
      console.warn('Could not load announcements from Firestore:', e);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleTogglePref = (key: keyof ReminderPreferences) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    savePreferences(updated);
    toast.success(`Reminder ${updated[key] ? 'enabled' : 'disabled'}`);
  };

  const handleEnablePermissions = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') {
      toast.success('Browser notifications enabled! You will now receive service alerts.');
    } else if (result === 'denied') {
      toast.error('Notifications blocked. Please enable them in your browser site settings.');
    }
  };

  const handleSendTest = async () => {
    setTestingNotification(true);
    try {
      const success = await sendTestNotification();
      setPermission(getNotificationPermission());
      if (success) {
        toast.success('Test notification sent! Look for the alert on your device.');
      } else {
        toast.error('Please allow browser notifications when prompted.');
      }
    } catch (err) {
      toast.error('Could not send notification on this device.');
    } finally {
      setTestingNotification(false);
    }
  };

  const isEnabled = permission === 'granted';

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full text-stone-600 hover:text-nobel-gold hover:bg-stone-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold cursor-pointer touch-manipulation"
        aria-label="Church Notifications and Service Reminders"
        aria-expanded={isOpen}
        title="Service Reminders & Announcements"
      >
        {isEnabled ? (
          <Bell className="w-5 h-5 transition-transform hover:rotate-12" />
        ) : (
          <BellRing className="w-5 h-5 text-nobel-gold animate-bounce" />
        )}

        {/* Pulse / Badge indicator */}
        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isEnabled ? 'bg-emerald-400' : 'bg-red-500'}`} />
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isEnabled ? 'bg-emerald-500' : 'bg-nobel-gold'}`} />
        </span>
      </button>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 sm:hidden transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Flyout Panel (Responsive: full width centered sheet on mobile, anchored dropdown on sm+) */}
      {isOpen && (
        <div 
          role="dialog"
          aria-label="Church Notifications"
          className="fixed inset-x-3 top-16 max-h-[calc(100dvh-5rem)] sm:max-h-[min(650px,85vh)] sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2.5 w-auto sm:w-[420px] max-w-[440px] mx-auto sm:mx-0 bg-white rounded-3xl shadow-2xl border border-stone-200/90 z-50 overflow-hidden flex flex-col panel-pop"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-4 sm:p-5 border-b border-stone-800 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-nobel-gold/20 flex items-center justify-center text-nobel-gold shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-base leading-tight truncate">WCI Simbock Alerts</h3>
                  <p className="text-[11px] text-stone-400 truncate">Services, Reminders & News</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0 touch-manipulation cursor-pointer"
                aria-label="Close notification panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="flex items-center justify-between bg-stone-800/80 rounded-xl px-3 py-2 text-xs border border-stone-700/60 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${isEnabled ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                <span className="text-stone-300 text-[11px] sm:text-xs truncate">
                  {isEnabled ? 'Browser Notifications Active' : 'Device Alerts Inactive'}
                </span>
              </div>
              {!isEnabled ? (
                <button
                  onClick={handleEnablePermissions}
                  className="text-[11px] sm:text-xs font-bold text-nobel-gold hover:text-red-400 transition-colors uppercase tracking-wider underline cursor-pointer shrink-0 touch-manipulation"
                >
                  Turn On
                </button>
              ) : (
                <button
                  onClick={handleSendTest}
                  disabled={testingNotification}
                  className="text-[11px] text-stone-300 hover:text-white flex items-center gap-1 bg-stone-700 hover:bg-stone-600 px-2.5 py-1 rounded-md cursor-pointer transition-colors shrink-0 touch-manipulation disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  <span>{testingNotification ? 'Sending...' : 'Test'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-stone-100 bg-stone-50/80 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-3 px-3 flex items-center justify-center gap-2 transition-colors border-b-2 cursor-pointer touch-manipulation ${
                activeTab === 'services'
                  ? 'border-nobel-gold text-nobel-gold bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Service Reminders</span>
            </button>
            <button
              onClick={() => { setActiveTab('announcements'); fetchAnnouncements(); }}
              className={`flex-1 py-3 px-3 flex items-center justify-center gap-2 transition-colors border-b-2 cursor-pointer touch-manipulation ${
                activeTab === 'announcements'
                  ? 'border-nobel-gold text-nobel-gold bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Announcements</span>
              {announcements.length > 0 && (
                <span className="bg-nobel-gold text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0">
                  {announcements.length}
                </span>
              )}
            </button>
          </div>

          {/* Scrollable Panel Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 overscroll-contain">
            {activeTab === 'services' ? (
              <>
                {/* Imminent Service Countdown Card */}
                {nextService && (
                  <div className="bg-gradient-to-br from-red-50 via-white to-amber-50/50 rounded-2xl p-4 border border-red-100 shadow-xs">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-nobel-gold text-white shadow-xs shrink-0">
                        <Sparkles className="w-3 h-3" />
                        Next Service
                      </span>
                      <span className="text-xs font-bold text-nobel-gold font-mono bg-white px-2 py-0.5 rounded-md border border-red-200 shrink-0">
                        {nextService.formattedCountdown}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base mb-1.5 leading-snug">
                      {nextService.service.name}
                    </h4>

                    <div className="flex items-center gap-2 text-stone-600 text-xs mb-1.5">
                      <Calendar className="w-3.5 h-3.5 text-nobel-gold shrink-0" />
                      <span className="truncate">{nextService.service.dayName} · {nextService.service.timeString}</span>
                    </div>

                    <div className="flex items-center gap-2 text-stone-500 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{nextService.service.location}</span>
                    </div>
                  </div>
                )}

                {/* Reminder Schedule Toggles */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Weekly Schedule Reminders
                    </span>
                    <span className="text-[11px] text-stone-400">Custom Alerts</span>
                  </div>

                  {CHURCH_SERVICES.map((s) => {
                    const isChecked = prefs[s.preferenceKey];
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleTogglePref(s.preferenceKey)}
                        className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-stone-200 bg-stone-50/60 hover:bg-stone-50 active:scale-[0.99] transition-all cursor-pointer touch-manipulation select-none group"
                        role="checkbox"
                        aria-checked={isChecked}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleTogglePref(s.preferenceKey);
                          }
                        }}
                      >
                        <div className="pr-3 min-w-0">
                          <p className="text-xs font-bold text-stone-800 leading-snug group-hover:text-nobel-gold transition-colors">
                            {s.name}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {s.dayName} · {s.timeString}
                          </p>
                        </div>
                        <div className="relative inline-flex items-center shrink-0 pointer-events-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="sr-only"
                            aria-label={`Toggle reminder for ${s.name}`}
                          />
                          <div className={`w-9 h-5 rounded-full transition-colors relative ${isChecked ? 'bg-nobel-gold' : 'bg-stone-200'}`}>
                            <div className={`absolute top-[2px] left-[2px] bg-white border border-stone-300 rounded-full h-4 w-4 transition-transform duration-200 ${isChecked ? 'translate-x-4 border-white' : 'translate-x-0'}`} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Browser Permission Prompt Banner */}
                {!isEnabled && (
                  <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1 min-w-0">
                      <p className="font-semibold">Receive Alerts on Your Phone or PC</p>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Allow notifications so WCI Simbock can remind you 2 hours before Sunday services and Wednesday communion.
                      </p>
                      <button
                        onClick={handleEnablePermissions}
                        className="w-full sm:w-auto px-3.5 py-2 bg-nobel-gold text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-xs touch-manipulation cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>Allow Device Notifications</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Announcements Tab */
              <div className="space-y-3">
                {/* Prophetic Focus Theme Card */}
                <div className="p-4 rounded-2xl bg-stone-900 text-white border border-stone-800 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-nobel-gold text-white text-[10px] font-bold uppercase tracking-wider">
                      2026 Prophetic Theme
                    </span>
                    <span className="text-[11px] text-stone-400">Rev 3:8</span>
                  </div>
                  <h4 className="font-serif font-bold text-lg text-amber-300">
                    2026: OPEN DOORS
                  </h4>
                  <p className="text-stone-300 text-xs leading-relaxed mt-1">
                    "Behold, I have set before thee an open door, and no man can shut it." Walk in supernatural favour and access this year!
                  </p>
                </div>

                {loadingAnnouncements ? (
                  <div className="py-8 text-center text-stone-400 text-xs">
                    Loading church announcements...
                  </div>
                ) : announcements.length === 0 ? (
                  <div className="py-8 px-4 text-center text-stone-500 bg-stone-50 rounded-2xl border border-stone-100">
                    <p className="text-xs font-semibold mb-1">No Recent Custom Announcements</p>
                    <p className="text-[11px] text-stone-400">
                      Check back soon or attend our Sunday Celebration service for live updates.
                    </p>
                  </div>
                ) : (
                  announcements.map((item) => {
                    const isExpanded = expandedAnnouncementId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setExpandedAnnouncementId(isExpanded ? null : item.id)}
                        className="p-3.5 bg-stone-50 hover:bg-white rounded-2xl border border-stone-200 transition-colors shadow-2xs cursor-pointer touch-manipulation group"
                      >
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <h5 className="font-serif font-bold text-stone-900 text-sm group-hover:text-nobel-gold transition-colors truncate">
                            {item.subject}
                          </h5>
                          <span className="text-[10px] text-stone-400 shrink-0">
                            {new Date(item.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className={`text-stone-600 text-xs whitespace-pre-wrap leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                          {item.message}
                        </p>
                        {item.message.length > 120 && (
                          <span className="text-[10px] font-semibold text-nobel-gold mt-1 inline-block">
                            {isExpanded ? 'Show less' : 'Read more...'}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 shrink-0">
            <span className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-nobel-gold shrink-0" />
              <span className="truncate">Winners Chapel Simbock</span>
            </span>
            <button
              onClick={handleSendTest}
              disabled={testingNotification}
              className="text-nobel-gold hover:underline font-semibold cursor-pointer shrink-0 touch-manipulation disabled:opacity-50 ml-2"
            >
              {testingNotification ? 'Sending alert...' : 'Send Test Alert'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

