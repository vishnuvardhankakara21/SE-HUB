import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResource extends Document {
  title: string;
  description: string;
  unitNumber: number;
  topicId?: mongoose.Types.ObjectId;
  topicTitle?: string;
  uploadedBy?: mongoose.Types.ObjectId;
  uploaderName?: string;
  resourceType: "pdf" | "ppt" | "doc" | "image" | "video_link";
  fileUrl: string;
  storageKey?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    unitNumber: { type: Number, required: true, index: true },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", index: true },
    topicTitle: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    uploaderName: { type: String, default: "Faculty Member" },
    resourceType: {
      type: String,
      enum: ["pdf", "ppt", "doc", "image", "video_link"],
      required: true,
      index: true,
    },
    fileUrl: { type: String, required: true },
    storageKey: { type: String },
    fileSizeBytes: { type: Number, default: 0 },
    mimeType: { type: String },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

ResourceSchema.index({ unitNumber: 1, isPublished: 1 });

export const Resource: Model<IResource> =
  mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);

export default Resource;

