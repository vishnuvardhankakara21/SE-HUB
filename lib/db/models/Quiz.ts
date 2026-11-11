import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface IQuiz extends Document {
  unitNumber: number;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: IQuizQuestion[];
  isPublished: boolean;
}

const QuizSchema = new Schema<IQuiz>(
  {
    unitNumber: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    timeLimitMinutes: { type: Number, default: 10 },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOptionIndex: { type: Number, required: true },
        explanation: { type: String, default: "" },
      },
    ],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Quiz: Model<IQuiz> =
  mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;

