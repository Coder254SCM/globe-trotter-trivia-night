# Project architecture rules

- Extend `src/data/picturePacks.ts` for picture-quiz content so every pack uses the same tested gameplay and scoring flow.
- Deduplicate database quiz questions independently of distractors and top up short country rounds from verified templates; changing answer options must not introduce repeats.