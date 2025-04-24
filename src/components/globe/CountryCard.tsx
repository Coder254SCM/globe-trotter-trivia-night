
import { Country, DifficultyLevel } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Landmark, Trophy, Globe, Leaf, Palette } from "lucide-react";
import { useState } from "react";

interface CountryCardProps {
  country: Country;
  onClose: () => void;
  onStartQuiz: (difficulty: DifficultyLevel) => void;
}

export const CountryCard = ({ country, onClose, onStartQuiz }: CountryCardProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(country.difficulty);

  const getIcon = () => {
    switch (country.iconType) {
      case 'landmark':
        return <Landmark className="inline-block mr-1" size={24} />;
      case 'trophy':
        return <Trophy className="inline-block mr-1" size={24} />;
      case 'culture':
        return <Palette className="inline-block mr-1" size={24} />;
      case 'nature':
        return <Leaf className="inline-block mr-1" size={24} />;
      default:
        return <Globe className="inline-block mr-1" size={24} />;
    }
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 animate-fade-in">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose}></div>
      <Card className="w-full max-w-md p-6 relative z-20 border-primary/20 shadow-lg shadow-primary/20">
        <div className="flex items-center gap-4 mb-6">
          {getIcon()}
          
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
              Select quiz difficulty
            </p>
          </div>
        </div>
        
        {country.mapImageUrl && (
          <div className="mb-6">
            <img 
              src={country.mapImageUrl} 
              alt={`${country.name} map`}
              className="w-full rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Select Difficulty:</h3>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`p-3 rounded-md border-2 transition-all capitalize
                  ${selectedDifficulty === difficulty ? 
                    `${getDifficultyColor(difficulty)} text-white border-transparent` : 
                    'border-border hover:border-primary/50'
                  }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Available Categories:</h3>
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
        
        <Button 
          onClick={() => onStartQuiz(selectedDifficulty)} 
          className="w-full"
        >
          Start {country.name} Quiz ({selectedDifficulty})
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
