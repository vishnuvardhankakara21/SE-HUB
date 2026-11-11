export interface QuestionItem {
  number: string;
  subNumber?: string;
  text: string;
  marks: string;
  co?: string;
  blooms?: string;
  pi?: string;
}

export interface QuestionGroup {
  unitTitle: string;
  unitNumber: number;
  orGroup?: boolean;
  questions: QuestionItem[];
  alternateQuestions?: QuestionItem[];
}

export interface PreviousPaper {
  id: string;
  title: string;
  institution: string;
  department: string;
  program: string;
  yearSemester: string;
  courseTitle: string;
  courseCode: string;
  regulation: string; // e.g., "R23"
  examType: "Semester-End Regular" | "Mid-Term 1" | "Mid-Term 2";
  date: string;
  time: string;
  maxMarks: string;
  codeNumber?: string;
  instructions: string;
  scanImageUrl: string;
  unitsCovered: number[];
  groups: QuestionGroup[];
}

export const ANITS_PREVIOUS_PAPERS: PreviousPaper[] = [
  {
    id: "anits-r23-sem-end-2025",
    title: "ANITS Autonomous Regular Semester-End Examination",
    institution: "Anil Neerukonda Institute of Technology & Sciences (Autonomous)",
    department: "Department of Computer Science & Engineering",
    program: "B.Tech III/IV CSE • I-Semester Regular",
    yearSemester: "III/IV B.Tech I-Semester",
    courseTitle: "SOFTWARE ENGINEERING (CSE)",
    courseCode: "23CS4119",
    codeNumber: "R23-40313",
    regulation: "R23 Regulation",
    examType: "Semester-End Regular",
    date: "October - November 2025",
    time: "3 Hours",
    maxMarks: "60M (5 × 12M)",
    instructions: "Answer ONE Question from each Unit. All Questions Carry Equal Marks (12M). All parts of the questions must be answered at one place only.",
    scanImageUrl: "/images/previous-papers/ANITS_R23_SEM_END_2025_11.jpg",
    unitsCovered: [1, 2, 3, 4, 5],
    groups: [
      {
        unitTitle: "UNIT - I (Software Process & Life Cycle Models)",
        unitNumber: 1,
        questions: [
          {
            number: "1",
            subNumber: "a",
            text: "Define software? Describe the nature of the software and software process.",
            marks: "6M",
            co: "CO-1",
            blooms: "L1",
          },
          {
            number: "1",
            subNumber: "b",
            text: "Explain the spiral model for software process with the help of a diagram.",
            marks: "6M",
            co: "CO-1",
            blooms: "L2",
          },
        ],
        alternateQuestions: [
          {
            number: "2",
            subNumber: "a",
            text: "What are software challenges and SDLC? Explain in detail.",
            marks: "6M",
            co: "CO-1",
            blooms: "L1",
          },
          {
            number: "2",
            subNumber: "b",
            text: "Describe the Waterfall Model and the Iterative Waterfall Model.",
            marks: "6M",
            co: "CO-1",
            blooms: "L2",
          },
        ],
      },
      {
        unitTitle: "UNIT - II (Requirements Engineering, SRS & System Design)",
        unitNumber: 2,
        questions: [
          {
            number: "3",
            subNumber: "a",
            text: "Explain the software requirements specification SRS?",
            marks: "6M",
            co: "CO-2",
            blooms: "L2",
          },
          {
            number: "3",
            subNumber: "b",
            text: "What is meant by coupling? Explain five levels of coupling.",
            marks: "6M",
            co: "CO-2",
            blooms: "L1",
          },
        ],
        alternateQuestions: [
          {
            number: "4",
            subNumber: "a",
            text: "Differentiate between structured design and detailed design?",
            marks: "6M",
            co: "CO-2",
            blooms: "L2",
          },
          {
            number: "4",
            subNumber: "b",
            text: "What is a DFD? Explain the process involved in preparing the DFDs.",
            marks: "6M",
            co: "CO-2",
            blooms: "L1",
          },
        ],
      },
      {
        unitTitle: "UNIT - III (Software Architecture & UML Building Blocks)",
        unitNumber: 3,
        questions: [
          {
            number: "5",
            subNumber: "a",
            text: "Explain different architecture views?",
            marks: "6M",
            co: "CO-3",
            blooms: "L2",
          },
          {
            number: "5",
            subNumber: "b",
            text: "Describe the class diagram in UML and its key elements.",
            marks: "6M",
            co: "CO-3",
            blooms: "L2",
          },
        ],
        alternateQuestions: [
          {
            number: "6",
            subNumber: "a",
            text: "Explain an object-oriented design with an example.",
            marks: "6M",
            co: "CO-3",
            blooms: "L2",
          },
          {
            number: "6",
            subNumber: "b",
            text: "Explain the Building blocks of UML.",
            marks: "6M",
            co: "CO-3",
            blooms: "L3",
          },
        ],
      },
      {
        unitTitle: "UNIT - IV (Object-Oriented Design & Testing Strategies)",
        unitNumber: 4,
        questions: [
          {
            number: "7",
            subNumber: "a",
            text: "Explain the Booch Methodology?",
            marks: "6M",
            co: "CO-4",
            blooms: "L2",
          },
          {
            number: "7",
            subNumber: "b",
            text: "Differentiate between black box testing and white box testing?",
            marks: "6M",
            co: "CO-4",
            blooms: "L2",
          },
        ],
        alternateQuestions: [
          {
            number: "8",
            subNumber: "a",
            text: "Explain the Activity diagram and the state chart diagram.",
            marks: "6M",
            co: "CO-4",
            blooms: "L3",
          },
          {
            number: "8",
            subNumber: "b",
            text: "Explain System Testing? Explain some general issues associated with testing.",
            marks: "6M",
            co: "CO-4",
            blooms: "L2",
          },
        ],
      },
      {
        unitTitle: "UNIT - V (Metrics, Estimation & Software Project Management)",
        unitNumber: 5,
        questions: [
          {
            number: "9",
            subNumber: "a",
            text: "Explain what the metrics are used for in the Requirements Model.",
            marks: "6M",
            co: "CO-5",
            blooms: "L2",
          },
          {
            number: "9",
            subNumber: "b",
            text: "Explain the COCOMO Model.",
            marks: "6M",
            co: "CO-5",
            blooms: "L2",
          },
        ],
        alternateQuestions: [
          {
            number: "10",
            subNumber: "a",
            text: "Define a Software project and explain the need for software project management.",
            marks: "6M",
            co: "CO-5",
            blooms: "L1",
          },
          {
            number: "10",
            subNumber: "b",
            text: "Explain the importance of project tracking & control in software development.",
            marks: "6M",
            co: "CO-5",
            blooms: "L2",
          },
        ],
      },
    ],
  },
  {
    id: "anits-r23-mid-1-2025",
    title: "ANITS Descriptive Examination MID - I",
    institution: "Anil Neerukonda Institute of Technology and Sciences (ANITS)",
    department: "Department of Computer Science & Engineering",
    program: "B.Tech III/IV CSE • Semester I",
    yearSemester: "3/4 CSE Semester: I",
    courseTitle: "Software Engineering",
    courseCode: "CSE4119 / 23CS4119",
    regulation: "R23 Regulation",
    examType: "Mid-Term 1",
    date: "21-08-2025",
    time: "1:15PM – 03:15PM",
    maxMarks: "40M",
    instructions: "Answer any three of the following six questions, one question from each unit. Students should write the answers in serial number i.e. 1a, b, 2a, b, 3a, b, etc. and in one space in the answer book.",
    scanImageUrl: "/images/previous-papers/ANITS_R23_MID1_2025_08_21.jpg",
    unitsCovered: [1, 2, 3],
    groups: [
      {
        unitTitle: "UNIT - 1 (SDLC, Evolutionary Models & Agile)",
        unitNumber: 1,
        questions: [
          {
            number: "1",
            subNumber: "a",
            text: "Describe the main steps involved in the problem-solving process during software development and the phases of SDLC with a neat sketch?",
            marks: "8M",
            co: "CO1",
            blooms: "L2",
            pi: "2.2.4",
          },
          {
            number: "1",
            subNumber: "b",
            text: "Explain about Evolutionary process models in detail with neat sketch?",
            marks: "8M",
            co: "CO1",
            blooms: "L2",
            pi: "1.3.1",
          },
        ],
        alternateQuestions: [
          {
            number: "2",
            subNumber: "a",
            text: "Define Agile methodology and its artifacts. Explain the Agile Manifesto along with its 12 principles?",
            marks: "10M",
            co: "CO1",
            blooms: "L2",
            pi: "1.2.1",
          },
          {
            number: "2",
            subNumber: "b",
            text: "How do umbrella activities ensure consistency and quality across all phases of the software development life cycle?",
            marks: "8M",
            co: "CO1",
            blooms: "L2",
            pi: "1.3.1",
          },
        ],
      },
      {
        unitTitle: "UNIT - 2 (Requirements, Coupling & Data Flow Diagrams)",
        unitNumber: 2,
        questions: [
          {
            number: "3",
            subNumber: "a",
            text: "Write the difference between the Functional Requirements, Non Functional Requirements with suitable example?",
            marks: "8M",
            co: "CO2",
            blooms: "L3",
            pi: "1.2.1",
          },
          {
            number: "3",
            subNumber: "b",
            text: "What is coupling in software engineering? What are the different types of coupling in software design? Provide examples of each.",
            marks: "8M",
            co: "CO2",
            blooms: "L3",
            pi: "2.1.1",
          },
        ],
        alternateQuestions: [
          {
            number: "4",
            subNumber: "a",
            text: "What is a DFD? What are the main components and rules of a DFD explain with Student Information System?",
            marks: "10M",
            co: "CO2",
            blooms: "L1",
            pi: "2.1.3",
          },
          {
            number: "4",
            subNumber: "b",
            text: "Mention Characteristics of Requirements in detail",
            marks: "6M",
            co: "CO2",
            blooms: "L2",
            pi: "2.1.3",
          },
        ],
      },
      {
        unitTitle: "UNIT - 3 (Software Architecture & UML Building Blocks)",
        unitNumber: 3,
        questions: [
          {
            number: "5",
            text: "Need of Software Architecture and explain about Architecture Views and styles in software engineering?",
            marks: "8M",
            co: "CO3",
            blooms: "L2",
            pi: "2.2.2",
          },
        ],
        alternateQuestions: [
          {
            number: "6",
            text: "Explain Building Blocks of UML in detail with suitable examples?",
            marks: "8M",
            co: "CO3",
            blooms: "L2",
            pi: "2.2.2",
          },
        ],
      },
    ],
  },
  {
    id: "anits-r23-mid-2-2025",
    title: "ANITS Descriptive Examination MID - 2",
    institution: "Anil Neerukonda Institute of Technology and Sciences (ANITS)",
    department: "Department of Computer Science & Engineering",
    program: "B.Tech III/IV CSE • Semester I",
    yearSemester: "3/4 CSE Semester: I",
    courseTitle: "Software Engineering (SE)",
    courseCode: "23CS4119",
    regulation: "R23 Regulation",
    examType: "Mid-Term 2",
    date: "16-10-2025",
    time: "9:30 AM – 11:30 AM",
    maxMarks: "40M",
    instructions: "Answer any three of the following six questions, one question from each unit. Students should write the answers in serial number i.e. 1a, b, 2a, b, 3a, b, etc. and in one space in the answer book.",
    scanImageUrl: "/images/previous-papers/ANITS_R23_MID2_2025_10_16.jpg",
    unitsCovered: [3, 4, 5],
    groups: [
      {
        unitTitle: "UNIT - 3 (UML Diagrams: Class, Sequence, ATM Use-Case)",
        unitNumber: 3,
        questions: [
          {
            number: "1",
            subNumber: "a",
            text: "What is a class diagram? Design Class Diagram for Course Registration System.",
            marks: "4M",
            co: "CO3",
            blooms: "L2",
            pi: "1.2.1",
          },
          {
            number: "1",
            subNumber: "b",
            text: "Taking an example of Online Order Management System, design Sequence and collaboration diagrams.",
            marks: "4M",
            co: "CO3",
            blooms: "L2",
            pi: "1.2.1",
          },
        ],
        alternateQuestions: [
          {
            number: "2",
            text: "Define the problem statement for ATM transaction. Identify the actors and use-cases. Draw a Use-case diagram clearly depicting the scenario.",
            marks: "8M",
            co: "CO3",
            blooms: "L3",
            pi: "1.2.1",
          },
        ],
      },
      {
        unitTitle: "UNIT - 4 (OO Methodologies, COCOMO & Risk Management)",
        unitNumber: 4,
        questions: [
          {
            number: "3",
            text: "Explain object oriented methodologies: a) Rumbaugh Methodology b) Booch Methodology c) Unified Methodology",
            marks: "16M",
            co: "CO4",
            blooms: "L2",
            pi: "1.2.1",
          },
        ],
        alternateQuestions: [
          {
            number: "5",
            subNumber: "a",
            text: "Explain in detail COCOMO Model",
            marks: "8M",
            co: "CO4",
            blooms: "L3",
            pi: "2.1.1",
          },
          {
            number: "5",
            subNumber: "b",
            text: "Explain about Risk Management Plan and Project Tracking & Control in Software Risk Management",
            marks: "8M",
            co: "CO4",
            blooms: "L2",
            pi: "2.1.1",
          },
        ],
      },
      {
        unitTitle: "UNIT - 5 (Testing: Verification/Validation, Defect Tracking & Test Plans)",
        unitNumber: 5,
        questions: [
          {
            number: "4",
            subNumber: "a",
            text: "Differentiate between Verification and Validation in the context of Testing and explain about Defect Logging & Tracking",
            marks: "8M",
            co: "CO5",
            blooms: "L3",
            pi: "2.1.1",
          },
          {
            number: "4",
            subNumber: "b",
            text: "Explain Test plan in detail with the guidelines to be followed in developing a test plan",
            marks: "8M",
            co: "CO5",
            blooms: "L2",
            pi: "1.2.1",
          },
        ],
        alternateQuestions: [
          {
            number: "6",
            subNumber: "a",
            text: "Explain in detail about Test Case Specification",
            marks: "8M",
            co: "CO5",
            blooms: "L2",
            pi: "2.1.1",
          },
          {
            number: "6",
            subNumber: "b",
            text: "List and brief about levels of Testing in detail",
            marks: "8M",
            co: "CO5",
            blooms: "L2",
            pi: "1.2.1",
          },
        ],
      },
    ],
  },
];

