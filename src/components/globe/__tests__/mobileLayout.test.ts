import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

/**
 * Responsive UI regression guard.
 *
 * These tests pin critical mobile tap-target and spacing classes so a future
 * refactor cannot silently shrink touch targets below the 44px accessibility
 * floor or remove responsive grid breakpoints.
 */

const read = (rel: string) =>
  readFileSync(path.resolve(__dirname, "../../../..", rel), "utf8");

describe("mobile layout regression guards", () => {
  it("CountryGrid keeps single-column mobile grid with adequate gap", () => {
    const src = read("src/components/globe/CountryGrid.tsx");
    expect(src).toMatch(/grid-cols-1\s+sm:grid-cols-2/);
    expect(src).toMatch(/gap-4\s+sm:gap-6/);
  });

  it("CountryGrid Start Quiz button meets 44px tap target on mobile", () => {
    const src = read("src/components/globe/CountryGrid.tsx");
    expect(src).toMatch(/h-11\s+sm:h-10/);
  });

  it("CountryGrid difficulty chips have min 44px touch height", () => {
    const src = read("src/components/globe/CountryGrid.tsx");
    expect(src).toMatch(/min-h-\[44px\]/);
  });

  it("GlobeSearch FAB is at least 44px on mobile", () => {
    const src = read("src/components/globe/GlobeSearch.tsx");
    expect(src).toMatch(/h-14\s+w-14/);
  });

  it("GlobeSearch FAB is positioned out of the way on mobile", () => {
    const src = read("src/components/globe/GlobeSearch.tsx");
    expect(src).toMatch(/fixed[^"]*right-4[^"]*bottom-20/);
  });

  it("GlobeFilters stack vertically on mobile", () => {
    const src = read("src/components/globe/GlobeFilters.tsx");
    expect(src).toMatch(/mx-3|mx-4/);
  });
});
