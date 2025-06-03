
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportedLanguages, getCurrentLanguage, setCurrentLanguage } from "@/utils/quiz/languages";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

export const LanguageSelector = ({ onLanguageChange }: LanguageSelectorProps) => {
  const currentLanguage = getCurrentLanguage();

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
    
    // Reload the page to apply language changes
    window.location.reload();
  };

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px] h-8">
        <div className="flex items-center gap-2">
          <Globe size={14} />
          <span className="text-sm">{currentLang?.flag} {currentLang?.code.toUpperCase()}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
              <span className="text-xs text-muted-foreground">({language.nativeName})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
