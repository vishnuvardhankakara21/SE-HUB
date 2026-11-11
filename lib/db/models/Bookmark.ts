import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  itemType: "topic" | "question" | "diagram";
  itemId: mongoose.Types.ObjectId;
  unitNumber: number;
  title: string;
  subtitle?: string;
  url: string;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    itemType: {
      type: String,
      enum: ["topic", "question", "diagram"],
      required: true,
      index: true,
    },
    itemId: { type: Schema.Types.ObjectId, required: true },
    unitNumber: { type: Number, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

export const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

export default Bookmark;

