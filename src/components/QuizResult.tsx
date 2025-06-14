
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { QuizResult as QuizResultType } from "../types/quiz";
import { Clock, Globe, Trophy, Flag, Star, Target, Zap, Award } from "lucide-react";
import { ProgressRing } from "./ui/progress-ring";
import { StatCard } from "./ui/stat-card";
import { GameCard } from "./ui/game-card";

interface QuizResultProps {
  result: QuizResultType;
  countryName: string;
  onRestart: () => void;
  onBackToGlobe: () => void;
  isWeeklyChallenge?: boolean;
}

const QuizResult = ({ 
  result, 
  countryName, 
  onRestart, 
  onBackToGlobe,
  isWeeklyChallenge = false
}: QuizResultProps) => {
  const { totalQuestions, correctAnswers, score, timeTaken } = result;
  
  const getFeedback = () => {
    if (score >= 90) {
      return {
        title: isWeeklyChallenge ? "🏆 Challenge Master!" : "🏆 Cultural Expert!",
        message: isWeeklyChallenge 
          ? "Outstanding! You've mastered the most challenging questions!"
          : `Amazing! You're practically a ${countryName} native! Your knowledge of global cultures is impressive.`,
        color: "from-amber-400 to-yellow-600",
        badgeText: "LEGENDARY",
        badgeColor: "bg-gradient-to-r from-amber-500 to-yellow-500"
      };
    } else if (score >= 70) {
      return {
        title: isWeeklyChallenge ? "🌟 Challenge Champion!" : "🌟 Cultural Enthusiast!",
        message: isWeeklyChallenge
          ? "Great job tackling these difficult questions!"
          : `Great job! You know ${countryName} quite well. Keep exploring to become a true expert.`,
        color: "from-blue-400 to-indigo-600",
        badgeText: "EXPERT",
        badgeColor: "bg-gradient-to-r from-blue-500 to-indigo-500"
      };
    } else if (score >= 50) {
      return {
        title: isWeeklyChallenge ? "📚 Challenge Apprentice" : "📚 Cultural Learner",
        message: isWeeklyChallenge
          ? "Good effort on these challenging questions. Keep practicing!"
          : `Good effort! You have some knowledge about ${countryName}, but there's more to discover.`,
        color: "from-green-400 to-emerald-600",
        badgeText: "LEARNER",
        badgeColor: "bg-gradient-to-r from-green-500 to-emerald-500"
      };
    } else {
      return {
        title: isWeeklyChallenge ? "🌱 Challenge Novice" : "🌱 Cultural Novice",
        message: isWeeklyChallenge
          ? "These were tough questions! Keep trying to improve your score."
          : `You've taken your first steps into learning about ${countryName}. Keep exploring to improve your score!`,
        color: "from-purple-400 to-pink-600",
        badgeText: "BEGINNER",
        badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500"
      };
    }
  };
  
  const feedback = getFeedback();
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const timePerQuestion = Math.round(timeTaken / totalQuestions);
  
  return (
    <div className="min-h-screen w-full p-4 flex flex-col justify-center items-center bg-gradient-to-br from-background via-background to-muted/10">
      {/* Celebration Effects */}
      {score >= 70 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>
      )}

      <div className="w-full max-w-4xl space-y-6">
        {/* Main Result Card */}
        <GameCard
          title="Quiz Complete!"
          className="text-center relative overflow-hidden"
          interactive={false}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feedback.color} opacity-5`} />
          
          <div className="relative z-10 space-y-6">
            {/* Achievement Badge */}
            <div className="flex justify-center">
              <div className={`${feedback.badgeColor} text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg animate-pulse`}>
                {feedback.badgeText}
              </div>
            </div>

            {/* Title and Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                {feedback.title}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                {feedback.message}
              </p>
            </div>

            {/* Progress Ring */}
            <div className="flex justify-center py-4">
              <ProgressRing 
                progress={score} 
                size={150}
                strokeWidth={12}
                color={score >= 70 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
              />
            </div>
          </div>
        </GameCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Final Score"
            value={`${score}%`}
            icon={<Trophy className="h-6 w-6" />}
            change={{
              value: score >= 70 ? "Excellent!" : score >= 50 ? "Good job!" : "Keep trying!",
              trend: score >= 70 ? 'up' : score >= 50 ? 'neutral' : 'down'
            }}
          />
          
          <StatCard
            title="Accuracy"
            value={`${correctAnswers}/${totalQuestions}`}
            icon={<Target className="h-6 w-6" />}
            change={{
              value: `${accuracy}% correct`,
              trend: accuracy >= 70 ? 'up' : accuracy >= 50 ? 'neutral' : 'down'
            }}
          />
          
          <StatCard
            title="Time Taken"
            value={`${timeTaken}s`}
            icon={<Clock className="h-6 w-6" />}
            change={{
              value: `${timePerQuestion}s per question`,
              trend: 'neutral'
            }}
          />
          
          <StatCard
            title="Performance"
            value={score >= 90 ? "🏆" : score >= 70 ? "🌟" : score >= 50 ? "📚" : "🌱"}
            icon={<Star className="h-6 w-6" />}
            change={{
              value: feedback.badgeText,
              trend: score >= 70 ? 'up' : 'neutral'
            }}
          />
        </div>

        {/* Achievement Details */}
        <GameCard
          title="Achievement Details"
          description="Your performance breakdown"
          className="bg-gradient-to-r from-card to-card/80"
        >
          <div className="space-y-4">
            {/* Progress Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Accuracy</span>
                  <span className="text-sm text-muted-foreground">{accuracy}%</span>
                </div>
                <Progress value={accuracy} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Speed Bonus</span>
                  <span className="text-sm text-muted-foreground">
                    {timePerQuestion < 15 ? "Fast!" : timePerQuestion < 25 ? "Good" : "Steady"}
                  </span>
                </div>
                <Progress 
                  value={timePerQuestion < 15 ? 100 : timePerQuestion < 25 ? 70 : 40} 
                  className="h-3" 
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {score === 100 && (
                <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                  <Award className="h-4 w-4" />
                  Perfect Score!
                </div>
              )}
              {timePerQuestion < 15 && (
                <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <Zap className="h-4 w-4" />
                  Speed Demon
                </div>
              )}
              {score >= 80 && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <Star className="h-4 w-4" />
                  High Achiever
                </div>
              )}
            </div>
          </div>
        </GameCard>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onRestart}
            size="lg"
            variant="outline"
            className="flex items-center gap-2 bg-card hover:bg-card/80 transition-all duration-200 hover:scale-105"
          >
            <Flag className="h-5 w-5" />
            Try Again
          </Button>
          
          <Button 
            onClick={onBackToGlobe}
            size="lg"
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-200 hover:scale-105"
          >
            {isWeeklyChallenge ? <Trophy className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
            {isWeeklyChallenge ? "More Challenges" : "Explore More"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
