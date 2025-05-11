
import { Question } from "../../types/quiz";
import { countryQuestions } from "../../utils/quiz/questionSets";

// Collect easy questions from all countries
const collectEasyQuestions = (): Question[] => {
  const allEasyQuestions: Question[] = [];
  
  // Gather questions from all countries
  Object.values(countryQuestions).forEach(countryQuestionSet => {
    const easyQuestions = countryQuestionSet.filter(q => q.difficulty === "easy");
    allEasyQuestions.push(...easyQuestions);
  });
  
  // Add a unique category for these collected questions, using a valid category
  return allEasyQuestions.map(question => ({
    ...question,
    category: question.category, // Keep the original category instead of using "Global Knowledge"
    id: `global-easy-${question.id}`, // Make IDs unique
    lastUpdated: new Date().toISOString()
  }));
};

const easyGlobalQuestions = collectEasyQuestions();

export default easyGlobalQuestions;
