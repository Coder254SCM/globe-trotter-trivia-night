
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, FileText, Database, Users, Globe, Settings } from "lucide-react";
import { getQuestionStats } from "../../utils/quiz/questionSets";
import countries from "../../data/countries";

export const ProjectStructure = () => {
  const questionStats = getQuestionStats();
  
  const features = [
    {
      name: "All 195 Countries",
      status: countries.length >= 195 ? "complete" : "incomplete",
      description: `${countries.length}/195 countries loaded`,
      icon: Globe,
    },
    {
      name: "Question Database",
      status: questionStats.countriesWithQuestions >= 195 ? "complete" : "incomplete", 
      description: `${questionStats.countriesWithQuestions}/195 countries have questions`,
      icon: Database,
    },
    {
      name: "Dark/Light Theme",
      status: "complete",
      description: "Theme toggle implemented",
      icon: Settings,
    },
    {
      name: "Multi-Language Support", 
      status: "complete",
      description: "10+ languages supported",
      icon: FileText,
    },
    {
      name: "Analytics System",
      status: "complete", 
      description: "User behavior tracking",
      icon: CheckCircle,
    },
    {
      name: "Invite System",
      status: "complete",
      description: "Referral system with rewards",
      icon: Users,
    },
    {
      name: "User Authentication",
      status: "missing",
      description: "Requires Supabase integration",
      icon: Users,
    },
    {
      name: "Database Migration",
      status: "missing", 
      description: "Move from static files to database",
      icon: Database,
    },
    {
      name: "Ultimate Quiz Feature",
      status: "partial",
      description: "Failed questions tracking needs database",
      icon: AlertTriangle,
    },
    {
      name: "Group Challenges",
      status: "complete",
      description: "Player dashboard with group features",
      icon: Users,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "partial":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "missing":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      case "missing":
        return <Badge className="bg-red-100 text-red-800">Missing</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const completedFeatures = features.filter(f => f.status === "complete").length;
  const totalFeatures = features.length;
  const completionPercentage = (completedFeatures / totalFeatures) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Project Structure & Completion
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{completionPercentage.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Project Complete</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{completedFeatures}</div>
            <div className="text-sm text-muted-foreground">Features Complete</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{totalFeatures - completedFeatures}</div>
            <div className="text-sm text-muted-foreground">Features Remaining</div>
          </div>
        </div>

        <div className="space-y-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(feature.status)}
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{feature.name}</div>
                    <div className="text-sm text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
                {getStatusBadge(feature.status)}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Database Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{countries.length}</div>
            <div className="text-sm text-muted-foreground">Total Countries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{questionStats.totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{questionStats.averageQuestionsPerCountry.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Avg Questions/Country</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{questionStats.continents}</div>
            <div className="text-sm text-muted-foreground">Continent Sets</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Next Steps for Production</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span>1. Enable Supabase integration for user authentication</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span>2. Migrate questions from static files to database</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span>3. Implement real-time multiplayer with WebSockets</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span>4. Add image optimization and CDN setup</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
