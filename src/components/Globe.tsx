
import { useState, useEffect, useMemo, useCallback } from "react";
import { Country, DifficultyLevel } from "../types/quiz";
import { StarsBackground } from "./globe/StarsBackground";
import { CountryCard } from "./globe/CountryCard";
import { GlobeHeader } from "./globe/GlobeHeader";
import { GlobeFilters } from "./globe/GlobeFilters";
import { GlobeLegend } from "./globe/GlobeLegend";
import { GlobeSearch } from "./globe/GlobeSearch";
import { useGlobe } from "../hooks/useGlobe";
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
  const [rotating, setRotating] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
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

  // Handle country selection (intercept to stop rotation)
  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setRotating(false);
  }, []);

  // Custom hook for globe setup and interaction
  const { containerRef, zoomToContinent, focusCountry } = useGlobe({
    filteredCountries,
    showLabels: isMobile ? false : showLabels, // Disable labels on mobile for performance
    rotating: isMobile ? false : rotating, // Disable auto-rotation on mobile
    onCountrySelect: handleCountrySelect
  });

  // Enhanced continent change handler to include zooming
  const handleEnhancedContinentChange = useCallback((value: string) => {
    handleContinentChange(value);
    if (value !== "all") {
      zoomToContinent(value);
      setRotating(false);
    } else {
      setRotating(!isMobile); // Only rotate on desktop
    }
  }, [handleContinentChange, zoomToContinent, isMobile]);

  // Enhanced filter clearing that restores rotation
  const handleClearFilters = useCallback(() => {
    clearFilters();
    setRotating(!isMobile); // Only rotate on desktop
  }, [clearFilters, isMobile]);

  const toggleLabels = useCallback(() => {
    if (!isMobile) { // Only allow label toggle on desktop
      setShowLabels(!showLabels);
    }
  }, [showLabels, isMobile]);

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
    setRotating(!isMobile); // Only rotate on desktop
  }, [isMobile]);

  // Focus on a specific country by ID (for search)
  const handleCountryFocus = useCallback((countryId: string) => {
    const country = allCountries.find(c => c.id === countryId);
    if (country) {
      focusCountry(country);
      setRotating(false);
      // Auto-select the country after focus
      setTimeout(() => {
        setSelectedCountry(country);
      }, isMobile ? 500 : 1000); // Faster on mobile
    }
  }, [allCountries, focusCountry, isMobile]);

  // Show comprehensive stats on component mount
  useEffect(() => {
    const stats = getQuestionStats();
    
    toast({
      title: "🌍 Global Quiz Explorer Ready!",
      description: `All ${allCountries.length} countries loaded with ${stats.totalQuestions} questions. Every country is now playable!`,
    });
    
    console.log("🌍 Globe Statistics:");
    console.log(`- Total Countries: ${allCountries.length}`);
    console.log(`- Countries with Questions: ${stats.countriesWithQuestions}`);
    console.log(`- Total Questions: ${stats.totalQuestions}`);
    console.log(`- Average Questions per Country: ${stats.averageQuestionsPerCountry.toFixed(1)}`);
  }, [allCountries.length]);

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-black ${isMobile ? 'touch-none' : ''}`}>
      <div ref={containerRef} className="globe-container w-full h-full">
        {!isMobile && <StarsBackground containerRef={containerRef} />}
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
        totalCountriesCount={allCountries.length}
        onContinentChange={handleEnhancedContinentChange}
        onCategoryChange={handleCategoryChange}
        onClearFilters={handleClearFilters}
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
