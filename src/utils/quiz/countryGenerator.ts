
import { Country } from "../../types/quiz";

/**
 * Generates a basic country object with default values
 * This helps quickly create country entries with minimal required data
 */
export const generateBasicCountry = (
  id: string,
  name: string,
  code: string,
  lat: number,
  lng: number,
  continent: string,
  difficulty: "easy" | "medium" | "hard" = "medium",
  iconType: "landmark" | "culture" | "nature" | "trophy" | "globe" = "landmark"
): Country => {
  return {
    id,
    name,
    code,
    position: {
      lat,
      lng
    },
    difficulty,
    categories: ["Geography", "History", "Culture"],
    flagImageUrl: `https://flagcdn.com/${code.toLowerCase()}.svg`,
    mapImageUrl: `https://upload.wikimedia.org/wikipedia/commons/thumb/archive/map_${id.replace(/-/g, "_")}.jpg/800px-map_${id.replace(/-/g, "_")}.jpg`,
    iconType,
    continent
  };
};
