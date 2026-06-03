import { describe, it, expect } from "vitest";
import { generateRealQuestions } from "./realQuestionGenerator";
import { REAL_COUNTRY_DATA } from "@/data/realCountryData";

const sampleCountries = Object.keys(REAL_COUNTRY_DATA).slice(0, 15);

function answerSignature(q: any) {
  return q.choices
    .map((c: any) => c.text.trim().toLowerCase())
    .sort()
    .join("|");
}

describe("generateRealQuestions deduplication", () => {
  for (const name of sampleCountries) {
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      it(`produces no duplicate question texts for ${name} (${difficulty})`, () => {
        const country = { id: name.toLowerCase().replace(/\s+/g, "-"), name, continent: "" };
        const qs = generateRealQuestions(country, difficulty, 10);
        expect(qs.length).toBeGreaterThan(0);

        const texts = qs.map((q) => q.text.trim().toLowerCase());
        expect(new Set(texts).size).toBe(texts.length);
      });

      it(`produces no duplicate answer-sets for ${name} (${difficulty})`, () => {
        const country = { id: name.toLowerCase().replace(/\s+/g, "-"), name, continent: "" };
        const qs = generateRealQuestions(country, difficulty, 10);
        const sigs = qs.map((q) => `${q.text}::${answerSignature(q)}`);
        expect(new Set(sigs).size).toBe(sigs.length);
      });

      it(`every question has exactly 4 unique choices with one correct (${name}, ${difficulty})`, () => {
        const country = { id: name.toLowerCase().replace(/\s+/g, "-"), name, continent: "" };
        const qs = generateRealQuestions(country, difficulty, 10);
        for (const q of qs) {
          expect(q.choices).toHaveLength(4);
          const texts = q.choices.map((c) => c.text);
          expect(new Set(texts).size).toBe(4);
          expect(q.choices.filter((c) => c.isCorrect)).toHaveLength(1);
        }
      });
    }
  }
});
