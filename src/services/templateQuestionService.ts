
import { Question } from "@/types/quiz";
import { Country } from "./supabase/country/countryTypes";
import { QuestionService } from "./supabase/questionService";

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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

    if (category.toLowerCase() === 'geography') {
      allTemplates.push(...[
        {
          difficulty: 'easy', text: `What is the capital of ${country.name}?`, correct: country.capital,
          options: [country.capital, 'London', 'Paris', 'Tokyo'],
          explanation: `The capital is ${country.capital}.`
        },
        {
          difficulty: 'easy', text: `Which continent is ${country.name} located in?`, correct: country.continent,
          options: [country.continent, 'Asia', 'Africa', 'Europe'].filter(c => c !== country.continent),
          explanation: `${country.name} is on ${country.continent}.`
        },
        {
          difficulty: 'medium', text: `What is the approximate area of ${country.name} in square kilometers?`, correct: `${country.area_km2?.toLocaleString()} km²`,
          options: [`${country.area_km2?.toLocaleString()} km²`, `${(country.area_km2 * 1.5).toLocaleString()} km²`, `${(country.area_km2 * 0.5).toLocaleString()} km²`],
          explanation: `The area is ${country.area_km2?.toLocaleString()} km².`
        },
        {
          difficulty: 'hard', text: `What is the population density of ${country.name}? (people per km²)`, correct: `${(country.population / country.area_km2).toFixed(2)}`,
          options: [`${(country.population / country.area_km2).toFixed(2)}`, `${(country.population / country.area_km2 * 1.2).toFixed(2)}`, `${(country.population / country.area_km2 * 0.8).toFixed(2)}`],
          explanation: `Density is population (${country.population.toLocaleString()}) divided by area (${country.area_km2.toLocaleString()} km²).`
        }
      ]);
    }
    
    if (category.toLowerCase() === 'culture') {
        allTemplates.push(...[
            {
                difficulty: 'easy', text: `What is a common cultural aspect of ${country.name}?`, correct: `Influenced by its ${country.continent} neighbors.`,
                options: [`Influenced by its ${country.continent} neighbors.`, 'Known for polar bear festivals.', 'Primary language is Klingon.'],
                explanation: `Cultures are shaped by their region.`
            },
            {
                difficulty: 'medium', text: `What does the flag of ${country.name} often represent?`, correct: 'National identity and history.',
                options: ['National identity and history.', 'A local sports team.', 'A corporate logo.'],
                explanation: `National flags symbolize a country's identity.`
            }
        ]);
    }

    const filteredTemplates = allTemplates.filter(t => t.difficulty === difficulty);
    const questions: Question[] = [];

    for(let i=0; i < Math.min(count, filteredTemplates.length); i++) {
        const template = filteredTemplates[i];
        let finalOptions = Array.from(new Set(template.options.flat().filter((opt: any) => opt)));
        while(finalOptions.length < 4) finalOptions.push(`Placeholder Option ${finalOptions.length + 1}`);
        finalOptions = shuffle(finalOptions.slice(0, 4));
        if (!finalOptions.includes(template.correct)) {
          finalOptions.pop();
          finalOptions.push(template.correct);
          shuffle(finalOptions);
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
    return questions;
  }

  private static async saveQuestionsToSupabase(
    questions: Question[],
    country: Country,
    difficulty: string
  ): Promise<void> {
    const currentMonth = new Date().getMonth() + 1;
    const questionsToInsert = questions.map(q => ({
      id: q.id, country_id: country.id, text: q.text,
      option_a: q.choices[0]?.text || '', option_b: q.choices[1]?.text || '',
      option_c: q.choices[2]?.text || '', option_d: q.choices[3]?.text || '',
      correct_answer: q.choices.find(c => c.isCorrect)?.text || '',
      difficulty: difficulty, category: q.category, explanation: q.explanation,
      month_rotation: currentMonth, ai_generated: false, image_url: q.imageUrl
    }));

    await QuestionService.saveQuestions(questionsToInsert);
    console.log(`✅ Saved ${questions.length} template questions for ${country.name} (${difficulty})`);
  }
}
