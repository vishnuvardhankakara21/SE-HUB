import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  priority: "normal" | "urgent" | "exam";
  authorName: string;
  authorRole: string;
  unitTag?: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ["normal", "urgent", "exam"],
      default: "normal",
      index: true,
    },
    authorName: { type: String, default: "Faculty Member" },
    authorRole: { type: String, default: "Course Faculty" },
    unitTag: { type: Number, min: 1, max: 5 },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

AnnouncementSchema.index({ isPublished: 1, createdAt: -1 });

export const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement ||
  mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);

export default Announcement;
