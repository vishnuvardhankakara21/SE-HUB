import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import Quiz from "@/lib/db/models/Quiz";
import QuizResult from "@/lib/db/models/QuizResult";
import User from "@/lib/db/models/User";
import { getServerAuthSession } from "@/lib/auth-helpers";
import { CANONICAL_QUIZZES } from "@/lib/data/quizzes";
import mongoose from "mongoose";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ unitNumber: string }> }
) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in to submit quizzes." },
        { status: 401 }
      );
    }

    const { unitNumber: unitParam } = await params;
    const unitNumber = parseInt(unitParam, 10);

    if (isNaN(unitNumber) || unitNumber < 1 || unitNumber > 5) {
      return NextResponse.json(
        { success: false, message: "Invalid unit number. Must be between 1 and 5." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { answers } = body as {
      answers: Array<{ questionIndex: number; selectedOption: number }>;
    };

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { success: false, message: "Answers array is required." },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // 1. Fetch authoritative questions (from DB or canonical fallbacks)
    const dbQuiz = await Quiz.findOne({ unitNumber, isPublished: true }).lean();
    const authoritativeQuestions =
      dbQuiz && dbQuiz.questions && dbQuiz.questions.length > 0
        ? dbQuiz.questions
        : CANONICAL_QUIZZES[unitNumber]?.questions || [];

    if (authoritativeQuestions.length === 0) {
      return NextResponse.json(
        { success: false, message: "Quiz content for this unit is currently unavailable." },
        { status: 404 }
      );
    }

    // 2. Strict Server-Side Evaluation
    let score = 0;
    const totalQuestions = authoritativeQuestions.length;
    const evaluatedAnswers: Array<{
      questionIndex: number;
      selectedOption: number;
      isCorrect: boolean;
    }> = [];

    // Map submitted answers by question index
    const submittedMap = new Map<number, number>();
    answers.forEach((ans) => {
      if (typeof ans.questionIndex === "number" && typeof ans.selectedOption === "number") {
        submittedMap.set(ans.questionIndex, ans.selectedOption);
      }
    });

    authoritativeQuestions.forEach((q, idx) => {
      const selected = submittedMap.get(idx);
      const isCorrect = selected !== undefined && selected === q.correctOptionIndex;
      if (isCorrect) score += 1;

      evaluatedAnswers.push({
        questionIndex: idx,
        selectedOption: selected ?? -1,
        isCorrect,
      });
    });

    const percentage = Math.round((score / totalQuestions) * 100);

    // 3. Anti-Exploit / Duplicate Reward Prevention:
    // Find user's previous attempts for this unit to prevent infinite XP farming
    const previousAttempts = await QuizResult.find({
      userId: session.user.id,
      unitNumber,
    })
      .select("score")
      .lean();

    const previousHighScore = previousAttempts.reduce(
      (max, att) => Math.max(max, att.score || 0),
      0
    );

    // Award XP ONLY for new high score achievements (20 XP per additional correct answer)
    const incrementalScore = Math.max(0, score - previousHighScore);
    const earnedXp = incrementalScore * 20;

    // 4. Record QuizResult in Database
    const quizResult = await QuizResult.create({
      userId: session.user.id,
      quizId: dbQuiz?._id || new mongoose.Types.ObjectId(),
      unitNumber,
      score,
      totalQuestions,
      percentage,
      answers: evaluatedAnswers,
    });

    // 5. Atomic Update to User XP and Streaks
    const user = await User.findById(session.user.id);
    if (user) {
      const now = new Date();
      const lastActive = user.streak?.lastActiveDate;
      const streakCurrent = user.streak?.current || 0;
      const streakLongest = user.streak?.longest || 0;

      let newCurrent = streakCurrent;
      if (!lastActive) {
        newCurrent = 1;
      } else {
        const diffDays = Math.floor(
          (now.getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          newCurrent += 1;
        } else if (diffDays > 1) {
          newCurrent = 1;
        }
      }

      await User.findByIdAndUpdate(session.user.id, {
        $inc: { xp: earnedXp },
        $set: {
          streak: {
            current: newCurrent,
            longest: Math.max(streakLongest, newCurrent),
            lastActiveDate: now,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      result: {
        id: quizResult._id,
        score,
        totalQuestions,
        percentage,
        earnedXp,
        previousHighScore,
        unitNumber,
      },
    });
  } catch (err: any) {
    console.error("Quiz submission error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process quiz submission" },
      { status: 500 }
    );
  }
}
