import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: "student" | "teacher";
  status: "active" | "pending_approval" | "suspended";
  rollNumber?: string;
  className?: string;
  section?: string;
  department?: string;
  avatarUrl?: string;
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate?: Date;
  };
  earnedBadges: Array<{
    badgeId: string;
    awardedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "pending_approval", "suspended"],
      default: "active",
      index: true,
    },
    rollNumber: { type: String, uppercase: true, trim: true, index: true },
    className: { type: String, trim: true },
    section: { type: String, trim: true },
    department: { type: String, default: "Computer Science & Engineering" },
    avatarUrl: { type: String },
    xp: { type: Number, default: 0, index: true },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: Date },
    },
    earnedBadges: [
      {
        badgeId: { type: String, required: true },
        awardedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

