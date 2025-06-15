
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Country } from "@/types/quiz";
import { QuizSettings as QuizSettingsComponent } from "@/components/quiz/QuizSettings";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function QuizSettingsPage() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // FORCE scroll to top immediately
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    scrollToTop();
    setTimeout(scrollToTop, 0);
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    setTimeout(scrollToTop, 100);

    // Get the selected country from sessionStorage
    const storedCountry = sessionStorage.getItem('selectedCountry');
    if (storedCountry) {
      console.log('[QuizSettings] Read from sessionStorage:', storedCountry);
      setSelectedCountry(JSON.parse(storedCountry));
    } else {
      // If no country is stored, redirect back to home
      navigate('/');
    }
  }, [navigate]);

  const handleStartQuiz = (questionCount: number) => {
    if (selectedCountry) {
      // Store the question count and navigate to quiz
      sessionStorage.setItem('questionCount', questionCount.toString());
      // Log for troubleshooting
      console.log('[QuizSettings] Starting quiz for:', selectedCountry.name, '| Difficulty:', selectedCountry.difficulty, '| Question Count:', questionCount);
      navigate('/quiz');
    }
  };

  const handleBack = () => {
    // Clear stored country and go back to home
    sessionStorage.removeItem('selectedCountry');
    navigate('/');
  };

  if (!selectedCountry) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Setting up your quiz</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 pt-6">
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Countries
          </Button>
        </div>
        
        <QuizSettingsComponent
          countryName={selectedCountry.name}
          countryId={selectedCountry.id}
          onStartQuiz={handleStartQuiz}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}
