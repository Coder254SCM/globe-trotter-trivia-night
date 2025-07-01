
import { useMemo } from 'react';
import { Country } from '@/types/quiz';

export const useAlphabeticalCountries = (countries: Country[]) => {
  const sortedCountries = useMemo(() => {
    if (!countries || !Array.isArray(countries)) {
      return [];
    }
    
    return [...countries].sort((a, b) => {
      return a.name.localeCompare(b.name, 'en', { 
        sensitivity: 'base',
        numeric: true 
      });
    });
  }, [countries]);

  return sortedCountries;
};
