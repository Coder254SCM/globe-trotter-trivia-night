
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Database, 
  Users, 
  TrendingUp, 
  Globe, 
  Brain,
  FileText,
  Search,
  Settings,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

export const ProductionDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Database className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Production Dashboard</h2>
          <p className="text-muted-foreground">
            Complete system overview and management tools
          </p>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Database Status</p>
              <p className="text-2xl font-bold">Operational</p>
            </div>
            <Database className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Countries</p>
              <p className="text-2xl font-bold">195</p>
            </div>
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">AI Service</p>
              <p className="text-2xl font-bold text-red-600">Offline</p>
            </div>
            <Brain className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Management Tools */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5" />
            Question Management
          </h3>
          <div className="space-y-3">
            <Link to="/admin/question-audit">
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Supabase Question Audit
              </Button>
            </Link>
            <Link to="/admin/manual-hard-questions">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Manual Hard Questions
              </Button>
            </Link>
            <Link to="/admin/hard-questions">
              <Button className="w-full justify-start" variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                AI Hard Questions (Offline)
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Tools
          </h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Database Operations
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              User Analytics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance Metrics
            </Button>
          </div>
        </Card>
      </div>

      {/* Status Information */}
      <Card className="p-6 bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">Current System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Question Database</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Manual Question Generator</span>
              <Badge variant="default">Available</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">User Authentication</span>
              <Badge variant="default">Enabled</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Question Service</span>
              <Badge variant="destructive">Offline</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Real-time Updates</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Game Engine</span>
              <Badge variant="default">Running</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
