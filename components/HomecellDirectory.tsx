import React, { useState, useMemo } from 'react';
import { 
  HOMECELL_LOCATIONS, 
  HomecellLocation 
} from '../data/homecells';
import { 
  MapPin, 
  Phone, 
  User, 
  Home, 
  Clock, 
  Search, 
  Check, 
  Copy, 
  MessageCircle, 
  Users, 
  Sparkles,
  Filter
} from 'lucide-react';

interface HomecellDirectoryProps {
  defaultQuarter?: string;
  showTitle?: boolean;
}

export const HomecellDirectory: React.FC<HomecellDirectoryProps> = ({
  defaultQuarter = 'all',
  showTitle = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState(defaultQuarter);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const quarters = useMemo(() => {
    const list = Array.from(new Set(HOMECELL_LOCATIONS.map((c) => c.quarters)));
    return ['all', ...list];
  }, []);

  const filteredLocations = useMemo(() => {
    return HOMECELL_LOCATIONS.filter((cell) => {
      const matchesQuarter =
        selectedQuarter === 'all' || cell.quarters.toLowerCase() === selectedQuarter.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        cell.name.toLowerCase().includes(q) ||
        cell.quarters.toLowerCase().includes(q) ||
        cell.host.toLowerCase().includes(q) ||
        cell.leader.toLowerCase().includes(q) ||
        cell.phone.includes(q);

      return matchesQuarter && matchesSearch;
    });
  }, [searchQuery, selectedQuarter]);

  const handleCopy = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <section id="homecells" className="w-full">
      {showTitle && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-100 text-nobel-gold text-xs font-bold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            Winners Satellite Fellowship (WSF)
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            Find a Homecell Center Near You
          </h2>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed">
            Fellowship, break bread, and pray with brothers and sisters in your neighborhood every Saturday from <strong className="text-stone-800">5:00 PM to 6:00 PM</strong>.
          </p>
        </div>
      )}

      {/* Search & Quarter Filters */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm mb-8 space-y-6">
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by quarter (e.g. Mbalgong, Monte Ngok), cell name, host, or leader..."
            className="w-full pl-12 pr-4 py-3.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white rounded-xl border border-stone-200 focus:border-nobel-gold focus:ring-2 focus:ring-nobel-gold/20 outline-none text-stone-800 text-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 px-2 py-1 bg-stone-200 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quarter Filter Chips */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Quarter:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quarters.map((quarter) => {
              const count =
                quarter === 'all'
                  ? HOMECELL_LOCATIONS.length
                  : HOMECELL_LOCATIONS.filter((c) => c.quarters.toLowerCase() === quarter.toLowerCase()).length;
              const isSelected = selectedQuarter.toLowerCase() === quarter.toLowerCase();

              return (
                <button
                  key={quarter}
                  onClick={() => setSelectedQuarter(quarter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-nobel-gold text-white shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span className="capitalize">{quarter === 'all' ? 'All Quarters' : quarter}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-6 px-1">
        <span>Showing <strong>{filteredLocations.length}</strong> of {HOMECELL_LOCATIONS.length} fellowship centers</span>
        <span className="flex items-center gap-1 text-nobel-gold font-medium">
          <Clock className="w-3.5 h-3.5" />
          Every Saturday 5:00 PM – 6:00 PM
        </span>
      </div>

      {/* Grid of Homecells */}
      {filteredLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((cell) => (
            <div
              key={cell.sn}
              className="bg-white rounded-2xl p-6 border border-stone-200 hover:border-nobel-gold/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header with Cell Name & Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-nobel-gold uppercase block">
                      Cell #{cell.sn}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-nobel-gold transition-colors">
                      {cell.name}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium shrink-0">
                    <Clock className="w-3 h-3 text-nobel-gold" />
                    5:00 PM
                  </span>
                </div>

                {/* Quarter / Location */}
                <div className="flex items-start gap-2 text-stone-800 font-medium text-sm mb-4 pb-4 border-b border-stone-100">
                  <MapPin className="w-4 h-4 text-nobel-gold shrink-0 mt-0.5" />
                  <span>{cell.quarters}</span>
                </div>

                {/* Host & Leader Info */}
                <div className="space-y-2.5 text-xs text-stone-600 mb-6">
                  <div className="flex items-center justify-between py-1 bg-stone-50 px-3 rounded-lg">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <Home className="w-3.5 h-3.5 text-stone-400" />
                      Host:
                    </span>
                    <strong className="text-stone-900 font-semibold">{cell.host}</strong>
                  </div>

                  <div className="flex items-center justify-between py-1 bg-stone-50 px-3 rounded-lg">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      Leader:
                    </span>
                    <strong className="text-stone-900 font-semibold">{cell.leader}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-stone-600 font-medium">{cell.displayPhone}</span>
                  <button
                    onClick={() => handleCopy(cell.phone)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded transition-colors"
                    title="Copy phone number"
                    aria-label={`Copy phone for cell ${cell.name}`}
                  >
                    {copiedPhone === cell.phone ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:+237${cell.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nobel-gold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Leader</span>
                  </a>

                  <a
                    href={`https://wa.me/237${cell.phone}?text=Praise%20the%20Lord!%20I%20would%20like%20to%20attend%20the%20${encodeURIComponent(cell.name)}%20Homecell%20in%20${encodeURIComponent(cell.quarters)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
          <p className="text-stone-500 text-sm mb-4">No homecells match your search query "{searchQuery}".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedQuarter('all');
            }}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
