import React from 'react';
import { Helmet } from 'react-helmet-async';

export const Services: React.FC = () => {
  return (
    <main className="pt-32 pb-24 container mx-auto px-6 max-w-5xl">
      <Helmet>
        <title>Our Services | WCI Simbock Yaoundé</title>
        <meta name="description" content="Join Winners Chapel International Simbock for Sunday services and Wednesday Midweek Communion Service." />
        <meta name="keywords" content="church services, sunday worship, communion service, Winners Chapel, WCI Simbock, Yaoundé" />
        <meta property="og:title" content="Our Services | WCI Simbock Yaoundé" />
        <meta property="og:description" content="Join Winners Chapel International Simbock for Sunday services and Wednesday." />
        <meta property="og:url" content="https://wci-simbock-cy77.vercel.app/
services" />
        <link rel="canonical" href="https://wci-simbock-cy77.vercel.app/
services" />
      </Helmet>
      <h1 className="font-serif text-5xl mb-6 text-stone-900 text-center">Our Services</h1>
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-nobel-gold font-serif text-xl mb-2">Psalm 122:1</p>
        <p className="text-stone-600 italic">"I rejoiced with those who said to me, 'Let us go to the house of the Lord.'"</p>
      </div>

      <div className="space-y-16">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3 text-center md:text-left">
            <h2 className="font-serif text-4xl text-nobel-gold mb-2">Sunday</h2>
            <div className="text-stone-500 font-bold tracking-widest uppercase text-sm">1st Service</div>
            <div className="mt-2 text-2xl text-stone-900">7:00 AM - 9:15 AM</div>
            <div className="text-stone-500 font-bold tracking-widest uppercase text-sm mt-6">2nd Service</div>
            <div className="mt-2 text-2xl text-stone-900">9:30 AM - 11:30 AM</div>
          </div>
          <div className="md:w-2/3 text-lg text-stone-600 leading-relaxed">
            Join us every Sunday for a powerful time of worship, fellowship, and the teaching of the Word. We offer two services to accommodate your schedule. Our Sunday services are designed to inspire, equip, and empower you for the week ahead. Children's ministry is available during the services.
          </div>
        </div>

        <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3 text-center md:text-left">
            <h2 className="font-serif text-4xl text-nobel-gold mb-2">Wednesday</h2>
            <div className="text-stone-500 font-bold tracking-widest uppercase text-sm">Communion Service</div>
            <div className="mt-4 text-2xl text-stone-900">5:30 PM - 7:30 PM</div>
          </div>
          <div className="md:w-2/3 text-lg text-stone-600 leading-relaxed">
            Deepen your understanding of the scriptures and partake in the Holy Communion every Wednesday. We dive into the Word of God, exploring its depths and applying its truths to our daily lives.
          </div>
        </div>
      </div>
    </main>
  );
};
