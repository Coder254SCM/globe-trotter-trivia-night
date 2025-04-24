
import { Question } from "../types/quiz";

const usaQuestions: Question[] = [
  {
    id: "usa-q1",
    type: "multiple-choice",
    text: "Which city is the capital of the United States?",
    choices: [
      { id: "a", text: "New York", isCorrect: false },
      { id: "b", text: "Washington, D.C.", isCorrect: true },
      { id: "c", text: "Los Angeles", isCorrect: false },
      { id: "d", text: "Chicago", isCorrect: false },
    ],
    category: "Geography",
    explanation: "Washington, D.C. has been the capital of the United States since 1790.",
    difficulty: "easy",
  },
  {
    id: "usa-q2",
    type: "multiple-choice",
    text: "Who wrote the Declaration of Independence?",
    choices: [
      { id: "a", text: "George Washington", isCorrect: false },
      { id: "b", text: "Benjamin Franklin", isCorrect: false },
      { id: "c", text: "Thomas Jefferson", isCorrect: true },
      { id: "d", text: "John Adams", isCorrect: false },
    ],
    category: "History",
    explanation: "Thomas Jefferson was the principal author of the Declaration of Independence.",
    difficulty: "medium",
  },
];

export default usaQuestions;
