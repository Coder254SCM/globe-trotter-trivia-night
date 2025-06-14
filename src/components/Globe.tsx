
import { useState, useEffect, useMemo, useCallback } from "react";
import { Country, DifficultyLevel } from "../types/quiz";
import { Enhanced3DGlobe } from "./globe/Enhanced3DGlobe";
import { CountryCard } from "./globe/CountryCard";
import { GlobeHeader } from "./globe/GlobeHeader";
import { GlobeFilters } from "./globe/GlobeFilters";
import { GlobeLegend } from "./globe/GlobeLegend";
import { GlobeSearch } from "./globe/GlobeSearch";
import { useCountryFilter } from "../hooks/useCountryFilter";
import { getQuestionStats } from "../utils/quiz/questionSets";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import countries from "@/data/countries";

interface GlobeProps {
  onCountrySelect: (country: Country) => void;
  onStartWeeklyChallenge?: () => void;
}

const Globe = ({ onCountrySelect, onStartWeeklyChallenge }: GlobeProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const isMobile = useIsMobile();
  
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

  // Handle country selection from enhanced globe
  const handleCountryClick = useCallback((countryId: string) => {
    const country = allCountries.find(c => c.id === countryId);
    if (country) {
      setSelectedCountry(country);
      toast({
        title: `🌍 ${country.name}`,
        description: `Ready to explore ${country.name}? Choose your quiz difficulty!`,
      });
    }
  }, [allCountries]);

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

  // Show comprehensive stats on component mount
  useEffect(() => {
    const stats = getQuestionStats();
    
    toast({
      title: "🌍 Enhanced Globe Explorer Ready!",
      description: `Professional 3D Earth with ${allCountries.length} countries and ${stats.totalQuestions} questions. Completely free!`,
    });
    
    console.log("🌍 Enhanced Globe Statistics:");
    console.log(`- Total Countries: ${allCountries.length}`);
    console.log(`- Countries with Questions: ${stats.countriesWithQuestions}`);
    console.log(`- Total Questions: ${stats.totalQuestions}`);
    console.log(`- Enhanced 3D Rendering: Active`);
  }, [allCountries.length]);

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-black ${isMobile ? 'touch-none' : ''}`}>
      {/* Enhanced 3D Globe */}
      <Enhanced3DGlobe onCountryClick={handleCountryClick} />
      
      <GlobeHeader 
        onToggleLabels={() => {}} // Enhanced globe doesn't use traditional labels
        onStartWeeklyChallenge={onStartWeeklyChallenge}
        showLabels={false}
      />
      
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
      
      {!isMobile && <GlobeLegend />}
      
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
