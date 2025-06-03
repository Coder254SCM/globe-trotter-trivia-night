
import { countryQuestions } from "../questionSets";

// Find duplicate questions across all countries
export const findDuplicateQuestions = (): Map<string, string[]> => {
  const questionFingerprints = new Map<string, string[]>();
  
  Object.entries(countryQuestions).forEach(([countryId, questions]) => {
    questions.forEach(question => {
      const fingerprint = question.text.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (!questionFingerprints.has(fingerprint)) {
        questionFingerprints.set(fingerprint, []);
      }
      questionFingerprints.get(fingerprint)!.push(`${countryId}:${question.id}`);
    });
  });
  
  // Return only fingerprints with duplicates
  const duplicates = new Map<string, string[]>();
  questionFingerprints.forEach((locations, fingerprint) => {
    if (locations.length > 1) {
      duplicates.set(fingerprint, locations);
    }
  });
  
  return duplicates;
};
