
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Globe, Filter } from "lucide-react";

interface GlobeFiltersProps {
  availableContinents: string[];
  allCategories: string[];
  selectedContinent: string;
  selectedCategory: string;
  filteredCountriesCount: number;
  totalCountriesCount: number;
  onContinentChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
}

export const GlobeFilters = ({
  availableContinents,
  allCategories,
  selectedContinent,
  selectedCategory,
  filteredCountriesCount,
  totalCountriesCount,
  onContinentChange,
  onCategoryChange,
  onClearFilters
}: GlobeFiltersProps) => {
  const hasActiveFilters = selectedContinent !== "all" || selectedCategory !== "all";

  return (
    <Card className="absolute top-20 left-4 p-4 bg-background/90 backdrop-blur-sm border-primary/20 z-10">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={18} className="text-primary" />
        <h3 className="font-medium text-sm">Explore Countries</h3>
      </div>
      
      <div className="space-y-3 min-w-[200px]">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Continent</label>
          <Select value={selectedContinent} onValueChange={onContinentChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Continents</SelectItem>
              {availableContinents.map((continent) => (
                <SelectItem key={continent} value={continent}>
                  {continent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Category</label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe size={12} />
            <span>Showing {filteredCountriesCount} of {totalCountriesCount}</span>
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-6 px-2 text-xs"
            >
              <X size={12} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
