import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestionAnswer extends Document {
  unitId?: mongoose.Types.ObjectId;
  unitNumber: number;
  topicId?: mongoose.Types.ObjectId;
  topicTitle?: string;
  questionNumber: number;
  question: string;
  marks: number;
  priority: "high" | "medium" | "low";
  structuredAnswer: {
    definition?: string;
    points?: string[];
    diagramAscii?: string;
    advantages?: string[];
    disadvantages?: string[];
    example?: string;
    conclusion?: string;
  };
  rawAnswerMarkdown: string;
  examTips?: string;
}

const QuestionAnswerSchema = new Schema<IQuestionAnswer>(
  {
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", index: true },
    unitNumber: { type: Number, required: true, index: true },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", index: true },
    topicTitle: { type: String },
    questionNumber: { type: Number, required: true },
    question: { type: String, required: true },
    marks: { type: Number, default: 6 },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "high",
      index: true,
    },
    structuredAnswer: {
      definition: { type: String },
      points: [{ type: String }],
      diagramAscii: { type: String },
      advantages: [{ type: String }],
      disadvantages: [{ type: String }],
      example: { type: String },
      conclusion: { type: String },
    },
    rawAnswerMarkdown: { type: String, required: true },
    examTips: { type: String },
  },
  { timestamps: true }
);

QuestionAnswerSchema.index({ unitNumber: 1, questionNumber: 1 }, { unique: true });

export const QuestionAnswer: Model<IQuestionAnswer> =
  mongoose.models.QuestionAnswer ||
  mongoose.model<IQuestionAnswer>("QuestionAnswer", QuestionAnswerSchema);

export default QuestionAnswer;

