# Add and test three picture quiz packs

## Build
- Add Currencies & Banknotes, Sports Team Logos, and Movie Posters to “Do You Know These?”.
- Give every pack at least 10 rounds with accurate answers, plausible alternatives, and reliable free images.
- Keep the existing hub, gameplay, scoring, and mobile layout unchanged.

## Validate
- Confirm every new image loads and each pack can complete a scored 10-question game.
- Run the automated test suite.
- Play several country quizzes chosen at random and check for repeated questions, broken answers, and layout errors.

## Technical details
- Extend the existing typed picture-pack data rather than creating a second quiz system.
- Add focused tests for pack size, unique IDs, four unique choices, valid image URLs, and round generation.
- Record completed checks in the project roadmap.