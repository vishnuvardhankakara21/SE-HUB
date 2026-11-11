import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudentProgress extends Document {
  userId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  unitNumber: number;
  status: "unread" | "in_progress" | "completed";
  lastReadAt: Date;
}

const StudentProgressSchema = new Schema<IStudentProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true, index: true },
    unitNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["unread", "in_progress", "completed"],
      default: "completed",
    },
    lastReadAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

StudentProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });
StudentProgressSchema.index({ userId: 1, unitNumber: 1 });

export const StudentProgress: Model<IStudentProgress> =
  mongoose.models.StudentProgress ||
  mongoose.model<IStudentProgress>("StudentProgress", StudentProgressSchema);

export default StudentProgress;

