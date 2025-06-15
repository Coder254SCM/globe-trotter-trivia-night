
import { useState, useEffect } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useNavigate } from "react-router-dom";
import { Country } from "@/types/quiz";
import React, { Suspense } from "react";

// Lazy load only the components needed for the main page
const Globe = React.lazy(() => import("@/components/Globe"));
const MainLayout = React.lazy(() => import("@/components/layout/MainLayout").then(module => ({ default: module.MainLayout })));
const AppHeader = React.lazy(() => import("@/components/layout/AppHeader").then(module => ({ default: module.AppHeader })));

// Import hooks
import { useEnhancedCountries } from "@/hooks/useEnhancedCountries";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

function IndexContent() {
  console.log('🔄 Index component loading...');
  
  const navigate = useNavigate();
  
  // Load enhanced countries
  const allCountries = useEnhancedCountries();
  console.log('🔄 Countries loaded:', allCountries?.length || 0);

  useEffect(() => {
    console.log('🔄 Index component mounted successfully');
    console.log('🔄 Countries loaded:', allCountries?.length || 0);
  }, [allCountries]);

  const handleCountrySelectFromGlobe = (country: Country) => {
    console.log('🎯 Index: Country selected from Globe:', country.name, 'difficulty:', country.difficulty);
    // Store the selected country and navigate to quiz settings
    sessionStorage.setItem('selectedCountry', JSON.stringify(country));
    navigate('/quiz-settings');
  };

  const handleStartWeeklyChallenge = () => {
    console.log('🔄 Navigating to weekly challenges');
    navigate('/weekly-challenges');
  };

  console.log('🔄 Index component rendering main globe view');
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MainLayout>
        <AppHeader 
          countriesCount={allCountries?.length || 0} 
          isGeneratingQuestions={false}
        />
        
        <Globe
          onCountrySelect={handleCountrySelectFromGlobe}
          onStartWeeklyChallenge={handleStartWeeklyChallenge}
        />
      </MainLayout>
    </Suspense>
  );
}

export default function Index() {
  return (
    <ErrorBoundary>
      <IndexContent />
    </ErrorBoundary>
  );
}
