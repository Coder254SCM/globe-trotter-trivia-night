
import { useState, useEffect, useMemo, useCallback } from "react";
import { Country, DifficultyLevel } from "../types/quiz";
import { CountryCard } from "./globe/CountryCard";
import { GlobeHeader } from "./globe/GlobeHeader";
import { GlobeFilters } from "./globe/GlobeFilters";
import { GlobeSearch } from "./globe/GlobeSearch";
import { CountryGrid } from "./globe/CountryGrid";
import { useCountryFilter } from "../hooks/useCountryFilter";
import { getQuestionStats } from "../utils/quiz/questionSets";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import countries from "@/data/countries";

interface GlobeProps {
  onCountrySelect: (country: Country) => void;
  onStartWeeklyChallenge?: () => void;
}

const Globe = ({ onCountrySelect, onStartWeeklyChallenge }: GlobeProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Use static countries data - all 195 countries
  const allCountries = useMemo(() => countries, []);
  
  // Custom hooks for country filtering
  const {
    selectedContinent,
    selectedCategory,
    filteredCountries,
    availableContinents,
    allCategories,
    handleContinentChange,
    handleCategoryChange,
    clearFilters
  } = useCountryFilter({ allCountries });

  // Handle country selection from grid
  function handleCountryClick(country: Country) {
    setSelectedCountry(country);
    toast({
      title: `🌍 ${country.name}`,
      description: `Ready to explore ${country.name}? Choose your quiz difficulty!`,
    });
  }

  const handleStartQuiz = useCallback((difficulty: string) => {
    if (selectedCountry) {
      const countryWithDifficulty = {
        ...selectedCountry,
        difficulty: difficulty as DifficultyLevel
      };
      onCountrySelect(countryWithDifficulty);
    }
  }, [selectedCountry, onCountrySelect]);

  const handleCloseCard = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  // Focus on a specific country by ID (for search)
  const handleCountryFocus = useCallback((countryId: string) => {
    const country = allCountries.find(c => c.id === countryId);
    if (country) {
      setSelectedCountry(country);
      toast({
        title: country.name,
        description: `Focused on ${country.name}. Click to start a quiz!`
      });
    }
  }, [allCountries]);

  // Handle weekly challenge navigation
  const handleWeeklyChallengeClick = useCallback(() => {
    navigate('/weekly-challenges');
  }, [navigate]);

  // Show comprehensive stats on component mount
  useEffect(() => {
    const stats = getQuestionStats();
    
    toast({
      title: "🌍 Country Explorer Ready!",
      description: `Interactive country cards with ${allCountries.length} countries and ${stats.totalQuestions} questions. Click any country to start!`,
    });
    
    console.log("🌍 Country Grid Statistics:");
    console.log(`- Total Countries: ${allCountries.length}`);
    console.log(`- Countries with Questions: ${stats.countriesWithQuestions}`);
    console.log(`- Total Questions: ${stats.totalQuestions}`);
  }, [allCountries.length]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/20 ${isMobile ? 'touch-none' : ''}`}>
      <GlobeHeader 
        onToggleLabels={() => {}} // Not needed for card view
        onStartWeeklyChallenge={handleWeeklyChallengeClick}
        showLabels={false}
      />
      
      <div className="pt-20">
        <GlobeSearch 
          onCountrySelect={setSelectedCountry}
          onCountryFocus={handleCountryFocus}
        />
        
        <GlobeFilters
          availableContinents={availableContinents}
          allCategories={allCategories}
          selectedContinent={selectedContinent}
          selectedCategory={selectedCategory}
          filteredCountriesCount={filteredCountries.length}
          totalCountriesCount={allCountries.length}
          onContinentChange={handleContinentChange}
          onCategoryChange={handleCategoryChange}
          onClearFilters={clearFilters}
        />
        
        <CountryGrid
          countries={filteredCountries}
          onCountrySelect={handleCountryClick}
          selectedContinent={selectedContinent}
          selectedCategory={selectedCategory}
        />
      </div>
      
      {selectedCountry && (
        <CountryCard
          country={selectedCountry}
          onClose={handleCloseCard}
          onStartQuiz={handleStartQuiz}
        />
      )}
    </div>
  );
};

export default Globe;
