import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import QuizResult from "@/lib/db/models/QuizResult";
import Bookmark from "@/lib/db/models/Bookmark";
import PersonalDiagram from "@/lib/db/models/PersonalDiagram";
import { getServerAuthSession } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    try {
      await connectToDatabase();
      const user = await User.findById(session.user.id).lean();

      const [quizAttempts, bookmarkCount, diagramCount] = await Promise.all([
        QuizResult.countDocuments({ userId: session.user.id }),
        Bookmark.countDocuments({ userId: session.user.id }),
        PersonalDiagram.countDocuments({ userId: session.user.id }),
      ]);

      return NextResponse.json({
        success: true,
        progress: {
          xp: user?.xp ?? 0,
          streak: user?.streak ?? { current: 0, longest: 0 },
          quizAttempts: quizAttempts ?? 0,
          bookmarkCount: bookmarkCount ?? 0,
          diagramCount: diagramCount ?? 0,
          badges: user?.earnedBadges ?? [],
        },
      });
    } catch {
      return NextResponse.json({
        success: true,
        progress: {
          xp: 0,
          streak: { current: 0, longest: 0 },
          quizAttempts: 0,
          bookmarkCount: 0,
          diagramCount: 0,
          badges: [],
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

