
import React from "react";
import { Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QuestionCategory } from "@/types/quiz";
import { toast } from "@/components/ui/use-toast";

interface GlobeFiltersProps {
  availableContinents: string[];
  allCategories: string[];
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
  onClearFilters,
}) => {
  const handleClearFilters = () => {
    onClearFilters();
    toast({
      title: "Filters Cleared",
      description: "Now showing all countries on the globe."
    });
  };

  return (
    <div className="fixed left-4 top-20 z-20 bg-background/80 backdrop-blur-md shadow-lg rounded-lg p-4 w-64 border border-border">
      <div className="flex items-center gap-2 mb-4 font-bold text-primary">
        <Filter size={18} />
        <h2>Explore by</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Continent</label>
          <Select 
            value={selectedContinent || "all"} 
            onValueChange={onContinentChange}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="All Continents" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border">
              <SelectItem value="all">All Continents</SelectItem>
              {availableContinents.map((continent) => (
                <SelectItem key={continent} value={continent}>
                  {continent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select 
            value={selectedCategory || "all"} 
            onValueChange={onCategoryChange}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="max-h-80 overflow-y-auto bg-background border border-border">
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          onClick={handleClearFilters}
          className="w-full flex items-center gap-2"
        >
          <X size={14} />
          Clear Filters
        </Button>

        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing: 
            <span className="font-medium ml-2 text-foreground">
              {filteredCountriesCount} Countries
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
