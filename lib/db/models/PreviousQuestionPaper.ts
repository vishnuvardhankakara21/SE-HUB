import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPreviousQuestionPaper extends Document {
  year: number;
  month: string;
  semester: string;
  regulation: string;
  examType: string;
  title: string;
  fileUrl: string;
  fileSizeBytes: number;
  createdAt: Date;
}

const PreviousQuestionPaperSchema = new Schema<IPreviousQuestionPaper>(
  {
    year: { type: Number, required: true, index: true },
    month: { type: String, required: true },
    semester: { type: String, default: "Semester End Exam" },
    regulation: { type: String, default: "R20" },
    examType: { type: String, default: "Regular" },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSizeBytes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PreviousQuestionPaper: Model<IPreviousQuestionPaper> =
  mongoose.models.PreviousQuestionPaper ||
  mongoose.model<IPreviousQuestionPaper>(
    "PreviousQuestionPaper",
    PreviousQuestionPaperSchema
  );

export default PreviousQuestionPaper;

