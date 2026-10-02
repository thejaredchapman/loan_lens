import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      loanProductId: 'home',
      setLoanProduct: (id) => set({ loanProductId: id }),

      searchMode: 'property',
      setSearchMode: (mode) => set({ searchMode: mode }),

      selectedCityId: 'austin-tx',
      setSelectedCity: (cityId) => set({ selectedCityId: cityId }),

      propertyPrice: 350000,
      downPaymentPercent: 20,
      interestRate: 7.25,
      loanTerm: 30,
      setPropertyPrice: (val) => set({ propertyPrice: val }),
      setDownPaymentPercent: (val) => set({ downPaymentPercent: val }),
      setInterestRate: (val) => set({ interestRate: val }),
      setLoanTerm: (val) => set({ loanTerm: val }),

      annualSalary: 75000,
      dtiRatio: 28,
      setAnnualSalary: (val) => set({ annualSalary: val }),
      setDtiRatio: (val) => set({ dtiRatio: val }),
    }),
    {
      name: 'amortization-prefs-v2',
    }
  )
);
