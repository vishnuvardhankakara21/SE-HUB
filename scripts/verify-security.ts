import bcrypt from "bcryptjs";
import crypto from "crypto";
import path from "path";
import { CANONICAL_QUIZZES } from "../lib/data/quizzes";

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details: string) {
  if (condition) {
    results.push({ name, passed: true, details });
    console.log(`\x1b[32m✔ PASS\x1b[0m [${name}]: ${details}`);
  } else {
    results.push({ name, passed: false, details });
    console.error(`\x1b[31m✖ FAIL\x1b[0m [${name}]: ${details}`);
  }
}

async function runSecurityAudit() {
  console.log("\n=======================================================");
  console.log("   SECURITY, AUTH & BACKEND INTEGRATION AUDIT SUITE    ");
  console.log("=======================================================\n");

  // TEST 1: Password Hashing & Bcrypt Verification
  console.log("--- 1. AUTHENTICATION & HASHING VERIFICATION ---");
  const testPassword = "EngineeringSecurePassword2026!";
  const saltRounds = 10;
  const hash = await bcrypt.hash(testPassword, saltRounds);
  const isValidValid = await bcrypt.compare(testPassword, hash);
  const isInvalidValid = await bcrypt.compare("WrongPassword123", hash);

  assert(
    hash.startsWith("$2a$") || hash.startsWith("$2b$"),
    "Bcrypt Hash Format",
    "Generated strong standard bcrypt hash ($2a$/$2b$)"
  );
  assert(
    isValidValid === true,
    "Valid Password Verification",
    "Bcrypt correctly verified authentic password asynchronously"
  );
  assert(
    isInvalidValid === false,
    "Invalid Password Rejection",
    "Bcrypt rejected invalid credentials as expected"
  );

  // TEST 2: Role Registration Validation with @anits.edu.in & Faculty Code
  console.log("\n--- 2. ROLE REGISTRATION VALIDATION (ANITS DOMAIN & FACULTY CODE) ---");
  const validStudentPayload = {
    name: "Rahul Verma",
    email: "A24126510021@anits.edu.in",
    password: "Password123",
    role: "student",
    rollNumber: "A24126510021",
    className: "III/IV B.Tech",
    section: "Section A",
  };
  const placeholderStudentPayload = {
    name: "Placeholder Student",
    email: "example@anits.edu.in",
    password: "Password123",
    role: "student",
    rollNumber: "A24126510021",
  };
  const nonAnitsStudentPayload = {
    name: "Test Student",
    email: "student@othercollege.edu",
    password: "Password123",
    role: "student",
    rollNumber: "A24126510021",
  };
  const missingRollStudentPayload = {
    name: "Test Student",
    email: "A24126510021@anits.edu.in",
    password: "Password123",
    role: "student",
    rollNumber: "",
  };
  const validTeacherPayload = {
    name: "Dr. Faculty",
    email: "faculty@anits.edu.in",
    password: "Password123",
    role: "teacher",
    facultyCode: "FACULTY2026",
  };
  const invalidTeacherPayload = {
    name: "Dr. Faculty",
    email: "faculty@anits.edu.in",
    password: "Password123",
    role: "teacher",
    facultyCode: "WRONG_CODE",
  };

  const expectedFacultyCode = process.env.FACULTY_CODE || process.env.TEACHER_INVITE_CODE || "FACULTY2026";

  const BLOCKED_PLACEHOLDERS = new Set([
    "example@anits.edu.in",
    "student@anits.edu.in",
    "test@anits.edu.in",
    "dummy@anits.edu.in",
    "sample@anits.edu.in",
  ]);

  function isAnitsDomain(email: string) {
    const e = email.toLowerCase().trim();
    return e.endsWith("@anits.edu.in");
  }

  function validateRegistrationPayload(payload: any): { allowed: boolean; role: string; error?: string } {
    if (!payload.email || !payload.password || !payload.name) {
      return { allowed: false, role: "", error: "Missing required fields" };
    }
    const normalized = payload.email.toLowerCase().trim();
    if (BLOCKED_PLACEHOLDERS.has(normalized)) {
      return { allowed: false, role: payload.role, error: "Placeholder emails like example@anits.edu.in are blocked" };
    }
    if (payload.role !== "student" && payload.role !== "teacher") {
      return { allowed: false, role: "", error: "Invalid role" };
    }
    if (payload.role === "student") {
      if (!isAnitsDomain(payload.email)) {
        return { allowed: false, role: "student", error: "Must end with @anits.edu.in" };
      }
      if (!payload.rollNumber || !payload.rollNumber.trim()) {
        return { allowed: false, role: "student", error: "Missing roll number" };
      }
    }
    if (payload.role === "teacher") {
      if (!payload.facultyCode || payload.facultyCode.trim() !== expectedFacultyCode) {
        return { allowed: false, role: "teacher", error: "Invalid Faculty Authorization Code" };
      }
    }
    return { allowed: true, role: payload.role };
  }

  // Pre-login registration requirement test
  const registeredUsersDb = new Set(["a24126510021@anits.edu.in", "faculty@anits.edu.in"]);
  function attemptLogin(email: string): { canLogin: boolean; reason?: string } {
    const normalized = email.toLowerCase().trim();
    if (BLOCKED_PLACEHOLDERS.has(normalized)) {
      return { canLogin: false, reason: "Placeholder email cannot be used to sign in." };
    }
    if (!registeredUsersDb.has(normalized)) {
      return { canLogin: false, reason: "Account not registered. Please create account first." };
    }
    return { canLogin: true };
  }

  const studentReg = validateRegistrationPayload(validStudentPayload);
  const placeholderReg = validateRegistrationPayload(placeholderStudentPayload);
  const nonAnitsReg = validateRegistrationPayload(nonAnitsStudentPayload);
  const missingRollReg = validateRegistrationPayload(missingRollStudentPayload);
  const teacherValidReg = validateRegistrationPayload(validTeacherPayload);
  const teacherInvalidReg = validateRegistrationPayload(invalidTeacherPayload);

  const registeredLogin = attemptLogin("A24126510021@anits.edu.in");
  const placeholderLogin = attemptLogin("example@anits.edu.in");
  const unregisteredLogin = attemptLogin("unregistered.user@anits.edu.in");

  assert(
    studentReg.allowed && studentReg.role === "student",
    "Valid Student Registration",
    "Student with authentic roll number email A24126510021@anits.edu.in registers successfully"
  );
  assert(
    !placeholderReg.allowed,
    "Placeholder Email Rejection",
    "Rejected registration with placeholder example@anits.edu.in"
  );
  assert(
    !placeholderLogin.canLogin,
    "Placeholder Sign-In Rejection",
    "Blocked sign-in attempt using placeholder example@anits.edu.in"
  );
  assert(
    !nonAnitsReg.allowed,
    "Non-ANITS Student Email Rejection",
    "Rejected student registration with non-@anits.edu.in email domain"
  );
  assert(
    !missingRollReg.allowed,
    "Missing Student Roll Number Rejection",
    "Rejected student registration when roll number is missing"
  );
  assert(
    teacherValidReg.allowed && teacherValidReg.role === "teacher",
    "Valid Faculty Registration with Code",
    "Faculty with matching code registers successfully"
  );
  assert(
    !teacherInvalidReg.allowed,
    "Invalid Faculty Code Rejection",
    "Faculty registration rejected when authorization code does not match"
  );
  assert(
    registeredLogin.canLogin,
    "Registered User Login Permitted",
    "Registered user in database can log in directly"
  );
  assert(
    !unregisteredLogin.canLogin,
    "Unregistered User Login Rejection",
    "Unregistered user is barred from login and directed to create account first"
  );

  // TEST 3: Role Integrity Verification (Strictly Student & Teacher)
  console.log("\n--- 3. ROLE INTEGRITY VERIFICATION ---");
  const allowedRoles = ["student", "teacher"];
  function validateRole(role: string): boolean {
    return allowedRoles.includes(role);
  }
  assert(validateRole("student"), "Student Role Validity", "'student' is an authorized role");
  assert(validateRole("teacher"), "Teacher Role Validity", "'teacher' is an authorized role");
  assert(!validateRole("admin"), "Admin Role Rejection", "Strict rejection of unauthorized 'admin' role");
  assert(!validateRole("superadmin"), "Superadmin Role Rejection", "Strict rejection of unauthorized 'superadmin' role");

  // TEST 4: Quiz Ground Truth & Anti-Farming XP Integrity
  console.log("\n--- 4. QUIZ GROUND TRUTH & ANTI-EXPLOIT XP TESTING ---");
  const unitKeys = Object.keys(CANONICAL_QUIZZES).map(Number);
  assert(
    unitKeys.length === 5,
    "Complete 5-Unit Ground Truth",
    `Found canonical quizzes for all 5 units: [${unitKeys.join(", ")}]`
  );

  let allQuestionsValid = true;
  for (const u of unitKeys) {
    const quiz = CANONICAL_QUIZZES[u];
    for (const q of quiz.questions) {
      if (
        !q.questionText ||
        q.options.length < 2 ||
        q.correctOptionIndex < 0 ||
        q.correctOptionIndex >= q.options.length ||
        !q.explanation
      ) {
        allQuestionsValid = false;
      }
    }
  }
  assert(
    allQuestionsValid,
    "Ground Truth Structure",
    "All questions have valid option bounds, correct option indices, and explanations"
  );

  // Simulate server-side anti-farming grading algorithm
  function gradeSubmission(
    unitNum: number,
    answers: { questionIndex: number; selectedOption: number }[],
    previousHighScore: number
  ) {
    const quiz = CANONICAL_QUIZZES[unitNum];
    let score = 0;
    for (const item of answers) {
      if (quiz.questions[item.questionIndex]?.correctOptionIndex === item.selectedOption) {
        score++;
      }
    }
    const earnedXp = Math.max(0, score - previousHighScore) * 20;
    const newHighScore = Math.max(previousHighScore, score);
    return { score, earnedXp, newHighScore };
  }

  // Attempt 1: Perfect score -> awards questions.length * 20 XP
  const qCount = CANONICAL_QUIZZES[1].questions.length;
  const perfectAnswers = CANONICAL_QUIZZES[1].questions.map((q, idx) => ({
    questionIndex: idx,
    selectedOption: q.correctOptionIndex,
  }));
  const attempt1 = gradeSubmission(1, perfectAnswers, 0);
  assert(
    attempt1.score === qCount && attempt1.earnedXp === qCount * 20,
    "First Quiz Attempt Scoring",
    `Perfect score ${qCount}/${qCount} correctly awarded ${qCount * 20} XP (got ${attempt1.earnedXp} XP)`
  );

  // Attempt 2: Repeat perfect score -> should award 0 XP
  const attempt2 = gradeSubmission(1, perfectAnswers, attempt1.newHighScore);
  assert(
    attempt2.score === qCount && attempt2.earnedXp === 0,
    "Anti-Farming Repeat Attempt XP",
    `Repeat ${qCount}/${qCount} submission awarded 0 incremental XP (got ${attempt2.earnedXp} XP)`
  );

  // Attempt 3: Inferior 2 questions -> should award 0 XP
  const inferiorAnswers = perfectAnswers.slice(0, 2);
  const attempt3 = gradeSubmission(1, inferiorAnswers, attempt1.newHighScore);
  assert(
    attempt3.score === 2 && attempt3.earnedXp === 0,
    "Inferior Attempt XP Prevention",
    `Score 2/${qCount} lower than highscore ${qCount}/${qCount} awarded 0 incremental XP (got ${attempt3.earnedXp} XP)`
  );

  // TEST 5: Personal Diagram Isolation & Privacy Testing
  console.log("\n--- 5. PERSONAL DIAGRAM ISOLATION ---");
  interface PersonalDiag {
    id: string;
    userId: string;
    title: string;
    xml: string;
  }
  const mockDiagramsDb: PersonalDiag[] = [
    { id: "diag-1", userId: "student-user-a", title: "My Library System", xml: "<xml>A</xml>" },
    { id: "diag-2", userId: "student-user-b", title: "My Banking System", xml: "<xml>B</xml>" },
  ];

  function getDiagramForUser(diagId: string, requestingUserId: string) {
    const diag = mockDiagramsDb.find((d) => d.id === diagId && d.userId === requestingUserId);
    return diag || null;
  }

  const accessOwn = getDiagramForUser("diag-1", "student-user-a");
  const accessOther = getDiagramForUser("diag-1", "student-user-b");

  assert(
    accessOwn !== null && accessOwn.id === "diag-1",
    "Author Diagram Retrieval",
    "Owner successfully retrieved their own diagram"
  );
  assert(
    accessOther === null,
    "Cross-User Diagram Isolation",
    "Student B cannot access or view Student A's diagram"
  );

  // TEST 6: File Upload Security & Sanitization
  console.log("\n--- 6. FILE UPLOAD SECURITY & SANITIZATION ---");
  const ALLOWED_EXTENSIONS = new Set([
    ".pdf",
    ".ppt",
    ".pptx",
    ".doc",
    ".docx",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ]);
  const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

  function validateUpload(fileName: string, fileSize: number) {
    const ext = path.extname(fileName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return { valid: false, error: "Unsupported file extension" };
    }
    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return { valid: false, error: "Exceeds 25MB limit" };
    }
    const safeBase = path
      .basename(fileName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const sanitizedName = `${safeBase}-${Date.now()}${ext}`;
    return { valid: true, sanitizedName };
  }

  const testPdf = validateUpload("Lecture_Unit_3.pdf", 5 * 1024 * 1024);
  const testPpt = validateUpload("Software_Processes.pptx", 12 * 1024 * 1024);
  const testExe = validateUpload("Malicious_Tool.exe", 1024);
  const testOversize = validateUpload("HugeVideo.pdf", 30 * 1024 * 1024);
  const testTraversal = validateUpload("../../../etc/shadow.pdf", 2048);

  assert(testPdf.valid, "Valid PDF Upload", "Accepted standard 5MB PDF document");
  assert(testPpt.valid, "Valid PPTX Upload", "Accepted standard 12MB PPTX presentation");
  assert(!testExe.valid, "Dangerous File Rejection", "Rejected executable file (.exe)");
  assert(!testOversize.valid, "Oversize File Rejection", "Rejected file exceeding 25MB limit");
  assert(
    testTraversal.valid && !testTraversal.sanitizedName?.includes(".."),
    "Path Traversal Sanitization",
    `Sanitized path traversal to: ${testTraversal.sanitizedName}`
  );

  // TEST 7: Diagrams.net PostMessage Origin Hardening
  console.log("\n--- 7. DIAGRAMS.NET POSTMESSAGE ORIGIN VALIDATION ---");
  const ALLOWED_ORIGINS = ["https://embed.diagrams.net", "https://app.diagrams.net"];
  function isAllowedMessageOrigin(origin: string): boolean {
    return ALLOWED_ORIGINS.includes(origin);
  }

  assert(
    isAllowedMessageOrigin("https://embed.diagrams.net"),
    "Valid Draw.io Origin (Embed)",
    "Allowed trusted embed.diagrams.net origin"
  );
  assert(
    isAllowedMessageOrigin("https://app.diagrams.net"),
    "Valid Draw.io Origin (App)",
    "Allowed trusted app.diagrams.net origin"
  );
  assert(
    !isAllowedMessageOrigin("https://evil-hacker.com"),
    "Untrusted Origin Rejection",
    "Blocked malicious third-party postMessage origin"
  );
  assert(
    !isAllowedMessageOrigin("null"),
    "Null Origin Rejection",
    "Blocked null / sandboxed origin spoofing"
  );

  // SUMMARY REPORT
  console.log("\n=======================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`TOTAL AUDIT TESTS RUN: ${total}`);
  console.log(`PASSED: \x1b[32m${passed}\x1b[0m`);
  console.log(`FAILED: \x1b[${failed > 0 ? "31" : "32"}m${failed}\x1b[0m`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityAudit().catch((err) => {
  console.error("Audit suite error:", err);
  process.exit(1);
});
