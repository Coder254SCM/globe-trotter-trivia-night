import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Country, Question } from "@/types/quiz";
import Quiz from "@/components/Quiz";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { getCleanQuizQuestions } from "@/utils/quiz/cleanQuestionFetcher";
import { FactualQuizService } from "@/services/factual/factualQuizService";
import { useToast } from "@/hooks/use-toast";

export default function QuizPage() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

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

        console.log(`[QuizPage] Loading ${count} questions for ${country.name} (${country.difficulty})`);
        
        // Get questions with duplicate prevention
        let questions = await getCleanQuizQuestions(country.id, country.difficulty, count);
        console.log(`[QuizPage] Found ${questions.length} questions after duplicate filtering`);

        // If no questions or wrong questions, generate factual ones
        if (questions.length === 0) {
          console.log(`[QuizPage] Generating factual questions for ${country.name}...`);
          
          toast({
            title: "Generating Factual Questions",
            description: `Creating accurate questions for ${country.name}...`,
          });

          try {
            // Clean up wrong questions and generate factual ones
            const factualQuestions = await FactualQuizService.cleanAndGenerateQuestions(
              country.id,
              country.difficulty,
              count
            );

            if (factualQuestions.length > 0) {
              // Convert to frontend format
              questions = factualQuestions.map(q => ({
                id: q.id || `factual-${Date.now()}`,
                type: 'multiple-choice' as const,
                text: q.text,
                choices: [
                  { id: 'a', text: q.option_a, isCorrect: q.correct_answer === q.option_a },
                  { id: 'b', text: q.option_b, isCorrect: q.correct_answer === q.option_b },
                  { id: 'c', text: q.option_c, isCorrect: q.correct_answer === q.option_c },
                  { id: 'd', text: q.option_d, isCorrect: q.correct_answer === q.option_d },
                ],
                category: q.category as any,
                explanation: q.explanation,
                difficulty: q.difficulty as any,
              }));
              
              toast({
                title: "Factual Questions Ready!",
                description: `Generated ${questions.length} accurate questions for ${country.name}`,
              });
            }
          } catch (generationError) {
            console.error('[QuizPage] Factual generation failed:', generationError);
            toast({
              title: "Generation Failed",
              description: "Could not generate questions. Please try a different country.",
              variant: "destructive",
            });
          }
        }

        if (questions.length === 0) {
          console.warn(`[QuizPage] No questions available for ${country.name}`);
          toast({
            title: "No Questions Available",
            description: `No questions found for ${country.name}. Please try a different country.`,
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setQuizQuestions(questions);
        console.log(`[QuizPage] Quiz ready with ${questions.length} unique questions`);

        // Show warning if less than requested number of questions
        if (questions.length < count) {
          toast({
            title: "Fewer Questions Available",
            description: `Only ${questions.length} unique questions were available for ${country.name}. This may cause repeated or similar questions. Try again later or report missing questions to the admin.`,
            variant: "default"
          });
        }

      } catch (error) {
        console.error('[QuizPage] Error loading quiz:', error);
        toast({
          title: "Quiz Loading Error",
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
            Preparing your quiz for {selectedCountry?.name || "selected country"}
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
            Unable to load questions for the selected country.
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
