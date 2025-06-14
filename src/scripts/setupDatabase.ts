/**
 * Database Setup Script
 * 
 * This script helps initialize the Globe Trotter Trivia database with:
 * 1. All 195 countries
 * 2. Template-generated questions for all difficulty levels
 * 3. Comprehensive audit of question quality
 * 
 * Usage:
 * 1. Run: npm run setup-db
 */

import { QuizService } from '../services/supabase/quizService';

class DatabaseSetup {
  /**
   * Initialize the complete database setup with audit
   */
  static async initializeDatabase(): Promise<void> {
    console.log('🚀 Starting Globe Trotter Trivia database setup...');
    
    try {
      // Step 1: Populate countries
      console.log('\n📋 Step 1: Populating countries database...');
      await QuizService.populateAllCountries();
      console.log('✅ All 195 countries have been added to the database');
      
      // Step 2: Generate questions for all countries
      console.log('\n📋 Step 2: Generating template questions for all countries...');
      console.log('⏳ This may take a while...');
      
      await QuizService.generateQuestionsForAllCountries(20); // 20 questions per difficulty per country
      
      // Step 3: Run comprehensive audit
      console.log('\n📋 Step 3: Running comprehensive question audit...');
      const auditResults = await QuizService.auditQuestions();
      
      console.log('\n🎉 Database setup completed successfully!');
      console.log('📊 Summary:');
      console.log('   • 195 countries added');
      console.log('   • ~11,700 questions generated (20 per difficulty × 3 difficulties × 195 countries)');
      console.log('\n🔍 Audit Results:');
      console.log(`   • Total Questions: ${auditResults.totalQuestions}`);
      console.log(`   • Wrong Country Assignment: ${auditResults.wrongCountryQuestions}`);
      console.log(`   • Wrong Category Assignment: ${auditResults.wrongCategoryQuestions}`);
      console.log(`   • Issues Found: ${auditResults.details.length}`);
      
      if (auditResults.details.length > 0) {
        console.log('\n⚠️ Top Issues Found:');
        auditResults.details.slice(0, 5).forEach((issue, index) => {
          console.log(`${index + 1}. ${issue.assignedCountry} - ${issue.text}`);
          console.log(`   Issues: ${issue.issues.join(', ')}`);
        });
      }
      
      console.log('\n✅ Ready for trivia gameplay!');
      
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      throw error;
    }
  }
  
  /**
   * Run audit only (no database changes)
   */
  static async auditOnly(): Promise<void> {
    try {
      console.log('🔍 Running comprehensive question audit...');
      
      const auditResults = await QuizService.auditQuestions();
      
      console.log('\n📊 AUDIT RESULTS:');
      console.log(`Total Questions: ${auditResults.totalQuestions}`);
      console.log(`Questions in Wrong Country: ${auditResults.wrongCountryQuestions}`);
      console.log(`Questions in Wrong Category: ${auditResults.wrongCategoryQuestions}`);
      console.log(`Total Issues Found: ${auditResults.details.length}`);
      
      if (auditResults.details.length > 0) {
        console.log('\n🚨 DETAILED ISSUES:');
        auditResults.details.forEach((issue, index) => {
          console.log(`\n${index + 1}. Question ID: ${issue.questionId}`);
          console.log(`   Country: ${issue.assignedCountry}`);
          console.log(`   Category: ${issue.assignedCategory}`);
          console.log(`   Text: ${issue.text}`);
          console.log(`   Issues: ${issue.issues.join(', ')}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Audit failed:', error);
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
      
      await QuizService.generateQuestionsForCountry(country, 20);
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
      // Populate countries
      await QuizService.populateAllCountries();
      
      // Generate questions for just 10 countries for quick testing
      const countries = await QuizService.getAllCountries();
      const testCountries = countries.slice(0, 10);
      
      console.log(`🎯 Generating questions for ${testCountries.length} countries (quick setup)...`);
      
      for (const country of testCountries) {
        await QuizService.generateQuestionsForCountry(country, 5); // Only 5 questions per difficulty
      }
      
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
    case 'audit':
      DatabaseSetup.auditOnly();
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
      console.log('  npm run setup-db audit    - Run audit only (no database changes)');
      console.log('  npm run setup-db quick    - Quick setup (10 countries, fewer questions)');
      console.log('  npm run setup-db country "Country Name" - Generate questions for specific country');
      console.log('');
      console.log('Prerequisites:');
      console.log('  1. Database must be initialized via Admin panel first');
      break;
  }
}

export { DatabaseSetup };
