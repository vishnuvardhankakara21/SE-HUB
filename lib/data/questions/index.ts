import { ExamQuestion } from "../questions";
import { UNIT_1_QUESTIONS } from "./unit1";
import { UNIT_2_QUESTIONS } from "./unit2";
import { UNIT_3_QUESTIONS } from "./unit3";
import { UNIT_4_QUESTIONS } from "./unit4";
import { UNIT_5_QUESTIONS } from "./unit5";

export const ALL_EXAM_QUESTIONS: ExamQuestion[] = [
  ...UNIT_1_QUESTIONS,
  ...UNIT_2_QUESTIONS,
  ...UNIT_3_QUESTIONS,
  ...UNIT_4_QUESTIONS,
  ...UNIT_5_QUESTIONS,
];

export {
  UNIT_1_QUESTIONS,
  UNIT_2_QUESTIONS,
  UNIT_3_QUESTIONS,
  UNIT_4_QUESTIONS,
  UNIT_5_QUESTIONS,
};
