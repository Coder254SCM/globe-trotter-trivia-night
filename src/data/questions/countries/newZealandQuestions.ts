
import { Question } from "../../../types/quiz";

const newZealandQuestions: Question[] = [
  {
    id: "nz-q1",
    type: "multiple-choice",
    text: "What is the name of the indigenous people of New Zealand?",
    choices: [
      { id: "a", text: "Maori", isCorrect: true },
      { id: "b", text: "Aboriginal", isCorrect: false },
      { id: "c", text: "Inuit", isCorrect: false },
      { id: "d", text: "Saami", isCorrect: false },
    ],
    category: "Culture",
    explanation: "The Maori are the indigenous Polynesian people of New Zealand (Aotearoa). They arrived in New Zealand from eastern Polynesia in several waves of canoe voyages sometime between 1320 and 1350.",
    difficulty: "easy",
    lastUpdated: "2025-05-08"
  },
  {
    id: "nz-q2",
    type: "multiple-choice",
    text: "What is the capital city of New Zealand?",
    choices: [
      { id: "a", text: "Auckland", isCorrect: false },
      { id: "b", text: "Christchurch", isCorrect: false },
      { id: "c", text: "Wellington", isCorrect: true },
      { id: "d", text: "Queenstown", isCorrect: false },
    ],
    category: "Geography",
    explanation: "Wellington is the capital city of New Zealand. It's located at the southern tip of the North Island and is the second most populous urban area in New Zealand after Auckland.",
    difficulty: "easy",
    lastUpdated: "2025-05-08"
  },
  {
    id: "nz-q3",
    type: "multiple-choice",
    text: "Which famous movie trilogy was filmed in New Zealand?",
    choices: [
      { id: "a", text: "Star Wars", isCorrect: false },
      { id: "b", text: "The Lord of the Rings", isCorrect: true },
      { id: "c", text: "The Matrix", isCorrect: false },
      { id: "d", text: "Back to the Future", isCorrect: false },
    ],
    category: "Cinema",
    explanation: "The Lord of the Rings trilogy, directed by New Zealand filmmaker Peter Jackson, was filmed entirely in New Zealand. The country's diverse landscapes stood in for the fictional Middle-earth.",
    difficulty: "easy",
    lastUpdated: "2025-05-08"
  },
  {
    id: "nz-q4",
    type: "multiple-choice",
    text: "What bird is a national symbol of New Zealand?",
    choices: [
      { id: "a", text: "Eagle", isCorrect: false },
      { id: "b", text: "Kiwi", isCorrect: true },
      { id: "c", text: "Penguin", isCorrect: false },
      { id: "d", text: "Albatross", isCorrect: false },
    ],
    category: "Culture",
    explanation: "The kiwi is a flightless bird native to New Zealand and is a national symbol. New Zealanders are often affectionately referred to as 'Kiwis'.",
    difficulty: "easy",
    lastUpdated: "2025-05-08"
  },
  {
    id: "nz-q5",
    type: "true-false",
    text: "New Zealand was the first country in the world to give women the right to vote.",
    choices: [
      { id: "a", text: "True", isCorrect: true },
      { id: "b", text: "False", isCorrect: false },
    ],
    category: "History",
    explanation: "In 1893, New Zealand became the first self-governing country in the world to grant all women the right to vote in parliamentary elections.",
    difficulty: "medium",
    lastUpdated: "2025-05-08"
  },
  {
    id: "nz-q6",
    type: "multiple-choice",
    text: "Which of these mountain ranges runs through New Zealand's South Island?",
    choices: [
      { id: "a", text: "Andes", isCorrect: false },
      { id: "b", text: "Rocky Mountains", isCorrect: false },
      { id: "c", text: "Southern Alps", isCorrect: true },
      { id: "d", text: "Himalayas", isCorrect: false },
    ],
    category: "Geography",
    explanation: "The Southern Alps (Kā Tiritiri o te Moana) is a mountain range extending along much of the length of New Zealand's South Island. Its highest peak is Aoraki/Mount Cook.",
    difficulty: "medium",
    lastUpdated: "2025-05-08"
  },
  {
    id: "nz-q7",
    type: "multiple-choice",
    text: "What is the traditional Maori war dance performed by New Zealand's sports teams?",
    choices: [
      { id: "a", text: "Hangi", isCorrect: false },
      { id: "b", text: "Haka", isCorrect: true },
      { id: "c", text: "Hongi", isCorrect: false },
      { id: "d", text: "Huhu", isCorrect: false },
    ],
    category: "Sports",
    explanation: "The haka is a traditional Maori war dance or challenge. It is performed by many of New Zealand's sports teams, most notably the national rugby team, the All Blacks.",
    difficulty: "medium",
    lastUpdated: "2025-05-08"
  },
  {
    id: "nz-q8",
    type: "multiple-choice",
    text: "Which body of water separates New Zealand's North and South Islands?",
    choices: [
      { id: "a", text: "Tasman Sea", isCorrect: false },
      { id: "b", text: "Pacific Ocean", isCorrect: false },
      { id: "c", text: "Cook Strait", isCorrect: true },
      { id: "d", text: "Southern Ocean", isCorrect: false },
    ],
    category: "Geography",
    explanation: "Cook Strait is the body of water that separates New Zealand's North and South Islands. It connects the Tasman Sea on the west with the Pacific Ocean on the east.",
    difficulty: "medium",
    lastUpdated: "2025-05-08"
  },
  {
    id: "nz-q9",
    type: "multiple-choice",
    text: "What is New Zealand's largest city?",
    choices: [
      { id: "a", text: "Wellington", isCorrect: false },
      { id: "b", text: "Christchurch", isCorrect: false },
      { id: "c", text: "Hamilton", isCorrect: false },
      { id: "d", text: "Auckland", isCorrect: true },
    ],
    category: "Geography",
    explanation: "Auckland is New Zealand's largest city with a population of about 1.6 million, which is around one-third of the country's population.",
    difficulty: "medium",
    lastUpdated: "2025-05-08"
  },
  {
    id: "nz-q10",
    type: "multiple-choice",
    text: "What is the name of the active marine volcano in New Zealand that erupted in 2019?",
    choices: [
      { id: "a", text: "White Island (Whakaari)", isCorrect: true },
      { id: "b", text: "Mount Taranaki", isCorrect: false },
      { id: "c", text: "Mount Ruapehu", isCorrect: false },
      { id: "d", text: "Mount Tongariro", isCorrect: false },
    ],
    category: "Geography",
    explanation: "White Island, or Whakaari in Māori, is an active marine volcano located off the east coast of New Zealand's North Island. It erupted on December 9, 2019, causing multiple fatalities.",
    difficulty: "hard",
    lastUpdated: "2025-05-08"
  }
];

export default newZealandQuestions;
