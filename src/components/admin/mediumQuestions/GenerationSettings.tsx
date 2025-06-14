
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SimpleCountry {
  id: string;
  name: string;
  continent: string;
}

interface GenerationSettingsProps {
  generationMode: "single" | "all";
  onGenerationModeChange: (mode: "single" | "all") => void;
  selectedCountry: string;
  onSelectedCountryChange: (countryId: string) => void;
  questionsPerCategory: number;
  onQuestionsPerCategoryChange: (count: number) => void;
  countries: SimpleCountry[];
}

export const GenerationSettings = ({
  generationMode,
  onGenerationModeChange,
  selectedCountry,
  onSelectedCountryChange,
  questionsPerCategory,
  onQuestionsPerCategoryChange,
  countries
}: GenerationSettingsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="generation-mode">Generation Mode</Label>
        <Select value={generationMode} onValueChange={onGenerationModeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select generation mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single Country</SelectItem>
            <SelectItem value="all">All Countries</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {generationMode === "single" && (
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select value={selectedCountry} onValueChange={onSelectedCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="questions-per-category">Questions per Category</Label>
        <Input
          id="questions-per-category"
          type="number"
          min="5"
          max="30"
          value={questionsPerCategory}
          onChange={(e) => onQuestionsPerCategoryChange(parseInt(e.target.value) || 15)}
        />
        <p className="text-sm text-muted-foreground">
          Total questions: {questionsPerCategory * 5} (5 categories)
        </p>
      </div>
    </div>
  );
};
