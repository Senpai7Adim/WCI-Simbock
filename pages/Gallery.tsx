import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
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

  if (loading) return <div className="pt-32 text-center">Loading gallery...</div>;

  return (
    <div className="pt-32 pb-24 container mx-auto px-6">
      <h1 className="font-serif text-5xl mb-6 text-stone-900 text-center">Gallery</h1>
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-nobel-gold font-serif text-xl mb-2">Psalm 105:1</p>
        <p className="text-stone-600 italic">"Give praise to the Lord, proclaim his name; make known among the nations what he has done."</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-stone-100 group flex flex-col">
            <div className="h-80 bg-stone-50 relative overflow-hidden flex items-center justify-center p-2">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.description} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              ) : getYouTubeId(item.url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(item.url)}`}
                  title={item.description || "YouTube video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <video src={item.url} controls className="max-w-full max-h-full object-contain" />
              )}
            </div>
            <div className="p-4 text-center mt-auto border-t border-stone-50">
              <p className="text-sm text-stone-600 truncate">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-stone-500">No gallery items found.</p>
      )}
    </div>
  );
};
