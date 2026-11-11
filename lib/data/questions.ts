export interface ExamQuestion {
  id: string;
  unitNumber: number;
  questionNumber: number;
  question: string;
  marks: number;
  priority: "high" | "medium" | "low";
  markingScheme: string;
  answerMarkdown: string;
  examTips: string;
}

import {
  ALL_EXAM_QUESTIONS,
  UNIT_1_QUESTIONS,
  UNIT_2_QUESTIONS,
  UNIT_3_QUESTIONS,
  UNIT_4_QUESTIONS,
  UNIT_5_QUESTIONS,
} from "./questions/index";

export const EXAM_QUESTIONS: ExamQuestion[] = ALL_EXAM_QUESTIONS;

export {
  UNIT_1_QUESTIONS,
  UNIT_2_QUESTIONS,
  UNIT_3_QUESTIONS,
  UNIT_4_QUESTIONS,
  UNIT_5_QUESTIONS,
};
