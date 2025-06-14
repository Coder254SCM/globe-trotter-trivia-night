
import { QuestionCategory } from "@/types/quiz";

export interface Country {
  id: string;
  name: string;
  capital: string;
  continent: string;
  population: number;
  area_km2: number;
  latitude: number;
  longitude: number;
  flag_url?: string;
  categories?: QuestionCategory[];
  difficulty?: string;
}
