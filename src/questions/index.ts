// src/questions/index.ts
import unit1 from './unit1.json';
import unit2 from './unit2.json';
import unit3 from './unit3.json';
import unit4 from './unit4.json';
import unit5 from './unit5.json';
import unit6 from './unit6.json';
import unit7 from './unit7.json';
import unit8 from './unit8.json';
import unit9 from './unit9.json';

export interface Question {
  id: string;
  unit: number;
  topic: string;
  difficulty_b: number;
  discrimination_a: number;
  prompt: string;
  options: string[];
  correct_idx: number;
  explanation: string;
}

// Safely converts JSON inputs into a Question array regardless of structure
const toArray = (data: unknown): Question[] => {
  if (Array.isArray(data)) return data as Question[];
  if (data && typeof data === 'object' && 'questions' in data && Array.isArray((data as any).questions)) {
    return (data as any).questions as Question[];
  }
  return [];
};

export const allQuestions: Question[] = [
  ...toArray(unit1),
  ...toArray(unit2),
  ...toArray(unit3),
  ...toArray(unit4),
  ...toArray(unit5),
  ...toArray(unit6),
  ...toArray(unit7),
  ...toArray(unit8),
  ...toArray(unit9),
];