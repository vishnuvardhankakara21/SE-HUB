import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  itemType: "topic" | "question" | "diagram";
  itemId: string;
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
    itemId: { type: String, required: true, index: true },
    unitNumber: { type: Number, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });
BookmarkSchema.index({ userId: 1, url: 1 });

export const Bookmark: Model<IBookmark> =
  mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);

export default Bookmark;

