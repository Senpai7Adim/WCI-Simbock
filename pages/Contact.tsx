import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Phone, Mail, Heart, Copy, Check, Loader2, Sparkles, Send, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { HomecellDirectory } from '../components/HomecellDirectory';
import { ChurchLocationMap } from '../components/ChurchLocationMap';
import { getApiBaseUrl } from '../utils/api';

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

export const Contact: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<any>({ paymentMethods: [] });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useScrollReveal();

  useEffect(() => {
    const fetchContactInfo = async () => {
      const docRef = doc(db, 'settings', 'contactInfo');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setContactInfo(docSnap.data() as any);
    };
    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const API_URL = getApiBaseUrl();
      const res = await fetch(`${API_URL}/api/send-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Thank you! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const ct = res.headers.get('content-type');
        if (ct?.includes('application/json')) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to send message');
        } else {
          throw new Error(`Server Error (${res.status})`);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const contactDetails = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: 'Sanctuary Address',
      content: (
        <>
          <p className="text-stone-800 font-semibold">Simbock (Entrée Onana)<br />Yaoundé, Cameroon</p>
          <p className="text-xs text-stone-500 mt-1">
            Plus Code: <span className="font-mono font-bold text-stone-700 bg-stone-200/80 px-1.5 py-0.5 rounded">RF9C+8HF</span>
          </p>
          <div className="flex flex-col gap-1 mt-2">
            <a href="https://www.google.com/maps/dir/?api=1&destination=RF9C%2B8HF%2C+Yaound%C3%A9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-nobel-gold hover:text-red-700 transition-colors">
              <ExternalLink size={11} /> Get Directions
            </a>
          </div>
        </>
      ),
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Phone',
      content: <p className="text-stone-600">+237 6XX XXX XXX</p>,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email',
      content: (
        <a href="mailto:contact@wcsimbock.org" className="text-stone-600 hover:text-nobel-gold transition-colors">
          contact@wcsimbock.org
        </a>
      ),
    },
  ];

  return (
    <div className="pt-28 pb-24 overflow-x-hidden">
      <Helmet>
        <title>Contact Us | WCI Simbock Yaoundé</title>
        <meta name="description" content="Get in touch with Winners Chapel International Simbock. Find our address in Yaoundé, contact details, and give offerings securely." />
        <link rel="canonical" href="https://wci-simbock.vercel.app/contact" />
      </Helmet>

      {/* Page Header */}
      <div className="container mx-auto px-6 max-w-6xl mb-16">
        <div className="text-center reveal">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-stone-900 mt-4 mb-4">Contact Us</h1>
          <p className="text-nobel-gold font-serif text-lg mb-1">Jeremiah 33:3</p>
          <p className="text-stone-500 italic max-w-xl mx-auto text-sm">
            "Call to me and I will answer you and tell you great and unsearchable things you do not know."
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">

          {/* ── Contact Form ── */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-stone-100 reveal reveal-left">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 mb-8">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-stone-700 mb-2">Your Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-stone-700 mb-2">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="form-input resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center py-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                ) : (
                  <><Send size={16} /> Send Message</>
                )}
              </button>
            </form>
          </div>

          {/* ── Contact Info + Offerings ── */}
          <div className="flex flex-col gap-8">
            {/* Contact details */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 reveal reveal-right">
              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-8">Get in touch</h2>
              <div className="space-y-6">
                {contactDetails.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-nobel-gold shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm mb-1">{item.title}</h3>
                      <div className="text-sm text-stone-600">{item.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offerings */}
            <div className="bg-stone-900 rounded-3xl p-8 text-white reveal reveal-right reveal-delay-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-nobel-gold/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-nobel-gold" />
                </div>
                <h2 className="font-serif text-xl font-bold">Give / Offerings</h2>
              </div>
              <p className="text-stone-400 text-sm mb-6">
                Your generous giving supports the ministry and our community outreach programs.
              </p>

              <div className="space-y-3">
                {contactInfo.paymentMethods && contactInfo.paymentMethods.length > 0 ? (
                  contactInfo.paymentMethods.map((method: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-3 p-4 bg-stone-800 rounded-xl border border-stone-700">
                      <span className="font-semibold text-white text-sm">{method.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-nobel-gold text-sm bg-stone-900/60 px-2.5 py-1 rounded-lg">{method.code}</span>
                        <button
                          onClick={() => handleCopy(method.code, index)}
                          className="p-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-400 hover:text-white transition-colors"
                          aria-label={`Copy ${method.name} code`}
                        >
                          {copiedIndex === index ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {[{ name: 'Orange Money', code: '*150*...' }, { name: 'Mobile Money', code: '*126*...' }].map((m, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 p-4 bg-stone-800 rounded-xl border border-stone-700">
                        <span className="font-semibold text-white text-sm">{m.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-nobel-gold text-sm bg-stone-900/60 px-2.5 py-1 rounded-lg">{m.code}</span>
                          <button
                            onClick={() => handleCopy(m.code, -(i + 1))}
                            className="p-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-400 hover:text-white transition-colors"
                            aria-label={`Copy ${m.name} code`}
                          >
                            {copiedIndex === -(i + 1) ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mb-20 pt-12 border-t border-stone-200 reveal">
          <ChurchLocationMap />
        </div>

        {/* Homecell Directory */}
        <div className="pt-12 border-t border-stone-200 reveal">
          <HomecellDirectory />
        </div>
      </div>
    </div>
  );
};
