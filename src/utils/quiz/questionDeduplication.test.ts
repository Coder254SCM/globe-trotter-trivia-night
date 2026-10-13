import { describe, expect, it } from 'vitest';
import { deduplicateQuestions } from './questionDeduplication';
import { Question } from '@/types/quiz';

const question = (id: string, text: string, wrong: string): Question => ({
  id, text, type: 'multiple-choice', category: 'Geography',
  choices: [{ id: 'a', text: 'Asia', isCorrect: true }, { id: 'b', text: wrong, isCorrect: false }],
});

describe('database question deduplication', () => {
  it('removes the same question with different distractors', () => {
    const first = question('1', 'On which continent is South Korea located?', 'Europe');
    expect(deduplicateQuestions([first, question('2', first.text, 'Africa')])).toEqual([first]);
  });
  it('normalizes punctuation, case and whitespace', () => {
    expect(deduplicateQuestions([
      question('1', 'Which continent?', 'Europe'),
      question('2', '  WHICH   CONTINENT! ', 'Africa'),
    ])).toHaveLength(1);
  });
  it('preserves different questions sharing a correct answer', () => {
    expect(deduplicateQuestions([
      question('1', 'Which continent contains Japan?', 'Europe'),
      question('2', 'Which continent contains South Korea?', 'Africa'),
    ])).toHaveLength(2);
  });
});