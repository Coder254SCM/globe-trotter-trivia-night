import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Country, Question } from "@/types/quiz";
import Quiz from "@/components/Quiz";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { getCleanQuizQuestions } from "@/utils/quiz/cleanQuestionFetcher";
import { useToast } from "@/hooks/use-toast";

export default function QuizPage() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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

    const loadQuizData = async () => {
      try {
        const storedCountry = sessionStorage.getItem('selectedCountry');
        const storedQuestionCount = sessionStorage.getItem('questionCount');
        
        if (!storedCountry) {
          toast({
            title: "No Country Selected",
            description: "Please choose a country to begin.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        const country = JSON.parse(storedCountry);
        const count = storedQuestionCount ? parseInt(storedQuestionCount) : 10;

        setSelectedCountry(country);
        setQuestionCount(count);

        console.log(`🎯 Loading ${count} clean questions for ${country.name} (id: ${country.id}) at difficulty ${country.difficulty}`);

        // Use clean question fetcher with the actual difficulty from the country object
        const questions = await getCleanQuizQuestions(
          country.id, 
          country.difficulty, 
          count
        );

        if (questions.length === 0) {
          console.warn(`❌ No validated questions found for country=${country.name}, id=${country.id}, difficulty=${country.difficulty}`);
          toast({
            title: "No Clean Questions Available",
            description: `No validated ${country.difficulty} questions found for ${country.name} (countryId: ${country.id}).\nTry a different country or check your question population.`,
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setQuizQuestions(questions);

        console.log(`✅ Loaded ${questions.length} clean ${country.difficulty} questions for ${country.name}`);
        scrollToTop();

      } catch (error) {
        console.error('Failed to load clean quiz questions:', error);
        toast({
          title: "Quiz Loading Error",
          description: "Failed to load clean questions. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
        setTimeout(scrollToTop, 100);
      }
    };

    loadQuizData();
  }, [navigate, toast]);

  const handleQuizComplete = (result: any) => {
    sessionStorage.setItem('quizResult', JSON.stringify(result));
    navigate('/quiz-results');
  };

  const handleBack = () => {
    sessionStorage.removeItem('selectedCountry');
    sessionStorage.removeItem('questionCount');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Clean Quiz...</h2>
          <p className="text-muted-foreground">
            Preparing {questionCount} validated questions for {selectedCountry?.name ?? "—"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Only high-quality questions are included
          </p>
        </div>
      </div>
    );
  }

  if (!selectedCountry || quizQuestions.length === 0) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50 min-h-screen">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold mb-2">Clean Quiz Not Available</h2>
          <p className="text-muted-foreground mb-1">
            {selectedCountry 
              ? `No validated "${selectedCountry.difficulty}" questions found for "${selectedCountry.name}" (countryId:${selectedCountry.id}).`
              : "No validated questions available for this selection."
            }
          </p>
          <p className="text-xs text-muted-foreground">
            Please try a different country, check your country population, or ensure questions exist at this difficulty.
          </p>
          <button onClick={handleBack} className="bg-primary text-primary-foreground px-4 py-2 rounded mt-3">
            Back to Countries
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Quiz
        country={selectedCountry}
        questions={quizQuestions}
        onFinish={handleQuizComplete}
        onBack={handleBack}
      />
    </ErrorBoundary>
  );
}
