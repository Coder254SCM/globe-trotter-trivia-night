
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types/quiz";
import { GameSessionService } from "@/services/supabase/gameSessionService";
import { QuestionService } from "@/services/supabase/questionService";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trophy, BookOpen, Target, RotateCcw } from "lucide-react";

export const UltimateQuiz = () => {
  const [failedQuestions, setFailedQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [masteredCount, setMasteredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

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
      const questions = await GameSessionService.getFailedQuestions(user.id);
      
      if (questions.length === 0) {
        setLoading(false);
        return;
      }
      
      // Transform to frontend format
      const transformedQuestions = questions.map(q => QuestionService.transformToFrontendQuestion(q));
      setFailedQuestions(transformedQuestions);
      
      if (transformedQuestions.length > 0) {
        setCurrentQuestion(transformedQuestions[0]);
      }
      
      setLoading(false);
      
      toast({
        title: "Ultimate Quiz Ready",
        description: `${questions.length} challenging questions loaded for mastery!`,
      });
      
    } catch (error) {
      console.error('Error loading failed questions:', error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load your challenging questions",
        variant: "destructive",
      });
    }
  };

  const handleAnswerSelect = async (answerId: string) => {
    setSelectedAnswer(answerId);
    setShowExplanation(true);
    
    const correct = currentQuestion?.choices.find(c => c.id === answerId)?.isCorrect;
    if (correct) {
      setScore(score + 1);
      setMasteredCount(masteredCount + 1);
      
      // Mark question as mastered
      if (user && currentQuestion) {
        try {
          await GameSessionService.markQuestionMastered(user.id, currentQuestion.id);
          toast({
            title: "Question Mastered!",
            description: "This question won't appear in your Ultimate Quiz anymore.",
          });
        } catch (error) {
          console.error('Error marking question as mastered:', error);
        }
      }
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
    setMasteredCount(0);
  };

  const handleReloadQuestions = async () => {
    setLoading(true);
    await loadUserAndFailedQuestions();
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setMasteredCount(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <div className="text-lg">Loading Ultimate Quiz...</div>
          <p className="text-muted-foreground">Gathering your challenging questions</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6" />
            Ultimate Quiz
          </CardTitle>
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
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Ultimate Quiz
          </CardTitle>
          <CardDescription className="text-center">
            Excellent! You don't have any failed questions to master yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-6 bg-green-50 rounded-lg">
            <Target className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <p className="text-green-700 font-medium mb-2">Perfect Performance!</p>
            <p className="text-green-600 text-sm">
              You haven't missed any questions yet. Keep up the great work!
            </p>
          </div>
          <div className="space-y-2">
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Take a Quiz
            </Button>
            <Button onClick={handleReloadQuestions} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh Questions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Ultimate Quiz Complete!
          </CardTitle>
          <CardDescription className="text-center">
            You've worked through {failedQuestions.length} challenging questions!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-blue-600">Questions Correct</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{masteredCount}</div>
              <div className="text-sm text-green-600">Questions Mastered</div>
            </div>
          </div>
          
          <div className="mb-6">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Success Rate: {Math.round((score / failedQuestions.length) * 100)}%
            </Badge>
          </div>
          
          <div className="space-x-4">
            <Button onClick={handleRetryQuiz}>Retry Quiz</Button>
            <Button variant="outline" onClick={handleReloadQuestions}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Load New Questions
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Take New Quiz
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-amber-500" />
            Ultimate Quiz
          </h1>
          <Badge variant="outline" className="text-lg px-3 py-1">
            Question {currentIndex + 1} of {failedQuestions.length}
          </Badge>
        </div>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Master your challenging questions</span>
          <span>Mastered: {masteredCount} | Correct: {score}/{currentIndex + (showExplanation ? 1 : 0)}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-x-2">
              <Badge variant="outline" className="mb-2">
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="secondary" className="mb-2">
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
                  {selectedAnswer === currentQuestion.choices.find(c => c.isCorrect)?.id ? "Correct! ✨" : "Try Again Next Time"}
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
