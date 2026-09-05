import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { HomecellDirectory } from '../components/HomecellDirectory';
import { 
  Clock, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  Flame, 
  HeartHandshake, 
  ShieldCheck, 
  ChevronRight, 
  Users, 
  CheckCircle2,
  Calendar,
  MessageCircleQuestion,
  PhoneCall
} from 'lucide-react';

interface ServiceCardProps {
  title: string;
  tag: string;
  times: string[];
  description: string;
  scripture: string;
  image: string;
  highlights: string[];
  badgeColor?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  tag,
  times,
  description,
  scripture,
  image,
  highlights,
  badgeColor = 'bg-nobel-gold text-white',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row group">
      {/* Image container */}
      <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-[420px] bg-stone-900 overflow-hidden">
        <img
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out ${
            imageLoaded ? 'opacity-90' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-stone-950/20 lg:to-stone-950/70 pointer-events-none" />
        
        {/* Floating Tag */}
        <div className="absolute top-5 left-5 z-10">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${badgeColor}`}>
            <Sparkles className="w-3.5 h-3.5" />
            {tag}
          </span>
        </div>

        {/* Floating Scripture */}
        <div className="absolute bottom-5 left-5 right-5 z-10 text-white">
          <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-1">Covenant Foundation</p>
          <p className="text-sm font-serif italic text-stone-200 line-clamp-2">"{scripture}"</p>
        </div>
      </div>

      {/* Content */}
      <div className="lg:w-1/2 p-8 md:p-10 flex flex-col justify-between">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4 tracking-tight group-hover:text-nobel-gold transition-colors">
            {title}
          </h2>

          {/* Time Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {times.map((time, idx) => (
              <div 
                key={idx}
                className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-900 rounded-xl text-sm font-medium border border-stone-200 transition-colors"
              >
                <Clock className="w-4 h-4 text-nobel-gold shrink-0" />
                <span>{time}</span>
              </div>
            ))}
          </div>

          <p className="text-stone-600 text-base md:text-lg leading-relaxed mb-6 font-normal">
            {description}
          </p>

          {/* Highlights checklist */}
          <div className="space-y-2.5 mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Service Highlights</p>
            {highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-stone-700 text-sm md:text-base">
                <CheckCircle2 className="w-4 h-4 text-nobel-gold shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <MapPin className="w-4 h-4 text-stone-400" />
            <span>Simbock Sanctuary (Entrée Onana), Yaoundé</span>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-nobel-gold hover:text-red-700 transition-colors group/btn"
          >
            <span>Plan Your Visit</span>
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export const Services: React.FC = () => {
  return (
    <main className="pt-28 pb-24 bg-stone-50 min-h-screen">
      <Helmet>
        <title>Our Services | Winners Chapel International Simbock</title>
        <meta 
          name="description" 
          content="Join Winners Chapel International Simbock (WCI Simbock), Yaoundé for Sunday celebration services, Holy Communion midweek service, and WSF house fellowship." 
        />
        <meta 
          name="keywords" 
          content="WCI Simbock services, Winners Chapel Simbock, Bishop David Oyedepo ministry, Sunday service Yaoundé, communion service Cameroon, Living Faith Church" 
        />
        <meta property="og:title" content="Our Services | Winners Chapel International Simbock, Yaoundé" />
        <meta property="og:description" content="Experience life-transforming Sunday worship and Wednesday Holy Communion in Simbock, Yaoundé." />
        <meta property="og:url" content="https://wci-simbock.vercel.app/services" />
        <link rel="canonical" href="https://wci-simbock.vercel.app/services" />
      </Helmet>

      {/* Header Banner */}
      <section className="container mx-auto px-6 max-w-6xl mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-nobel-gold text-xs font-bold uppercase tracking-wider mb-6">
          <Flame className="w-3.5 h-3.5" />
          Living Faith Church Worldwide · WCI Simbock
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-stone-900 font-bold tracking-tight mb-6">
          Worship & Encounter Services
        </h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-nobel-gold font-serif text-lg font-semibold mb-2">Psalm 122:1</p>
          <p className="text-stone-600 italic text-lg leading-relaxed">
            "I was glad when they said unto me, Let us go into the house of the Lord."
          </p>
        </div>
      </section>

      {/* Bishop Oyedepo & The Liberation Mandate Feature Banner */}
      <section className="container mx-auto px-6 max-w-6xl mb-20">
        <div className="bg-stone-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col lg:flex-row items-center">
          {/* Oyedepo Ministry Image */}
          <div className="lg:w-5/12 w-full relative h-72 sm:h-96 lg:h-[460px] bg-stone-950 overflow-hidden">
            <img
              src="https://www.thetrentonline.com/wp-content/uploads/2017/01/Bishop-David-Oyedepo-spitting-prophetic-fires.jpg"
              alt="Bishop David Oyedepo Preaching the Word of Faith"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5">
              <span className="inline-block px-3 py-1 bg-nobel-gold text-white text-xs font-bold uppercase tracking-wider rounded-md mb-2">
                Apostolic Commission
              </span>
              <p className="text-white font-serif text-lg font-medium">Bishop David O. Oyedepo</p>
              <p className="text-stone-400 text-xs">President & Founder, Living Faith Church Worldwide</p>
            </div>
          </div>

          {/* Mandate Text */}
          <div className="lg:w-7/12 w-full p-8 md:p-12 lg:p-14 flex flex-col justify-center">
            <span className="text-nobel-gold text-xs uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              The Liberation Mandate · Since May 2, 1981
            </span>
            <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-stone-100 font-normal leading-snug mb-6 italic">
              "The hour has come to liberate the world from all oppressions of the devil through the preaching of the Word of Faith, and I am sending you to undertake this task."
            </blockquote>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8">
              At Winners Chapel International Simbock, every service is an intentional encounter with the Word of Faith, unveiling your heritage in Christ for total victory, divine health, spiritual elevation, and supernatural dominion.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-800 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-stone-300">
                <Flame className="w-4 h-4 text-nobel-gold shrink-0" />
                <span>The Word of Faith</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Holy Communion Mystery</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Users className="w-4 h-4 text-nobel-gold shrink-0" />
                <span>Signs & Wonders Altar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Schedule Cards */}
      <section className="container mx-auto px-6 max-w-6xl mb-24">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 font-bold mb-3">
            Weekly Order of Services
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto text-base">
            Find the right service for you and your family to grow spiritually, receive the prophetic word, and commune in fellowship.
          </p>
        </div>

        <div className="space-y-12">
          {/* Sunday Service */}
          <ServiceCard
            title="Sunday Celebration Services"
            tag="Supernatural Worship"
            times={['1st Service: 7:00 AM - 9:15 AM', '2nd Service: 9:30 AM - 11:30 AM']}
            description="Our Sunday services are loaded with high praise, heartfelt worship, and the unadulterated preaching of the Word of Faith. Whether you attend early or mid-morning, you will experience tangible breakthroughs and prophetic impartations for triumphant weekly living."
            scripture="Obadiah 1:17 - But upon mount Zion shall be deliverance, and there shall be holiness; and the house of Jacob shall possess their possessions."
            image="https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmvSHJ1fO9JVIW4cERpjPpyJvF_PrPho9Z_f9pK34uT1OPOXAT70VPEnmlWyP2Z-zMRxjEa0-iMnwBj36wE7OvFBIY8JIgiHrWvA76AnirMsBOUN1g7nFbenES4n4mExkIsbfIATigvoQ=s680-w680-h510-rw"
            highlights={[
              'Spirit-anointed praise and celebration worship',
              'Systematic teachings on faith, divine health, and dominion',
              'Dedicated, safe Children & Teenagers Church classrooms',
              'Personal prayer and prophetic declarations over your week'
            ]}
            badgeColor="bg-nobel-gold text-white"
          />

          {/* Wednesday Communion Service */}
          <ServiceCard
            title="Midweek Communion Service"
            tag="Divine Strength & Healing"
            times={['Every Wednesday: 5:30 PM - 7:30 PM']}
            description="Deepen your spiritual foundation in our mid-week fellowship and partake in the mystery of the Holy Communion. As ordained in scripture, the flesh and the blood of Jesus Christ infuse divine vitality, shatter demonic yokes, and empower you to finish your week strong."
            scripture="John 6:54 - Whoso eateth my flesh, and drinketh my blood, hath eternal life; and I will raise him up at the last day."
            image="/images/holy_communion_service_1788618177522.jpg"
            highlights={[
              'In-depth expository bible teaching & scripture breakdowns',
              'Sacrament of the Holy Communion for supernatural health and vitality',
              'Focused prayer sessions against every spiritual resistance',
              'Quick mid-week spiritual refreshment for working professionals & students'
            ]}
            badgeColor="bg-amber-600 text-white"
          />

          {/* WSF Saturday Cell Service */}
          <ServiceCard
            title="Winners Satellite Fellowship (WSF)"
            tag="Home Cell Fellowship"
            times={['Every Saturday: 5:00 PM - 6:00 PM']}
            description="Experience caring Christian family community right in your neighborhood. WSF is our grassroots home-cell network across Simbock, Mendong, and neighbouring districts of Yaoundé, providing spiritual mentorship, interactive prayer, and warm sisterhood and brotherhood."
            scripture="Acts 2:46 - And they, continuing daily with one accord in the temple, and breaking bread from house to house..."
            image="/images/simbock_church_sanctuary_1788618229052.jpg"
            highlights={[
              '11 active fellowship centers across Mbalgong, Michel Power, Essono City, Entrée Onana, Monte Ngok, Mario, Nomayos & Bambou de Chine',
              'Intimate, interactive neighborhood fellowship, scripture study, and prayer',
              'One-on-one pastoral care and mutual encouragement with dedicated cell leaders',
              'Every Saturday from 5:00 PM to 6:00 PM close to your residence'
            ]}
            badgeColor="bg-stone-800 text-white"
          />
        </div>
      </section>

      {/* Interactive WSF Homecell Centers Directory */}
      <section className="container mx-auto px-6 max-w-6xl mb-24">
        <HomecellDirectory />
      </section>

      {/* WCI Simbock Sanctuary Experience */}
      <section className="container mx-auto px-6 max-w-6xl mb-24">
        <div className="bg-white rounded-3xl p-8 md:p-14 border border-stone-200 shadow-sm">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-nobel-gold text-xs uppercase font-bold tracking-widest block mb-2">
              Sanctuary Life at Simbock
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-stone-900 font-bold mb-4">
              What to Expect at WCI Simbock
            </h2>
            <p className="text-stone-600 text-base leading-relaxed">
              We know visiting a church for the first time can be a new experience. Here is how our pastoral team and protocol ensure you feel immediately at home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 text-left">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-nobel-gold flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Warm Welcoming</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Our hospitality and ushers team welcomes you with love and smiles, guiding you comfortably into the sanctuary.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Liberation Message</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Clear, practical, and scripture-backed teachings that apply directly to your career, family, health, and finances.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Children's Church</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Age-graded bible classes, fun songs, and qualified teachers to train your little ones in the ways of the Lord.
              </p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Personal Ministry</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Opportunity for salvation, dedicated prayer over sick bodies, and confidential counseling with our pastoral staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Your Visit CTA */}
      <section className="container mx-auto px-6 max-w-4xl">
        <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-black text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl border border-stone-800">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 text-stone-100">
              Your Seat is Saved at the Altar of Praise
            </h2>
            <p className="text-stone-300 text-base sm:text-lg mb-8 leading-relaxed">
              Whether you are in Simbock, Mendong, Biyem-Assi, or elsewhere in Yaoundé, you are warmly invited to join the Winners family this coming service.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-nobel-gold hover:bg-red-700 text-white rounded-full font-bold text-sm tracking-wider uppercase transition-colors shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold"
              >
                Get Directions & Address
              </Link>
              <Link
                to="/events"
                className="px-8 py-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-full font-bold text-sm tracking-wider uppercase transition-colors border border-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold"
              >
                Upcoming Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

