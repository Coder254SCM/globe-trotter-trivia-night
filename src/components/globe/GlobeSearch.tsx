
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import countries from "../../data/countries";
import { Country } from "@/types/quiz";

interface GlobeSearchProps {
  onCountrySelect: (country: Country) => void;
  onCountryFocus: (countryId: string) => void;
}

export const GlobeSearch: React.FC<GlobeSearchProps> = ({ 
  onCountrySelect,
  onCountryFocus
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setOpen(false);
    onCountryFocus(country.id);
    // Brief timeout to allow the globe to rotate before showing the card
    setTimeout(() => {
      onCountrySelect(country);
    }, 1000);
  };

  return (
    <>
      <Button 
        variant="outline"
        className="fixed right-4 top-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm z-20 shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span>Search Countries</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search all countries..." 
          onValueChange={setSearch}
        />
        <CommandList className="max-h-[80vh]">
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup heading="Countries">
            {countries
              .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((country) => (
                <CommandItem 
                  key={country.id}
                  onSelect={() => handleCountrySelect(country)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-6 h-4 relative overflow-hidden rounded-sm">
                    <img 
                      src={country.flagImageUrl} 
                      alt={`${country.name} flag`} 
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <span>{country.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {country.continent}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
