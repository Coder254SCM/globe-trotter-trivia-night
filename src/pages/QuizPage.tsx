
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

        console.log(`[QuizPage] Loading ${count} questions for ${country.name} (id: ${country.id}) at difficulty "${country.difficulty}"`);
        
        // Use clean question fetcher with enhanced fallbacks
        const questions = await getCleanQuizQuestions(
          country.id, 
          country.difficulty, 
          count
        );

        console.log(`[QuizPage] Loaded ${questions.length} questions from fetcher`);

        if (questions.length === 0) {
          console.warn(`[QuizPage] ❌ No questions found for country=${country.name}, id=${country.id}, difficulty=${country.difficulty}`);
          toast({
            title: "No Questions Available",
            description: `No questions found for ${country.name}. The automatic generation may still be running. Please wait a moment and try again, or select a different country.`,
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setQuizQuestions(questions);

        console.log(`[QuizPage] ✅ Successfully loaded ${questions.length} questions for ${country.name}`);
        scrollToTop();

      } catch (error) {
        console.error('[QuizPage] Failed to load quiz questions:', error);
        toast({
          title: "Quiz Loading Error",
          description: "Failed to load questions. Please try again or select a different country.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }, 100);
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
          <h2 className="text-xl font-semibold mb-2">Loading Quiz...</h2>
          <p className="text-muted-foreground">
            Preparing {questionCount} questions for {selectedCountry?.name ?? "—"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            If this is your first time, questions are being generated automatically
          </p>
        </div>
      </div>
    );
  }

  if (!selectedCountry || quizQuestions.length === 0) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50 min-h-screen">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold mb-2">No Quiz Questions Available</h2>
          <p className="text-muted-foreground mb-1">
            {selectedCountry 
              ? `No questions found for "${selectedCountry.name}" at "${selectedCountry.difficulty}" difficulty.`
              : "No questions available for this selection."
            }
          </p>
          <p className="text-xs text-muted-foreground">
            Questions may still be generating in the background. Please wait a moment and try again.
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
