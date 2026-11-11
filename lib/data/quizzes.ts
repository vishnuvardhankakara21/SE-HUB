export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface UnitQuiz {
  unitNumber: number;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}

export const CANONICAL_QUIZZES: Record<number, UnitQuiz> = {
  1: {
    unitNumber: 1,
    title: "Unit 1: Process Models & SDLC Mastery Quiz",
    description: "Evaluates classical and agile SDLC models, umbrella activities, and development workflows.",
    timeLimitMinutes: 10,
    questions: [
      {
        questionText:
          "Which process model is most appropriate when customer requirements are completely stable, well-understood, and unlikely to change?",
        options: [
          "Waterfall Model",
          "Agile Model",
          "Spiral Model",
          "Prototype Model",
        ],
        correctOptionIndex: 0,
        explanation:
          "The Waterfall model is ideal for small, well-defined projects with stable requirements where sequential phases can be executed without frequent back-tracking.",
      },
      {
        questionText:
          "In the V-Model, which testing phase corresponds directly to the Requirements Analysis phase?",
        options: [
          "Unit Testing",
          "Integration Testing",
          "System Testing",
          "Acceptance Testing",
        ],
        correctOptionIndex: 3,
        explanation:
          "Acceptance Testing validates that the software meets customer business requirements identified during the Requirements Analysis phase.",
      },
      {
        questionText:
          "What is the primary driving factor in Barry Boehm's Spiral Model?",
        options: [
          "Speed of delivery",
          "Risk analysis and management",
          "Component reusability",
          "Formal documentation",
        ],
        correctOptionIndex: 1,
        explanation:
          "The Spiral model was specifically designed as a risk-driven process that mitigates technical and managerial risks during each spiral cycle.",
      },
      {
        questionText:
          "Which of the following is classified as an Umbrella Activity in Software Engineering?",
        options: [
          "Coding",
          "System Design",
          "Software Configuration Management (SCM)",
          "User Acceptance Testing",
        ],
        correctOptionIndex: 2,
        explanation:
          "SCM, SQA, and Risk Management are umbrella activities because they span across all development phases rather than belonging to a single phase.",
      },
    ],
  },
  2: {
    unitNumber: 2,
    title: "Unit 2: SRS & Function-Oriented Design Quiz",
    description: "Cohesion, coupling, IEEE 830 format, and DFD balancing rules.",
    timeLimitMinutes: 10,
    questions: [
      {
        questionText:
          "Which type of cohesion is considered the most desirable and highest in software engineering?",
        options: [
          "Temporal Cohesion",
          "Communicational Cohesion",
          "Functional Cohesion",
          "Coincidental Cohesion",
        ],
        correctOptionIndex: 2,
        explanation:
          "Functional cohesion occurs when all elements within a module contribute to executing a single, well-defined mathematical or domain function.",
      },
      {
        questionText:
          "Which type of coupling is considered the most undesirable (highest degree of interdependence)?",
        options: [
          "Data Coupling",
          "Stamp Coupling",
          "Control Coupling",
          "Content Coupling",
        ],
        correctOptionIndex: 3,
        explanation:
          "Content coupling is the worst form because one module directly reads or modifies the internal code or private memory of another module.",
      },
      {
        questionText:
          "What does the fundamental DFD Balancing Rule mandate?",
        options: [
          "Every process must have exactly two inputs and two outputs",
          "Data flows entering and leaving a parent process must match those entering and leaving its decomposed child DFD",
          "Data stores cannot interact with processes",
          "External entities must equal the count of data stores",
        ],
        correctOptionIndex: 1,
        explanation:
          "Balancing guarantees that inputs and outputs at higher DFD levels are preserved without omission in lower-level decomposed DFDs.",
      },
    ],
  },
  3: {
    unitNumber: 3,
    title: "Unit 3: Architecture & UML Modeling Quiz",
    description: "4+1 view model, architectural styles, and object-oriented class relationships.",
    timeLimitMinutes: 10,
    questions: [
      {
        questionText:
          "In UML Class Diagrams, what graphical notation represents Composition (strong whole-part relationship)?",
        options: [
          "A dashed arrow",
          "A solid line with a hollow diamond",
          "A solid line with a filled diamond",
          "A hollow triangle",
        ],
        correctOptionIndex: 2,
        explanation:
          "A filled diamond represents Composition, where the lifecycle of the part is strictly bound to the lifetime of the whole.",
      },
      {
        questionText:
          "Which architectural style is best illustrated by a compiler executing lexical analysis, parsing, and code generation in sequence?",
        options: [
          "Client-Server Style",
          "Shared Data / Repository Style",
          "Pipe-and-Filter Style",
          "Event-Driven Style",
        ],
        correctOptionIndex: 2,
        explanation:
          "Pipe-and-Filter transforms discrete streams of data through successive independent filter components connected by pipes.",
      },
      {
        questionText:
          "In Use Case diagrams, what does the <<include>> stereotype signify?",
        options: [
          "The included use case is executed conditionally",
          "The base use case always and unconditionally incorporates the included behavior",
          "The included use case is an optional plugin",
          "The included use case represents an external actor",
        ],
        correctOptionIndex: 1,
        explanation:
          "The <<include>> relationship represents mandatory inclusion of common functionality required by the base use case.",
      },
    ],
  },
  4: {
    unitNumber: 4,
    title: "Unit 4: Advanced UML & Testing Strategies Quiz",
    description: "Basis path testing, cyclomatic complexity, boundary value analysis, and verification vs validation.",
    timeLimitMinutes: 10,
    questions: [
      {
        questionText:
          "If a Control Flow Graph (CFG) has 9 edges (E) and 7 nodes (N), what is its Cyclomatic Complexity V(G)?",
        options: ["2", "4", "5", "3"],
        correctOptionIndex: 1,
        explanation:
          "Using Formula 1: V(G) = E - N + 2 = 9 - 7 + 2 = 4 independent paths.",
      },
      {
        questionText:
          "Which Black-Box testing technique specifically selects test cases at the extreme minimum, maximum, and immediate boundary limits?",
        options: [
          "Equivalence Partitioning",
          "Boundary Value Analysis (BVA)",
          "Basis Path Testing",
          "Statement Coverage",
        ],
        correctOptionIndex: 1,
        explanation:
          "BVA focuses on input extremes where boundary faults are statistically most prevalent.",
      },
      {
        questionText:
          "What is the classical distinction between Verification and Validation?",
        options: [
          "Verification: 'Are we building the product right?' | Validation: 'Are we building the right product?'",
          "Verification is done by clients; Validation is done by developers",
          "Verification is dynamic testing; Validation is static code inspection",
          "There is no difference in software engineering",
        ],
        correctOptionIndex: 0,
        explanation:
          "Verification ensures compliance with technical specifications; Validation ensures the final product fulfills actual customer requirements.",
      },
    ],
  },
  5: {
    unitNumber: 5,
    title: "Unit 5: Product Metrics & COCOMO Quiz",
    description: "Barry Boehm's COCOMO equations, EVM variances, and Defect Removal Efficiency.",
    timeLimitMinutes: 10,
    questions: [
      {
        questionText:
          "In Basic COCOMO, which project mode represents small teams developing familiar software in an experienced environment?",
        options: [
          "Semi-Detached Mode",
          "Embedded Mode",
          "Organic Mode",
          "Detailed Mode",
        ],
        correctOptionIndex: 2,
        explanation:
          "Organic mode applies to experienced teams with well-understood requirements, using coefficients a = 2.4 and b = 1.05.",
      },
      {
        questionText:
          "In Earned Value Management (EVM), what does a positive Schedule Variance (SV = EV - PV > 0) signify?",
        options: [
          "The project is over budget",
          "The project is behind schedule",
          "The project is ahead of schedule",
          "The project has incurred zero costs",
        ],
        correctOptionIndex: 2,
        explanation:
          "When Earned Value (EV) exceeds Planned Value (PV), more work has been accomplished than planned, meaning the project is ahead of schedule.",
      },
      {
        questionText:
          "If 40 defects were detected during development (E) and 10 defects were uncovered by users post-deployment (D), what is the Defect Removal Efficiency (DRE)?",
        options: ["80%", "75%", "90%", "25%"],
        correctOptionIndex: 0,
        explanation:
          "DRE = (E / (E + D)) * 100 = (40 / (40 + 10)) * 100 = (40 / 50) * 100 = 80%.",
      },
    ],
  },
};

