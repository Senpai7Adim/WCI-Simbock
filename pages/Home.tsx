import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { HeroScene } from '../components/QuantumScene';
import {
  Youtube, Facebook, Instagram, Loader2, Clock, Sparkles,
  ChevronRight, ArrowRight, MapPin, Users, Heart, Star,
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import { Link } from 'react-router-dom';
import { GlobalLoader } from '../components/GlobalLoader';
import { ChurchLocationMap } from '../components/ChurchLocationMap';

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

/* ─── Lazy Image ─── */
const LazyImg: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ className, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full">
      {!loaded && <div className="skeleton absolute inset-0" />}
      <img
        {...props}
        className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className ?? ''}`}
        onLoad={() => setLoaded(true)}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    </div>
  );
};

/* ─── Stats ─── */
const stats = [
  { icon: <Star size={20} />, value: '12+', label: 'Years of Impact' },
  { icon: <Heart size={20} />, value: '11', label: 'Homecell Centres' },

];

export const Home: React.FC = () => {
  const [propheticFocus, setPropheticFocus] = useState({ title: '2026 OPEN DOORS', text: '' });
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useScrollReveal();

  const bgImages = [
    'https://faithtabernacle.org.ng/2026/opendoors_.png?v=2.3',
    'https://i.imgur.com/PMrZoh7.png',
    'https://i.imgur.com/vYbuE3q.png',
  ];

  useEffect(() => {
    if (carouselRef.current && carouselRef.current.children[bgImageIndex]) {
      const container = carouselRef.current;
      const child = container.children[bgImageIndex] as HTMLElement;
      container.scrollTo({ left: child.offsetLeft - container.offsetLeft, behavior: 'smooth' });
    }
  }, [bgImageIndex]);

  useEffect(() => {
    const fetchFocus = async () => {
      const docRef = doc(db, 'settings', 'propheticFocus');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPropheticFocus(docSnap.data() as any);
    };

    const fetchEvents = async () => {
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      const snap = await getDocs(q);
      const today = new Date();
      let upcoming: any = null;
      let latestPast: any = null;
      snap.forEach(d => {
        const eventDate = new Date(d.data().date);
        if ((isAfter(eventDate, today) || isSameDay(eventDate, today)) && !upcoming) {
          upcoming = { id: d.id, ...d.data(), isPast: false };
        } else if (isBefore(eventDate, today)) {
          latestPast = { id: d.id, ...d.data(), isPast: true };
        }
      });
      setNextEvent(upcoming || latestPast);
      setLoading(false);
    };

    fetchFocus();
    fetchEvents();

    const interval = setInterval(() => setBgImageIndex(p => (p + 1) % bgImages.length), 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <GlobalLoader />;

  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>WCI Simbock | Winners Chapel International Simbock, Yaoundé</title>
        <meta name="description" content="Welcome to Winners Chapel International Simbock (WCI Simbock) in Yaoundé, Cameroon. Join us for Sunday services, communion, spiritual growth, and community impact." />
        <link rel="canonical" href="https://wci-simbock.vercel.app/" />
        <meta property="og:title" content="WCI Simbock | Winners Chapel International Simbock, Yaoundé" />
        <meta property="og:description" content="Welcome to Winners Chapel International Simbock (WCI Simbock) in Yaoundé, Cameroon." />
        <meta property="og:url" content="https://wci-simbock.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="WCI Simbock | Winners Chapel Yaoundé" />
      </Helmet>

      <main>
        {/* ──────────────────── HERO ──────────────────── */}
        <header className="relative z-0 h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#faf9f6]">
          {/* Animated 3D canvas background */}
          <HeroScene />

          {/* Gradient overlay */}
          <div className="hero-gradient absolute inset-0 z-10 pointer-events-none" />

          {/* Pastor image */}
          <img
            src="/667864879_122195525894826511_5622559667234970482_n-removebg-preview.png"
            alt="Pastor Success"
            className="absolute bottom-0 right-0 md:right-16 h-[380px] sm:h-[480px] md:h-[88vh] object-contain object-bottom pointer-events-none z-20 transition-opacity duration-1000 opacity-100 select-none"
            style={{ filter: 'drop-shadow(-8px 0 32px rgba(0,0,0,0.18))' }}
          />

          {/* Main text */}
          <div className="relative z-20 container mx-auto px-6 text-left max-w-7xl">
            <div className="max-w-2xl">
              {/* Eyebrow badge */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-200 text-[11px] font-bold uppercase tracking-widest text-nobel-gold mb-6 shadow-sm animate-fade-in"
                style={{ animationDelay: '0.1s' }}
              >

              </div>

              <h1
                className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.92] text-stone-900 mb-6 animate-hero-reveal"
                style={{ animationDelay: '0.2s' }}
              >
                Welcome to<br />
                <span className="text-nobel-gold italic font-normal">WCI Simbock</span>
              </h1>

              <p
                className="text-lg md:text-xl text-stone-600 font-light leading-relaxed mb-10 max-w-lg animate-slide-up"
                style={{ animationDelay: '0.45s' }}
              >
                Home Of Signs And Wonders.
                <span className="block text-stone-500 text-base mt-1 font-serif italic">Matthew 5:14</span>
              </p>

              <div
                className="flex flex-wrap gap-3 animate-slide-up"
                style={{ animationDelay: '0.6s' }}
              >
                <Link to="/services" className="btn-primary">
                  Our Services <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn-ghost">
                  Find Us <MapPin size={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* Social icons — vertical stack */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-3">
            {[
              { href: 'https://youtube.com', icon: <Youtube size={18} />, label: 'YouTube' },
              { href: 'https://www.facebook.com/profile.php?id=61574795353364', icon: <Facebook size={18} />, label: 'Facebook' },
              { href: 'https://www.instagram.com/winners_chapel_intl_simbock?igsh=eWtqZzRybjJpeGF2', icon: <Instagram size={18} />, label: 'Instagram' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 border border-stone-200 text-stone-500 hover:text-nobel-gold hover:border-nobel-gold hover:scale-110 transition-all duration-200 shadow-sm"
              >
                {s.icon}
              </a>
            ))}
            <div className="mx-auto w-px h-12 bg-gradient-to-b from-stone-300 to-transparent mt-1" />
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-stone-400 animate-float">
            <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-stone-400 to-transparent" />
          </div>
        </header>

        {/* ──────────────────── STATS BAR ──────────────────── */}
        <section className="py-6 bg-white border-y border-stone-100">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-stone-100">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4 reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-nobel-gold shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <div className="font-serif font-bold text-2xl text-stone-900 leading-none">{s.value}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────── PROVEN STRATEGIES ──────────────────── */}
        <section
          className="relative py-20 md:py-32 flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://faithtabernacle.org.ng/old_images/proven.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/55 z-0" />
          <div className="relative z-10 container mx-auto px-6 flex flex-col items-center reveal">
            <div className="w-full max-w-lg mx-auto mb-8 min-h-[150px] flex items-center justify-center">
              <img
                src="https://faithtabernacle.org.ng/old_images/proven.png"
                alt="Proven Strategies"
                referrerPolicy="no-referrer"
                className="w-full h-auto"
              />
            </div>
            <a
              href="https://faithtabernacle.org.ng/pdf/ProvenStrategiesforCellGrowthandReplication.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-2 uppercase tracking-widest text-xs"
            >
              Voir Document <ArrowRight size={14} />
            </a>
          </div>
        </section>

        {/* ──────────────────── PROPHETIC FOCUS ──────────────────── */}
        <section className="relative bg-stone-900 py-16 md:py-28 overflow-hidden">
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-950/25 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-950/25 blur-[100px] pointer-events-none" />

          <div className="relative z-10 container mx-auto px-6 text-center text-white mb-10 md:mb-16 reveal">
            <span className="section-label mb-4 inline-flex">
              <Sparkles className="w-3 h-3" /> Prophetic Theme 2026
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold mb-4 text-nobel-gold drop-shadow-lg mt-4">
              {propheticFocus.title}
            </h2>
            <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl font-light leading-relaxed text-stone-300">
              {propheticFocus.text || 'Rev 3:7-8 — "Behold, I have set before thee an open door, and no man can shut it."'}
            </p>
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 md:px-16 pb-6 no-scrollbar"
          >
            {bgImages.map((img, i) => (
              <div key={i} className="snap-center shrink-0 w-full flex items-center justify-center px-2">
                <div className="w-full max-w-5xl mx-auto relative min-h-[200px] md:min-h-[340px] img-zoom rounded-2xl overflow-hidden shadow-2xl">
                  <LazyImg src={img} alt={`Prophetic image ${i + 1}`} className="w-full h-auto max-h-[500px] object-contain mx-auto" />
                </div>
              </div>
            ))}
          </div>

          {/* Carousel dots */}
          <div className="flex justify-center gap-2 mt-4">
            {bgImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setBgImageIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === bgImageIndex ? 'w-6 bg-nobel-gold' : 'w-1.5 bg-stone-600'}`}
              />
            ))}
          </div>
        </section>

        {/* ──────────────────── NEXT EVENT ──────────────────── */}
        <section className="py-24 bg-stone-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12 reveal">
              <span className="section-label mb-4 inline-flex">
                <Clock className="w-3 h-3" />
                {nextEvent?.isPast ? 'Latest Event' : 'Upcoming Event'}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mt-4 font-bold">
                {nextEvent?.isPast ? 'What We Did Recently' : "What's Coming Up"}
              </h2>
            </div>

            {nextEvent ? (
              <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-100 flex flex-col md:flex-row card-lift reveal">
                {nextEvent.img && (
                  <div className="md:w-5/12 h-72 md:h-auto img-zoom">
                    <LazyImg
                      src={nextEvent.img}
                      alt="Event"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={`p-8 md:p-12 flex flex-col justify-center ${nextEvent.img ? 'md:w-7/12' : 'w-full'}`}>
                  <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-nobel-gold mb-4">
                    <span className="w-4 h-px bg-nobel-gold" />
                    {new Date(nextEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <p className="text-stone-700 text-lg leading-relaxed mb-8 line-clamp-4">
                    {nextEvent.text}
                  </p>
                  <Link
                    to="/events"
                    className="btn-primary self-start"
                  >
                    View All Events <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-center text-stone-500 text-lg">No events at the moment.</p>
            )}
          </div>
        </section>

        {/* ──────────────────── SERVICES ──────────────────── */}
        <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-950/20 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10 max-w-6xl">
            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto mb-16 reveal">
              <span className="section-label mb-4 inline-flex" style={{ background: 'rgba(227,0,15,.15)', borderColor: 'rgba(227,0,15,.35)' }}>
                <Sparkles className="w-3.5 h-3.5" /> Spiritual Encounters
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-3 tracking-tight">
                Our Weekly Services
              </h2>
              <p className="text-stone-400 italic text-sm mt-2">
                Psalm 122:1 — "I rejoiced with those who said to me, 'Let us go to the house of the Lord.'"
              </p>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              {/* Sunday */}
              <div className="bg-stone-800/70 rounded-3xl overflow-hidden border border-stone-700/60 hover:border-nobel-gold/60 transition-all duration-300 flex flex-col group shadow-xl card-lift reveal reveal-left">
                <div className="relative h-64 img-zoom bg-stone-950">
                  <img
                    src="https://i.imgur.com/oK4q9Wd.jpeg"
                    alt="Sunday Worship Service"
                    className="w-full h-full object-cover opacity-90"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-nobel-gold text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow">
                    Sunday Celebrations
                  </span>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-serif text-2xl font-bold mb-3 text-white group-hover:text-nobel-gold transition-colors">
                    Sunday Celebration Services
                  </h3>
                  <p className="text-stone-300 text-sm leading-relaxed mb-6">
                    Experience energetic praise, worship, and the unadulterated preaching of the Word of Faith. Dedicated children ministry available.
                  </p>
                  <div className="space-y-2 mb-6">
                    {[['1st Service', '7:00 AM – 9:15 AM'], ['2nd Service', '9:30 AM – 11:30 AM']].map(([label, time]) => (
                      <div key={label} className="flex items-center gap-2.5 text-sm">
                        <Clock className="w-4 h-4 text-nobel-gold shrink-0" />
                        <span className="font-semibold text-white">{label}:</span>
                        <span className="text-stone-300">{time}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/services" className="inline-flex items-center gap-2 text-sm font-bold text-nobel-gold hover:text-red-400 transition-colors pt-4 border-t border-stone-700/50 mt-auto">
                    <span>View Service Details</span> <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Wednesday */}
              <div className="bg-stone-800/70 rounded-3xl overflow-hidden border border-stone-700/60 hover:border-nobel-gold/60 transition-all duration-300 flex flex-col group shadow-xl card-lift reveal reveal-right">
                <div className="relative h-64 img-zoom bg-stone-950">
                  <img
                    src="/images/1788800894816.jpg"
                    alt="Holy Communion Service"
                    className="w-full h-full object-cover opacity-90"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-amber-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow">
                    Midweek Encounter
                  </span>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-serif text-2xl font-bold mb-3 text-white group-hover:text-nobel-gold transition-colors">
                    Communion Service
                  </h3>
                  <p className="text-stone-300 text-sm leading-relaxed mb-6">
                    Deepen your understanding of the scriptures and partake in the mystery of the Holy Communion for supernatural health and spiritual vitality.
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2.5 text-sm">
                      <Clock className="w-4 h-4 text-nobel-gold shrink-0" />
                      <span className="font-semibold text-white">Every Wednesday:</span>
                      <span className="text-stone-300">5:30 PM – 7:30 PM</span>
                    </div>
                  </div>
                  <Link to="/services" className="inline-flex items-center gap-2 text-sm font-bold text-nobel-gold hover:text-red-400 transition-colors pt-4 border-t border-stone-700/50 mt-auto">
                    <span>View Service Details</span> <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Oyedepo Banner */}
            <div className="max-w-5xl mx-auto bg-stone-950 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl flex flex-col md:flex-row items-stretch reveal">
              <div className="md:w-5/12 w-full h-64 md:h-auto relative img-zoom">
                <img
                  src="https://www.thetrentonline.com/wp-content/uploads/2017/01/Bishop-David-Oyedepo-spitting-prophetic-fires.jpg"
                  alt="Bishop David Oyedepo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-950/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="md:w-7/12 w-full p-8 md:p-12 flex flex-col justify-center">
                <span className="text-nobel-gold text-[11px] uppercase tracking-widest font-bold mb-3">
                  Apostolic Mandate · Living Faith Church Worldwide
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                  The Liberation Mandate of Faith
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-6 italic">
                  "The hour has come to liberate the world from all oppressions of the devil through the preaching of the Word of Faith, and I am sending you to undertake this task."
                  <span className="block mt-2 text-stone-300 not-italic font-medium">— Bishop David O. Oyedepo</span>
                </p>
                <Link
                  to="/services"
                  className="btn-primary self-start text-xs uppercase tracking-wider"
                >
                  Explore All Services <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────── LOCATION ──────────────────── */}
        <section className="py-24 bg-stone-50 border-t border-stone-200/60">
          <div className="container mx-auto px-6 max-w-6xl reveal">
            <ChurchLocationMap />
          </div>
        </section>
      </main>
    </div>
  );
};
