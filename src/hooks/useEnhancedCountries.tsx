
import { useMemo } from 'react';
import { Country } from '@/types/quiz';
import countries from '@/data/countries';
import { getCategoriesForCountry } from '@/utils/countryCategories';

export const useEnhancedCountries = () => {
  const enhancedCountries = useMemo(() => {
    console.log('🌍 useEnhancedCountries: Processing countries...');
    console.log('🌍 Raw countries data:', countries);
    
    if (!countries || !Array.isArray(countries)) {
      console.error('🌍 useEnhancedCountries: Countries data is invalid:', countries);
      console.error('🌍 Countries type:', typeof countries);
      console.error('🌍 Countries length:', countries?.length);
      return [];
    }
    
    console.log('🌍 useEnhancedCountries: Found', countries.length, 'countries to process');
    
    const enhanced = countries.map((country, index) => {
      console.log(`🌍 Processing country ${index + 1}/${countries.length}:`, country.name);
      
      const categories = getCategoriesForCountry(country.name, country.continent);
      
      return {
        ...country,
        categories
      };
    });
    
    console.log('🌍 useEnhancedCountries: Successfully processed', enhanced.length, 'countries');
    console.log('🌍 Sample enhanced country:', enhanced[0]);
    
    return enhanced;
  }, []);

  console.log('🌍 useEnhancedCountries: Returning', enhancedCountries.length, 'enhanced countries');
  return enhancedCountries;
};
