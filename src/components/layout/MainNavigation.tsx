
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Settings, 
  Users, 
  BarChart3, 
  Trophy, 
  HelpCircle,
  Search,
  Database,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MainNavigation = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("globe");

  const handleNavigation = (path: string, section: string) => {
    navigate(path);
    setActiveSection(section);
  };

  return (
    <nav className="flex flex-wrap gap-2 p-4 bg-card/50 backdrop-blur-sm border-b">
      <Button
        variant={activeSection === "globe" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleNavigation("/", "globe")}
        className="flex items-center gap-2"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Globe</span>
      </Button>

      <Button
        variant={activeSection === "admin" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleNavigation("/admin", "admin")}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Admin</span>
      </Button>

      <Button
        variant={activeSection === "audit" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleNavigation("/comprehensive-audit", "audit")}
        className="flex items-center gap-2"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Question Audit</span>
        <Badge variant="destructive" className="text-xs">Critical</Badge>
      </Button>

      <Button
        variant={activeSection === "moderation" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleNavigation("/admin/moderation", "moderation")}
        className="flex items-center gap-2"
      >
        <Shield className="h-4 w-4" />
        <span className="hidden sm:inline">Moderation</span>
      </Button>

      <Button
        variant={activeSection === "challenges" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleNavigation("/weekly-challenges", "challenges")}
        className="flex items-center gap-2"
      >
        <Trophy className="h-4 w-4" />
        <span className="hidden sm:inline">Challenges</span>
      </Button>

      <Button
        variant={activeSection === "ultimate" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleNavigation("/ultimate-quiz", "ultimate")}
        className="flex items-center gap-2"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Ultimate Quiz</span>
      </Button>
    </nav>
  );
};
