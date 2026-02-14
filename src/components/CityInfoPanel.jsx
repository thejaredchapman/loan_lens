import { formatNumber, formatPercent } from '../utils/formatters';

export default function CityInfoPanel({ city, liveWeather, isEnriching }) {
  if (!city) return null;

  const { weather, schools, walkability, demographics } = city;

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 backdrop-blur-sm">
      <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">
        About {city.name}, {city.state}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weather */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🌤️</span>
            <span className="text-sm font-medium text-white">Weather</span>
            {isEnriching && <span className="text-xs text-white/30 animate-pulse">updating...</span>}
          </div>
          {liveWeather && (
            <div className="mb-2 px-2 py-1 rounded bg-white/5 text-xs text-white/70">
              Now: {liveWeather.currentTemp}°F, Wind {liveWeather.windSpeed} mph
            </div>
          )}
          <div className="space-y-1 text-xs text-white/60">
            <div className="flex justify-between">
              <span>Summer High</span>
              <span className="text-white/80">{weather.avgHighSummer}°F</span>
            </div>
            <div className="flex justify-between">
              <span>Winter Low</span>
              <span className="text-white/80">{weather.avgLowWinter}°F</span>
            </div>
            <div className="flex justify-between">
              <span>Annual Rainfall</span>
              <span className="text-white/80">{weather.avgAnnualRainfall}"</span>
            </div>
            <div className="flex justify-between">
              <span>Sunny Days</span>
              <span className="text-white/80">{weather.avgSunnyDays}/yr</span>
            </div>
            <div className="mt-1 text-white/40">{weather.climateType}</div>
          </div>
        </div>

        {/* Schools */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎓</span>
            <span className="text-sm font-medium text-white">Schools</span>
          </div>
          <div className="space-y-1 text-xs text-white/60">
            <div className="flex justify-between">
              <span>Avg Rating</span>
              <span className="text-white/80">{schools.rating}/10</span>
            </div>
            <div className="flex justify-between">
              <span>Total Schools</span>
              <span className="text-white/80">{formatNumber(schools.totalSchools)}</span>
            </div>
            <div className="flex justify-between">
              <span>Student:Teacher</span>
              <span className="text-white/80">{schools.studentTeacherRatio}:1</span>
            </div>
            <div className="mt-1 text-white/40">Top: {schools.topDistrict}</div>
          </div>
        </div>

        {/* Walkability */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚶</span>
            <span className="text-sm font-medium text-white">Walkability</span>
          </div>
          <div className="space-y-2 text-xs">
            {[
              { label: 'Walk Score', value: walkability.walkScore },
              { label: 'Transit Score', value: walkability.transitScore },
              { label: 'Bike Score', value: walkability.bikeScore },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-white/60 mb-1">
                  <span>{item.label}</span>
                  <span className="text-white/80">{item.value}/100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.value >= 70 ? '#22c55e' : item.value >= 40 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">👥</span>
            <span className="text-sm font-medium text-white">Demographics</span>
          </div>
          <div className="space-y-1 text-xs text-white/60">
            <div className="flex justify-between">
              <span>Population</span>
              <span className="text-white/80">{formatNumber(demographics.population)}</span>
            </div>
            <div className="flex justify-between">
              <span>Median Age</span>
              <span className="text-white/80">{demographics.medianAge}</span>
            </div>
            <div className="flex justify-between">
              <span>Median Income</span>
              <span className="text-white/80">${formatNumber(demographics.medianHouseholdIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cost of Living</span>
              <span className="text-white/80">{demographics.costOfLivingIndex} (100=avg)</span>
            </div>
            <div className="mt-2 text-white/40">
              Age groups: Under 18: {formatPercent(demographics.ageDistribution.under18, 0)} |
              18-34: {formatPercent(demographics.ageDistribution.age18to34, 0)} |
              35-54: {formatPercent(demographics.ageDistribution.age35to54, 0)} |
              55+: {formatPercent(demographics.ageDistribution.age55to74 + demographics.ageDistribution.age75plus, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Tax Summary */}
      <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-xs text-white/40 mb-1">Property Tax Rate</div>
          <div className="text-sm font-semibold text-white">{formatPercent(city.propertyTaxRate)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/40 mb-1">State Income Tax</div>
          <div className="text-sm font-semibold text-white">
            {city.stateTaxRate === 0 ? 'None' : formatPercent(city.stateTaxRate)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/40 mb-1">Sales Tax</div>
          <div className="text-sm font-semibold text-white">{formatPercent(city.salesTaxRate)}</div>
        </div>
      </div>
    </div>
  );
}
