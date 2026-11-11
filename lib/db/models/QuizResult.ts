import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizResult extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  unitNumber: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: Array<{
    questionIndex: number;
    selectedOption: number;
    isCorrect: boolean;
  }>;
  createdAt: Date;
}

const QuizResultSchema = new Schema<IQuizResult>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true, index: true },
    unitNumber: { type: Number, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    answers: [
      {
        questionIndex: { type: Number, required: true },
        selectedOption: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
  },
  { timestamps: true }
);

QuizResultSchema.index({ userId: 1, createdAt: -1 });

export const QuizResult: Model<IQuizResult> =
  mongoose.models.QuizResult ||
  mongoose.model<IQuizResult>("QuizResult", QuizResultSchema);

export default QuizResult;

