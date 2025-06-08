import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, User } from "lucide-react";
import { QuizService } from "@/services/supabase/quizService";

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  badge?: string;
}

export const CompetitiveLeaderboard = () => {
  const [individualLeaderboard, setIndividualLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [groupLeaderboard, setGroupLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    try {
      const [individual, groups, weekly] = await Promise.all([
        QuizService.getLeaderboard('all-time'),
        QuizService.getLeaderboard('all-time'), // Groups
        QuizService.getLeaderboard('weekly')
      ]);

      setIndividualLeaderboard(individual.map((entry, index) => ({
        rank: index + 1,
        username: entry.user_profiles?.username || 'Anonymous',
        score: entry.score,
        badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : undefined
      })));

      setGroupLeaderboard(groups.map((entry, index) => ({
        rank: index + 1,
        username: entry.user_profiles?.username || 'Team',
        score: entry.score,
        badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : undefined
      })));

      setWeeklyLeaderboard(weekly.map((entry, index) => ({
        rank: index + 1,
        username: entry.user_profiles?.username || 'Player',
        score: entry.score,
        badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : undefined
      })));

      setLoading(false);
    } catch (error) {
      console.error('Error loading leaderboards:', error);
      setLoading(false);
    }
  };

  const LeaderboardTable = ({ entries, title, icon }: { 
    entries: LeaderboardEntry[], 
    title: string,
    icon: React.ReactNode 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>
          Compete with players worldwide
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading leaderboard...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No entries yet. Be the first to compete!
          </div>
        ) : (
          <div className="space-y-3">
            {entries.slice(0, 10).map((entry) => (
              <div
                key={`${entry.rank}-${entry.username}`}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    entry.rank === 1 ? 'bg-yellow-500 text-white' :
                    entry.rank === 2 ? 'bg-gray-400 text-white' :
                    entry.rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {entry.badge || entry.rank}
                  </div>
                  <div>
                    <div className="font-semibold">{entry.username}</div>
                    <div className="text-sm text-muted-foreground">
                      Rank #{entry.rank}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{entry.score.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">points</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Global Competition</h1>
        <p className="text-muted-foreground text-lg">
          Compete with millions of players worldwide and climb the rankings!
        </p>
      </div>

      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="individual">Individual Contest</TabsTrigger>
          <TabsTrigger value="groups">Group Competition</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Challenge</TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <LeaderboardTable 
            entries={individualLeaderboard}
            title="Individual Champions"
            icon={<User className="w-5 h-5" />}
          />
        </TabsContent>

        <TabsContent value="groups">
          <LeaderboardTable 
            entries={groupLeaderboard}
            title="Top Teams"
            icon={<Users className="w-5 h-5" />}
          />
        </TabsContent>

        <TabsContent value="weekly">
          <LeaderboardTable 
            entries={weeklyLeaderboard}
            title="This Week's Heroes"
            icon={<Trophy className="w-5 h-5" />}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="font-bold text-lg mb-2">Weekly Prizes</h3>
            <p className="text-muted-foreground">Top 3 players win exclusive badges</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="font-bold text-lg mb-2">Team Battles</h3>
            <p className="text-muted-foreground">Join groups and compete together</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="font-bold text-lg mb-2">Personal Best</h3>
            <p className="text-muted-foreground">Track your improvement over time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
