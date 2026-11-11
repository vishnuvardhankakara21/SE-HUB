import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import QuizResult from "@/lib/db/models/QuizResult";
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
      const history = await QuizResult.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      return NextResponse.json({ success: true, history });
    } catch {
      return NextResponse.json({ success: true, history: [] });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

