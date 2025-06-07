/**
 * Database Setup Script
 * 
 * This script helps initialize the Globe Trotter Trivia database with:
 * 1. All 195 countries
 * 2. AI-generated questions for all difficulty levels
 * 
 * Usage:
 * 1. Ensure Ollama is installed and running (see AIService.getInstallationInstructions())
 * 2. Run: npm run setup-db
 */

import { QuizService } from '../services/supabase/quizService';
import { AIService } from '../services/aiService';

class DatabaseSetup {
  /**
   * Initialize the complete database setup
   */
  static async initializeDatabase(): Promise<void> {
    console.log('🚀 Starting Globe Trotter Trivia database setup...');
    
    try {
      // Step 1: Check if Ollama is available
      console.log('\n📋 Step 1: Checking AI service availability...');
      const isOllamaAvailable = await AIService.checkOllamaAvailability();
      
      if (!isOllamaAvailable) {
        console.log('❌ Ollama is not available. Please install and start Ollama first.');
        console.log(AIService.getInstallationInstructions());
        return;
      }
      
      console.log('✅ Ollama is available');
      
      // Step 2: Ensure the model is available
      console.log('\n📋 Step 2: Ensuring AI model is available...');
      await AIService.ensureModelAvailable();
      console.log('✅ AI model is ready');
      
      // Step 3: Populate countries
      console.log('\n📋 Step 3: Populating countries database...');
      await QuizService.populateAllCountries();
      console.log('✅ All 195 countries have been added to the database');
      
      // Step 4: Generate questions for all countries
      console.log('\n📋 Step 4: Generating AI questions for all countries...');
      console.log('⏳ This may take a while (estimated 30-60 minutes for all countries)...');
      
      await QuizService.generateQuestionsForAllCountries(20); // 20 questions per difficulty per country
      
      console.log('\n🎉 Database setup completed successfully!');
      console.log('📊 Summary:');
      console.log('   • 195 countries added');
      console.log('   • ~11,700 questions generated (20 per difficulty × 3 difficulties × 195 countries)');
      console.log('   • Ready for trivia gameplay!');
      
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      throw error;
    }
  }
  
  /**
   * Generate questions for a specific country
   */
  static async generateQuestionsForCountry(countryName: string): Promise<void> {
    try {
      console.log(`🎯 Generating questions for ${countryName}...`);
      
      const countries = await QuizService.getAllCountries();
      const country = countries.find(c => 
        c.name.toLowerCase().includes(countryName.toLowerCase())
      );
      
      if (!country) {
        console.log(`❌ Country "${countryName}" not found`);
        console.log('Available countries:', countries.map(c => c.name).slice(0, 10).join(', '), '...');
        return;
      }
      
      await AIService.generateAllDifficultyQuestions(country, 20);
      console.log(`✅ Generated questions for ${country.name}`);
      
    } catch (error) {
      console.error('❌ Question generation failed:', error);
      throw error;
    }
  }
  
  /**
   * Quick setup for development (fewer questions)
   */
  static async quickSetup(): Promise<void> {
    console.log('⚡ Starting quick development setup...');
    
    try {
      // Check Ollama
      const isOllamaAvailable = await AIService.checkOllamaAvailability();
      if (!isOllamaAvailable) {
        console.log('❌ Ollama not available. Install it first.');
        console.log(AIService.getInstallationInstructions());
        return;
      }
      
      await AIService.ensureModelAvailable();
      
      // Populate countries
      await QuizService.populateAllCountries();
      
      // Generate questions for just 10 countries for quick testing
      const countries = await QuizService.getAllCountries();
      const testCountries = countries.slice(0, 10);
      
      console.log(`🎯 Generating questions for ${testCountries.length} countries (quick setup)...`);
      await AIService.batchGenerateQuestions(testCountries, 5); // Only 5 questions per difficulty
      
      console.log('⚡ Quick setup completed!');
      console.log(`📊 Generated questions for: ${testCountries.map(c => c.name).join(', ')}`);
      
    } catch (error) {
      console.error('❌ Quick setup failed:', error);
      throw error;
    }
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const arg = process.argv[3];
  
  switch (command) {
    case 'full':
      DatabaseSetup.initializeDatabase();
      break;
    case 'quick':
      DatabaseSetup.quickSetup();
      break;
    case 'country':
      if (!arg) {
        console.log('❌ Please provide a country name: npm run setup-db country "United States"');
        process.exit(1);
      }
      DatabaseSetup.generateQuestionsForCountry(arg);
      break;
    default:
      console.log('🌍 Globe Trotter Trivia Database Setup');
      console.log('');
      console.log('Usage:');
      console.log('  npm run setup-db full     - Complete setup (all countries, all questions)');
      console.log('  npm run setup-db quick    - Quick setup (10 countries, fewer questions)');
      console.log('  npm run setup-db country "Country Name" - Generate questions for specific country');
      console.log('');
      console.log('Prerequisites:');
      console.log('  1. Install Ollama: https://ollama.ai');
      console.log('  2. Start Ollama: ollama serve');
      console.log('  3. Pull model: ollama pull llama3.2:3b');
      break;
  }
}

export { DatabaseSetup };