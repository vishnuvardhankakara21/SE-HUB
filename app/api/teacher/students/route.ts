import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import QuizResult from "@/lib/db/models/QuizResult";
import PersonalDiagram from "@/lib/db/models/PersonalDiagram";
import Bookmark from "@/lib/db/models/Bookmark";
import { getServerAuthSession } from "@/lib/auth-helpers";

export interface StudentStatsItem {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  className: string;
  section: string;
  department: string;
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate?: string;
  };
  quizAttempts: number;
  averageQuizScore: number;
  highestQuizScore: number;
  diagramCount: number;
  bookmarkCount: number;
  overallProgress: number;
  unitProgress: Array<{
    unitNumber: number;
    title: string;
    attempts: number;
    bestScore: number | null;
    status: "mastered" | "completed" | "in_progress" | "not_started";
  }>;
  recentQuizzes: Array<{
    unitNumber: number;
    score: number;
    totalQuestions: number;
    percentage: number;
    createdAt: string;
  }>;
  joinedAt: string;
}

const UNIT_TITLES = [
  "Unit 1: Software Process & Agile Models",
  "Unit 2: Requirements & System Design (DFD)",
  "Unit 3: Software Architecture & UML",
  "Unit 4: OO Methodologies, COCOMO & Metrics",
  "Unit 5: Testing Strategies, V&V & SPM",
];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user?.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Faculty access required." },
        { status: 403 }
      );
    }

    try {
      await connectToDatabase();

      // Retrieve all registered students
      const students = await User.find({ role: "student" })
        .sort({ rollNumber: 1, createdAt: -1 })
        .lean();

      if (!students || students.length === 0) {
        return NextResponse.json({
          success: true,
          students: [],
          cohortStats: {
            totalStudents: 0,
            sections: {},
            averageCohortXP: 0,
            averageCohortQuizScore: 0,
            totalQuizSubmissions: 0,
          },
        });
      }

      // Concurrently build telemetry for each student
      const studentStats: StudentStatsItem[] = await Promise.all(
        students.map(async (student) => {
          const studentId = student._id.toString();

          const [quizResults, diagramCount, bookmarkCount] = await Promise.all([
            QuizResult.find({ userId: student._id }).sort({ createdAt: -1 }).lean(),
            PersonalDiagram.countDocuments({ userId: student._id }),
            Bookmark.countDocuments({ userId: student._id }),
          ]);

          const totalAttempts = quizResults.length;
          const avgScore =
            totalAttempts > 0
              ? Math.round(
                  quizResults.reduce((acc, q) => acc + (q.percentage || 0), 0) /
                    totalAttempts
                )
              : 0;

          const highestScore =
            totalAttempts > 0
              ? Math.max(...quizResults.map((q) => q.percentage || 0))
              : 0;

          // Unit progress breakdown
          const unitProgress = [1, 2, 3, 4, 5].map((uNum) => {
            const uQuizzes = quizResults.filter((q) => q.unitNumber === uNum);
            const attempts = uQuizzes.length;
            const bestScore =
              attempts > 0
                ? Math.max(...uQuizzes.map((q) => q.percentage || 0))
                : null;

            let status: "mastered" | "completed" | "in_progress" | "not_started" =
              "not_started";
            if (bestScore !== null) {
              if (bestScore >= 80) status = "mastered";
              else if (bestScore >= 50) status = "completed";
              else status = "in_progress";
            }

            return {
              unitNumber: uNum,
              title: UNIT_TITLES[uNum - 1],
              attempts,
              bestScore,
              status,
            };
          });

          // Calculate authentic overall progress percentage
          const unitsPassed = unitProgress.filter(
            (u) => u.status === "mastered" || u.status === "completed"
          ).length;
          const quizContribution = unitsPassed * 16; // up to 80%
          const xpContribution = Math.min(20, Math.floor((student.xp || 0) / 25)); // up to 20%
          const overallProgress = Math.min(100, quizContribution + xpContribution);

          // Infer roll number if empty
          let rollNo = student.rollNumber;
          if (!rollNo && student.email) {
            const emailPrefix = student.email.split("@")[0].toUpperCase();
            if (/^A[0-9A-Z]{5,}/.test(emailPrefix)) {
              rollNo = emailPrefix;
            }
          }

          return {
            id: studentId,
            name: student.name || "Student",
            email: student.email || "",
            rollNumber: rollNo || "UNASSIGNED",
            className: student.className || "III/IV B.Tech CSE",
            section: student.section || "Section A",
            department: student.department || "Computer Science & Engineering",
            xp: student.xp || 0,
            streak: {
              current: student.streak?.current || 0,
              longest: student.streak?.longest || 0,
              lastActiveDate: student.streak?.lastActiveDate
                ? new Date(student.streak.lastActiveDate).toISOString()
                : undefined,
            },
            quizAttempts: totalAttempts,
            averageQuizScore: avgScore,
            highestQuizScore: highestScore,
            diagramCount,
            bookmarkCount,
            overallProgress,
            unitProgress,
            recentQuizzes: quizResults.slice(0, 10).map((q) => ({
              unitNumber: q.unitNumber,
              score: q.score,
              totalQuestions: q.totalQuestions,
              percentage: q.percentage,
              createdAt: q.createdAt ? new Date(q.createdAt).toISOString() : "",
            })),
            joinedAt: student.createdAt
              ? new Date(student.createdAt).toISOString()
              : new Date().toISOString(),
          };
        })
      );

      // Compute cohort-wide aggregate stats
      const sectionsMap: { [key: string]: number } = {};
      let totalCohortXP = 0;
      let totalCohortQuizScore = 0;
      let totalQuizSubmissions = 0;

      studentStats.forEach((s) => {
        sectionsMap[s.section] = (sectionsMap[s.section] || 0) + 1;
        totalCohortXP += s.xp;
        totalCohortQuizScore += s.averageQuizScore;
        totalQuizSubmissions += s.quizAttempts;
      });

      const averageCohortXP =
        studentStats.length > 0
          ? Math.round(totalCohortXP / studentStats.length)
          : 0;
      const averageCohortQuizScore =
        studentStats.length > 0
          ? Math.round(totalCohortQuizScore / studentStats.length)
          : 0;

      return NextResponse.json({
        success: true,
        students: studentStats,
        cohortStats: {
          totalStudents: studentStats.length,
          sections: sectionsMap,
          averageCohortXP,
          averageCohortQuizScore,
          totalQuizSubmissions,
        },
      });
    } catch (dbError: any) {
      console.error("Database error in /api/teacher/students:", dbError);
      return NextResponse.json({
        success: true,
        students: [],
        cohortStats: {
          totalStudents: 0,
          sections: {},
          averageCohortXP: 0,
          averageCohortQuizScore: 0,
          totalQuizSubmissions: 0,
        },
      });
    }
  } catch (error: any) {
    console.error("Error in /api/teacher/students:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch student statistics" },
      { status: 500 }
    );
  }
}

