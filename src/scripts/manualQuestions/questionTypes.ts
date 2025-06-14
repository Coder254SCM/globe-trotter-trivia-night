
export interface ManualQuestion {
  id: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  category: string;
  country_id: string;
  difficulty: 'hard';
  month_rotation: number;
  ai_generated: false;
  image_url: null;
}

export interface Country {
  id: string;
  name: string;
  [key: string]: any;
}
