
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
 * Migration script to verify difficulty migration status:
 * All questions have been migrated to 'easy' difficulty since they can be answered in under a minute
 */
async function verifyDifficultyMigration() {
  console.log('🔄 Verifying difficulty migration status...');
  
  try {
    // Get count of questions by difficulty
    const { data: difficultyCounts, error: countError } = await supabase
      .from('questions')
      .select('difficulty')
      .then(async (result) => {
        if (result.error) throw result.error;
        
        // Count by difficulty
        const counts = result.data.reduce((acc, q) => {
          acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        return { data: counts, error: null };
      });
    
    if (countError) {
      throw new Error(`Error counting questions by difficulty: ${countError.message}`);
    }
    
    console.log('📊 Current question distribution by difficulty:');
    Object.entries(difficultyCounts || {}).forEach(([difficulty, count]) => {
      console.log(`  - ${difficulty}: ${count} questions`);
    });
    
    const totalQuestions = Object.values(difficultyCounts || {}).reduce((sum, count) => sum + count, 0);
    console.log(`  - Total: ${totalQuestions} questions`);
    
    // Check if migration is complete
    const nonEasyQuestions = Object.entries(difficultyCounts || {})
      .filter(([difficulty]) => difficulty !== 'easy')
      .reduce((sum, [, count]) => sum + count, 0);
    
    if (nonEasyQuestions === 0) {
      console.log('✅ Migration completed successfully! All questions are now "easy" difficulty.');
      console.log('\n📋 Next Steps:');
      console.log('1. Generate new medium-difficulty questions (college-level)');
      console.log('2. Generate new hard-difficulty questions (PhD-level)');
      console.log('3. Test the new difficulty levels in the application');
    } else {
      console.log(`⚠️  Warning: ${nonEasyQuestions} questions still have non-easy difficulty`);
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

/**
 * Generate new questions for medium and hard difficulties
 */
async function generateNewDifficultyQuestions() {
  console.log('\n🔄 Starting generation of new medium and hard difficulty questions...');
  
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
    
    console.log('\n📋 To generate new medium and hard questions:');
    console.log('1. Run: npm run generate-questions -- --medium-only');
    console.log('2. Run: npm run generate-questions -- --hard-only');
    console.log('3. Or run: npm run generate-questions (for both)');
    
    console.log('\n🎯 New difficulty levels will be:');
    console.log('- Easy: Basic knowledge (current questions - under 1 minute)');
    console.log('- Medium: College-level knowledge (2-3 minutes)');
    console.log('- Hard: PhD-level expertise (3-5 minutes)');
    
  } catch (error) {
    console.error('❌ Question generation setup failed:', error);
  }
}

// Main execution
async function main() {
  console.log('🚀 Globe Trotter Trivia - Difficulty Migration Verification');
  console.log('========================================================\n');
  
  await verifyDifficultyMigration();
  await generateNewDifficultyQuestions();
  
  console.log('\n✨ Migration verification completed!');
}

// Run the verification if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { verifyDifficultyMigration, generateNewDifficultyQuestions };
