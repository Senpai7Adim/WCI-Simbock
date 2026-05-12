import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, Phone, Mail, Heart, Copy, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const Contact: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<any>({ paymentMethods: [] });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const fetchContactInfo = async () => {
      const docRef = doc(db, 'settings', 'contactInfo');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContactInfo(docSnap.data() as any);
      }
    };
    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Thank you for your message. We will get back to you soon.");
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Contact Form Error:', error);
      toast.error(error.message || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="pt-32 pb-24 container mx-auto px-6 max-w-6xl">
      <Helmet>
        <title>Contact Us | WCI Simbock Yaoundé</title>
        <meta name="description" content="Get in touch with Winners Chapel International Simbock. Find our address in Yaoundé, contact details, and give offerings securely." />
        <link rel="canonical" href="https://wci-simbock.vercel.app/
contact" />
      </Helmet>

      <h1 className="font-serif text-5xl mb-6 text-stone-900 text-center">Contact Us</h1>
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-nobel-gold font-serif text-xl mb-2">Jeremiah 33:3</p>
        <p className="text-stone-600 italic">"Call to me and I will answer you and tell you great and unsearchable things you do not know."</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-stone-100">
          <h2 className="font-serif text-3xl mb-8 text-stone-800">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">Name</label>
              <input 
                id="name" 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold focus:border-transparent outline-none transition-all" 
                placeholder="Your name" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">Email</label>
              <input 
                id="email" 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold focus:border-transparent outline-none transition-all" 
                placeholder="your@email.com" 
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">Message</label>
              <textarea 
                id="message" 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required 
                rows={5} 
                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-nobel-gold focus:border-transparent outline-none transition-all resize-none" 
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors font-medium tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        {/* Contact Details & Offerings */}
        <div className="space-y-12">
          <div>
            <h2 className="font-serif text-3xl mb-8 text-stone-800">Get in touch</h2>
            <div className="space-y-6 text-stone-600">
              <div className="flex items-start gap-4">
                <MapPin className="text-nobel-gold mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stone-900">Address</h3>
                  <p>XG28+XJX, Simbock<br />Yaoundé</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-nobel-gold mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stone-900">Phone</h3>
                  <p>+237 6XX XXX XXX</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-nobel-gold mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-stone-900">Email</h3>
                  <p>contact@wcsimbock.org</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="text-nobel-gold" />
              <h2 className="font-serif text-2xl text-stone-800">Give / Offerings</h2>
            </div>
            <p className="text-stone-600 mb-6">
              Your generous giving supports the ministry and our community outreach programs.
            </p>

            <div className="space-y-4">
              {contactInfo.paymentMethods && contactInfo.paymentMethods.length > 0 ? (
                contactInfo.paymentMethods.map((method: any, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
                    <span className="font-bold text-stone-800 break-words">{method.name}</span>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end overflow-hidden">
                      <span className="font-mono text-nobel-gold font-medium bg-stone-50 px-3 py-1 rounded-md text-sm break-all">{method.code}</span>
                      <button
                        onClick={() => handleCopy(method.code, index)}
                        className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-500 hover:text-nobel-gold flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold"
                        title="Copy code"
                        aria-label={`Copy ${method.name} code`}
                      >
                        {copiedIndex === index ? <Check size={18} className="text-green-500" aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
                    <span className="font-bold text-stone-800 break-words">Orange Money</span>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end overflow-hidden">
                      <span className="font-mono text-nobel-gold font-medium bg-stone-50 px-3 py-1 rounded-md text-sm break-all">*150*...</span>
                      <button
                        onClick={() => handleCopy('*150*...', -1)}
                        className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-500 hover:text-nobel-gold flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold"
                        title="Copy code"
                        aria-label="Copy Orange Money code"
                      >
                        {copiedIndex === -1 ? <Check size={18} className="text-green-500" aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-white rounded-xl border border-stone-100 shadow-sm">
                    <span className="font-bold text-stone-800 break-words">Mobile Money</span>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end overflow-hidden">
                      <span className="font-mono text-nobel-gold font-medium bg-stone-50 px-3 py-1 rounded-md text-sm break-all">*126*...</span>
                      <button
                        onClick={() => handleCopy('*126*...', -2)}
                        className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-500 hover:text-nobel-gold flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold"
                        title="Copy code"
                        aria-label="Copy Mobile Money code"
                      >
                        {copiedIndex === -2 ? <Check size={18} className="text-green-500" aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
