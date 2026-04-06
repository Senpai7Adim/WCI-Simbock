import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { X, Facebook, Twitter, Link as LinkIcon, Check } from 'lucide-react';

export const Testimonies: React.FC = () => {
  const [testimonies, setTestimonies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimony, setSelectedTestimony] = useState<any | null>(null);
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
    const fetchTestimonies = async () => {
      const q = query(collection(db, 'testimonies'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestimonies(data);
      setLoading(false);
    };

    fetchTestimonies();
  }, []);

  if (loading) return <div className="pt-32 text-center">Loading testimonies...</div>;

  const shareUrl = window.location.href;

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <Helmet>
        <title>Testimonies & Miracles | WCI Simbock Yaoundé</title>
        <meta name="description" content="Read powerful testimonies and miracles from the members of Winners Chapel International Simbock. See what God is doing in our church." />
        <link rel="canonical" href="https://wcsimbock.org/testimonies" />
      </Helmet>

      <h1 className="font-serif text-5xl mb-6 text-stone-900 text-center">Testimonies</h1>
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-nobel-gold font-serif text-xl mb-2">Revelation 12:11</p>
        <p className="text-stone-600 italic">"They triumphed over him by the blood of the Lamb and by the word of their testimony..."</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonies.map(testimony => (
          <div 
            key={testimony.id} 
            className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedTestimony(testimony)}
          >
            {testimony.img && (
              <img src={testimony.img} alt={testimony.name || "Testimony"} className="w-24 h-24 rounded-full object-cover mb-6 border-2 border-nobel-gold" referrerPolicy="no-referrer" loading="lazy" />
            )}
            {testimony.title && (
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{testimony.title}</h3>
            )}
            <p className="text-stone-700 italic leading-relaxed mb-6 line-clamp-4">
              "{testimony.text}"
            </p>
            <div className="mt-auto flex flex-col items-center">
              {testimony.name && (
                <span className="font-medium text-stone-800 mb-1">- {testimony.name}</span>
              )}
              <div className="text-xs text-stone-400 uppercase tracking-widest">
                {new Date(testimony.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {testimonies.length === 0 && (
        <p className="text-center text-stone-500">No testimonies found.</p>
      )}

      {/* Testimony Details Modal */}
      {selectedTestimony && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTestimony(null)}>
          <div 
            className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-10 p-2 bg-black/5 hover:bg-black/10 text-stone-600 rounded-full transition-colors"
              onClick={() => setSelectedTestimony(null)}
            >
              <X size={24} />
            </button>
            
            <div className="overflow-y-auto flex-1 p-8 md:p-12 flex flex-col items-center text-center">
              {selectedTestimony.img && (
                <img 
                  src={selectedTestimony.img} 
                  alt={selectedTestimony.name || "Testimony"} 
                  className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-nobel-gold shadow-md" 
                  referrerPolicy="no-referrer" 
                  loading="lazy"
                />
              )}
              {selectedTestimony.title && (
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-4">{selectedTestimony.title}</h3>
              )}
              <p className="text-stone-800 text-lg italic leading-relaxed mb-8 whitespace-pre-wrap">
                "{selectedTestimony.text}"
              </p>
              <div className="mt-auto flex flex-col items-center w-full">
                {selectedTestimony.name && (
                  <span className="font-medium text-stone-900 text-lg mb-1">- {selectedTestimony.name}</span>
                )}
                <div className="text-sm text-stone-500 uppercase tracking-widest mb-8">
                  {new Date(selectedTestimony.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex items-center justify-center gap-4 pt-6 border-t border-stone-100 w-full">
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
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Read this powerful testimony: ${selectedTestimony.title || selectedTestimony.text.substring(0, 50)}...`)}`} 
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
