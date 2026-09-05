import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroScene } from '../components/QuantumScene';
import { Youtube, Facebook, Instagram, Loader2, Clock, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import { Link } from 'react-router-dom';
import { GlobalLoader } from '../components/GlobalLoader';
import { ChurchLocationMap } from '../components/ChurchLocationMap';

const PastorImage = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src="/667864879_122195525894826511_5622559667234970482_n-removebg-preview.png"
      alt="Pastor Success"
      onLoad={() => setLoaded(true)}
      className={`absolute bottom-0 right-0 md:right-12 h-[55vh] md:h-[85vh] object-contain object-bottom pointer-events-none z-20 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
    />
  );
};

const ProvenImage = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative mb-8 min-h-[200px] flex items-center justify-center w-full">
      {!loaded && <Loader2 className="w-8 h-8 text-nobel-gold animate-spin absolute z-0" />}
      <img src="https://faithtabernacle.org.ng/old_images/proven.png" alt="Proven Strategies" onLoad={() => setLoaded(true)} referrerPolicy="no-referrer" className={`w-[120%] lg:w-auto lg:max-w-full max-w-[120%] h-auto relative z-10 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

const BackgroundImage = ({ img, index }: { img: string, index: number }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="w-full max-w-5xl mx-auto relative min-h-[300px] flex items-center justify-center">
      {!loaded && <Loader2 className="w-10 h-10 text-nobel-gold animate-spin absolute z-0" />}
      <img src={img} alt={`Slide ${index + 1}`} className={`w-full h-auto max-h-[75vh] object-contain mx-auto rounded-xl shadow-2xl relative z-10 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setLoaded(true)} referrerPolicy="no-referrer" />
    </div>
  );
};

const NextEventImage = ({ src }: { src: string }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="md:w-1/2 h-64 md:h-auto relative bg-stone-100 flex items-center justify-center overflow-hidden w-full">
      {!loaded && <Loader2 className="w-8 h-8 text-nobel-gold animate-spin absolute z-0" />}
      <img src={src} alt="Event" className={`absolute inset-0 w-full h-full object-cover relative z-10 transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setLoaded(true)} referrerPolicy="no-referrer" loading="lazy" />
    </div>
  );
};

export const Home: React.FC = () => {
  const [propheticFocus, setPropheticFocus] = useState({ title: '2026  OPEN DOORS', text: '' });
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

const bgImages = [
    'https://faithtabernacle.org.ng/2026/opendoors_.png?v=2.3',
    'https://i.imgur.com/WIsR4Fj.png',
    'https://i.imgur.com/vYbuE3q.png',
  ];

  useEffect(() => {
    if (carouselRef.current && carouselRef.current.children[bgImageIndex]) {
      const container = carouselRef.current;
      const child = container.children[bgImageIndex] as HTMLElement;

      container.scrollTo({
        left: child.offsetLeft - container.offsetLeft,
        behavior: 'smooth'
      });
    }
  }, [bgImageIndex]);

  useEffect(() => {
    const fetchFocus = async () => {
      const docRef = doc(db, 'settings', 'propheticFocus');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPropheticFocus(docSnap.data() as any);
      }
    };

    const fetchEvents = async () => {
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      const today = new Date();

      let upcoming = null;
      let latestPast = null;
      querySnapshot.forEach((doc) => {
        const eventDate = new Date(doc.data().date);
        if ((isAfter(eventDate, today) || isSameDay(eventDate, today)) && !upcoming) {
          upcoming = { id: doc.id, ...doc.data(), isPast: false };
        } else if (isBefore(eventDate, today)) {
          latestPast = { id: doc.id, ...doc.data(), isPast: true };
        }
      });
      setNextEvent(upcoming || latestPast);
      setLoading(false);
    };

    fetchFocus();
    fetchEvents();

    const interval = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % bgImages.length);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <div>
      <Helmet>
        <title>WCI Simbock | Winners Chapel International Simbock, Yaoundé</title>
        <meta name="description" content="Welcome to Winners Chapel International Simbock (WCI Simbock) in Yaoundé, Cameroon. Join us for Sunday services, communion, spiritual growth, and community impact." />
        <link rel="canonical" href="https://wci-simbock.vercel.app/
" />
        <meta property="og:title" content="WCI Simbock | Winners Chapel International Simbock, Yaoundé" />
        <meta property="og:description" content="Welcome to Winners Chapel International Simbock (WCI Simbock) in Yaoundé, Cameroon. Join us for Sunday services, communion, spiritual growth, and community impact." />
        <meta property="og:url" content="https://wci-simbock.vercel.app/
" />
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="WCI Simbock | Winners Chapel Yaoundé" />
      </Helmet>

      <main>
        {/* Hero Section */}
        <header className="relative z-0 h-screen flex items-center justify-center overflow-hidden">
          {/* Pastor Image - Same level as text, bottom right */}
          <PastorImage />

          <HeroScene />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(249,248,244,0.92)_0%,rgba(249,248,244,0.6)_50%,rgba(249,248,244,0.3)_100%)]" />

          <div className="relative z-20 container mx-auto px-6 text-center">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl font-medium leading-tight md:leading-[0.9] mb-8 text-stone-900 drop-shadow-sm">
              Welcome to <br /><span className="italic font-normal text-stone-600 text-3xl md:text-5xl block mt-4">WCI Simbock</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-stone-700 font-light leading-relaxed mb-12">
              Home Of Signs And Wonders.
            </p>
          </div>

          {/* Social Icons Bottom Left */}
          <div className="absolute bottom-8 left-8 z-20 flex gap-4 text-stone-600">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Visit our YouTube channel" className="hover:text-nobel-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-md p-1">
              <Youtube size={28} aria-hidden="true" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61574795353364" target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page" className="hover:text-nobel-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-md p-1">
              <Facebook size={28} aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/winners_chapel_intl_simbock?igsh=eWtqZzRybjJpeGF2" target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page" className="hover:text-nobel-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold rounded-md p-1">
              <Instagram size={28} aria-hidden="true" />
            </a>
          </div>

          {/* Bible Verse Top Right */}
          <div className="absolute top-24 right-8 z-20 max-w-xs text-right hidden md:block">
            <div className="font-serif text-nobel-gold text-xl mb-2">Matt 5:14</div>
            <p className="text-stone-600 italic text-sm">
              "You are the light of the world. A town built on a hill cannot be hidden."
            </p>
          </div>
        </header>

        {/* Proven Strategies Section */}
        <section
          className="relative min-h-[50vh] md:min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-20 md:py-0"
          style={{ backgroundImage: "url('https://faithtabernacle.org.ng/old_images/proven.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/40 z-0 h-full w-full" /> {/* Optional overlay for better visibility */}
          <div className="relative z-10 container mx-auto px-6 py-24">
            <div className="flex flex-col items-center justify-center">
              <ProvenImage />
              <a
                href="https://faithtabernacle.org.ng/pdf/ProvenStrategiesforCellGrowthandReplication.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-white text-stone-900 font-bold tracking-widest uppercase text-sm hover:bg-nobel-gold hover:text-white transition-colors duration-300 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold focus-visible:ring-offset-2"
              >
                VIEW DOCUMENT
              </a>
            </div>
          </div>
        </section>

        {/* Prophetic Focus Section */}
        <section className="relative bg-stone-900 py-24 overflow-hidden">
          <div className="relative z-10 container mx-auto px-6 text-center text-white mb-16">
            <h2 className="font-serif text-5xl md:text-7xl font-bold mb-8 text-nobel-gold drop-shadow-lg">{propheticFocus.title}</h2>
            <p className="max-w-3xl mx-auto text-xl font-light leading-relaxed drop-shadow-md">
              {propheticFocus.text || "Rev 3:7-8"}
            </p>
          </div>

          {/* Hide scrollbar for webkit */}
          <style dangerouslySetInnerHTML={{
            __html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { scrollbar-width: none; ms-overflow-style: none; }
        `}} />

          {/* Horizontal Scroll Carousel */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-8 px-6 md:px-12 pb-8 no-scrollbar"
          >
            {bgImages.map((img, index) => (
              <div key={index} className="snap-center shrink-0 w-full flex items-center justify-center px-4">
                <BackgroundImage img={img} index={index} />
              </div>
            ))}
          </div>
        </section>

        {/* Next Event Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-serif text-4xl mb-12 text-stone-900">{nextEvent?.isPast ? 'Latest Event' : 'Next Event'}</h2>
            {nextEvent ? (
              <div className="max-w-4xl mx-auto bg-stone-50 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row text-left">
                {nextEvent.img && (
                  <NextEventImage src={nextEvent.img} />
                )}
                <div className={`p-8 md:p-12 flex flex-col justify-center ${nextEvent.img ? 'md:w-1/2' : 'w-full'}`}>
                  <div className="text-nobel-gold font-bold tracking-widest uppercase text-sm mb-4">
                    {new Date(nextEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <p className="text-stone-700 text-lg leading-relaxed mb-8 line-clamp-4">
                    {nextEvent.text}
                  </p>
                  <Link to="/events" className="inline-block px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors self-start focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold focus-visible:ring-offset-2">
                    View All Events
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-stone-500 text-lg">No events at the moment.</p>
            )}
          </div>
        </section>

        {/* Our Services Section */}
        <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-950/20 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-800/60 text-nobel-gold text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Spiritual Encounters
              </span>
              <h2 className="font-serif text-4xl md:text-5xl mb-4 text-white font-bold tracking-tight">
                Our Weekly Services
              </h2>
              <p className="text-stone-400 font-serif text-lg mb-2">Psalm 122:1</p>
              <p className="text-stone-400 italic text-sm">
                "I rejoiced with those who said to me, 'Let us go to the house of the Lord.'"
              </p>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              {/* Sunday Services Card */}
              <div className="bg-stone-800/80 rounded-3xl overflow-hidden border border-stone-700/70 hover:border-nobel-gold transition-all duration-300 flex flex-col group shadow-xl">
                <div className="relative h-64 overflow-hidden bg-stone-950">
                  <img
                    src="/images/sunday_worship_service_1788618161094.jpg"
                    alt="Sunday Worship Service at Winners Chapel"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-nobel-gold text-white text-xs font-bold uppercase tracking-wider rounded-full shadow">
                    Sunday Celebrations
                  </span>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300">
                    <span>Two Impact Services</span>
                    <span className="text-amber-300 font-semibold">Obadiah 1:17</span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold mb-3 text-white group-hover:text-nobel-gold transition-colors">
                      Sunday Celebration Services
                    </h3>
                    <p className="text-stone-300 text-sm leading-relaxed mb-6">
                      Experience energetic praise, worship, and the unadulterated preaching of the Word of Faith. Dedicated children ministry available.
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2.5 text-sm text-stone-200">
                        <Clock className="w-4 h-4 text-nobel-gold shrink-0" />
                        <span className="font-semibold text-white">1st Service:</span>
                        <span className="text-stone-300">7:00 AM - 9:15 AM</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-stone-200">
                        <Clock className="w-4 h-4 text-nobel-gold shrink-0" />
                        <span className="font-semibold text-white">2nd Service:</span>
                        <span className="text-stone-300">9:30 AM - 11:30 AM</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 text-sm font-bold text-nobel-gold hover:text-red-400 transition-colors pt-4 border-t border-stone-700/60"
                  >
                    <span>View Service Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Wednesday Communion Service Card */}
              <div className="bg-stone-800/80 rounded-3xl overflow-hidden border border-stone-700/70 hover:border-nobel-gold transition-all duration-300 flex flex-col group shadow-xl">
                <div className="relative h-64 overflow-hidden bg-stone-950">
                  <img
                    src="/images/holy_communion_service_1788618177522.jpg"
                    alt="Holy Communion Table Service"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow">
                    Midweek Encounter
                  </span>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300">
                    <span>Holy Communion</span>
                    <span className="text-amber-300 font-semibold">John 6:54</span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-bold mb-3 text-white group-hover:text-nobel-gold transition-colors">
                      Communion Service
                    </h3>
                    <p className="text-stone-300 text-sm leading-relaxed mb-6">
                      Deepen your understanding of the scriptures and partake in the mystery of the Holy Communion for supernatural health and spiritual vitality.
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2.5 text-sm text-stone-200">
                        <Clock className="w-4 h-4 text-nobel-gold shrink-0" />
                        <span className="font-semibold text-white">Every Wednesday:</span>
                        <span className="text-stone-300">5:30 PM - 7:30 PM</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 text-sm font-bold text-nobel-gold hover:text-red-400 transition-colors pt-4 border-t border-stone-700/60"
                  >
                    <span>View Service Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Bishop Oyedepo & Ministry Legacy Banner */}
            <div className="max-w-5xl mx-auto bg-stone-950 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col md:flex-row items-center">
              <div className="md:w-5/12 w-full h-64 md:h-80 relative overflow-hidden">
                <img
                  src="/images/bishop_oyedepo_preaching_1788618143091.jpg"
                  alt="Bishop David Oyedepo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-950/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="md:w-7/12 w-full p-8 md:p-10 flex flex-col justify-center">
                <span className="text-nobel-gold text-xs uppercase tracking-widest font-bold mb-2">
                  Apostolic Mandate · Living Faith Church Worldwide
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mb-3">
                  The Liberation Mandate of Faith
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-6 italic">
                  "The hour has come to liberate the world from all oppressions of the devil through the preaching of the Word of Faith, and I am sending you to undertake this task."
                  <span className="block mt-1 text-stone-300 not-italic font-medium">— Bishop David O. Oyedepo</span>
                </p>
                <div>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-nobel-gold hover:bg-red-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold"
                  >
                    <span>Explore All Services & Mandate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Church Location & Google Maps Section */}
        <section className="py-24 bg-stone-50 border-t border-stone-200/60">
          <div className="container mx-auto px-6 max-w-6xl">
            <ChurchLocationMap />
          </div>
        </section>
      </main>
    </div>
  );
};
