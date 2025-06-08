
import { useState, useEffect } from "react";
import Globe from "@/components/Globe";
import Quiz from "@/components/Quiz";
import QuizResult from "@/components/QuizResult";
import { GlobeFilters } from "@/components/globe/GlobeFilters";
import { GlobeSearch } from "@/components/globe/GlobeSearch";
import { GlobeHeader } from "@/components/globe/GlobeHeader";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { QuizService } from "@/services/supabase/quizService";
import { Country } from "@/services/supabase/quizService";

export default function Index() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [showLabels, setShowLabels] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load countries from Supabase
  useEffect(() => {
    const loadCountries = async () => {
      try {
        console.log('🌍 Loading countries from Supabase...');
        const supabaseCountries = await QuizService.getAllCountries();
        console.log(`✅ Loaded ${supabaseCountries.length} countries from Supabase`);
        setCountries(supabaseCountries);
      } catch (error) {
        console.error('❌ Failed to load countries from Supabase:', error);
        toast({
          title: "Error",
          description: "Failed to load countries. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, [toast]);

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
    setShowQuiz(false);
    setQuizResult(null);
  };

  const handleStartQuiz = () => {
    if (selectedCountry) {
      setShowQuiz(true);
      setQuizResult(null);
    }
  };

  const handleQuizComplete = (result: any) => {
    setQuizResult(result);
    setShowQuiz(false);
  };

  const handleBackToGlobe = () => {
    setSelectedCountry(null);
    setShowQuiz(false);
    setQuizResult(null);
  };

  const handleRetryQuiz = () => {
    setQuizResult(null);
    setShowQuiz(true);
  };

  const handleToggleLabels = () => {
    setShowLabels(!showLabels);
  };

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContinent = !selectedContinent || country.continent === selectedContinent;
    
    return matchesSearch && matchesContinent;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Globe Trotter Trivia...</div>
      </div>
    );
  }

  if (showQuiz && selectedCountry) {
    return (
      <Quiz
        country={selectedCountry}
        onComplete={handleQuizComplete}
        onBack={handleBackToGlobe}
      />
    );
  }

  if (quizResult) {
    return (
      <QuizResult
        result={quizResult}
        countryName={selectedCountry?.name || "Unknown"}
        onRestart={handleRetryQuiz}
        onBackToGlobe={handleBackToGlobe}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          onClick={() => window.location.href = '/admin'}
          variant="outline"
          size="sm"
        >
          Admin
        </Button>
        <ThemeToggle />
      </div>
      
      <GlobeHeader 
        onToggleLabels={handleToggleLabels}
        showLabels={showLabels}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="flex-1">
            <GlobeSearch 
              value={searchTerm} 
              onChange={setSearchTerm} 
            />
          </div>
          <div className="lg:w-80">
            <GlobeFilters
              selectedContinent={selectedContinent}
              onContinentChange={setSelectedContinent}
            />
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-300">
            Showing {filteredCountries.length} of {countries.length} countries
          </p>
        </div>

        <Globe
          countries={filteredCountries}
          onCountryClick={handleCountryClick}
          selectedCountry={selectedCountry}
          onStartQuiz={handleStartQuiz}
        />
      </div>
    </div>
  );
}
