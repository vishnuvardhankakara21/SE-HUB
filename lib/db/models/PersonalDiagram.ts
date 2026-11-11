import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPersonalDiagram extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  diagramType: string;
  xmlContent: string;
  previewThumbnailUrl?: string;
  isPublic: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const PersonalDiagramSchema = new Schema<IPersonalDiagram>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, default: "Untitled Diagram", trim: true },
    diagramType: { type: String, default: "Custom" },
    xmlContent: { type: String, required: true },
    previewThumbnailUrl: { type: String },
    isPublic: { type: Boolean, default: false },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

PersonalDiagramSchema.index({ userId: 1, updatedAt: -1 });

export const PersonalDiagram: Model<IPersonalDiagram> =
  mongoose.models.PersonalDiagram ||
  mongoose.model<IPersonalDiagram>("PersonalDiagram", PersonalDiagramSchema);

export default PersonalDiagram;

