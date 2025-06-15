
import { useMemo } from 'react';
import { Country } from '@/types/quiz';
import countries from '@/data/countries';
import { getCategoriesForCountry } from '@/utils/countryCategories';

export const useEnhancedCountries = () => {
  const enhancedCountries = useMemo(() => {
    console.log('🌍 useEnhancedCountries: Processing countries...');
    
    try {
      if (!countries || !Array.isArray(countries)) {
        console.error('🌍 useEnhancedCountries: Countries data is invalid:', countries);
        return [];
      }
      
      const enhanced = countries.map(country => {
        try {
          const categories = getCategoriesForCountry(country.name, country.continent);
          return {
            ...country,
            categories
          };
        } catch (error) {
          console.error('🌍 useEnhancedCountries: Error processing country:', country.name, error);
          return {
            ...country,
            categories: ['Geography', 'History'] // fallback categories
          };
        }
      });
      
      console.log('🌍 useEnhancedCountries: Successfully processed', enhanced.length, 'countries');
      return enhanced;
    } catch (error) {
      console.error('🌍 useEnhancedCountries: Critical error:', error);
      return [];
    }
  }, []);

  return enhancedCountries;
};
