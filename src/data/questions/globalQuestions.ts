
import { Question } from "../../types/quiz";

// 50 global questions that test knowledge across the world
const globalQuestions: Question[] = [
  // History category
  {
    id: "global-history-1",
    type: "multiple-choice",
    text: "Which empire was the largest contiguous land empire in history?",
    choices: [
      { id: "a", text: "Roman Empire", isCorrect: false },
      { id: "b", text: "British Empire", isCorrect: false },
      { id: "c", text: "Mongol Empire", isCorrect: true },
      { id: "d", text: "Persian Empire", isCorrect: false },
    ],
    category: "History",
    explanation: "The Mongol Empire was the largest contiguous land empire in history, covering over 16% of Earth's land surface during the 13th century.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  {
    id: "global-history-2",
    type: "multiple-choice",
    text: "In which year did World War I begin?",
    choices: [
      { id: "a", text: "1914", isCorrect: true },
      { id: "b", text: "1918", isCorrect: false },
      { id: "c", text: "1939", isCorrect: false },
      { id: "d", text: "1945", isCorrect: false },
    ],
    category: "History",
    explanation: "World War I began in 1914 with the assassination of Archduke Franz Ferdinand and ended in 1918.",
    difficulty: "easy",
    lastUpdated: "2025-04-24",
  },
  {
    id: "global-history-3",
    type: "multiple-choice",
    text: "Which ancient wonder was located in Alexandria, Egypt?",
    choices: [
      { id: "a", text: "Hanging Gardens", isCorrect: false },
      { id: "b", text: "Colossus of Rhodes", isCorrect: false },
      { id: "c", text: "Lighthouse (Pharos)", isCorrect: true },
      { id: "d", text: "Temple of Artemis", isCorrect: false },
    ],
    category: "History",
    explanation: "The Lighthouse of Alexandria, also known as the Pharos of Alexandria, was one of the Seven Wonders of the Ancient World located in Alexandria, Egypt.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  
  // Geography category
  {
    id: "global-geo-1",
    type: "multiple-choice",
    text: "Which of these is the largest ocean on Earth?",
    choices: [
      { id: "a", text: "Atlantic Ocean", isCorrect: false },
      { id: "b", text: "Pacific Ocean", isCorrect: true },
      { id: "c", text: "Indian Ocean", isCorrect: false },
      { id: "d", text: "Arctic Ocean", isCorrect: false },
    ],
    category: "Geography",
    explanation: "The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 30% of the Earth's surface.",
    difficulty: "easy",
    lastUpdated: "2025-04-24",
  },
  {
    id: "global-geo-2",
    type: "multiple-choice",
    text: "Which mountain range separates Europe from Asia?",
    choices: [
      { id: "a", text: "Alps", isCorrect: false },
      { id: "b", text: "Himalayas", isCorrect: false },
      { id: "c", text: "Andes", isCorrect: false },
      { id: "d", text: "Ural Mountains", isCorrect: true },
    ],
    category: "Geography",
    explanation: "The Ural Mountains are considered the boundary between Europe and Asia, running from north to south through Russia.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  
  // Culture category
  {
    id: "global-culture-1",
    type: "image",
    text: "Which architectural style is shown in this famous building?",
    imageUrl: "https://i.imgur.com/8c7X3yP.jpg", // Taj Mahal
    choices: [
      { id: "a", text: "Gothic", isCorrect: false },
      { id: "b", text: "Baroque", isCorrect: false },
      { id: "c", text: "Mughal", isCorrect: true },
      { id: "d", text: "Byzantine", isCorrect: false },
    ],
    category: "Culture",
    explanation: "The Taj Mahal is one of the most famous examples of Mughal architecture, combining Persian, Islamic, and Indian architectural styles.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  
  // Continue with more global questions...
  // Food category
  {
    id: "global-food-1",
    type: "multiple-choice",
    text: "Which country is the origin of sushi?",
    choices: [
      { id: "a", text: "China", isCorrect: false },
      { id: "b", text: "Japan", isCorrect: true },
      { id: "c", text: "Thailand", isCorrect: false },
      { id: "d", text: "Vietnam", isCorrect: false },
    ],
    category: "Food",
    explanation: "Sushi originated in Japan as a way to preserve fish in fermented rice. The modern form of sushi as a fresh food became popular in the 19th century.",
    difficulty: "easy",
    lastUpdated: "2025-04-24",
  },
  
  // Music category
  {
    id: "global-music-1",
    type: "multiple-choice",
    text: "Which composer wrote 'The Four Seasons'?",
    choices: [
      { id: "a", text: "Ludwig van Beethoven", isCorrect: false },
      { id: "b", text: "Wolfgang Amadeus Mozart", isCorrect: false },
      { id: "c", text: "Johann Sebastian Bach", isCorrect: false },
      { id: "d", text: "Antonio Vivaldi", isCorrect: true },
    ],
    category: "Music",
    explanation: "'The Four Seasons' is a set of four violin concertos composed by Antonio Vivaldi in 1723.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  
  // Sports category
  {
    id: "global-sports-1",
    type: "multiple-choice",
    text: "In which year were the first modern Olympic Games held?",
    choices: [
      { id: "a", text: "1896", isCorrect: true },
      { id: "b", text: "1900", isCorrect: false },
      { id: "c", text: "1924", isCorrect: false },
      { id: "d", text: "1936", isCorrect: false },
    ],
    category: "Sports",
    explanation: "The first modern Olympic Games were held in Athens, Greece, in 1896, featuring athletes from 14 nations.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },

  // Science category
  {
    id: "global-science-1",
    type: "multiple-choice",
    text: "Who formulated the theory of general relativity?",
    choices: [
      { id: "a", text: "Isaac Newton", isCorrect: false },
      { id: "b", text: "Albert Einstein", isCorrect: true },
      { id: "c", text: "Stephen Hawking", isCorrect: false },
      { id: "d", text: "Niels Bohr", isCorrect: false },
    ],
    category: "Science",
    explanation: "Albert Einstein published his theory of general relativity in 1915, describing gravity as a geometric property of space and time.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  
  // Add more global questions until we have 50...
];

// Additional questions to reach 50 total would be added here

export default globalQuestions;
