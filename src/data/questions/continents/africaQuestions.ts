
import { Question } from "../../../types/quiz";

const africaQuestions: Question[] = [
  // History
  {
    id: "africa-history-1",
    type: "multiple-choice",
    text: "Which African empire was known for its wealth in gold and salt trade?",
    choices: [
      { id: "a", text: "Zulu Kingdom", isCorrect: false },
      { id: "b", text: "Mali Empire", isCorrect: true },
      { id: "c", text: "Ethiopian Empire", isCorrect: false },
      { id: "d", text: "Kingdom of Kush", isCorrect: false },
    ],
    category: "History",
    explanation: "The Mali Empire was known for its immense wealth primarily from gold and salt trades. Mansa Musa, its most famous ruler, is often described as the wealthiest person in history.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  {
    id: "africa-history-2",
    type: "multiple-choice",
    text: "Which year did Nelson Mandela become President of South Africa?",
    choices: [
      { id: "a", text: "1990", isCorrect: false },
      { id: "b", text: "1994", isCorrect: true },
      { id: "c", text: "1999", isCorrect: false },
      { id: "d", text: "2001", isCorrect: false },
    ],
    category: "History",
    explanation: "Nelson Mandela became the first black president of South Africa in 1994, following the country's first democratic elections.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  
  // Geography
  {
    id: "africa-geo-1",
    type: "multiple-choice",
    text: "Which is Africa's highest mountain?",
    choices: [
      { id: "a", text: "Mount Kenya", isCorrect: false },
      { id: "b", text: "Mount Kilimanjaro", isCorrect: true },
      { id: "c", text: "Atlas Mountains", isCorrect: false },
      { id: "d", text: "Mount Meru", isCorrect: false },
    ],
    category: "Geography",
    explanation: "Mount Kilimanjaro, located in Tanzania, is Africa's highest mountain peak at 5,895 meters (19,341 ft) above sea level.",
    difficulty: "easy",
    lastUpdated: "2025-04-24",
  },
  {
    id: "africa-geo-2",
    type: "multiple-choice",
    text: "Which desert covers most of Northern Africa?",
    choices: [
      { id: "a", text: "Arabian Desert", isCorrect: false },
      { id: "b", text: "Kalahari Desert", isCorrect: false },
      { id: "c", text: "Sahara Desert", isCorrect: true },
      { id: "d", text: "Namib Desert", isCorrect: false },
    ],
    category: "Geography",
    explanation: "The Sahara Desert is the largest hot desert in the world, covering most of Northern Africa. It's approximately the size of the United States.",
    difficulty: "easy",
    lastUpdated: "2025-04-24",
  },
  
  // Wildlife
  {
    id: "africa-wildlife-1",
    type: "true-false",
    text: "The 'Big Five' game animals in Africa include the rhinoceros, leopard, lion, elephant, and giraffe.",
    choices: [
      { id: "a", text: "True", isCorrect: false },
      { id: "b", text: "False", isCorrect: true },
    ],
    category: "Wildlife",
    explanation: "False. The 'Big Five' game animals are the lion, leopard, rhinoceros, elephant, and Cape buffalo. The term was coined by big-game hunters for the difficulty in hunting these animals.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  
  // Culture
  {
    id: "africa-culture-1",
    type: "multiple-choice",
    text: "Which African music and dance style originated in the Democratic Republic of Congo?",
    choices: [
      { id: "a", text: "Highlife", isCorrect: false },
      { id: "b", text: "Soukous", isCorrect: true },
      { id: "c", text: "Afrobeat", isCorrect: false },
      { id: "d", text: "Mbalax", isCorrect: false },
    ],
    category: "Culture",
    explanation: "Soukous, also known as Congo or Lingala music, originated in the Belgian Congo and French Congo during the 1930s and early 1940s, gaining popularity throughout Africa.",
    difficulty: "hard",
    lastUpdated: "2025-04-24",
  },

  // Languages
  {
    id: "africa-language-1",
    type: "multiple-choice",
    text: "Which language has the most native speakers in Africa?",
    choices: [
      { id: "a", text: "Swahili", isCorrect: false },
      { id: "b", text: "Hausa", isCorrect: false },
      { id: "c", text: "Arabic", isCorrect: true },
      { id: "d", text: "Amharic", isCorrect: false },
    ],
    category: "Language",
    explanation: "Arabic has the most native speakers in Africa, being the official language in several North African countries and widely spoken across the continent.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  
  // Add more questions to reach 50 total
];

// Additional questions to reach 50 total would be added here

export default africaQuestions;
