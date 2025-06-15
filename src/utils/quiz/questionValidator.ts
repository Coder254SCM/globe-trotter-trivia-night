
import { Question } from "@/types/quiz";

export const isQuestionInvalid = (question: Question | null | undefined): boolean => {
    if (!question) return true;

    const hasPlaceholderText = question.text?.toLowerCase().includes('placeholder') ||
                             question.text?.includes('[country]') ||
                             question.text?.includes('[capital]') ||
                             question.text?.toLowerCase().includes('quantum physics') ||
                             question.text?.toLowerCase().includes('methodology') ||
                             question.text?.toLowerCase().includes('approach') ||
                             question.text?.toLowerCase().includes('technique');

    const hasInvalidChoices = !question.choices || 
                           question.choices.length < 4 ||
                           question.choices.some(c => 
                             c.text.toLowerCase().includes('placeholder') ||
                             c.text.toLowerCase().includes('option a for') ||
                             c.text.toLowerCase().includes('incorrect option') ||
                             c.text.toLowerCase().includes('methodology') ||
                             c.text.toLowerCase().includes('approach') ||
                             c.text.toLowerCase().includes('technique') ||
                             c.text.toLowerCase().includes('advanced') ||
                             c.text.toLowerCase().includes('cutting-edge') ||
                             c.text.toLowerCase().includes('innovative') ||
                             c.text.toLowerCase().includes('state-of-the-art')
                           );
    
    return hasPlaceholderText || hasInvalidChoices;
}

