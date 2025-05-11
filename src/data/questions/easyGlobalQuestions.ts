
import { Question } from "../../types/quiz";
import { countryQuestions } from "../../utils/quiz/questionSets";

// Collect easy questions from all countries with deduplication
const collectEasyQuestions = (): Question[] => {
  const allEasyQuestions: Question[] = [];
  const seenQuestionTexts = new Set<string>();
  
  // Gather unique easy questions from all countries
  Object.values(countryQuestions).forEach(countryQuestionSet => {
    const easyQuestions = countryQuestionSet.filter(q => q.difficulty === "easy");
    
    easyQuestions.forEach(question => {
      // Only add questions we haven't seen before (based on question text)
      if (!seenQuestionTexts.has(question.text)) {
        seenQuestionTexts.add(question.text);
        allEasyQuestions.push({...question});
      }
    });
  });
  
  // Make IDs unique and update timestamps
  return allEasyQuestions.map(question => ({
    ...question,
    category: question.category,
    id: `global-easy-${question.id}`, // Make IDs unique
    lastUpdated: new Date().toISOString()
  }));
};

const easyGlobalQuestions = collectEasyQuestions();

export default easyGlobalQuestions;
