
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { QuizResult as QuizResultType } from "../types/quiz";
import { Clock, Globe, Trophy } from "lucide-react";

interface QuizResultProps {
  result: QuizResultType;
  countryName: string;
  onRestart: () => void;
  onBackToGlobe: () => void;
}

const QuizResult = ({ result, countryName, onRestart, onBackToGlobe }: QuizResultProps) => {
  const { totalQuestions, correctAnswers, score, timeTaken } = result;
  
  const getFeedback = () => {
    if (score >= 90) {
      return {
        title: "Cultural Expert!",
        message: `Amazing! You're practically a ${countryName} native! Your knowledge of global cultures is impressive.`,
        icon: "🏆"
      };
    } else if (score >= 70) {
      return {
        title: "Cultural Enthusiast!",
        message: `Great job! You know ${countryName} quite well. Keep exploring to become a true expert.`,
        icon: "🌟"
      };
    } else if (score >= 50) {
      return {
        title: "Cultural Learner",
        message: `Good effort! You have some knowledge about ${countryName}, but there's more to discover.`,
        icon: "📚"
      };
    } else {
      return {
        title: "Cultural Novice",
        message: `You've taken your first steps into learning about ${countryName}. Keep exploring to improve your score!`,
        icon: "🌱"
      };
    }
  };
  
  const feedback = getFeedback();
  
  return (
    <div className="min-h-screen w-full p-4 flex flex-col justify-center items-center">
      <Card className="w-full max-w-md p-8 border-primary/20 shadow-lg shadow-primary/20">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 inline-block">{feedback.icon}</span>
          <h1 className="text-2xl font-bold mb-2">{feedback.title}</h1>
          <p className="text-muted-foreground">{feedback.message}</p>
        </div>
        
        <div className="mb-8 space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Score</span>
              <span className="flex items-center">
                <Trophy size={16} className="text-primary mr-1" />
                {score}%
              </span>
            </div>
            <Progress value={score} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/30 p-4 rounded-md text-center">
              <p className="text-muted-foreground text-sm">Correct Answers</p>
              <p className="text-xl font-semibold mt-1">
                {correctAnswers}/{totalQuestions}
              </p>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-md text-center">
              <p className="text-muted-foreground text-sm">Time Taken</p>
              <p className="text-xl font-semibold mt-1 flex items-center justify-center">
                <Clock size={16} className="mr-1" />
                {timeTaken}s
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={onRestart}>
            Try Again
          </Button>
          <Button onClick={onBackToGlobe} className="flex items-center gap-2">
            <Globe size={16} />
            Explore More
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizResult;
