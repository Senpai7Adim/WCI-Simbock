import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2 } from 'lucide-react';

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const GalleryItem: React.FC<{ item: any }> = ({ item }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 group flex flex-col relative w-full mb-6">
      <div className="bg-stone-50 relative overflow-hidden flex items-center justify-center w-full min-h-[16rem]">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 z-0">
            <Loader2 className="w-8 h-8 text-nobel-gold animate-spin" />
          </div>
        )}
        {item.type === 'image' ? (
          <img 
            src={item.url} 
            alt={item.description} 
            className={`w-full h-auto object-cover group-hover:scale-105 transition-all duration-700 relative z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
          />
        ) : getYouTubeId(item.url) ? (
          <div className="w-full aspect-video relative z-10">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}`}
              title={item.description || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(true)}
            ></iframe>
          </div>
        ) : (
          <video 
            src={item.url} 
            controls 
            className={`w-full h-auto bg-black relative z-10 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
            onLoadedData={() => setIsLoaded(true)}
          />
        )}
      </div>
      {item.description && (
        <div className="p-4 bg-white text-center border-t border-stone-50 relative z-20 w-full">
          <p className="text-sm text-stone-600 break-words line-clamp-2">{item.description}</p>
        </div>
      )}
    </div>
  );
};

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
      setLoading(false);
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-nobel-gold animate-spin mb-4" />
        <p className="text-stone-500 text-lg">Loading gallery...</p>
      </div>
    );
  }

  // Generate dynamic description based on gallery content
  const dynamicDescription = items.length > 0 
    ? `View our latest gallery items including: ${items.slice(0, 3).map(i => i.description).filter(Boolean).join(', ')}...`
    : "Explore the photo and video gallery of Winners Chapel International Simbock. See our services, events, and community in action.";

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <Helmet>
        <title>Media Gallery | WCI Simbock Yaoundé</title>
        <meta name="description" content={dynamicDescription} />
        <meta name="keywords" content="gallery, photos, videos, church, Winners Chapel, Yaoundé, WCI Simbock, media" />
        <link rel="canonical" href="https://wcsimbock.org/gallery" />
      </Helmet>

      <h1 className="font-serif text-5xl mb-6 text-stone-900 text-center">Gallery</h1>
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-nobel-gold font-serif text-xl mb-2">Psalm 105:1</p>
        <p className="text-stone-600 italic">"Give praise to the Lord, proclaim his name; make known among the nations what he has done."</p>
      </div>
      
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.map(item => (
          <GalleryItem key={item.id} item={item} />
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-stone-500">No gallery items found.</p>
      )}
    </div>
  );
};
