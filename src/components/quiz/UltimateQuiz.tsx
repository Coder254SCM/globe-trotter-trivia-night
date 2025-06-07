
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types/quiz";
import { QuizService } from "@/services/supabase/quizService";
import { supabase } from "@/integrations/supabase/client";

export const UltimateQuiz = () => {
  const [failedQuestions, setFailedQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUserAndFailedQuestions();
  }, []);

  const loadUserAndFailedQuestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found - Ultimate Quiz requires authentication');
        setLoading(false);
        return;
      }
      
      setUser(user);
      const questions = await QuizService.getFailedQuestions(user.id);
      setFailedQuestions(questions);
      
      if (questions.length > 0) {
        setCurrentQuestion(questions[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading failed questions:', error);
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    setShowExplanation(true);
    
    const correct = currentQuestion?.choices.find(c => c.id === answerId)?.isCorrect;
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < failedQuestions.length) {
      setCurrentIndex(nextIndex);
      setCurrentQuestion(failedQuestions[nextIndex]);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      setCurrentQuestion(null);
    }
  };

  const handleRetryQuiz = () => {
    setCurrentIndex(0);
    setCurrentQuestion(failedQuestions[0]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading Ultimate Quiz...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Ultimate Quiz</CardTitle>
          <CardDescription className="text-center">
            Please sign in to access your failed questions and master them!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => window.location.href = '/auth'}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  if (failedQuestions.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Ultimate Quiz</CardTitle>
          <CardDescription className="text-center">
            Great job! You don't have any failed questions to master yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Play some quizzes to build your collection of challenging questions!
          </p>
          <Button onClick={() => window.location.href = '/'}>Start Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Ultimate Quiz Complete!</CardTitle>
          <CardDescription className="text-center">
            You've mastered {score} out of {failedQuestions.length} challenging questions!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Success Rate: {Math.round((score / failedQuestions.length) * 100)}%
            </Badge>
          </div>
          <div className="space-x-4">
            <Button onClick={handleRetryQuiz}>Retry Quiz</Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              New Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Ultimate Quiz</h1>
          <Badge variant="outline">
            Question {currentIndex + 1} of {failedQuestions.length}
          </Badge>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Master your challenging questions</span>
          <span>Score: {score}/{currentIndex + (showExplanation ? 1 : 0)}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline" className="mb-2">
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="secondary" className="mb-2 ml-2">
                {currentQuestion.category}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {currentQuestion.imageUrl && (
            <img 
              src={currentQuestion.imageUrl} 
              alt="Question"
              className="w-full max-w-md mx-auto mb-6 rounded-lg"
            />
          )}

          <div className="grid gap-3">
            {currentQuestion.choices.map((choice) => (
              <Button
                key={choice.id}
                variant={
                  showExplanation
                    ? choice.isCorrect
                      ? "default"
                      : selectedAnswer === choice.id
                      ? "destructive"
                      : "outline"
                    : selectedAnswer === choice.id
                    ? "secondary"
                    : "outline"
                }
                className="justify-start text-left h-auto p-4"
                onClick={() => !showExplanation && handleAnswerSelect(choice.id)}
                disabled={showExplanation}
              >
                <span className="font-semibold mr-3">{choice.id.toUpperCase()}.</span>
                {choice.text}
              </Button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-2">Explanation:</p>
              <p>{currentQuestion.explanation}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <Badge variant={selectedAnswer === currentQuestion.choices.find(c => c.isCorrect)?.id ? "default" : "destructive"}>
                  {selectedAnswer === currentQuestion.choices.find(c => c.isCorrect)?.id ? "Correct!" : "Incorrect"}
                </Badge>
                
                <Button onClick={handleNextQuestion}>
                  {currentIndex + 1 < failedQuestions.length ? "Next Question" : "Complete Quiz"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
