
import { useState, useEffect } from "react";
import { Country, QuestionCategory } from "@/types/quiz";

interface UseCountryFilterProps {
  allCountries: Country[];
}

export const useCountryFilter = ({ allCountries }: UseCountryFilterProps) => {
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | null>(null);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(allCountries);
  
  // Extract unique continents
  const availableContinents = Array.from(new Set(allCountries.map(country => country.continent)));
  
  // Extract unique categories
  const allCategories = Array.from(
    new Set(allCountries.flatMap(country => country.categories))
  );
  
  // Apply filters when continent or category changes
  useEffect(() => {
    let filtered = [...allCountries];
    
    if (selectedContinent) {
      filtered = filtered.filter(c => c.continent === selectedContinent);
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(c => c.categories.includes(selectedCategory));
    }
    
    setFilteredCountries(filtered);
  }, [selectedContinent, selectedCategory, allCountries]);

  const handleContinentChange = (value: string) => {
    if (value === "all") {
      setSelectedContinent(null);
    } else {
      setSelectedContinent(value);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(value as QuestionCategory);
    }
  };

  const clearFilters = () => {
    setSelectedContinent(null);
    setSelectedCategory(null);
  };

  return {
    selectedContinent,
    selectedCategory,
    filteredCountries,
    availableContinents,
    allCategories,
    handleContinentChange,
    handleCategoryChange,
    clearFilters
  };
};
