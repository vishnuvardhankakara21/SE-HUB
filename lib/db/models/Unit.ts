import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUnit extends Document {
  unitNumber: number;
  title: string;
  periods: number;
  description: string;
  learningOutcomes: string[];
  slug: string;
  order: number;
}

const UnitSchema = new Schema<IUnit>(
  {
    unitNumber: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true },
    periods: { type: Number, default: 12 },
    description: { type: String, default: "" },
    learningOutcomes: [{ type: String }],
    slug: { type: String, required: true, unique: true, index: true },
    order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Unit: Model<IUnit> =
  mongoose.models.Unit || mongoose.model<IUnit>("Unit", UnitSchema);

export default Unit;

