import { useMemo } from 'react';
import { useStore } from './store/useStore';
import { useCityData } from './hooks/useCityData';
import { LOAN_PRODUCTS } from './data/loanProducts';
import { calculatePITI, generateAmortizationSchedule } from './utils/amortization';
import { calculateRequiredSalary, calculateMaxAffordablePrice } from './utils/affordability';

import DynamicBackground from './components/DynamicBackground';
import Navbar from './components/Navbar';
import LoanProductSelector from './components/LoanProductSelector';
import SearchModeToggle from './components/SearchModeToggle';
import PropertySearchForm from './components/PropertySearchForm';
import SalarySearchForm from './components/SalarySearchForm';
import AmortizationResults from './components/AmortizationResults';
import PaymentBreakdownChart from './components/PaymentBreakdownChart';
import AmortizationSchedule from './components/AmortizationSchedule';
import SalaryRequirement from './components/SalaryRequirement';
import AffordabilityResult from './components/AffordabilityResult';
import CityInfoPanel from './components/CityInfoPanel';
import JobListings from './components/JobListings';
import RealtorListings from './components/RealtorListings';
import Footer from './components/Footer';

export default function App() {
  const {
    loanProductId, searchMode, selectedCityId,
    propertyPrice, downPaymentPercent, interestRate, loanTerm,
    annualSalary, dtiRatio,
  } = useStore();

  const product = LOAN_PRODUCTS.find((p) => p.id === loanProductId);
  const { city, liveWeather, isEnriching } = useCityData(selectedCityId);

  // Property search mode calculations
  const piti = useMemo(() => {
    if (searchMode !== 'property' || !propertyPrice || propertyPrice <= 0) return null;
    return calculatePITI({
      propertyPrice,
      downPaymentPercent,
      annualRate: interestRate,
      termYears: loanTerm,
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  }, [searchMode, propertyPrice, downPaymentPercent, interestRate, loanTerm, city, product]);

  const schedule = useMemo(() => {
    if (!piti) return [];
    return generateAmortizationSchedule(piti.loanAmount, interestRate, loanTerm);
  }, [piti, interestRate, loanTerm]);

  const requiredSalary = useMemo(() => {
    if (!piti) return 0;
    return calculateRequiredSalary(piti.totalMonthly, product.maxDTI);
  }, [piti, product]);

  // Salary search mode calculations
  const maxAffordable = useMemo(() => {
    if (searchMode !== 'salary' || !annualSalary || annualSalary <= 0) return 0;
    return calculateMaxAffordablePrice({
      annualSalary,
      maxDTIPercent: dtiRatio,
      annualRate: interestRate,
      termYears: loanTerm,
      downPaymentPercent,
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  }, [searchMode, annualSalary, dtiRatio, interestRate, loanTerm, downPaymentPercent, city, product]);

  const salaryPiti = useMemo(() => {
    if (searchMode !== 'salary' || !maxAffordable || maxAffordable <= 0) return null;
    return calculatePITI({
      propertyPrice: maxAffordable,
      downPaymentPercent,
      annualRate: interestRate,
      termYears: loanTerm,
      annualPropertyTaxRate: city?.propertyTaxRate || 0,
      annualInsurance: city?.avgHomeInsuranceAnnual || 0,
      pmiRate: product.pmiRate || 0.5,
      includesTax: product.includesTax,
      includesInsurance: product.includesInsurance,
      includesPMI: product.includesPMI,
    });
  }, [searchMode, maxAffordable, downPaymentPercent, interestRate, loanTerm, city, product]);

  const salarySchedule = useMemo(() => {
    if (!salaryPiti) return [];
    return generateAmortizationSchedule(salaryPiti.loanAmount, interestRate, loanTerm);
  }, [salaryPiti, interestRate, loanTerm]);

  // Determine target salary and price for shared components
  const targetSalary = searchMode === 'property' ? requiredSalary : annualSalary;
  const targetPrice = searchMode === 'property' ? propertyPrice : maxAffordable;
  const activePiti = searchMode === 'property' ? piti : salaryPiti;
  const activeSchedule = searchMode === 'property' ? schedule : salarySchedule;

  const showCityInfo = product.id === 'home' && city;

  return (
    <div className="min-h-screen relative text-white">
      <DynamicBackground />
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <LoanProductSelector />
        <SearchModeToggle />

        {searchMode === 'property' ? <PropertySearchForm /> : <SalarySearchForm />}

        {searchMode === 'salary' && (
          <AffordabilityResult
            annualSalary={annualSalary}
            dtiRatio={dtiRatio}
            interestRate={interestRate}
            loanTerm={loanTerm}
            downPaymentPercent={downPaymentPercent}
            city={city}
            product={product}
          />
        )}

        {activePiti && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AmortizationResults piti={activePiti} product={product} />
              <PaymentBreakdownChart piti={activePiti} product={product} />
            </div>

            {searchMode === 'property' && (
              <SalaryRequirement totalMonthly={activePiti.totalMonthly} maxDTI={product.maxDTI} />
            )}

            <AmortizationSchedule schedule={activeSchedule} />
          </>
        )}

        {showCityInfo && (
          <CityInfoPanel city={city} liveWeather={liveWeather} isEnriching={isEnriching} />
        )}

        <JobListings targetSalary={targetSalary} />

        {showCityInfo && (
          <RealtorListings city={city} maxAffordablePrice={targetPrice} />
        )}
      </main>

      <Footer />
    </div>
  );
}
