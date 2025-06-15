
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
    // AGGRESSIVE scroll to top - multiple methods to ensure it works
    const forceScrollToTop = () => {
      // Method 1: Direct scroll
      window.scrollTo(0, 0);
      
      // Method 2: Document element scroll
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      
      // Method 3: Body scroll
      if (document.body) {
        document.body.scrollTop = 0;
      }
      
      // Method 4: Scrolling element
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
    };
    
    // Execute immediately
    forceScrollToTop();
    
    // Execute after a brief delay to handle any layout shifts
    setTimeout(forceScrollToTop, 0);
    setTimeout(forceScrollToTop, 50);
    setTimeout(forceScrollToTop, 100);

    const loadQuizData = async () => {
      try {
        const storedCountry = sessionStorage.getItem('selectedCountry');
        const storedQuestionCount = sessionStorage.getItem('questionCount');
        
        if (!storedCountry) {
          navigate('/');
          return;
        }

        const country = JSON.parse(storedCountry);
        const count = storedQuestionCount ? parseInt(storedQuestionCount) : 10;
        
        setSelectedCountry(country);
        setQuestionCount(count);

        console.log(`🎯 Loading ${count} clean questions for ${country.name}`);
        
        // Force medium/hard difficulties only - NO EASY QUESTIONS
        let validDifficulty = country.difficulty;
        if (validDifficulty === 'easy') {
          console.warn('❌ Easy difficulty blocked - using medium instead');
          validDifficulty = 'medium';
        }
        
        // Ensure only medium or hard
        if (validDifficulty !== 'medium' && validDifficulty !== 'hard') {
          validDifficulty = 'medium';
        }

        // Use clean question fetcher
        const questions = await getCleanQuizQuestions(
          country.id, 
          validDifficulty, 
          count
        );
        
        if (questions.length === 0) {
          toast({
            title: "No Clean Questions Available",
            description: `No validated ${validDifficulty} questions found for ${country.name}. Please try another country or check back later.`,
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        setQuizQuestions(questions);
        
        console.log(`✅ Loaded ${questions.length} clean ${validDifficulty} questions for ${country.name}`);
        
        // Final scroll to top after questions are loaded
        forceScrollToTop();
        
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
        // Ensure scroll to top even after loading is complete
        setTimeout(forceScrollToTop, 100);
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
      <div className="min-h-screen flex items-center justify-center bg-background" style={{ paddingTop: 0, marginTop: 0 }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Clean Quiz...</h2>
          <p className="text-muted-foreground">
            Preparing {questionCount} validated questions for {selectedCountry?.name}
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
      <div className="min-h-screen flex items-center justify-center bg-background" style={{ paddingTop: 0, marginTop: 0 }}>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Clean Quiz Not Available</h2>
          <p className="text-muted-foreground mb-4">
            No validated questions available for this selection.
          </p>
          <button onClick={handleBack} className="bg-primary text-primary-foreground px-4 py-2 rounded">
            Back to Countries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 0, marginTop: 0, overflow: 'hidden auto' }}>
      <ErrorBoundary>
        <Quiz
          country={selectedCountry}
          questions={quizQuestions}
          onFinish={handleQuizComplete}
          onBack={handleBack}
        />
      </ErrorBoundary>
    </div>
  );
}
