import { describe, expect, it } from 'vitest';
import { PICTURE_PACKS } from './picturePacks';
import { buildRounds, ROUNDS_PER_GAME } from '@/pages/PictureQuiz';

const newPackIds = ['currencies', 'sports-logos', 'movie-posters'];

describe('picture quiz packs', () => {
  it.each(newPackIds)('%s supports a complete ten-round game', (id) => {
    const pack = PICTURE_PACKS.find((candidate) => candidate.id === id);
    expect(pack).toBeDefined();
    if (!pack) return;

    expect(pack.items.length).toBeGreaterThanOrEqual(ROUNDS_PER_GAME);
    expect(buildRounds(pack)).toHaveLength(ROUNDS_PER_GAME);
  });

  it.each(PICTURE_PACKS)('$title has unique IDs and four unique answers per picture', (pack) => {
    expect(new Set(pack.items.map((item) => item.id)).size).toBe(pack.items.length);

    for (const item of pack.items) {
      const choices = [item.answer, ...item.distractors];
      expect(choices).toHaveLength(4);
      expect(new Set(choices.map((choice) => choice.trim().toLowerCase())).size).toBe(4);
      expect(item.imageUrl).toMatch(/^https:\/\//);
    }
  });

  it.each(newPackIds)('%s builds rounds without repeated pictures or choices', (id) => {
    const pack = PICTURE_PACKS.find((candidate) => candidate.id === id);
    expect(pack).toBeDefined();
    if (!pack) return;

    for (let run = 0; run < 20; run += 1) {
      const rounds = buildRounds(pack);
      expect(new Set(rounds.map((round) => round.item.id)).size).toBe(rounds.length);
      for (const round of rounds) {
        expect(new Set(round.options).size).toBe(4);
        expect(round.options).toContain(round.item.answer);
      }
    }
  });
});