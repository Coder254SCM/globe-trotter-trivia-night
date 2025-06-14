
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Bot, Settings } from "lucide-react";

interface AppHeaderProps {
  countriesCount: number;
  isGeneratingQuestions?: boolean;
}

export const AppHeader = ({ countriesCount, isGeneratingQuestions = false }: AppHeaderProps) => {
  return (
    <>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          onClick={() => window.location.href = '/admin'}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Settings size={16} />
          Admin
        </Button>
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-4 pt-20">
          <div className="flex items-center justify-center gap-4 mb-2">
            <p className="text-sm text-gray-300">
              Showing {countriesCount} of {countriesCount} countries
            </p>
            
            {isGeneratingQuestions && (
              <Badge variant="secondary" className="flex items-center gap-1 animate-pulse">
                <Bot size={12} />
                AI Generating Questions
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-gray-400">
            🤖 Powered by OpenRouter AI • Dynamic question generation for all countries
          </p>
        </div>
      </div>
    </>
  );
};
