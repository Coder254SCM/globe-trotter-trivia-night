
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizService } from '@/services/supabase/quizService';
import { Globe, Database, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const ProductionDataInitializer = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('Ready to initialize production data');
  const [countriesPopulated, setCountriesPopulated] = useState(false);
  const [questionsGenerated, setQuestionsGenerated] = useState(false);

  const initializeProductionData = async () => {
    setIsInitializing(true);
    setProgress(0);
    
    try {
      // Step 1: Populate ALL 195 countries
      setStatus('Populating ALL 195 countries...');
      setProgress(10);
      
      await QuizService.populateAllCountries();
      setCountriesPopulated(true);
      setProgress(30);
      
      toast({
        title: "✅ Countries Populated",
        description: "All 195 countries have been added to the database",
      });

      // Step 2: Generate EASY questions for each country
      setStatus('Generating EASY questions for all countries...');
      setProgress(40);
      
      const countries = await QuizService.getAllCountries();
      console.log(`📊 Processing ${countries.length} countries for question generation`);
      
      let processedCount = 0;
      for (const country of countries) {
        setStatus(`Generating 600 EASY questions for ${country.name}...`);
        
        try {
          await QuizService.generateEasyQuestionsForCountry(country.id);
          processedCount++;
          
          const progressPercent = 40 + (processedCount / countries.length) * 50;
          setProgress(progressPercent);
          
          console.log(`✅ Generated questions for ${country.name} (${processedCount}/${countries.length})`);
        } catch (error) {
          console.error(`❌ Failed to generate questions for ${country.name}:`, error);
        }
      }
      
      setQuestionsGenerated(true);
      setProgress(100);
      setStatus(`🎉 Production initialization complete! ${countries.length} countries with EASY questions ready!`);
      
      toast({
        title: "🎉 Production Ready!",
        description: `All ${countries.length} countries now have 600 EASY questions each (50 per month per difficulty)`,
      });
      
    } catch (error) {
      console.error('❌ Production initialization failed:', error);
      setStatus('❌ Initialization failed. Check console for details.');
      
      toast({
        title: "❌ Initialization Failed",
        description: "There was an error during initialization. Check the console for details.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const checkDatabaseStatus = async () => {
    try {
      const countries = await QuizService.getAllCountries();
      
      toast({
        title: "📊 Database Status",
        description: `Currently ${countries.length} countries in database`,
      });
      
      if (countries.length === 195) {
        setCountriesPopulated(true);
      }
    } catch (error) {
      console.error('Error checking database:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Production Data Initializer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            This will populate the production database with ALL 195 countries and generate 600 EASY questions per country.
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {countriesPopulated ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
              <span className="text-sm">Countries Population (195 total)</span>
            </div>
            
            <div className="flex items-center gap-2">
              {questionsGenerated ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
              <span className="text-sm">EASY Questions Generation (117,000 total)</span>
            </div>
          </div>
          
          {isInitializing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">{status}</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={initializeProductionData}
              disabled={isInitializing}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {isInitializing ? 'Initializing...' : 'Initialize Production Data'}
            </Button>
            
            <Button
              onClick={checkDatabaseStatus}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Check Status
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Production Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Total Countries:</strong> 195
            </div>
            <div>
              <strong>Questions per Country:</strong> 600
            </div>
            <div>
              <strong>Question Difficulty:</strong> EASY
            </div>
            <div>
              <strong>Monthly Rotation:</strong> 50 questions/month
            </div>
            <div>
              <strong>Total Questions:</strong> 117,000
            </div>
            <div>
              <strong>Database:</strong> Supabase PostgreSQL
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
