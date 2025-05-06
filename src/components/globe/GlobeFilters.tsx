
import React from "react";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuestionCategory } from "@/types/quiz";

interface GlobeFiltersProps {
  availableContinents: string[];
  allCategories: QuestionCategory[];
  selectedContinent: string | null;
  selectedCategory: QuestionCategory | null;
  filteredCountriesCount: number;
  onContinentChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
}

export const GlobeFilters: React.FC<GlobeFiltersProps> = ({
  availableContinents,
  allCategories,
  selectedContinent,
  selectedCategory,
  filteredCountriesCount,
  onContinentChange,
  onCategoryChange,
  onClearFilters
}) => {
  return (
    <div className="absolute top-24 right-4 z-10 bg-background/90 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className="text-primary" />
        <h3 className="font-medium">Explore by</h3>
      </div>
      
      <div className="grid gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Continent</label>
          <Select 
            value={selectedContinent || "all"} 
            onValueChange={onContinentChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Continents" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Continents</SelectItem>
                {availableContinents.map((continent) => (
                  <SelectItem key={continent} value={continent}>
                    {continent}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Category</label>
          <Select 
            value={selectedCategory || "all"}
            onValueChange={onCategoryChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectGroup>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories
                  .sort((a, b) => a.localeCompare(b))
                  .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearFilters}
          className="mt-2"
        >
          Clear Filters
        </Button>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Showing:</p>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline">{filteredCountriesCount} Countries</Badge>
          {selectedContinent && (
            <Badge variant="secondary">{selectedContinent}</Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary">{selectedCategory}</Badge>
          )}
        </div>
      </div>
    </div>
  );
};
