
import { Question } from "../types/quiz";

const globalQuestions: Question[] = [
  {
    id: "global-q1",
    type: "multiple-choice",
    text: "Which of these is the largest ocean on Earth?",
    choices: [
      { id: "a", text: "Atlantic Ocean", isCorrect: false },
      { id: "b", text: "Pacific Ocean", isCorrect: true },
      { id: "c", text: "Indian Ocean", isCorrect: false },
      { id: "d", text: "Arctic Ocean", isCorrect: false },
    ],
    category: "Geography",
    explanation: "The Pacific Ocean is the largest and deepest ocean on Earth.",
    difficulty: "easy",
  },
  {
    id: "global-q2",
    type: "multiple-choice",
    text: "Which organization was established after World War II to maintain international peace?",
    choices: [
      { id: "a", text: "NATO", isCorrect: false },
      { id: "b", text: "European Union", isCorrect: false },
      { id: "c", text: "United Nations", isCorrect: true },
      { id: "d", text: "World Bank", isCorrect: false },
    ],
    category: "History",
    explanation: "The United Nations (UN) was established in 1945 after World War II to maintain international peace and security.",
    difficulty: "medium",
  },
];

export default globalQuestions;
