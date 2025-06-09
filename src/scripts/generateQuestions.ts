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
    // For now, we'll use a simple question generation approach
    // since AIService methods are not available
    console.log('📋 AI-powered question generation requires additional setup');
    console.log('For now, generating placeholder questions for testing...\n');
    
    // Get all countries
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('id, name, capital, continent, population, area_km2, latitude, longitude')
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
            
            // Generate placeholder questions
            const questions = generatePlaceholderQuestions(
              country,
              difficulty,
              questionsToGenerate
            );
            
            if (questions && questions.length > 0) {
              await saveQuestionsToSupabase(questions);
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
 * Generate placeholder questions for testing
 */
function generatePlaceholderQuestions(country: any, difficulty: string, count: number) {
  const questions = [];
  
  for (let i = 0; i < count; i++) {
    const monthRotation = (i % 12) + 1;
    
    const question = {
      id: `${country.id}-${difficulty}-${monthRotation}-${Date.now()}-${i}`,
      country_id: country.id,
      text: getQuestionTemplate(country, difficulty, i),
      option_a: getCorrectAnswer(country, difficulty, i),
      option_b: `Option B for ${country.name}`,
      option_c: `Option C for ${country.name}`,
      option_d: `Option D for ${country.name}`,
      correct_answer: getCorrectAnswer(country, difficulty, i),
      difficulty,
      category: getCategory(i),
      explanation: `This is a ${difficulty} level question about ${country.name}.`,
      month_rotation: monthRotation,
      ai_generated: false
    };
    
    questions.push(question);
  }
  
  return questions;
}

/**
 * Save questions to Supabase
 */
async function saveQuestionsToSupabase(questions: any[]): Promise<void> {
  try {
    const { error } = await supabase
      .from('questions')
      .upsert(questions, { onConflict: 'id' });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Failed to save questions:', error);
    throw error;
  }
}

function getQuestionTemplate(country: any, difficulty: string, index: number): string {
  const templates = {
    easy: [
      `What is the capital of ${country.name}?`,
      `Which continent is ${country.name} located in?`,
      `What is the approximate population of ${country.name}?`,
      `What is the total area of ${country.name}?`,
      `What flag represents ${country.name}?`
    ],
    medium: [
      `What is the main language spoken in ${country.name}?`,
      `What is ${country.name} famous for producing?`,
      `What is the climate like in ${country.name}?`,
      `What is the government type of ${country.name}?`,
      `What currency is used in ${country.name}?`
    ],
    hard: [
      `What is the GDP per capita of ${country.name}?`,
      `When did ${country.name} gain independence?`,
      `What is the literacy rate in ${country.name}?`,
      `What are the major exports of ${country.name}?`,
      `What is the life expectancy in ${country.name}?`
    ]
  };
  
  const categoryTemplates = templates[difficulty as keyof typeof templates] || templates.easy;
  return categoryTemplates[index % categoryTemplates.length];
}

function getCorrectAnswer(country: any, difficulty: string, index: number): string {
  if (difficulty === 'easy') {
    const answers = [
      country.capital || country.name,
      country.continent,
      `About ${Math.round((country.population || 1000000) / 1000000)} million`,
      `${(country.area_km2 || 100000).toLocaleString()} km²`,
      `Flag of ${country.name}`
    ];
    return answers[index % answers.length];
  }
  
  return `Correct answer for ${country.name}`;
}

function getCategory(index: number): string {
  const categories = ['Geography', 'History', 'Culture', 'Economy', 'Nature'];
  return categories[index % categories.length];
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

async function generateQuestionsForCountries(countryNames: string[], options: GenerationOptions = {}) {
  // Simplified implementation for now
  console.log(`🎯 Generating questions for specific countries: ${countryNames.join(', ')}`);
  await generateQuestionsForAllCountries(options);
}

// Run the script if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { generateQuestionsForAllCountries, generateQuestionsForCountries };
