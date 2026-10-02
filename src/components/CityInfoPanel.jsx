import { formatNumber, formatPercent } from '../utils/formatters';

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 border-b border-rule text-sm">
      <dt className="text-muted">{k}</dt>
      <dd className="num text-right">{v}</dd>
    </div>
  );
}

function Block({ title, children }) {
  return (
    <div>
      <h4 className="display text-xl font-semibold mb-2 pb-1 border-b-2 border-ink">{title}</h4>
      {children}
    </div>
  );
}

export default function CityInfoPanel({ city, liveWeather, isEnriching }) {
  if (!city) return null;

  const { weather, schools, walkability, demographics } = city;
  const scoreColor = (v) => (v >= 70 ? '#2f7d5f' : v >= 40 ? '#e0a526' : '#b3261e');

  return (
    <section className="panel">
      <h3 className="kicker mb-1">City profile</h3>
      <p className="display text-4xl font-extrabold mb-6">{city.name}, {city.state}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-8">
        <Block title="Weather">
          {isEnriching && <p className="text-xs text-muted animate-pulse">updating…</p>}
          {liveWeather && (
            <p className="num text-xs mb-1 px-2 py-1 bg-[var(--accent-soft)]">Now {liveWeather.currentTemp}°F · wind {liveWeather.windSpeed} mph</p>
          )}
          <dl>
            <Row k="Summer high" v={`${weather.avgHighSummer}°F`} />
            <Row k="Winter low" v={`${weather.avgLowWinter}°F`} />
            <Row k="Rainfall" v={`${weather.avgAnnualRainfall}"`} />
            <Row k="Sunny days" v={`${weather.avgSunnyDays}/yr`} />
          </dl>
          <p className="text-xs text-muted italic mt-2">{weather.climateType}</p>
        </Block>

        <Block title="Schools">
          <dl>
            <Row k="Avg rating" v={`${schools.rating}/10`} />
            <Row k="Total schools" v={formatNumber(schools.totalSchools)} />
            <Row k="Student:teacher" v={`${schools.studentTeacherRatio}:1`} />
          </dl>
          <p className="text-xs text-muted italic mt-2">Top: {schools.topDistrict}</p>
        </Block>

        <Block title="Getting around">
          <div className="space-y-3 pt-1">
            {[
              ['Walk', walkability.walkScore],
              ['Transit', walkability.transitScore],
              ['Bike', walkability.bikeScore],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted">{label}</span>
                  <span className="num">{value}</span>
                </div>
                <div className="h-2 bg-rule/60" role="meter" aria-label={`${label} score`} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full transition-all duration-500" style={{ width: `${value}%`, background: scoreColor(value) }} />
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="People">
          <dl>
            <Row k="Population" v={formatNumber(demographics.population)} />
            <Row k="Median age" v={demographics.medianAge} />
            <Row k="Median income" v={`$${formatNumber(demographics.medianHouseholdIncome)}`} />
            <Row k="Cost of living" v={demographics.costOfLivingIndex} />
          </dl>
          <p className="text-xs text-muted mt-2">
            &lt;18 {formatPercent(demographics.ageDistribution.under18, 0)} · 18–34 {formatPercent(demographics.ageDistribution.age18to34, 0)} · 35–54 {formatPercent(demographics.ageDistribution.age35to54, 0)} · 55+ {formatPercent(demographics.ageDistribution.age55to74 + demographics.ageDistribution.age75plus, 0)}
          </p>
        </Block>
      </div>

      <dl className="mt-8 grid grid-cols-3 border-[1.5px] border-ink text-center">
        {[
          ['Property tax', formatPercent(city.propertyTaxRate)],
          ['State income tax', city.stateTaxRate === 0 ? 'None' : formatPercent(city.stateTaxRate)],
          ['Sales tax', formatPercent(city.salesTaxRate)],
        ].map(([k, v], i) => (
          <div key={k} className={`py-3 ${i > 0 ? 'border-l-[1.5px] border-ink' : ''}`}>
            <dt className="field-label !mb-1">{k}</dt>
            <dd className="num text-lg font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
