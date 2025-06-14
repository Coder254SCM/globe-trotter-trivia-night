
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Country, Question } from "@/types/quiz";
import Quiz from "@/components/Quiz";
import { RotationService } from "@/services/supabase/rotationService";
import { QuestionService } from "@/services/supabase/questionService";
import { useToast } from "@/hooks/use-toast";

export default function QuizPage() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Force scroll to top immediately when component mounts
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const loadQuizData = async () => {
      try {
        // Get stored data
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

        console.log(`🎯 Loading ${count} questions for ${country.name} with difficulty ${country.difficulty}`);
        
        // Force medium/hard difficulties only - no easy questions allowed
        let validDifficulty = country.difficulty;
        if (validDifficulty === 'easy') {
          console.warn('❌ Easy difficulty requested but not available - using medium instead');
          validDifficulty = 'medium';
        }
        
        // Ensure only medium or hard
        if (validDifficulty !== 'medium' && validDifficulty !== 'hard') {
          validDifficulty = 'medium';
        }

        // Use rotation service to get current month questions (medium/hard only)
        const questions = await RotationService.getCurrentMonthQuestions(
          country.id, 
          validDifficulty, 
          count
        );
        
        if (questions.length === 0) {
          toast({
            title: "No Questions Available",
            description: `No ${validDifficulty} questions found for ${country.name}. Easy questions have been removed from the system.`,
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        // Transform to frontend format
        const transformedQuestions = questions.map(q => QuestionService.transformToFrontendQuestion(q));
        setQuizQuestions(transformedQuestions);
        
        console.log(`✅ Loaded ${questions.length} ${validDifficulty} questions for ${country.name}`);
        
      } catch (error) {
        console.error('Failed to load quiz questions:', error);
        toast({
          title: "Database Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [navigate, toast]);

  const handleQuizComplete = (result: any) => {
    // Store result and navigate to results page
    sessionStorage.setItem('quizResult', JSON.stringify(result));
    navigate('/quiz-results');
  };

  const handleBack = () => {
    // Clear all stored data and go back to home
    sessionStorage.removeItem('selectedCountry');
    sessionStorage.removeItem('questionCount');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Quiz...</h2>
          <p className="text-muted-foreground">
            Preparing {questionCount} questions for {selectedCountry?.name}
          </p>
        </div>
      </div>
    );
  }

  if (!selectedCountry || quizQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Quiz Not Available</h2>
          <p className="text-muted-foreground mb-4">
            Unable to load quiz questions. Please try again.
          </p>
          <button onClick={handleBack} className="bg-primary text-primary-foreground px-4 py-2 rounded">
            Back to Countries
          </button>
        </div>
      </div>
    );
  }

  return (
    <Quiz
      country={selectedCountry}
      questions={quizQuestions}
      onFinish={handleQuizComplete}
      onBack={handleBack}
    />
  );
}
