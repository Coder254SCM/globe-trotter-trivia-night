import { Country } from "./country/countryTypes";
import { QuestionService } from "./questionService";

export class MediumQuestionService {
  static async generateMediumQuestionsForCountry(
    country: Country, 
    questionsPerCategory: number = 15
  ): Promise<void> {
    const categories = ['Geography', 'History', 'Culture', 'Economy', 'Politics'];
    const questions: any[] = [];
    
    for (const category of categories) {
      for (let i = 0; i < questionsPerCategory; i++) {
        const monthRotation = (i % 12) + 1;
        
        const question = {
          id: `${country.id}-medium-${category.toLowerCase()}-${monthRotation}-${i}`,
          country_id: country.id,
          text: this.getMediumQuestionTemplate(country, category, i),
          option_a: this.getMediumCorrectAnswer(country, category, i),
          option_b: `Option B for ${country.name}`,
          option_c: `Option C for ${country.name}`,
          option_d: `Option D for ${country.name}`,
          correct_answer: this.getMediumCorrectAnswer(country, category, i),
          difficulty: 'medium',
          category,
          explanation: `This is a medium level ${category} question about ${country.name} requiring specific knowledge.`,
          month_rotation: monthRotation,
          ai_generated: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          image_url: null
        };
        
        questions.push(question);
      }
    }
    
    await QuestionService.saveQuestions(questions);
    console.log(`✅ Generated ${questions.length} medium questions for ${country.name} across all categories`);
  }

  static async generateMediumQuestionsForAllCountries(questionsPerCategory: number = 15): Promise<void> {
    const { CountryService } = await import('./countryService');
    const countries = await CountryService.getAllCountries();
    
    console.log(`📝 Generating medium questions for ${countries.length} countries...`);
    
    for (const country of countries) {
      await this.generateMediumQuestionsForCountry(country, questionsPerCategory);
    }
    
    console.log('✅ Completed generating medium questions for all countries');
  }

  private static getMediumQuestionTemplate(country: Country, category: string, index: number): string {
    const templates = {
      Geography: [
        `What is the total land area of ${country.name} in square kilometers?`,
        `Which mountain range/river system is most prominent in ${country.name}?`,
        `What is the population density of ${country.name}?`,
        `Which countries share the longest border with ${country.name}?`,
        `What is the highest point in ${country.name}?`,
        `What type of climate zone covers most of ${country.name}?`,
        `Which body of water is most important to ${country.name}'s geography?`,
        `What percentage of ${country.name} is urban vs rural?`,
        `Which natural resources are most abundant in ${country.name}?`,
        `What is the average elevation of ${country.name}?`,
        `Which geographic feature defines ${country.name}'s borders?`,
        `What is the coastline length of ${country.name}?`,
        `Which region of ${country.name} has the highest population?`,
        `What geological formation is ${country.name} known for?`,
        `Which time zone(s) does ${country.name} operate in?`
      ],
      History: [
        `When did ${country.name} achieve independence and from whom?`,
        `What was the most significant historical period for ${country.name}?`,
        `Which empire or colonial power had the greatest influence on ${country.name}?`,
        `What major war significantly affected ${country.name} in the 20th century?`,
        `When was the current constitution of ${country.name} established?`,
        `What was the original name of ${country.name} before independence?`,
        `Which historical figure is most celebrated in ${country.name}?`,
        `What major revolution or uprising occurred in ${country.name}?`,
        `When did ${country.name} join the United Nations?`,
        `What was the most significant treaty signed by ${country.name}?`,
        `Which period marked the golden age of ${country.name}?`,
        `What major discovery was made in ${country.name}?`,
        `When did slavery end in ${country.name}?`,
        `What was the most devastating natural disaster in ${country.name}'s history?`,
        `Which historical event led to major demographic changes in ${country.name}?`
      ],
      Culture: [
        `What is the traditional dress/costume of ${country.name} called?`,
        `Which indigenous language is still spoken in ${country.name}?`,
        `What is the most important cultural festival in ${country.name}?`,
        `Which art form originated in ${country.name}?`,
        `What is the traditional wedding ceremony like in ${country.name}?`,
        `Which mythology or folklore is central to ${country.name}'s culture?`,
        `What is the traditional music style of ${country.name}?`,
        `Which cultural practice is unique to ${country.name}?`,
        `What role does religion play in ${country.name}'s culture?`,
        `Which traditional craft is ${country.name} famous for?`,
        `What is the coming-of-age tradition in ${country.name}?`,
        `Which literary work best represents ${country.name}'s culture?`,
        `What is the traditional greeting in ${country.name}?`,
        `Which cultural symbol represents ${country.name}?`,
        `What is the traditional housing style in ${country.name}?`
      ],
      Economy: [
        `What is the GDP per capita of ${country.name}?`,
        `Which industry contributes most to ${country.name}'s economy?`,
        `What is ${country.name}'s main export commodity?`,
        `Which economic bloc or trade agreement does ${country.name} belong to?`,
        `What is the unemployment rate in ${country.name}?`,
        `Which multinational corporations are headquartered in ${country.name}?`,
        `What is the inflation rate trend in ${country.name}?`,
        `Which natural resource drives ${country.name}'s economy?`,
        `What is the poverty rate in ${country.name}?`,
        `Which trading partner is most important to ${country.name}?`,
        `What is the economic growth rate of ${country.name}?`,
        `Which sector employs the most people in ${country.name}?`,
        `What is the national debt level of ${country.name}?`,
        `Which economic challenge does ${country.name} face most?`,
        `What is the income inequality level in ${country.name}?`
      ],
      Politics: [
        `What type of government system does ${country.name} have?`,
        `How many political parties are represented in ${country.name}'s parliament?`,
        `What is the term length for the head of government in ${country.name}?`,
        `Which international organization does ${country.name} belong to?`,
        `What is the voting age in ${country.name}?`,
        `How is the head of state chosen in ${country.name}?`,
        `What is the structure of ${country.name}'s legislature?`,
        `Which political ideology dominates in ${country.name}?`,
        `What is the role of the military in ${country.name}'s politics?`,
        `How are judges appointed in ${country.name}?`,
        `What is the federalism structure of ${country.name}?`,
        `Which political rights are guaranteed in ${country.name}?`,
        `What is the electoral system used in ${country.name}?`,
        `How are local governments organized in ${country.name}?`,
        `What is the press freedom rating of ${country.name}?`
      ]
    };
    
    const categoryTemplates = templates[category as keyof typeof templates] || templates.Geography;
    return categoryTemplates[index % categoryTemplates.length];
  }

  private static getMediumCorrectAnswer(country: Country, category: string, index: number): string {
    // Enhanced answers based on category and actual country data
    if (category === 'Geography') {
      if (index % 5 === 0) return `${country.area_km2?.toLocaleString()} km²`;
      if (index % 5 === 2) return `${Math.round((country.population || 0) / (country.area_km2 || 1))} people per km²`;
    }
    
    return `Medium-level answer for ${country.name} - ${category}`;
  }
}
