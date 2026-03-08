
import { useEffect, useState } from 'react';
import { DatabaseInitializationService } from '@/services/database/initializationService';
import { useToast } from '@/hooks/use-toast';

export const AutoInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeIfNeeded = async () => {
      // Use a versioned key so we re-init when data format changes
      const sessionKey = 'quiz_db_initialized_v2';
      const alreadyInitialized = sessionStorage.getItem(sessionKey);
      
      if (alreadyInitialized === 'true') {
        setInitialized(true);
        return;
      }

      setInitializing(true);
      
      try {
        console.log('🚀 Auto-initializing database with REAL country data...');
        await DatabaseInitializationService.initializeDatabase();
        
        sessionStorage.setItem(sessionKey, 'true');
        setInitialized(true);
        
        toast({
          title: "Database Ready!",
          description: "All countries now have factually accurate questions.",
        });
        
      } catch (error) {
        console.error('Failed to auto-initialize:', error);
        toast({
          title: "Initialization Warning",
          description: "Some features may be limited. Questions will be generated on-demand.",
          variant: "destructive"
        });
      } finally {
        setInitializing(false);
      }
    };

    initializeIfNeeded();
  }, [toast]);

  if (initializing) {
    return (
      <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg z-50">
        🚀 Generating real quiz questions...
      </div>
    );
  }

  return null;
};
