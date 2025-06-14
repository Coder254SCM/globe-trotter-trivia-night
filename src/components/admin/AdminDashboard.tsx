
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Globe,
  BookOpen,
  GraduationCap,
  Brain,
  UserCheck,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import { Link } from "react-router-dom";

export const AdminDashboard = () => {
  const adminTools = [
    {
      title: "Production Dashboard",
      description: "Monitor live system status and performance",
      icon: Database,
      href: "/admin",
      variant: "default" as const,
      status: "Active"
    },
    {
      title: "Easy Questions",
      description: "Generate basic template questions for beginners",
      icon: Lightbulb,
      href: "/admin/easy-questions",
      variant: "secondary" as const,
      status: "Ready"
    },
    {
      title: "Medium Questions",
      description: "Generate medium-difficulty questions requiring specific knowledge",
      icon: GraduationCap,
      href: "/admin/medium-questions",
      variant: "secondary" as const,
      status: "New"
    },
    {
      title: "Hard Questions",
      description: "Generate advanced questions using AI or manual templates",
      icon: Brain,
      href: "/admin/manual-hard-questions",
      variant: "secondary" as const,
      status: "Ready"
    },
    {
      title: "Question Audit",
      description: "Review and analyze question quality across all countries",
      icon: FileText,
      href: "/admin/question-audit",
      variant: "outline" as const,
      status: "Tools"
    },
    {
      title: "Community Moderation",
      description: "Review and moderate community-submitted questions",
      icon: UserCheck,
      href: "/admin/moderation",
      variant: "outline" as const,
      status: "Active"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Ready": return "bg-blue-500";
      case "New": return "bg-purple-500";
      case "Tools": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage questions, monitor system performance, and configure the quiz platform
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          <Globe className="w-4 h-4 mr-1" />
          195 Countries Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminTools.map((tool) => (
          <Card key={tool.href} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <tool.icon className="h-8 w-8 text-primary" />
                <Badge 
                  variant="secondary" 
                  className={`text-white ${getStatusColor(tool.status)}`}
                >
                  {tool.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{tool.title}</CardTitle>
              <CardDescription className="text-sm">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={tool.href}>
                <Button variant={tool.variant} className="w-full">
                  Open Tool
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">195</div>
              <div className="text-sm text-green-700">Countries</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3 Levels</div>
              <div className="text-sm text-blue-700">Easy/Medium/Hard</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">Weekly</div>
              <div className="text-sm text-purple-700">Challenges</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">Ultimate</div>
              <div className="text-sm text-orange-700">Quiz System</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
