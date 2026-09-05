import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  Compass, 
  Sparkles 
} from 'lucide-react';

interface ChurchLocationMapProps {
  showTitle?: boolean;
  className?: string;
}

export const ChurchLocationMap: React.FC<ChurchLocationMapProps> = ({
  showTitle = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const churchName = "Winners Chapel International Simbock";
  const churchAddress = "Simbock, Entrée Onana, Yaoundé, Cameroon";
  const plusCode = "XG28+XJX, Simbock, Yaoundé";

  // Google Maps URLs
  const encodedQuery = encodeURIComponent("Simbock Entrée Onana, Yaoundé, Cameroun");
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedQuery}`;
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  
  // Maps embed URL
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const embedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedQuery}`
    : `https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${churchName}, ${churchAddress}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📍 *${churchName}*\n` +
      `Location: Simbock (Entrée Onana), Yaoundé, Cameroon\n` +
      `Google Maps: ${googleMapsSearchUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className={`w-full ${className}`}>
      {showTitle && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-nobel-gold text-xs font-bold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            Find The Sanctuary
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            Church Location & Directions
          </h2>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed">
            Visit us in person at our sanctuary in Simbock (Entrée Onana), Yaoundé. All are warmly welcomed to encounter the power of God.
          </p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Interactive Google Map Embed Frame */}
        <div className="lg:col-span-7 relative min-h-[350px] lg:min-h-[420px] bg-stone-100 flex flex-col">
          <iframe
            title="Winners Chapel International Simbock Google Map"
            src={embedUrl}
            className="w-full h-full min-h-[350px] lg:min-h-[420px] border-0"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Quick Floating Badge on Top of Map */}
          <div className="absolute top-4 left-4 right-4 sm:right-auto bg-stone-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-lg border border-stone-700/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-nobel-gold flex items-center justify-center text-white shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">WCI Simbock Sanctuary</p>
              <p className="text-[11px] text-stone-300 truncate">Simbock (Entrée Onana), Yaoundé</p>
            </div>
          </div>
        </div>

        {/* Location Details & Directions Panel */}
        <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-6 bg-stone-50/50">
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-nobel-gold block mb-1.5">
                Sanctuary Address
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                Winners Chapel Int'l Simbock
              </h3>
              <p className="text-stone-700 text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-nobel-gold shrink-0" />
                <span>Simbock, Entrée Onana — Yaoundé, Cameroon</span>
              </p>
              <p className="text-stone-500 text-xs mt-1.5 pl-6">
                Plus Code: <span className="font-mono text-stone-700 font-semibold">{plusCode}</span>
              </p>
            </div>

            {/* Service schedule quick reminder */}
            <div className="bg-amber-50 border border-amber-200/70 rounded-2xl p-4 text-xs text-amber-950">
              <p className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-nobel-gold shrink-0" />
                Weekly Service Times
              </p>
              <div className="space-y-1.5 text-amber-900/90 font-medium">
                <div>• <strong className="text-amber-950">Sundays:</strong> 1st Service: 7:00 AM | 2nd Service: 9:30 AM</div>
                <div>• <strong className="text-amber-950">Wednesdays:</strong> Communion Service: 5:30 PM - 7:30 PM</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-stone-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Google Maps Directions */}
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-nobel-gold hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              {/* View in Google Maps */}
              <a
                href={googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Google Maps</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Copy address */}
              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-medium transition-colors"
                aria-label="Copy church address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-700 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-400" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>

              {/* Share on WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-medium transition-colors"
                aria-label="Share location on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Location</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
