
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
import { Country, QuestionCategory } from "@/types/quiz";

export default function Index() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showLabels, setShowLabels] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const { toast } = useToast();

  // Load countries from Supabase
  useEffect(() => {
    const loadCountries = async () => {
      try {
        console.log('🌍 Loading countries from Supabase...');
        const supabaseCountries = await QuizService.getAllCountries();
        console.log(`✅ Loaded ${supabaseCountries.length} countries from Supabase`);
        
        if (supabaseCountries.length === 0) {
          console.log('⚠️ No countries found in database. Populating now...');
          await QuizService.populateAllCountries();
          
          // Reload countries after population
          const newCountries = await QuizService.getAllCountries();
          setCountries(newCountries);
          
          toast({
            title: "Database Initialized",
            description: `Successfully populated ${newCountries.length} countries!`,
          });
        } else {
          setCountries(supabaseCountries);
        }
        
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

  const handleStartQuiz = async () => {
    if (selectedCountry) {
      try {
        // Load questions for the selected country
        const questions = await QuizService.getQuestions(
          selectedCountry.id, 
          selectedCountry.difficulty || 'medium', 
          10
        );
        
        if (questions.length === 0) {
          toast({
            title: "No Questions Available",
            description: `No questions found for ${selectedCountry.name}. Please generate questions first.`,
            variant: "destructive",
          });
          return;
        }
        
        setQuizQuestions(questions);
        setShowQuiz(true);
        setQuizResult(null);
      } catch (error) {
        console.error('Failed to load quiz questions:', error);
        toast({
          title: "Error",
          description: "Failed to load questions for this country.",
          variant: "destructive",
        });
      }
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

  const handleClearFilters = () => {
    setSelectedContinent("all");
    setSelectedCategory("all");
    setSearchTerm("");
  };

  // Get unique continents and categories from countries
  const availableContinents = Array.from(new Set(countries.map(c => c.continent))).sort();
  const allCategories = Array.from(new Set(countries.flatMap(c => c.categories || []))).sort();

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContinent = selectedContinent === "all" || country.continent === selectedContinent;
    const matchesCategory = selectedCategory === "all" || (country.categories && country.categories.includes(selectedCategory as QuestionCategory));
    
    return matchesSearch && matchesContinent && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Globe Trotter Trivia...</div>
      </div>
    );
  }

  if (showQuiz && selectedCountry && quizQuestions.length > 0) {
    return (
      <Quiz
        country={selectedCountry}
        questions={quizQuestions}
        onFinish={handleQuizComplete}
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
              onCountrySelect={handleCountryClick}
              onCountryFocus={() => {}}
            />
          </div>
          <div className="lg:w-80">
            <GlobeFilters
              availableContinents={availableContinents}
              allCategories={allCategories}
              selectedContinent={selectedContinent}
              selectedCategory={selectedCategory}
              filteredCountriesCount={filteredCountries.length}
              totalCountriesCount={countries.length}
              onContinentChange={setSelectedContinent}
              onCategoryChange={setSelectedCategory}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-300">
            Showing {filteredCountries.length} of {countries.length} countries
          </p>
        </div>

        <Globe
          onCountrySelect={handleCountryClick}
          onStartWeeklyChallenge={() => {}}
        />
      </div>
    </div>
  );
}
