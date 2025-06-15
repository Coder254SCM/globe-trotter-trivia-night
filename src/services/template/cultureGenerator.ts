
import { Country } from "../supabase/country/countryTypes";

export function generateCultureQuestion(country: Country, difficulty: string, seed: number) {
  const questionTypes = [
    () => ({
      text: `Which of these cultural aspects is most commonly associated with ${country.name}?`,
      correct: `Traditional festivals and celebrations`,
      options: [
        `Traditional festivals and celebrations`,
        `Ancient pyramid architecture`,
        `Viking heritage sites`,
        `Samurai warrior traditions`
      ],
      explanation: `Like many countries, ${country.name} has rich cultural traditions including festivals and celebrations.`
    }),
    () => ({
      text: `What type of cultural influence has most shaped ${country.name}?`,
      correct: `Regional neighboring countries`,
      options: [
        `Regional neighboring countries`,
        `Ancient Roman empire`,
        `Medieval Viking raids`,
        `Colonial Portuguese traders`
      ],
      explanation: `${country.name} has been primarily influenced by its regional neighbors and geographic location.`
    }),
    () => ({
      text: `Which statement best describes the cultural diversity of ${country.name}?`,
      correct: `Reflects the geographic region of ${country.continent}`,
      options: [
        `Reflects the geographic region of ${country.continent}`,
        `Exclusively based on ancient Egyptian traditions`,
        `Purely influenced by Nordic customs`,
        `Only follows medieval European practices`
      ],
      explanation: `The culture of ${country.name} reflects its location in ${country.continent}.`
    })
  ];

  const selectedType = questionTypes[seed % questionTypes.length];
  return selectedType();
}
