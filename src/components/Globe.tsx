
import { useState, useEffect, useMemo, useCallback } from "react";
import { Country, DifficultyLevel } from "../types/quiz";
import { useGlobe } from "../hooks/useGlobe";
import { CountryCard } from "./globe/CountryCard";
import { GlobeHeader } from "./globe/GlobeHeader";
import { GlobeFilters } from "./globe/GlobeFilters";
import { GlobeLegend } from "./globe/GlobeLegend";
import { GlobeSearch } from "./globe/GlobeSearch";
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
  const [showLabels, setShowLabels] = useState(false);
  const [rotating, setRotating] = useState(true);
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

  // Use the original globe hook with proper functionality
  const { containerRef, zoomToContinent, focusCountry } = useGlobe({
    filteredCountries,
    showLabels,
    rotating,
    onCountrySelect: handleCountryClick
  });

  // Handle country selection from globe
  function handleCountryClick(country: Country) {
    setSelectedCountry(country);
    setRotating(false); // Stop rotation when country is selected
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
    setRotating(true); // Resume rotation when card is closed
  }, []);

  // Focus on a specific country by ID (for search)
  const handleCountryFocus = useCallback((countryId: string) => {
    const country = allCountries.find(c => c.id === countryId);
    if (country) {
      setSelectedCountry(country);
      focusCountry(country);
      setRotating(false);
      toast({
        title: country.name,
        description: `Focused on ${country.name}. Click to start a quiz!`
      });
    }
  }, [allCountries, focusCountry]);

  // Handle weekly challenge navigation
  const handleWeeklyChallengeClick = useCallback(() => {
    navigate('/weekly-challenges');
  }, [navigate]);

  // Toggle labels
  const handleToggleLabels = useCallback(() => {
    setShowLabels(prev => !prev);
    toast({
      title: showLabels ? "Labels Hidden" : "Labels Shown", 
      description: showLabels ? "Country labels are now hidden" : "Country labels are now visible"
    });
  }, [showLabels]);

  // Show comprehensive stats on component mount
  useEffect(() => {
    const stats = getQuestionStats();
    
    toast({
      title: "🌍 Globe Explorer Ready!",
      description: `Interactive 3D Earth with ${allCountries.length} countries and ${stats.totalQuestions} questions. Click any country to start!`,
    });
    
    console.log("🌍 Globe Statistics:");
    console.log(`- Total Countries: ${allCountries.length}`);
    console.log(`- Countries with Questions: ${stats.countriesWithQuestions}`);
    console.log(`- Total Questions: ${stats.totalQuestions}`);
  }, [allCountries.length]);

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-black ${isMobile ? 'touch-none' : ''}`}>
      {/* 3D Globe Container */}
      <div ref={containerRef} className="w-full h-full" />
      
      <GlobeHeader 
        onToggleLabels={handleToggleLabels}
        onStartWeeklyChallenge={handleWeeklyChallengeClick}
        showLabels={showLabels}
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
