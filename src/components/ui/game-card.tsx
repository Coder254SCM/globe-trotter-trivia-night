
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface GameCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  glowColor?: string;
  interactive?: boolean;
}

export const GameCard = ({ 
  title, 
  description, 
  children, 
  className,
  badge,
  badgeVariant = 'default',
  glowColor = 'primary',
  interactive = false
}: GameCardProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300",
      interactive && "hover:shadow-xl hover:scale-[1.02] cursor-pointer",
      "border-border/50 bg-card/95 backdrop-blur-sm",
      className
    )}>
      {/* Glow Effect */}
      {interactive && (
        <div className={`absolute inset-0 bg-gradient-to-r from-${glowColor}/10 to-${glowColor}/5 opacity-0 hover:opacity-100 transition-opacity duration-300`} />
      )}
      
      {/* Corner Decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {title}
          </CardTitle>
          {badge && (
            <Badge variant={badgeVariant} className="animate-pulse">
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="relative">
        {children}
      </CardContent>
    </Card>
  );
};
