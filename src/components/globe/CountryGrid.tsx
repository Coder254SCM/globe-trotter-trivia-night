
import { useState } from 'react';
import { Country } from '@/types/quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Globe, Trophy } from 'lucide-react';
import { useAlphabeticalCountries } from '@/hooks/useAlphabeticalCountries';

interface CountryGridProps {
  countries: Country[];
  onCountrySelect: (country: Country) => void;
  selectedContinent?: string | null;
  selectedCategory?: string | null;
}

export const CountryGrid = ({ 
  countries, 
  onCountrySelect, 
  selectedContinent, 
  selectedCategory 
}: CountryGridProps) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  
  // Sort countries alphabetically
  const sortedCountries = useAlphabeticalCountries(countries);

  const getCountryIcon = (continent: string) => {
    switch (continent?.toLowerCase()) {
      case 'africa': return '🌍';
      case 'asia': return '🌏';
      case 'europe': return '🌍';
      case 'north america': return '🌎';
      case 'south america': return '🌎';
      case 'oceania': return '🌏';
      default: return '🌐';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Choose Your Country
        </h2>
        <p className="text-muted-foreground">
          Select any country to start your geography quiz adventure
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {sortedCountries.length} countries available (A-Z order)
        </p>
        {(selectedContinent || selectedCategory) && (
          <div className="flex justify-center gap-2 mt-4">
            {selectedContinent && (
              <Badge variant="secondary">
                Continent: {selectedContinent}
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary">
                Category: {selectedCategory}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedCountries.map((country) => (
          <Card
            key={country.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${
              hoveredCountry === country.id 
                ? 'border-primary shadow-lg' 
                : 'border-border hover:border-primary/50'
            }`}
            onMouseEnter={() => setHoveredCountry(country.id)}
            onMouseLeave={() => setHoveredCountry(null)}
            onClick={() => onCountrySelect(country)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCountryIcon(country.continent)}</span>
                  <div>
                    <CardTitle className="text-lg font-bold">{country.name}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {country.continent}
                    </p>
                  </div>
                </div>
                {country.flagImageUrl && (
                  <img 
                    src={country.flagImageUrl} 
                    alt={`${country.name} flag`}
                    className="w-8 h-6 object-cover rounded shadow-sm"
                  />
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getDifficultyColor(country.difficulty)}>
                    {country.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Trophy className="w-3 h-3" />
                    50+ questions
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {country.categories.slice(0, 3).map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {country.categories.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{country.categories.length - 3}
                    </Badge>
                  )}
                </div>

                <Button 
                  className="w-full mt-2" 
                  variant={hoveredCountry === country.id ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCountrySelect(country);
                  }}
                >
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedCountries.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Countries Found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more countries.
          </p>
        </div>
      )}
    </div>
  );
};
