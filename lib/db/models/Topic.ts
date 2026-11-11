import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITopic extends Document {
  unitId: mongoose.Types.ObjectId;
  unitNumber: number;
  title: string;
  slug: string;
  order: number;
  summary: string;
  theoryMarkdown: string;
  examWeightage: string;
  estimatedMinutes: number;
}

const TopicSchema = new Schema<ITopic>(
  {
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", required: true, index: true },
    unitNumber: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    order: { type: Number, default: 1 },
    summary: { type: String, default: "" },
    theoryMarkdown: { type: String, required: true },
    examWeightage: { type: String, default: "Medium" },
    estimatedMinutes: { type: Number, default: 15 },
  },
  { timestamps: true }
);

TopicSchema.index({ unitNumber: 1, order: 1 });
TopicSchema.index({ unitNumber: 1, slug: 1 }, { unique: true });

export const Topic: Model<ITopic> =
  mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);

export default Topic;

