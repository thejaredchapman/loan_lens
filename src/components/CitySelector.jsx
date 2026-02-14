import { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { CITIES } from '../data/cities';

export default function CitySelector() {
  const { selectedCityId, setSelectedCity } = useStore();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedCity = CITIES.find((c) => c.id === selectedCityId);

  const filtered = useMemo(() => {
    if (!search) return CITIES;
    const q = search.toLowerCase();
    return CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
  }, [search]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs text-white/50 mb-1">City</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-sm text-left hover:bg-white/15 transition cursor-pointer"
      >
        {selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : 'Select a city...'}
        <span className="float-right text-white/40">▾</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg bg-slate-800 border border-white/15 shadow-xl overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cities..."
              className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/10 text-white text-sm placeholder-white/30 outline-none focus:border-white/30"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto schedule-scroll">
            {filtered.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedCity(city.id);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-white/10 transition cursor-pointer ${
                  city.id === selectedCityId ? 'bg-white/10 text-white' : 'text-white/70'
                }`}
              >
                {city.name}, {city.state}
                <span className="float-right text-white/30 text-xs">
                  Median: ${city.demographics.medianHomePrice.toLocaleString()}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-white/30 text-sm">No cities found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
