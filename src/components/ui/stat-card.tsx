
import { ReactNode } from 'react';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
  color?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  className,
  color = 'primary'
}: StatCardProps) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-md",
      "border-l-4 border-l-primary",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-foreground">
              {value}
            </p>
            {change && (
              <p className={cn("text-sm font-medium", getTrendColor(change.trend))}>
                {change.trend === 'up' ? '↗' : change.trend === 'down' ? '↘' : '→'} {change.value}
              </p>
            )}
          </div>
          
          {icon && (
            <div className={`p-3 rounded-full bg-${color}/10 text-${color}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
