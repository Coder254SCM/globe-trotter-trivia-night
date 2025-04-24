
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Choice, Country, Question, QuizResult } from "../types/quiz";
import { ArrowLeft, Clock, Globe, MapPin, Trophy, Flag } from "lucide-react";

interface QuizProps {
  country: Country | null;
  questions: Question[];
  onFinish: (result: QuizResult) => void;
  onBack: () => void;
  isWeeklyChallenge?: boolean;
}

const Quiz = ({ country, questions, onFinish, onBack, isWeeklyChallenge = false }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [correctQuestions, setCorrectQuestions] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // Reset state for each question
    setSelectedChoice(null);
    setIsAnswered(false);
    
    // Set timer based on difficulty
    let timeLimit = 0;
    switch (currentQuestion?.difficulty) {
      case 'easy':
        timeLimit = 20;
        break;
      case 'medium':
        timeLimit = 30;
        break;
      case 'hard':
        timeLimit = 40;
        break;
      default:
        timeLimit = 30;
    }
    
    setTimeRemaining(timeLimit);
    
    // Start countdown
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswered) {
            handleAnswer(null);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex, currentQuestion?.difficulty]);

  const handleAnswer = (choiceId: string | null) => {
    if (isAnswered) return;
    
    setSelectedChoice(choiceId);
    setIsAnswered(true);
    
    const correct = currentQuestion.choices.find(
      (choice) => choice.id === choiceId && choice.isCorrect
    );
    
    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
      setCorrectQuestions((prev) => [...prev, currentQuestionIndex]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      setTotalTime(timeTaken);
      
      // Calculate score - more points for harder questions and faster answers
      const score = Math.round(
        (correctAnswers / questions.length) * 100
      );
      
      onFinish({
        totalQuestions: questions.length,
        correctAnswers,
        score,
        timeTaken,
        correctQuestions,
      });
    }
  };

  const getChoiceClassName = (choice: Choice) => {
    if (!isAnswered) {
      return selectedChoice === choice.id
        ? "border-primary bg-primary/10"
        : "border-border hover:border-primary/50";
    }
    
    if (choice.isCorrect) {
      return "border-green-500 bg-green-500/10";
    }
    
    if (selectedChoice === choice.id && !choice.isCorrect) {
      return "border-red-500 bg-red-500/10";
    }
    
    return "border-border opacity-50";
  };

  const getHeaderIcon = () => {
    if (isWeeklyChallenge) {
      return <Trophy size={20} className="text-amber-500" />;
    }
    
    if (country) {
      return <Flag size={20} className="text-primary" />;
    }
    
    return <Globe size={20} className="text-primary" />;
  };

  const getHeaderTitle = () => {
    if (isWeeklyChallenge) {
      return "Weekly Challenge";
    }
    
    return country ? `${country.name} Quiz` : "Global Quiz";
  };
  
  return (
    <div className="min-h-screen w-full p-4 flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <Globe size={16} />
          Back to Globe
        </Button>
        
        <div className="flex items-center gap-2">
          {getHeaderIcon()}
          <span className="font-medium">{getHeaderTitle()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock size={16} className={timeRemaining < 5 ? "text-red-500" : ""} />
          <span className={timeRemaining < 5 ? "text-red-500 font-medium" : ""}>
            {timeRemaining}s
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
          <span>Category: {currentQuestion?.category}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card className="p-6 border-primary/20 shadow-lg shadow-primary/20">
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-2">
            {currentQuestion?.text}
          </h2>
          
          {currentQuestion?.imageUrl && (
            <div className="mt-4 mb-6 flex justify-center">
              <img 
                src={currentQuestion.imageUrl}
                alt="Question visual"
                className="max-w-full rounded-md shadow-md max-h-60 object-contain"
              />
            </div>
          )}
          
          {currentQuestion?.audioUrl && (
            <div className="mt-4 mb-6 flex justify-center">
              <audio controls className="w-full max-w-md">
                <source src={currentQuestion.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
        
        <div className="grid gap-3">
          {currentQuestion?.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleAnswer(choice.id)}
              disabled={isAnswered}
              className={`
                p-4 rounded-md border-2 transition-all text-left flex items-center
                ${getChoiceClassName(choice)}
              `}
            >
              <span className="w-8 h-8 mr-3 rounded-full bg-muted flex items-center justify-center">
                {choice.id.toUpperCase()}
              </span>
              {choice.text}
            </button>
          ))}
        </div>
        
        {isAnswered && (
          <div className="mt-6 flex flex-col gap-4">
            <div className="bg-secondary/50 p-4 rounded-md">
              <p className="font-medium mb-1">Explanation:</p>
              <p>{currentQuestion?.explanation}</p>
            </div>
            
            <Button onClick={handleNext}>
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Quiz;
