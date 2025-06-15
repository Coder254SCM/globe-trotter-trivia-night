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

  // Center modal on screen and prevent background scroll when card is open
  React.useEffect(() => {
    // Lock scroll on mount
    document.body.classList.add("overflow-hidden");
    return () => {
      // Release scroll lock on unmount
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

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

  const handleStartQuiz = () => {
    // Build up-to-date country, set in storage, and log for verification
    const countryWithDifficulty = {
      ...country,
      difficulty: selectedDifficulty
    };
    sessionStorage.setItem('selectedCountry', JSON.stringify(countryWithDifficulty));
    console.log('🌍 [CountryCard] Saved country in sessionStorage:', countryWithDifficulty);
    onStartQuiz(selectedDifficulty);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(16,21,33,0.88)" }}>
      {/* Clicking backdrop closes the modal */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md" onClick={onClose}></div>
      <Card className="w-full max-w-md p-6 relative z-20 border-primary/20 shadow-lg shadow-primary/20 animate-fade-in">
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
                className={`p-3 rounded-md border-2 transition-all capitalize font-semibold text-lg
                  ${selectedDifficulty === difficulty ? 
                    `${getDifficultyColor(difficulty)} text-white border-transparent` : 
                    'border-border hover:border-primary/50'
                  }`}
                style={selectedDifficulty === difficulty ? { boxShadow: "0 0 0 2px #10b981" } : undefined}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Available Categories:</h3>
          <div className="flex flex-wrap gap-2">
            {country.categories.slice(0, 8).map((category) => (
              <span 
                key={category}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
              >
                {category}
              </span>
            ))}
            {country.categories.length > 8 && (
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                +{country.categories.length - 8} more
              </span>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleStartQuiz}
          className={`w-full ${getDifficultyColor(selectedDifficulty)} hover:opacity-90 transition-opacity font-semibold text-lg py-3`}
        >
          Continue to Quiz Settings
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
