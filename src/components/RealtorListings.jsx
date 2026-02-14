import { useMemo } from 'react';
import { generateRealtorLinks } from '../utils/realtorUrl';

export default function RealtorListings({ city, maxAffordablePrice }) {
  const links = useMemo(() => {
    if (!city || !maxAffordablePrice || maxAffordablePrice <= 0) return [];
    return generateRealtorLinks(city, maxAffordablePrice);
  }, [city, maxAffordablePrice]);

  if (!city) return null;

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-white/60 mb-1 uppercase tracking-wider">
        Real Estate Listings
      </h3>
      <p className="text-xs text-white/30 mb-4">
        Browse current listings on Realtor.com for {city.name}, {city.state}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm group-hover:bg-white/15 transition">
              🏠
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white/80 group-hover:text-white transition truncate">
                {link.label}
              </div>
              <div className="text-xs text-white/30">realtor.com →</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
