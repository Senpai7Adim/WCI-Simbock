import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import { X, Facebook, Twitter, Link as LinkIcon, Check } from 'lucide-react';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(collection(db, 'events'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) return <div className="pt-32 text-center">Loading events...</div>;

  const today = new Date();
  
  // Sort upcoming events ascending
  const upcomingEvents = events.filter(e => {
    const d = new Date(e.date);
    return isAfter(d, today) || isSameDay(d, today);
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const otherUpcomingEvents = upcomingEvents.slice(1);
  
  const pastEvents = events.filter(e => {
    const d = new Date(e.date);
    return isBefore(d, today) && !isSameDay(d, today);
  });

  const EventCard = ({ event, isMain = false }: { event: any, isMain?: boolean }) => {
    const hasImage = !!event.img;
    return (
      <div 
        className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col cursor-pointer hover:shadow-md transition-shadow ${isMain && hasImage ? 'md:flex-row' : ''}`}
        onClick={() => setSelectedEvent(event)}
      >
        {hasImage && (
          <div className={`${isMain ? 'md:w-1/2' : 'w-full'} h-64 ${isMain ? 'md:h-auto min-h-[16rem]' : ''}`}>
            <img src={event.img} alt="Event" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
          </div>
        )}
        <div className={`p-8 flex flex-col justify-center ${hasImage && isMain ? 'md:w-1/2' : 'w-full'}`}>
          <div className="text-nobel-gold font-bold tracking-widest uppercase text-xs mb-3">
            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <p className="text-stone-700 leading-relaxed whitespace-pre-wrap line-clamp-4">
            {event.text}
          </p>
        </div>
      </div>
    );
  };

  const shareUrl = window.location.href;

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <Helmet>
        <title>Upcoming Events | WCI Simbock Yaoundé</title>
        <meta name="description" content="Discover upcoming events, conferences, and special services at Winners Chapel International Simbock. Join our community in Yaoundé." />
        <link rel="canonical" href="https://wcsimbock.org/events" />
      </Helmet>

      <h1 className="font-serif text-5xl mb-6 text-stone-900 text-center">Events</h1>
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-nobel-gold font-serif text-xl mb-2">Hebrews 10:24-25</p>
        <p className="text-stone-600 italic">"And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together..."</p>
      </div>

      {nextEvent && (
        <div className="mb-24">
          <h2 className="font-serif text-3xl mb-8 text-stone-800 border-b border-stone-200 pb-4">Next Event</h2>
          <EventCard event={nextEvent} isMain={true} />
        </div>
      )}

      {otherUpcomingEvents.length > 0 && (
        <div className="mb-24">
          <h2 className="font-serif text-3xl mb-8 text-stone-800 border-b border-stone-200 pb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherUpcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h2 className="font-serif text-3xl mb-8 text-stone-800 border-b border-stone-200 pb-4">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
      
      {!nextEvent && pastEvents.length === 0 && (
        <p className="text-center text-stone-500">No events found.</p>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <div 
            className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
              onClick={() => setSelectedEvent(null)}
            >
              <X size={24} />
            </button>
            
            <div className="overflow-y-auto flex-1">
              {selectedEvent.img && (
                <div className="w-full">
                  <img 
                    src={selectedEvent.img} 
                    alt="Event" 
                    className="w-full h-auto object-contain max-h-[60vh] bg-stone-100" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-8 md:p-12">
                <div className="text-nobel-gold font-bold tracking-widest uppercase text-sm mb-4">
                  {new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <p className="text-stone-800 text-lg leading-relaxed whitespace-pre-wrap mb-8">
                  {selectedEvent.text}
                </p>
                
                <div className="flex items-center gap-4 pt-6 border-t border-stone-100">
                  <span className="text-stone-500 font-medium text-sm uppercase tracking-wider">Share:</span>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-stone-100 text-stone-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                    title="Share on Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this event: ${selectedEvent.text.substring(0, 50)}...`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-stone-100 text-stone-600 rounded-full hover:bg-sky-500 hover:text-white transition-colors"
                    title="Share on Twitter"
                  >
                    <Twitter size={20} />
                  </a>
                  <button 
                    onClick={handleCopyLink}
                    className="p-2 bg-stone-100 text-stone-600 rounded-full hover:bg-stone-200 hover:text-stone-900 transition-colors"
                    title="Copy Link"
                  >
                    {copied ? <Check size={20} className="text-green-600" /> : <LinkIcon size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
