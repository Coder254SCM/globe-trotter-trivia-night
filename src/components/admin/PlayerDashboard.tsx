
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Globe, Target, Calendar, Star } from "lucide-react";

interface Player {
  id: string;
  name: string;
  score: number;
  countriesCompleted: string[];
  totalQuizzes: number;
  averageScore: number;
  streak: number;
  joinDate: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  endDate: string;
  prize: string;
  status: 'active' | 'upcoming' | 'completed';
}

export const PlayerDashboard = () => {
  const [player, setPlayer] = useState<Player>({
    id: "demo-player",
    name: "Demo Player",
    score: 2450,
    countriesCompleted: ["usa", "france", "japan", "brazil", "australia"],
    totalQuizzes: 47,
    averageScore: 78,
    streak: 5,
    joinDate: "2024-01-15"
  });

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "weekly-geography",
      title: "Weekly Geography Master",
      description: "Complete 10 geography quizzes with 80%+ accuracy",
      participants: 234,
      endDate: "2024-06-10",
      prize: "Geography Expert Badge",
      status: "active"
    },
    {
      id: "continent-explorer",
      title: "Continent Explorer",
      description: "Visit and complete quizzes from all 7 continents",
      participants: 156,
      endDate: "2024-06-15",
      prize: "World Explorer Title",
      status: "active"
    },
    {
      id: "culture-champion",
      title: "Culture Champion",
      description: "Score 90%+ on 5 culture category quizzes",
      participants: 89,
      endDate: "2024-06-20",
      prize: "Culture Expert Badge",
      status: "upcoming"
    }
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: "GeoMaster2024", score: 4850, country: "🇺🇸" },
    { rank: 2, name: "WorldExplorer", score: 4720, country: "🇬🇧" },
    { rank: 3, name: "QuizKing", score: 4650, country: "🇩🇪" },
    { rank: 4, name: "Demo Player", score: 2450, country: "🌍" },
    { rank: 5, name: "CultureBuff", score: 2380, country: "🇫🇷" }
  ]);

  const completionPercentage = (player.countriesCompleted.length / 195) * 100;

  return (
    <div className="space-y-6">
      {/* Player Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold">{player.score.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Score</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{player.countriesCompleted.length}/195</div>
              <div className="text-sm text-muted-foreground">Countries Explored</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{player.averageScore}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{player.streak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="challenges" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Group Challenges
            </h3>
            
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{challenge.title}</h4>
                    <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
                      {challenge.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {challenge.participants} participants
                    </span>
                    
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Ends {challenge.endDate}
                    </span>
                    
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {challenge.prize}
                    </span>
                  </div>
                  
                  {challenge.status === 'active' && (
                    <Button size="sm" className="mt-3">Join Challenge</Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">World Exploration Progress</h3>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Countries Completed</span>
                <span>{player.countriesCompleted.length}/195 ({completionPercentage.toFixed(1)}%)</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">47</div>
                <div className="text-xs text-muted-foreground">Total Quizzes</div>
              </div>
              
              <div>
                <div className="text-lg font-semibold">5</div>
                <div className="text-xs text-muted-foreground">Continents</div>
              </div>
              
              <div>
                <div className="text-lg font-semibold">12</div>
                <div className="text-xs text-muted-foreground">Badges Earned</div>
              </div>
              
              <div>
                <div className="text-lg font-semibold">3</div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Recent Countries Explored</h4>
              <div className="flex flex-wrap gap-2">
                {player.countriesCompleted.slice(-10).map((countryId) => (
                  <Badge key={countryId} variant="outline">
                    {countryId.replace('-', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Global Leaderboard
            </h3>
            
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div 
                  key={entry.rank} 
                  className={`flex items-center justify-between p-3 rounded ${
                    entry.name === player.name ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {entry.rank}
                    </div>
                    
                    <div>
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-sm text-muted-foreground">{entry.country}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">{entry.score.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">points</div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              View Full Leaderboard
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
