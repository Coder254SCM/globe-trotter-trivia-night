
import { useState } from 'react';
import { Country } from '@/types/quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Globe, Trophy } from 'lucide-react';
import { useAlphabeticalCountries } from '@/hooks/useAlphabeticalCountries';
import { getQuestionCounts } from '@/services/simple/realQuestionGenerator';

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
    <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6 text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
          Choose Your Country
        </h2>
        <p className="text-xs sm:text-base text-muted-foreground">
          Tap a country to start your geography quiz
        </p>
        <p className="text-[11px] sm:text-sm text-muted-foreground mt-1">
          {sortedCountries.length} countries available
        </p>
        {(selectedContinent || selectedCategory) && (
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {selectedContinent && (
              <Badge variant="secondary">
                {selectedContinent}
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary">
                {selectedCategory}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {sortedCountries.map((country) => {
          const counts = getQuestionCounts(country.name);
          return (
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
            <CardHeader className="pb-3 p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-2xl flex-shrink-0">{getCountryIcon(country.continent)}</span>
                  <div className="min-w-0">
                    <CardTitle className="text-base sm:text-lg font-bold truncate">{country.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{country.continent}</span>
                    </p>
                  </div>
                </div>
                {country.flagImageUrl && (
                  <img 
                    src={country.flagImageUrl} 
                    alt={`${country.name} flag`}
                    className="w-9 h-6 sm:w-8 sm:h-6 object-cover rounded shadow-sm flex-shrink-0"
                  />
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0 p-4 sm:p-6 sm:pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <Trophy className="w-3 h-3" />
                  {counts.total} questions
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center py-2 rounded-md border bg-green-50 border-green-200 min-h-[44px] justify-center">
                    <span className="text-[10px] sm:text-[11px] font-medium text-green-700 uppercase">Easy</span>
                    <span className="text-sm font-bold text-green-800">{counts.easy}</span>
                  </div>
                  <div className="flex flex-col items-center py-2 rounded-md border bg-yellow-50 border-yellow-200 min-h-[44px] justify-center">
                    <span className="text-[10px] sm:text-[11px] font-medium text-yellow-700 uppercase">Med</span>
                    <span className="text-sm font-bold text-yellow-800">{counts.medium}</span>
                  </div>
                  <div className="flex flex-col items-center py-2 rounded-md border bg-red-50 border-red-200 min-h-[44px] justify-center">
                    <span className="text-[10px] sm:text-[11px] font-medium text-red-700 uppercase">Hard</span>
                    <span className="text-sm font-bold text-red-800">{counts.hard}</span>
                  </div>
                </div>

                <div className="hidden sm:flex flex-wrap gap-1">
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
                  className="w-full mt-2 text-sm h-11 sm:h-10" 
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
          );
        })}
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
