
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Trophy, Users, Clock, Play, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { WeeklyChallengeService, WeeklyChallenge } from '@/services/supabase/weeklyChallengeService';
import { QuestionService } from '@/services/supabase/questionService';

interface UserAttempt {
  id: string;
  score: number;
  completed_at: string;
  questions_correct: number;
  total_questions: number;
}

interface WeeklyChallengesProps {
  onStartChallenge?: (questions: any[], challengeId: string) => void;
}

export const WeeklyChallenges = ({ onStartChallenge }: WeeklyChallengesProps) => {
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);
  const [userAttempts, setUserAttempts] = useState<{ [key: string]: UserAttempt }>({});
  const [currentChallenge, setCurrentChallenge] = useState<WeeklyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [startingChallenge, setStartingChallenge] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadChallenges();
    loadCurrentChallenge();
    if (user) {
      loadUserAttempts();
    }
  }, [user]);

  const loadChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_challenges')
        .select('*')
        .order('week_start', { ascending: false })
        .limit(10);

      if (error) throw error;
      setChallenges(data || []);
      console.log(`📅 Loaded ${data?.length || 0} challenges`);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const loadCurrentChallenge = async () => {
    try {
      const challenge = await WeeklyChallengeService.getCurrentChallenge();
      setCurrentChallenge(challenge);
      console.log('🏆 Current challenge:', challenge?.id);
    } catch (error) {
      console.error('Error loading current challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserAttempts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_challenge_attempts')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const attemptsMap = (data || []).reduce((acc, attempt) => {
        acc[attempt.challenge_id] = attempt;
        return acc;
      }, {} as { [key: string]: UserAttempt });
      
      setUserAttempts(attemptsMap);
      console.log(`👤 Loaded ${Object.keys(attemptsMap).length} user attempts`);
    } catch (error) {
      console.error('Error loading user attempts:', error);
    }
  };

  const createWeeklyChallenge = async () => {
    if (!isAdmin) return;
    
    setCreating(true);
    try {
      console.log('🔨 Creating weekly challenge...');
      const challenge = await WeeklyChallengeService.createWeeklyChallenge();
      
      toast({
        title: "Success!",
        description: `Weekly challenge created with ${challenge.question_ids.length} questions!`,
      });

      await loadChallenges();
      await loadCurrentChallenge();
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Error",
        description: "Failed to create weekly challenge. Make sure there are enough hard questions available.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const startChallenge = async (challenge: WeeklyChallenge) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to participate in challenges",
        variant: "destructive",
      });
      return;
    }

    // Check if user already completed this challenge
    if (userAttempts[challenge.id]) {
      toast({
        title: "Already Completed",
        description: "You have already completed this challenge",
        variant: "destructive",
      });
      return;
    }

    setStartingChallenge(challenge.id);
    
    try {
      console.log(`🚀 Starting challenge: ${challenge.id}`);
      
      // Get challenge questions
      const questions = await WeeklyChallengeService.getChallengeQuestions(challenge);
      
      if (questions.length === 0) {
        toast({
          title: "No Questions Available",
          description: "This challenge has no questions available",
          variant: "destructive",
        });
        return;
      }

      console.log(`📋 Found ${questions.length} questions for challenge`);

      // Transform questions to frontend format
      const transformedQuestions = questions.map(q => QuestionService.transformToFrontendQuestion(q));

      // Validate transformed questions
      const validQuestions = transformedQuestions.filter(q => 
        q.text && q.choices && q.choices.length === 4 && q.choices.some(c => c.isCorrect)
      );

      if (validQuestions.length === 0) {
        toast({
          title: "Invalid Questions",
          description: "No valid questions found for this challenge",
          variant: "destructive",
        });
        return;
      }

      console.log(`✅ Using ${validQuestions.length} valid questions`);

      // Start the challenge
      if (onStartChallenge) {
        onStartChallenge(validQuestions, challenge.id);
      }
      
      toast({
        title: "Challenge Started!",
        description: `Starting weekly challenge with ${validQuestions.length} questions`,
      });
    } catch (error) {
      console.error('Error starting challenge:', error);
      toast({
        title: "Error",
        description: "Failed to start challenge",
        variant: "destructive",
      });
    } finally {
      setStartingChallenge(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weekly Challenges</h1>
          <p className="text-muted-foreground">
            Test your knowledge with our weekly geography challenges
          </p>
        </div>
        {isAdmin && (
          <Button onClick={createWeeklyChallenge} disabled={creating}>
            {creating ? "Creating..." : "Create New Challenge"}
          </Button>
        )}
      </div>

      {/* Current Challenge Highlight */}
      {currentChallenge && (
        <Card className="border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-amber-500" />
                  Current Weekly Challenge
                  <Badge variant="default">Live Now</Badge>
                </CardTitle>
                <CardDescription>
                  {formatDate(currentChallenge.week_start)} - {formatDate(currentChallenge.week_end)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {currentChallenge.question_ids.length} Hard Questions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {currentChallenge.participants} Participants
                </span>
              </div>
              {userAttempts[currentChallenge.id] && (
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Your Score: {userAttempts[currentChallenge.id].questions_correct}/{userAttempts[currentChallenge.id].total_questions}
                  </span>
                </div>
              )}
            </div>

            {!user ? (
              <Button disabled className="w-full">
                Sign In to Participate
              </Button>
            ) : userAttempts[currentChallenge.id] ? (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-green-700 font-medium">
                  Challenge Completed!
                </p>
                <p className="text-sm text-green-600">
                  Final Score: {userAttempts[currentChallenge.id].score} points
                </p>
              </div>
            ) : (
              <Button 
                onClick={() => startChallenge(currentChallenge)}
                className="w-full"
                size="lg"
                disabled={startingChallenge === currentChallenge.id}
              >
                {startingChallenge === currentChallenge.id ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Challenge
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* No challenges state */}
      {challenges.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Challenges Yet</h3>
            <p className="text-muted-foreground">
              Weekly challenges will appear here. Check back soon!
            </p>
            {isAdmin && (
              <Button onClick={createWeeklyChallenge} className="mt-4" disabled={creating}>
                {creating ? "Creating..." : "Create First Challenge"}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Past Challenges */}
      {challenges.length > 0 && (
        <div className="grid gap-4">
          {challenges
            .filter(challenge => !currentChallenge || challenge.id !== currentChallenge.id)
            .map((challenge) => {
              const userAttempt = userAttempts[challenge.id];
              
              return (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Weekly Challenge
                          <Badge variant="outline">Past</Badge>
                        </CardTitle>
                        <CardDescription>
                          {formatDate(challenge.week_start)} - {formatDate(challenge.week_end)}
                        </CardDescription>
                      </div>
                      {userAttempt && (
                        <Badge variant="outline" className="text-green-600">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {challenge.question_ids.length} Questions
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {challenge.participants} Participants
                        </span>
                      </div>
                      {userAttempt && (
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Score: {userAttempt.questions_correct}/{userAttempt.total_questions}
                          </span>
                        </div>
                      )}
                    </div>

                    {userAttempt ? (
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-green-700 font-medium">
                          Challenge Completed!
                        </p>
                        <p className="text-sm text-green-600">
                          Final Score: {userAttempt.score} points
                        </p>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => startChallenge(challenge)}
                        className="w-full"
                        variant="outline"
                        disabled={!user || startingChallenge === challenge.id}
                      >
                        {!user ? "Sign In to Participate" : 
                         startingChallenge === challenge.id ? "Starting..." : "View Challenge"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};
