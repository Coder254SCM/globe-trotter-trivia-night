
import { useState, useEffect } from "react";
import { Country, DifficultyLevel } from "../types/quiz";
import { StarsBackground } from "./globe/StarsBackground";
import { CountryCard } from "./globe/CountryCard";
import { GlobeHeader } from "./globe/GlobeHeader";
import { GlobeFilters } from "./globe/GlobeFilters";
import { GlobeLegend } from "./globe/GlobeLegend";
import { GlobeSearch } from "./globe/GlobeSearch";
import { useGlobe } from "../hooks/useGlobe";
import { useCountryFilter } from "../hooks/useCountryFilter";
import countries from "../data/countries";
import { getQuestionStats } from "../utils/quiz/questionSets";
import { toast } from "@/components/ui/use-toast";

interface GlobeProps {
  onCountrySelect: (country: Country) => void;
  onStartWeeklyChallenge?: () => void;
}

const Globe = ({ onCountrySelect, onStartWeeklyChallenge }: GlobeProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [rotating, setRotating] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  
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
  } = useCountryFilter({ allCountries: countries });

  // Handle country selection (intercept to stop rotation)
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setRotating(false);
  };

  // Custom hook for globe setup and interaction
  const { containerRef, zoomToContinent, focusCountry } = useGlobe({
    filteredCountries,
    showLabels,
    rotating,
    onCountrySelect: handleCountrySelect
  });

  // Enhanced continent change handler to include zooming
  const handleEnhancedContinentChange = (value: string) => {
    handleContinentChange(value);
    if (value !== "all") {
      zoomToContinent(value);
      setRotating(false);
    } else {
      setRotating(true);
    }
  };

  // Enhanced filter clearing that restores rotation
  const handleClearFilters = () => {
    clearFilters();
    setRotating(true);
  };

  const toggleLabels = () => {
    setShowLabels(!showLabels);
  };

  const handleStartQuiz = (difficulty: string) => {
    if (selectedCountry) {
      // Fix the type issue by explicitly using a DifficultyLevel type cast
      const countryWithDifficulty = {
        ...selectedCountry,
        difficulty: difficulty as DifficultyLevel
      };
      onCountrySelect(countryWithDifficulty);
    }
  };

  const handleCloseCard = () => {
    setSelectedCountry(null);
    setRotating(true);
  };

  // Focus on a specific country by ID (for search)
  const handleCountryFocus = (countryId: string) => {
    const country = countries.find(c => c.id === countryId);
    if (country) {
      focusCountry(country);
      setRotating(false);
      // Auto-select the country after focus
      setTimeout(() => {
        setSelectedCountry(country);
      }, 1000);
    }
  };

  // Show comprehensive stats on component mount
  useEffect(() => {
    const stats = getQuestionStats();
    
    toast({
      title: "🌍 Global Quiz Explorer Ready!",
      description: `All ${stats.totalCountries} countries loaded with ${stats.totalQuestions} questions. Every country is now playable!`,
    });
    
    console.log("🌍 Globe Statistics:");
    console.log(`- Total Countries: ${stats.totalCountries}`);
    console.log(`- Countries with Questions: ${stats.countriesWithQuestions}`);
    console.log(`- Total Questions: ${stats.totalQuestions}`);
    console.log(`- Average Questions per Country: ${stats.averageQuestionsPerCountry.toFixed(1)}`);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-black">
      <div ref={containerRef} className="globe-container w-full h-full">
        <StarsBackground containerRef={containerRef} />
      </div>
      
      <GlobeHeader 
        onToggleLabels={toggleLabels}
        onStartWeeklyChallenge={onStartWeeklyChallenge}
        showLabels={showLabels}
      />
      
      <GlobeSearch 
        onCountrySelect={handleCountrySelect}
        onCountryFocus={handleCountryFocus}
      />
      
      <GlobeFilters
        availableContinents={availableContinents}
        allCategories={allCategories}
        selectedContinent={selectedContinent}
        selectedCategory={selectedCategory}
        filteredCountriesCount={filteredCountries.length}
        totalCountriesCount={countries.length}
        onContinentChange={handleEnhancedContinentChange}
        onCategoryChange={handleCategoryChange}
        onClearFilters={handleClearFilters}
      />
      
      <GlobeLegend />
      
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
