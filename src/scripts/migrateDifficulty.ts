import { createClient } from '@supabase/supabase-js';
import { Database } from '../integrations/supabase/types';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

/**
 * Migration script to adjust question difficulties:
 * - Move all existing 'hard' questions to 'easy'
 * - This prepares the database for the new difficulty system where:
 *   - Easy: Basic knowledge (current hard questions become easy)
 *   - Medium: College-level knowledge (new questions to be generated)
 *   - Hard: PhD-level knowledge (new questions to be generated)
 */
async function migrateDifficulty() {
  console.log('🔄 Starting difficulty migration...');
  
  try {
    // Step 1: Get count of existing hard questions
    const { count: hardCount, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('difficulty', 'hard');
    
    if (countError) {
      throw new Error(`Error counting hard questions: ${countError.message}`);
    }
    
    console.log(`📊 Found ${hardCount} hard questions to migrate to easy`);
    
    if (hardCount === 0) {
      console.log('✅ No hard questions found. Migration not needed.');
      return;
    }
    
    // Step 2: Update all hard questions to easy
    const { data: updatedQuestions, error: updateError } = await supabase
      .from('questions')
      .update({ difficulty: 'easy' })
      .eq('difficulty', 'hard')
      .select('id, country_id, text');
    
    if (updateError) {
      throw new Error(`Error updating questions: ${updateError.message}`);
    }
    
    console.log(`✅ Successfully migrated ${updatedQuestions?.length || 0} questions from hard to easy`);
    
    // Step 3: Show sample of migrated questions
    if (updatedQuestions && updatedQuestions.length > 0) {
      console.log('\n📝 Sample of migrated questions:');
      updatedQuestions.slice(0, 5).forEach((q, index) => {
        console.log(`${index + 1}. ${q.text.substring(0, 80)}...`);
      });
      
      if (updatedQuestions.length > 5) {
        console.log(`... and ${updatedQuestions.length - 5} more questions`);
      }
    }
    
    // Step 4: Verify the migration
    const { count: newHardCount, error: verifyError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('difficulty', 'hard');
    
    if (verifyError) {
      throw new Error(`Error verifying migration: ${verifyError.message}`);
    }
    
    const { count: newEasyCount, error: easyCountError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('difficulty', 'easy');
    
    if (easyCountError) {
      throw new Error(`Error counting easy questions: ${easyCountError.message}`);
    }
    
    console.log('\n📈 Migration Results:');
    console.log(`- Hard questions remaining: ${newHardCount}`);
    console.log(`- Easy questions total: ${newEasyCount}`);
    
    if (newHardCount === 0) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('\n📋 Next Steps:');
      console.log('1. Generate new medium-difficulty questions (college-level)');
      console.log('2. Generate new hard-difficulty questions (PhD-level)');
      console.log('3. Test the new difficulty levels in the application');
    } else {
      console.log(`\n⚠️  Warning: ${newHardCount} hard questions still remain`);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

/**
 * Generate new questions for all countries at medium and hard difficulties
 */
async function generateNewDifficultyQuestions() {
  console.log('\n🔄 Starting generation of new difficulty questions...');
  
  try {
    // Get all countries
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('id, name, capital, continent, population, area_km2');
    
    if (countriesError) {
      throw new Error(`Error fetching countries: ${countriesError.message}`);
    }
    
    console.log(`📍 Found ${countries?.length || 0} countries`);
    
    if (!countries || countries.length === 0) {
      console.log('❌ No countries found in database');
      return;
    }
    
    // Check if we have the AI service available
    const aiServicePath = '../services/aiService';
    try {
      const { AIService } = await import(aiServicePath);
      
      console.log('\n🤖 Generating new medium and hard questions...');
      console.log('This may take several minutes depending on the number of countries...');
      
      // Generate questions for a sample of countries first (to test)
      const sampleCountries = countries.slice(0, 5);
      
      for (const country of sampleCountries) {
        console.log(`\n🌍 Generating questions for ${country.name}...`);
        
        try {
          // Generate medium difficulty questions
          await AIService.generateAllDifficultyQuestions(country, ['medium']);
          console.log(`  ✅ Generated medium questions for ${country.name}`);
          
          // Generate hard difficulty questions
          await AIService.generateAllDifficultyQuestions(country, ['hard']);
          console.log(`  ✅ Generated hard questions for ${country.name}`);
          
          // Add delay to avoid overwhelming the AI service
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.log(`  ❌ Failed to generate questions for ${country.name}: ${error}`);
        }
      }
      
      console.log('\n🎉 Sample question generation completed!');
      console.log('\n📋 To generate questions for all countries, run:');
      console.log('npm run generate-all-questions');
      
    } catch (importError) {
      console.log('\n⚠️  AI Service not available. Questions will need to be generated manually.');
      console.log('Run the application and use the admin panel to generate questions.');
    }
    
  } catch (error) {
    console.error('❌ Question generation failed:', error);
  }
}

// Main execution
async function main() {
  console.log('🚀 Globe Trotter Trivia - Difficulty Migration Script');
  console.log('====================================================\n');
  
  await migrateDifficulty();
  await generateNewDifficultyQuestions();
  
  console.log('\n✨ Migration script completed!');
}

// Run the migration if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { migrateDifficulty, generateNewDifficultyQuestions };