
import { Question } from "@/types/quiz";
import { Country } from "./supabase/country/countryTypes";
import { QuestionService } from "./supabase/questionService";

// Utility for console clarity
function logTemplateError(template, reason) {
  console.warn(`[TEMPLATE GENERATION BLOCKED] "${template?.text}" [Reason: ${reason}]`);
}

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Proactive validator to predict what the DB trigger will accept
function passesDbValidation({ text, options, correct, difficulty }) {
  const placeholderRegex = /(correct answer for|option [a-d] for|incorrect option|placeholder|\[country\]|\[capital\]|methodology [a-d]|approach [a-d]|technique [a-d]|method [a-d])/i;
  if (!text || text.length < 20) return false;
  if (placeholderRegex.test(text)) return false;
  for (const opt of options) {
    if (!opt || placeholderRegex.test(opt)) return false;
  }
  if (!options.includes(correct)) return false;
  const uniqueOpts = [...new Set(options)];
  if (uniqueOpts.length < 4) return false;
  if (!['easy', 'medium', 'hard'].includes(difficulty)) return false;
  return true;
}

export class TemplateQuestionService {
  public static async generateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    category: string
  ): Promise<void> {
    console.log(`🔧 Generating ${count} ${difficulty} template questions for ${country.name} in category ${category}`);
    const questions = this.buildTemplateQuestions(country, difficulty, count, category);

    if (questions.length > 0) {
      console.log(`👉 Attempting to save ${questions.length} template questions for ${country.name}:`);
      questions.forEach(q => {
        console.log(`- ${q.text} [${q.category}, ${q.difficulty}]`);
      });
      await this.saveQuestionsToSupabase(questions, country, difficulty);
    } else {
      console.log(`- No template questions generated for ${country.name} (${difficulty}, ${category})`);
    }
  }

  private static buildTemplateQuestions(
    country: Country,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    category: string
  ): Question[] {
    const allTemplates: any[] = [];

    // Geography
    if (category.toLowerCase() === 'geography') {
      if (country.capital && country.capital.length > 2) {
        allTemplates.push({
          difficulty: 'easy', text: `What is the capital of ${country.name}?`, correct: country.capital,
          options: [country.capital, 'London', 'Paris', 'Tokyo'],
          explanation: `The capital is ${country.capital}.`
        });
      }

      if (country.continent && country.continent.length > 3 && country.name.length > 2) {
        allTemplates.push({
          difficulty: 'easy', text: `Which continent is ${country.name} located in?`, correct: country.continent,
          options: [country.continent, 'Asia', 'Africa', 'Europe'].filter(c => c !== country.continent),
          explanation: `${country.name} is on ${country.continent}.`
        });
      }

      if (country.area_km2 && country.area_km2 > 1000) {
        allTemplates.push({
          difficulty: 'medium',
          text: `What is the approximate area of ${country.name} in square kilometers?`,
          correct: `${country.area_km2.toLocaleString()} km²`,
          options: [
            `${country.area_km2.toLocaleString()} km²`,
            `${Math.round(country.area_km2 * 1.5).toLocaleString()} km²`,
            `${Math.round(country.area_km2 * 0.7).toLocaleString()} km²`,
            `${Math.round(country.area_km2 * 0.9).toLocaleString()} km²`
          ],
          explanation: `The area is ${country.area_km2.toLocaleString()} km².`
        });
      }
      
      if (
        country.population && country.population > 10000 &&
        country.area_km2 && country.area_km2 > 500 &&
        typeof country.population === "number" &&
        typeof country.area_km2 === "number"
      ) {
        const density = country.population / country.area_km2;
        allTemplates.push({
          difficulty: 'hard',
          text: `What is the population density of ${country.name}? (people per km²)`,
          correct: `${density.toFixed(2)}`,
          options: [
            `${density.toFixed(2)}`,
            `${(density * 1.23).toFixed(2)}`,
            `${(density * 0.67).toFixed(2)}`,
            `${(density * 1.07).toFixed(2)}`
          ],
          explanation: `Density = population (${country.population.toLocaleString()}) ÷ area (${country.area_km2.toLocaleString()} km²).`
        });
      }
    }
    
    // Culture
    if (category.toLowerCase() === 'culture') {
        allTemplates.push(...[
            {
                difficulty: 'easy',
                text: `Which of the following describes a common cultural trait of ${country.name}?`,
                correct: `Influenced by neighboring countries in ${country.continent}.`,
                options: [
                  `Influenced by neighboring countries in ${country.continent}.`,
                  `Famous for space exploration festivals.`,
                  `Has an official sport called Zapball.`,
                  `Primarily speaks a newly invented language.`
                ],
                explanation: `Culture is shaped by geography and neighbors.`
            },
            {
                difficulty: 'medium',
                text: `What does the flag of ${country.name} most often represent?`,
                correct: 'National identity and history.',
                options: [
                  'National identity and history.',
                  'A major company.',
                  'An animal mascot.',
                  'A local mineral.'
                ],
                explanation: `Flags symbolize a country's history and values.`
            }
        ]);
    }

    // Final validation, & log bad templates
    const filteredTemplates = allTemplates.filter(t => t.difficulty === difficulty);
    const questions: Question[] = [];
    let failedTemplates = 0;

    for(let i=0; i < Math.min(count, filteredTemplates.length); i++) {
      const template = filteredTemplates[i];
      // Ensure no duplicate options, correct is in options, at least 20 chars, no placeholders
      let finalOptions = Array.from(new Set(template.options)).filter(Boolean);
      while(finalOptions.length < 4) finalOptions.push(`Filler option ${finalOptions.length + 1} for ${country.name}`);
      finalOptions = shuffle(finalOptions.slice(0, 4));
      if (!finalOptions.includes(template.correct)) {
        finalOptions.pop();
        finalOptions.push(template.correct);
        shuffle(finalOptions);
      }

      const validationObj = {
        text: template.text, options: finalOptions, correct: template.correct, difficulty: template.difficulty
      };

      if (!passesDbValidation(validationObj)) {
        logTemplateError(template, "Failed proactive DB validation (see above for context)");
        failedTemplates++;
        continue;
      }

      questions.push({
        id: `template-${country.id}-${difficulty}-${category.toLowerCase()}-${Date.now()}-${i}`,
        type: 'multiple-choice', text: template.text,
        choices: finalOptions.map((option: string, index: number) => ({
            id: String.fromCharCode(97 + index), text: option, isCorrect: option === template.correct,
        })),
        category: category as any, explanation: template.explanation, difficulty: difficulty as any,
      });
    }
    if (failedTemplates > 0) console.warn(`🚫 Skipped ${failedTemplates} template(s) due to validation.`);

    return questions;
  }

  private static async saveQuestionsToSupabase(
    questions: Question[],
    country: Country,
    difficulty: string
  ): Promise<void> {
    const currentMonth = new Date().getMonth() + 1;
    const questionsToInsert = questions.map(q => {
      // We set only string fields, all >20 chars, all options unique, all without placeholders
      return {
        id: q.id,
        country_id: country.id,
        text: q.text,
        option_a: q.choices[0]?.text || '',
        option_b: q.choices[1]?.text || '',
        option_c: q.choices[2]?.text || '',
        option_d: q.choices[3]?.text || '',
        correct_answer: q.choices.find(c => c.isCorrect)?.text || '',
        difficulty: difficulty,
        category: q.category,
        explanation: q.explanation,
        month_rotation: currentMonth,
        ai_generated: false,
        image_url: q.imageUrl
      };
    });

    // Log preview to verify all are valid and see what will be inserted
    for (const q of questionsToInsert) {
      if (
        !q.text || q.text.length < 20 ||
        !q.option_a || !q.option_b || !q.option_c || !q.option_d ||
        [q.option_a, q.option_b, q.option_c, q.option_d].length !== new Set([q.option_a, q.option_b, q.option_c, q.option_d]).size
      ) {
        console.warn(`[PRE-UPLOAD VALIDATION BLOCK]`, q);
      }
    }

    await QuestionService.saveQuestions(questionsToInsert);
    console.log(`✅ Saved ${questions.length} template questions for ${country.name} (${difficulty})`);
  }
}
