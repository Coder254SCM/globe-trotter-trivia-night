
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
    // Get the selected country from sessionStorage
    const storedCountry = sessionStorage.getItem('selectedCountry');
    if (storedCountry) {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Setting up your quiz</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
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
