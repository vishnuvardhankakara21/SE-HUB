import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { connectToDatabase } from "@/lib/db/connect";
import User from "@/lib/db/models/User";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Invalid institutional email address").max(100),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  role: z.enum(["student", "teacher"], {
    errorMap: () => ({ message: "Role must be 'student' or 'teacher'" }),
  }),
  rollNumber: z.string().optional(),
  className: z.string().optional(),
  section: z.string().optional(),
  avatarUrl: z.string().optional(),
  facultyCode: z.string().optional(),
  inviteCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      role,
      rollNumber,
      className,
      section,
      avatarUrl,
      facultyCode,
      inviteCode,
    } = parsed.data;

    const normalizedEmail = email.toLowerCase().trim();

    const BLOCKED_PLACEHOLDERS = [
      "example@anits.edu.in",
      "student@anits.edu.in",
      "test@anits.edu.in",
      "dummy@anits.edu.in",
      "sample@anits.edu.in",
    ];

    if (BLOCKED_PLACEHOLDERS.includes(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "example@anits.edu.in is a placeholder and cannot be used. Please enter your authentic ANITS college email address.",
        },
        { status: 400 }
      );
    }

    // Student specific validations: @anits.edu.in domain & Roll Number
    if (role === "student") {
      if (!normalizedEmail.endsWith("@anits.edu.in")) {
        return NextResponse.json(
          {
            success: false,
            message: "Student registration requires an official college email ending with @anits.edu.in.",
          },
          { status: 400 }
        );
      }

      if (!rollNumber || !rollNumber.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "College Roll Number is required (e.g. A24126510021).",
          },
          { status: 400 }
        );
      }

      const formattedRoll = rollNumber.trim().toUpperCase();
      if (!/^A[0-9A-Z]{11}$/i.test(formattedRoll) && formattedRoll.length < 10) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid Roll Number format. Expected format like A24126510021.",
          },
          { status: 400 }
        );
      }
    }

    // Faculty Code verification
    if (role === "teacher") {
      const codeProvided = (facultyCode || inviteCode || "").trim();
      const expectedCode = process.env.FACULTY_CODE || process.env.TEACHER_INVITE_CODE || "FACULTY2026";

      if (!codeProvided) {
        return NextResponse.json(
          { success: false, message: "Faculty Authorization Code is required to create a faculty account." },
          { status: 400 }
        );
      }

      if (codeProvided !== expectedCode) {
        return NextResponse.json(
          { success: false, message: "Invalid Faculty Authorization Code. Only authorized department faculty may register." },
          { status: 403 }
        );
      }
    }

    await connectToDatabase();

    // Check email uniqueness
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this institutional email already exists." },
        { status: 409 }
      );
    }

    // Check roll number uniqueness for students
    if (role === "student" && rollNumber) {
      const existingRoll = await User.findOne({ rollNumber: rollNumber.trim().toUpperCase() });
      if (existingRoll) {
        return NextResponse.json(
          { success: false, message: "An account with this Roll Number is already registered." },
          { status: 409 }
        );
      }
    }

    // Secure asynchronous password hashing
    const passwordHash = await hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      status: "active",
      rollNumber: role === "student" && rollNumber ? rollNumber.trim().toUpperCase() : undefined,
      className: className ? className.trim() : undefined,
      section: section ? section.trim() : undefined,
      avatarUrl: avatarUrl ? avatarUrl.trim() : undefined,
      xp: 0,
      streak: { current: 0, longest: 0 },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account registered successfully. You may now sign in.",
        userId: newUser._id.toString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
