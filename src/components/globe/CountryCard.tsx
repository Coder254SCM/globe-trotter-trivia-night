
import { Country } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Landmark } from "lucide-react";
import dynamic from "next/dynamic";

const Football = dynamic(() => import("lucide-react").then(mod => mod.Football));

interface CountryCardProps {
  country: Country;
  onClose: () => void;
  onStartQuiz: () => void;
}

export const CountryCard = ({ country, onClose, onStartQuiz }: CountryCardProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 animate-fade-in">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose}></div>
      <Card className="w-full max-w-md p-6 relative z-20 border-primary/20 shadow-lg shadow-primary/20">
        <div className="flex items-center gap-4 mb-6">
          {country.categories.includes('Museum') && <Landmark className="inline-block mr-1" size={24} />}
          {country.categories.includes('Sports') && <Football className="inline-block mr-1" size={24} />}
          
          {country.flagImageUrl && (
            <img 
              src={country.flagImageUrl} 
              alt={`${country.name} flag`}
              className="w-12 h-8 object-cover shadow-sm"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{country.name}</h2>
            <p className="text-muted-foreground">
              <MapPin className="inline-block mr-1" size={16} />
              Quiz {country.difficulty} difficulty
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Categories:</h3>
          <div className="flex flex-wrap gap-2">
            {country.categories.map((category) => (
              <span 
                key={category}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
        
        <Button onClick={onStartQuiz} className="w-full">
          Start {country.name} Quiz
        </Button>
        
        <Button 
          variant="ghost" 
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          ✕
        </Button>
      </Card>
    </div>
  );
};

