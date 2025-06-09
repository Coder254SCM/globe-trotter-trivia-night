
import { createClient } from '@supabase/supabase-js';
import { Database } from '../integrations/supabase/types';
import { AIService } from '../services/aiService';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

interface GenerationOptions {
  difficulties?: string[];
  countries?: string[];
  questionsPerDifficulty?: number;
  batchSize?: number;
  delayBetweenBatches?: number;
}

/**
 * Generate questions for all countries with the new difficulty system
 * Easy questions already exist (migrated from previous questions)
 * We need to generate medium and hard questions
 */
async function generateQuestionsForAllCountries(options: GenerationOptions = {}) {
  const {
    difficulties = ['medium', 'hard'], // Easy questions already exist
    questionsPerDifficulty = 15,
    batchSize = 5,
    delayBetweenBatches = 3000
  } = options;
  
  console.log('🚀 Globe Trotter Trivia - Question Generation Script');
  console.log('===================================================\n');
  console.log('📝 Current Status:');
  console.log('- Easy questions: ✅ Already migrated (under 1 minute)');
  console.log('- Medium questions: 🔄 Will generate (college-level, 2-3 minutes)');
  console.log('- Hard questions: 🔄 Will generate (PhD-level, 3-5 minutes)\n');
  
  try {
    // Check if AI service is available
    const isOllamaAvailable = await AIService.checkOllamaAvailability();
    if (!isOllamaAvailable) {
      console.log('❌ Ollama is not available. Please ensure Ollama is running.');
      console.log('📋 Setup instructions:');
      console.log('1. Install Ollama from https://ollama.ai');
      console.log('2. Run: ollama pull llama3.2:3b');
      console.log('3. Start Ollama service');
      process.exit(1);
    }
    
    // Ensure the model is available
    await AIService.ensureModelAvailable();
    
    // Get all countries
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('id, name, capital, continent, population, area_km2')
      .order('name');
    
    if (countriesError) {
      throw new Error(`Error fetching countries: ${countriesError.message}`);
    }
    
    if (!countries || countries.length === 0) {
      console.log('❌ No countries found in database');
      return;
    }
    
    console.log(`📍 Found ${countries.length} countries`);
    console.log(`🎯 Generating questions for difficulties: ${difficulties.join(', ')}`);
    console.log(`📊 ${questionsPerDifficulty} questions per difficulty per country`);
    console.log(`⏱️  Processing in batches of ${batchSize} countries\n`);
    
    let totalGenerated = 0;
    let totalFailed = 0;
    
    // Process countries in batches
    for (let i = 0; i < countries.length; i += batchSize) {
      const batch = countries.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(countries.length / batchSize);
      
      console.log(`\n🔄 Processing batch ${batchNumber}/${totalBatches} (${batch.length} countries)`);
      
      for (const country of batch) {
        console.log(`\n🌍 Generating questions for ${country.name}...`);
        
        for (const difficulty of difficulties) {
          try {
            // Check if questions already exist for this country and difficulty
            const { count: existingCount, error: countError } = await supabase
              .from('questions')
              .select('*', { count: 'exact', head: true })
              .eq('country_id', country.id)
              .eq('difficulty', difficulty);
            
            if (countError) {
              console.log(`  ⚠️  Error checking existing questions for ${difficulty}: ${countError.message}`);
              continue;
            }
            
            if (existingCount && existingCount >= questionsPerDifficulty) {
              console.log(`  ✅ ${difficulty} questions already exist (${existingCount}) - skipping`);
              continue;
            }
            
            const questionsToGenerate = questionsPerDifficulty - (existingCount || 0);
            
            console.log(`  🤖 Generating ${questionsToGenerate} ${difficulty} questions...`);
            
            const questions = await AIService.generateQuestions(
              country,
              difficulty,
              questionsToGenerate
            );
            
            if (questions && questions.length > 0) {
              await AIService.saveQuestionsToSupabase(questions);
              console.log(`  ✅ Generated and saved ${questions.length} ${difficulty} questions`);
              totalGenerated += questions.length;
            } else {
              console.log(`  ❌ Failed to generate ${difficulty} questions`);
              totalFailed++;
            }
            
            // Small delay between difficulties
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.log(`  ❌ Error generating ${difficulty} questions: ${error}`);
            totalFailed++;
          }
        }
      }
      
      // Delay between batches (except for the last batch)
      if (i + batchSize < countries.length) {
        console.log(`\n⏳ Waiting ${delayBetweenBatches / 1000}s before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
    
    // Final statistics
    console.log('\n🎉 Question generation completed!');
    console.log('=====================================');
    console.log(`📊 Total questions generated: ${totalGenerated}`);
    console.log(`❌ Total failures: ${totalFailed}`);
    
    // Get final counts by difficulty
    const allDifficulties = ['easy', 'medium', 'hard'];
    for (const difficulty of allDifficulties) {
      const { count, error } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('difficulty', difficulty);
      
      if (!error) {
        const status = difficulty === 'easy' ? '✅ (migrated)' : 
                      difficulties.includes(difficulty) ? '🆕 (new)' : '⏳ (pending)';
        console.log(`📈 Total ${difficulty} questions: ${count} ${status}`);
      }
    }
    
    console.log('\n✨ Quiz difficulty levels now available:');
    console.log('- Easy: Basic knowledge (under 1 minute)');
    console.log('- Medium: College-level knowledge (2-3 minutes)');
    console.log('- Hard: PhD-level expertise (3-5 minutes)');
    
  } catch (error) {
    console.error('❌ Question generation failed:', error);
    process.exit(1);
  }
}

/**
 * Generate questions for specific countries
 */
async function generateQuestionsForCountries(countryNames: string[], options: GenerationOptions = {}) {
  const { data: countries, error } = await supabase
    .from('countries')
    .select('id, name, capital, continent, population, area_km2')
    .in('name', countryNames);
  
  if (error) {
    throw new Error(`Error fetching countries: ${error.message}`);
  }
  
  if (!countries || countries.length === 0) {
    console.log(`❌ No countries found matching: ${countryNames.join(', ')}`);
    return;
  }
  
  console.log(`🎯 Generating questions for specific countries: ${countries.map(c => c.name).join(', ')}`);
  
  await generateQuestionsForAllCountries({
    ...options,
    countries: countries.map(c => c.id)
  });
}

/**
 * Main execution function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('🤖 Globe Trotter Trivia - Question Generation Script');
    console.log('====================================================\n');
    console.log('📝 Current Status: Easy questions migrated, need medium/hard');
    console.log('');
    console.log('Usage:');
    console.log('  npm run generate-questions                    # Generate medium & hard for all countries');
    console.log('  npm run generate-questions -- --sample        # Generate for 10 sample countries');
    console.log('  npm run generate-questions -- --country "USA" # Generate for specific country');
    console.log('  npm run generate-questions -- --medium-only   # Generate only medium difficulty');
    console.log('  npm run generate-questions -- --hard-only     # Generate only hard difficulty');
    console.log('');
    console.log('Options:');
    console.log('  --sample          Generate for first 10 countries only');
    console.log('  --country NAME    Generate for specific country');
    console.log('  --medium-only     Generate only medium difficulty questions');
    console.log('  --hard-only       Generate only hard difficulty questions');
    console.log('  --help, -h        Show this help message');
    return;
  }
  
  let options: GenerationOptions = {};
  
  // Parse command line arguments
  if (args.includes('--medium-only')) {
    options.difficulties = ['medium'];
  } else if (args.includes('--hard-only')) {
    options.difficulties = ['hard'];
  }
  
  if (args.includes('--sample')) {
    // Generate for first 10 countries only
    const { data: countries, error } = await supabase
      .from('countries')
      .select('name')
      .order('name')
      .limit(10);
    
    if (error) {
      console.error('Error fetching sample countries:', error.message);
      process.exit(1);
    }
    
    if (countries) {
      await generateQuestionsForCountries(countries.map(c => c.name), options);
    }
    return;
  }
  
  const countryIndex = args.indexOf('--country');
  if (countryIndex !== -1 && args[countryIndex + 1]) {
    const countryName = args[countryIndex + 1];
    await generateQuestionsForCountries([countryName], options);
    return;
  }
  
  // Default: generate for all countries
  await generateQuestionsForAllCountries(options);
}

// Run the script if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { generateQuestionsForAllCountries, generateQuestionsForCountries };
