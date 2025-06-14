
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Trophy, Users, Clock } from 'lucide-react';

interface WeeklyChallenge {
  id: string;
  week_start: string;
  week_end: string;
  question_ids: string[];
  participants: number;
  created_at: string;
}

interface UserAttempt {
  id: string;
  score: number;
  completed_at: string;
  questions_correct: number;
  total_questions: number;
}

export const WeeklyChallenges = () => {
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);
  const [userAttempts, setUserAttempts] = useState<{ [key: string]: UserAttempt }>({});
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadChallenges();
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
    } catch (error) {
      console.error('Error loading challenges:', error);
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
    } catch (error) {
      console.error('Error loading user attempts:', error);
    }
  };

  const createWeeklyChallenge = async () => {
    if (!isAdmin) return;

    try {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      // Get random questions for the challenge
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id')
        .limit(20);

      if (questionsError) throw questionsError;

      const questionIds = questions?.map(q => q.id) || [];

      const { error } = await supabase
        .from('weekly_challenges')
        .insert({
          week_start: startOfWeek.toISOString().split('T')[0],
          week_end: endOfWeek.toISOString().split('T')[0],
          question_ids: questionIds
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Weekly challenge created successfully!",
      });

      loadChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Error",
        description: "Failed to create weekly challenge",
        variant: "destructive",
      });
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

    // Simulate starting a challenge (in a real app, this would navigate to quiz)
    toast({
      title: "Challenge Started!",
      description: `Starting weekly challenge with ${challenge.question_ids.length} questions`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isCurrentWeek = (challenge: WeeklyChallenge) => {
    const today = new Date();
    const start = new Date(challenge.week_start);
    const end = new Date(challenge.week_end);
    return today >= start && today <= end;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div>Loading challenges...</div>
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
          <Button onClick={createWeeklyChallenge}>
            Create New Challenge
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {challenges.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Challenges Yet</h3>
              <p className="text-muted-foreground">
                Weekly challenges will appear here. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          challenges.map((challenge) => {
            const userAttempt = userAttempts[challenge.id];
            const isCurrent = isCurrentWeek(challenge);
            
            return (
              <Card key={challenge.id} className={isCurrent ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Weekly Challenge
                        {isCurrent && <Badge variant="default">Current</Badge>}
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

                  {!user ? (
                    <Button disabled className="w-full">
                      Sign In to Participate
                    </Button>
                  ) : userAttempt ? (
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
                      variant={isCurrent ? "default" : "outline"}
                    >
                      {isCurrent ? "Start Challenge" : "View Challenge"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
