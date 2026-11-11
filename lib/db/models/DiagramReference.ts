import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDiagramReference extends Document {
  diagramNumber: number;
  fileName: string;
  title: string;
  domain: "Library" | "LMS" | "University" | "Banking";
  diagramType: "Activity" | "StateChart" | "Component" | "Deployment";
  unitNumber: number;
  imageUrl: string;
  xmlTemplate: string;
  description: string;
  keyElements: string[];
}

const DiagramReferenceSchema = new Schema<IDiagramReference>(
  {
    diagramNumber: { type: Number, required: true, unique: true, index: true },
    fileName: { type: String, required: true },
    title: { type: String, required: true },
    domain: {
      type: String,
      enum: ["Library", "LMS", "University", "Banking"],
      required: true,
      index: true,
    },
    diagramType: {
      type: String,
      enum: ["Activity", "StateChart", "Component", "Deployment"],
      required: true,
      index: true,
    },
    unitNumber: { type: Number, default: 4, index: true },
    imageUrl: { type: String, required: true },
    xmlTemplate: { type: String, default: "" },
    description: { type: String, required: true },
    keyElements: [{ type: String }],
  },
  { timestamps: true }
);

export const DiagramReference: Model<IDiagramReference> =
  mongoose.models.DiagramReference ||
  mongoose.model<IDiagramReference>("DiagramReference", DiagramReferenceSchema);

export default DiagramReference;

