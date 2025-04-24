
import { Question } from "../../../types/quiz";

const usaQuestions: Question[] = [
  // Original USA questions
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
    lastUpdated: "2025-04-24",
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
    lastUpdated: "2025-04-24",
  },
  
  // Add more questions to reach 50 total
  {
    id: "usa-q3",
    type: "multiple-choice",
    text: "In which year did the United States enter World War II?",
    choices: [
      { id: "a", text: "1939", isCorrect: false },
      { id: "b", text: "1940", isCorrect: false },
      { id: "c", text: "1941", isCorrect: true },
      { id: "d", text: "1942", isCorrect: false },
    ],
    category: "History",
    explanation: "The United States entered World War II after the Japanese attack on Pearl Harbor on December 7, 1941.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  {
    id: "usa-q4",
    type: "image",
    text: "Which famous American landmark is shown in this image?",
    imageUrl: "https://i.imgur.com/rFcCIa1.jpg", // Image of Mount Rushmore
    choices: [
      { id: "a", text: "Mount Rushmore", isCorrect: true },
      { id: "b", text: "Statue of Liberty", isCorrect: false },
      { id: "c", text: "Golden Gate Bridge", isCorrect: false },
      { id: "d", text: "Empire State Building", isCorrect: false },
    ],
    category: "Landmarks",
    explanation: "Mount Rushmore features the carved faces of four U.S. presidents: George Washington, Thomas Jefferson, Theodore Roosevelt, and Abraham Lincoln.",
    difficulty: "easy",
    lastUpdated: "2025-04-24",
  },
  {
    id: "usa-q5",
    type: "multiple-choice",
    text: "Which Amendment to the U.S. Constitution abolished slavery?",
    choices: [
      { id: "a", text: "13th Amendment", isCorrect: true },
      { id: "b", text: "14th Amendment", isCorrect: false },
      { id: "c", text: "15th Amendment", isCorrect: false },
      { id: "d", text: "16th Amendment", isCorrect: false },
    ],
    category: "History",
    explanation: "The 13th Amendment, ratified in 1865, abolished slavery and involuntary servitude in the United States.",
    difficulty: "medium",
    lastUpdated: "2025-04-24",
  },
  {
    id: "usa-q6",
    type: "multiple-choice",
    text: "Which U.S. state has the largest land area?",
    choices: [
      { id: "a", text: "Texas", isCorrect: false },
      { id: "b", text: "California", isCorrect: false },
      { id: "c", text: "Alaska", isCorrect: true },
      { id: "d", text: "Montana", isCorrect: false },
    ],
    category: "Geography",
    explanation: "Alaska is the largest U.S. state by land area, covering more than twice the area of the second-largest state, Texas.",
    difficulty: "easy",
    lastUpdated: "2025-04-24",
  },

  // Continue adding more USA questions to reach 50 total
];

// Additional questions to reach 50 total would be added here

export default usaQuestions;
