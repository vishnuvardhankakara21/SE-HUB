import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth-helpers";
import { connectToDatabase } from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import QuizResult from "@/lib/db/models/QuizResult";
import Bookmark from "@/lib/db/models/Bookmark";
import PersonalDiagram from "@/lib/db/models/PersonalDiagram";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const query = session.user.id
      ? { _id: session.user.id }
      : { email: session.user.email?.toLowerCase().trim() };

    const user = await User.findOne(query).lean();

    const userId = user?._id || session.user.id;
    const [quizAttempts, bookmarkCount, diagramCount] = await Promise.all([
      QuizResult.countDocuments({ userId }),
      Bookmark.countDocuments({ userId }),
      PersonalDiagram.countDocuments({ userId }),
    ]);

    return NextResponse.json({
      success: true,
      profile: {
        id: user?._id?.toString() || session.user.id,
        name: user?.name || session.user.name || "Student",
        email: user?.email || session.user.email || "",
        role: user?.role || session.user.role || "student",
        rollNumber: user?.rollNumber || session.user.rollNumber || "",
        className: user?.className || session.user.className || "III/IV B.Tech",
        section: user?.section || session.user.section || "Section A",
        department: user?.department || "Computer Science & Engineering",
        avatarUrl: user?.avatarUrl || session.user.image || "",
        xp: user?.xp ?? 0,
        streak: user?.streak ?? { current: 0, longest: 0 },
        badges: user?.earnedBadges ?? [],
        createdAt: user?.createdAt || null,
        stats: {
          quizAttempts: quizAttempts ?? 0,
          bookmarkCount: bookmarkCount ?? 0,
          diagramCount: diagramCount ?? 0,
        },
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/student/profile:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, className, section, avatarUrl } = body;

    await connectToDatabase();
    const query = session.user.id
      ? { _id: session.user.id }
      : { email: session.user.email?.toLowerCase().trim() };

    const updateFields: Record<string, any> = {};
    if (typeof name === "string" && name.trim()) updateFields.name = name.trim();
    if (typeof className === "string") updateFields.className = className.trim();
    if (typeof section === "string") updateFields.section = section.trim();
    if (typeof avatarUrl === "string") updateFields.avatarUrl = avatarUrl;

    const updatedUser = await User.findOneAndUpdate(query, { $set: updateFields }, { new: true }).lean();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        name: updatedUser?.name,
        className: updatedUser?.className,
        section: updatedUser?.section,
        avatarUrl: updatedUser?.avatarUrl,
      },
    });
  } catch (error: any) {
    console.error("Error in PUT /api/student/profile:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

