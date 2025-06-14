
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AppHeaderProps {
  countriesCount: number;
}

export const AppHeader = ({ countriesCount }: AppHeaderProps) => {
  return (
    <>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          onClick={() => window.location.href = '/admin'}
          variant="outline"
          size="sm"
        >
          Admin
        </Button>
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-4 pt-20">
          <p className="text-sm text-gray-300">
            Showing {countriesCount} of {countriesCount} countries
          </p>
        </div>
      </div>
    </>
  );
};
