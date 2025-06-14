
import { useMemo } from 'react';
import { Country } from '@/types/quiz';
import countries from '@/data/countries';
import { getCategoriesForCountry } from '@/utils/countryCategories';

export const useEnhancedCountries = () => {
  const enhancedCountries = useMemo(() => {
    return countries.map(country => ({
      ...country,
      categories: getCategoriesForCountry(country.name, country.continent)
    }));
  }, []);

  return enhancedCountries;
};
