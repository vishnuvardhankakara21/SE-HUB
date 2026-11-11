import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  User,
  Unit,
  Topic,
  QuestionAnswer,
  DiagramReference,
  Quiz,
  Announcement,
  PreviousQuestionPaper,
  Resource,
} from "../lib/db/models";
import { EXAM_QUESTIONS } from "../lib/data/questions";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/se-learning-platform";

export async function seedDatabase() {
  console.log("Connecting to MongoDB for master curriculum seeding...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  // Clean existing curriculum collections
  await Promise.all([
    User.deleteMany({}),
    Unit.deleteMany({}),
    Topic.deleteMany({}),
    QuestionAnswer.deleteMany({}),
    DiagramReference.deleteMany({}),
    Quiz.deleteMany({}),
    Announcement.deleteMany({}),
    PreviousQuestionPaper.deleteMany({}),
    Resource.deleteMany({}),
  ]);
  console.log("Cleaned existing collections.");

  // 1. Create Default Users
  const passwordHash = await bcrypt.hash("Password@123", 10);

  const faculty = await User.create({
    name: "Prof. Ananya Roy (SE Faculty)",
    email: "faculty@college.edu",
    passwordHash,
    role: "teacher",
    status: "active",
    xp: 450,
    streak: { current: 12, longest: 18, lastActiveDate: new Date() },
  });

  const student = await User.create({
    name: "Rahul Verma (Student)",
    email: "student@college.edu",
    passwordHash,
    role: "student",
    status: "active",
    xp: 180,
    streak: { current: 5, longest: 7, lastActiveDate: new Date() },
    earnedBadges: [
      { badgeId: "first_login", awardedAt: new Date() },
      { badgeId: "uml_explorer", awardedAt: new Date() },
    ],
  });

  console.log("Created 2 initial users: Faculty and Student.");

  // 2. Create the 5 Canonical Units
  const unitsData = [
    {
      unitNumber: 1,
      title: "Importance of Software Engineering & Process Models",
      periods: 12,
      slug: "unit-1-importance-of-se-process-models",
      description:
        "Fundamentals of Software Engineering, development activities, umbrella activities, SDLC phases, and comparative analysis of Waterfall, Incremental, Prototype, V-Model, Spiral, RAD, and Agile models.",
      learningOutcomes: [
        "List various Software Development activities and umbrella processes.",
        "Classify and evaluate the working of classical and agile Software Process Models.",
      ],
      order: 1,
    },
    {
      unitNumber: 2,
      title: "Software Requirement Analysis, Specification & Function-Oriented Design",
      periods: 12,
      slug: "unit-2-srs-function-oriented-design",
      description:
        "Requirements engineering, characteristics of good requirements, IEEE 830 format SRS, Function-Oriented Design, DFD levels and rules, design principles, and in-depth module cohesion and coupling classifications.",
      learningOutcomes: [
        "Identify Functional and Non-Functional Requirements and author standard IEEE SRS documents.",
        "Design functional data flow using DFDs and architect modules with high cohesion and low coupling.",
      ],
      order: 2,
    },
    {
      unitNumber: 3,
      title: "Software Architecture, Object-Oriented Design & UML Overview",
      periods: 12,
      slug: "unit-3-architecture-ood-uml",
      description:
        "Architectural views (4+1), C&C architectural styles (Pipe-and-Filter, Client-Server, Shared Data), OOD process and design evolution, building blocks of UML, Class diagrams, Use Case diagrams, and Interaction diagrams.",
      learningOutcomes: [
        "Select and apply appropriate Software Architectural styles.",
        "Design structural and interaction UML diagrams following object-oriented methodologies.",
      ],
      order: 3,
    },
    {
      unitNumber: 4,
      title: "Advanced UML Diagrams, OO Methodologies & Software Testing Strategies",
      periods: 12,
      slug: "unit-4-uml-diagrams-testing-strategies",
      description:
        "Activity, State Chart, Component, and Deployment diagrams across real-world systems; Unified, Rumbaugh OMT, and Booch methodologies; testing levels, conventional vs OO testing, White-Box basis path testing, and Black-Box techniques.",
      learningOutcomes: [
        "Illustrate object-oriented methodologies and construct advanced behavioral & physical UML diagrams.",
        "Design robust test suites, compute Cyclomatic Complexity, and execute White-Box & Black-Box testing.",
      ],
      order: 4,
    },
    {
      unitNumber: 5,
      title: "Product Metrics & Software Project Management",
      periods: 12,
      slug: "unit-5-product-metrics-project-management",
      description:
        "Framework for Product Metrics (Requirements, Design, Source Code LOC/Halstead, Testing, Maintenance), SPM definition and SPMP plan, Effort Estimation, COCOMO models (Basic, Intermediate, Detailed), Risk Management, and Project Tracking (Gantt, EVM).",
      learningOutcomes: [
        "Compute software product metrics and evaluate code/design quality.",
        "Formulate project management plans, calculate COCOMO effort estimates, manage risks, and track schedules using EVM.",
      ],
      order: 5,
    },
  ];

  const createdUnits = await Unit.insertMany(unitsData);
  console.log("Created 5 Units.");

  // Helper map for unitId
  const unitIdMap: Record<number, mongoose.Types.ObjectId> = {};
  createdUnits.forEach((u) => {
    unitIdMap[u.unitNumber] = u._id as mongoose.Types.ObjectId;
  });

  // 3. Create Seed Topics for All 5 Units
  const topicsData = [
    // UNIT 1 TOPICS
    {
      unitId: unitIdMap[1],
      unitNumber: 1,
      title: "Importance of Software Engineering & Core Activities",
      slug: "importance-of-software-engineering",
      order: 1,
      summary: "Definition of SE, complexity management, quality assurance, problem solving, modeling, and knowledge acquisition activities.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 20,
      theoryMarkdown: `## 1. Importance of Software Engineering

### Definition
Software Engineering is a systematic approach to designing, developing, testing, deploying, and maintaining software. It applies engineering principles to software development to produce reliable, efficient, and high-quality software.

### Why Software Engineering is Important
1. **Handles Complexity:** Software projects can contain thousands of lines of code and many interconnected components. Software engineering helps organize and manage this complexity.
2. **Improves Software Quality:** It follows standards, testing procedures, and design principles to develop reliable and error-free software.
3. **Reduces Development Cost:** Proper planning and early error detection help reduce the cost of fixing mistakes later.
4. **Saves Time:** A systematic development process helps teams complete projects within the planned schedule.
5. **Supports Teamwork:** Software engineering defines responsibilities, documentation, and communication methods so that multiple developers can work together.
6. **Improves Maintainability:** Well-designed software is easier to modify, update, and repair.
7. **Increases Customer Satisfaction:** Requirement analysis helps developers understand customer needs and deliver software that meets expectations.

> **Conclusion:** Software engineering is important because it helps develop high-quality, reliable, maintainable, and cost-effective software within the required time.

---

## 2. Problem-Solving Activity
**Definition:** Problem-solving is the activity of understanding a real-world problem and developing a software solution to solve it.

### Steps Involved
1. **Problem Identification:** Understand the problem that needs to be solved (e.g., college attendance automation).
2. **Requirement Analysis:** Identify what the software must do (e.g., record attendance, calculate percentages, generate reports).
3. **Solution Design:** Plan the structure, algorithms, database, and interfaces.
4. **Implementation:** Convert the design into a working program using a programming language.
5. **Testing:** Verify the software produces expected results and identify defects.
6. **Evaluation:** Verify whether the developed software solves the original problem correctly.

---

## 3. Modelling Activity
**Definition:** Modelling is the process of representing a software system using diagrams, structures, or simplified descriptions before actual implementation.

### Four Types of Modelling
* **Requirement Modelling:** Represents what the user expects from the system (e.g., Use Case diagrams).
* **Structural Modelling:** Represents the components of a system and their relationships (e.g., Class diagrams).
* **Behavioural Modelling:** Represents how the system behaves when different events occur (e.g., State Machine diagrams).
* **Data Modelling:** Represents how information is organized and related (e.g., Entity Relationship models).

---

## 4. Knowledge Acquisition & Rationale-Driven Activity
* **Knowledge Acquisition:** Process of collecting, understanding, organizing, and recording information needed to develop software from customers, domain experts, existing systems, and business rules.
* **Rationale-Driven Activity:** Developers record the *reasons* behind important decisions made during software development. It explains *why* a particular decision was made, avoiding repeated mistakes and facilitating maintenance.`,
    },
    {
      unitId: unitIdMap[1],
      unitNumber: 1,
      title: "Umbrella Activities & Software Engineering Challenges",
      slug: "umbrella-activities-and-challenges",
      order: 2,
      summary: "Eight critical umbrella activities and key challenges faced in modern software development.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 15,
      theoryMarkdown: `## Umbrella Activities in Software Engineering

### Definition
Umbrella activities are activities performed throughout the software development process to support and improve the quality of the software project. Unlike phase-specific activities, umbrella activities continue across multiple phases of development.

### Eight Major Umbrella Activities
1. **Software Project Tracking and Control:** Monitors project progress and compares actual progress with planned milestones.
2. **Risk Management:** Identifies possible risks and prepares contingency plans to reduce their impact.
3. **Software Quality Assurance (SQA):** Ensures that development processes and work products comply with defined quality standards.
4. **Formal Technical Reviews (FTR):** Reviews requirements, designs, and code to detect defects early before they propagate.
5. **Software Configuration Management (SCM):** Manages changes to code, documents, and baseline artifacts (e.g., using Git).
6. **Measurement & Metrics:** Collects process and product metrics such as defect counts and development velocity.
7. **Software Documentation:** Produces and maintains technical documents for requirements, architecture, and user manuals.
8. **Reusability Management:** Identifies, creates, and maintains reusable software components.

> **Exam Tip:** To score full marks on Umbrella Activities, list and explain at least six activities with clear examples.

---

## Software Engineering Challenges
1. **Complexity:** Interconnected components make large software hard to manage.
2. **Changing Requirements:** Evolving client needs alter project scope, schedule, and cost.
3. **Time and Cost Constraints:** Delivering high-grade software within strict budget ceilings and tight deadlines.
4. **Software Quality & Security:** Preventing vulnerabilities, data leaks, and runtime errors.
5. **Maintenance & Legacy Code:** Managing long-term updates and technical debt.
6. **Scalability:** Ensuring responsiveness under rapid growth in concurrent users and transaction volumes.`,
    },
    {
      unitId: unitIdMap[1],
      unitNumber: 1,
      title: "Software Development Life Cycle (SDLC) & Classical Process Models",
      slug: "sdlc-and-process-models",
      order: 3,
      summary: "Seven phases of SDLC, Waterfall Model, Incremental Model, Prototype Model, and V-Model.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 25,
      theoryMarkdown: `## Software Development Life Cycle (SDLC)

The SDLC is a structured sequence of phases followed by software engineers to develop reliable software applications from inception to retirement.

\`\`\`
 Planning & Feasibility Study
             │
             ▼
    Requirement Analysis
             │
             ▼
       System Design
             │
             ▼
    Implementation (Coding)
             │
             ▼
         Testing
             │
             ▼
        Deployment
             │
             ▼
       Maintenance
\`\`\`

### Seven Core SDLC Phases
1. **Planning and Feasibility:** Evaluates technical, financial, and operational feasibility.
2. **Requirement Analysis:** Gathers and documents customer expectations into an SRS.
3. **System Design:** Architects database structures, UI wireframes, and module interfaces.
4. **Implementation:** Translates designs into executable source code.
5. **Testing:** Validates system behavior through unit, integration, system, and acceptance tests.
6. **Deployment:** Releases the validated system into staging and production environments.
7. **Maintenance:** Corrects post-release bugs, enhances features, and adapts to new runtime platforms.

---

## Classical Process Models

### 1. Waterfall Model
* **Characteristics:** Sequential, linear flow. Each phase must complete before the next begins.
* **Advantages:** Simple to comprehend; distinct milestones; excellent documentation.
* **Disadvantages:** Rigid to change; late working software; delayed testing; high risk of late-stage rework.

### 2. Incremental Model
* **Characteristics:** Divides system into functional releases (increments). First increment delivers core features; subsequent increments add functionality.
* **Advantages:** Early working software delivered; client feedback guides future increments.
* **Disadvantages:** Demands modular architecture; complex inter-increment integration.

### 3. Prototype Model
* **Characteristics:** Develops an early toy system or mockup to clarify ambiguous user requirements.
* **Cycle:** Requirements Gathering -> Quick Design -> Build Prototype -> Customer Evaluation -> Refine Prototype -> Final Design & Implementation.
* **Advantages:** Clarifies ambiguous needs; prevents building the wrong product.

### 4. V-Model (Verification and Validation Model)
* **Concept:** Connects every development phase on the left with a corresponding testing phase on the right.
* **Pairs:**
  * Requirements <---> Acceptance Testing
  * System Design <---> System Testing
  * Architecture <---> Integration Testing
  * Module Design <---> Unit Testing`,
    },
    {
      unitId: unitIdMap[1],
      unitNumber: 1,
      title: "Evolutionary & Agile Models: Spiral, RAD, and Agile",
      slug: "spiral-rad-agile-models",
      order: 4,
      summary: "Spiral risk-driven model, Rapid Application Development (RAD), and Agile iteration.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 20,
      theoryMarkdown: `## 1. Spiral Model (Risk-Driven Model)
Introduced by Barry Boehm. Combines iterative development with rigorous risk assessment.

### Four Quadrants in Each Spiral:
1. **Planning:** Identifies objectives, alternative solutions, and constraints.
2. **Risk Analysis:** Evaluates technical and management risks; creates prototypes to mitigate dangers.
3. **Engineering:** Develops, tests, and validates the current increment.
4. **Customer Evaluation:** Reviews progress and decides whether to continue to the next spiral.

---

## 2. Rapid Application Development (RAD)
Emphasizes rapid prototyping and component reuse over prolonged planning.
* **Phases:** Requirements Planning -> User Design -> Construction -> Cutover.
* **Best suited for:** Modular systems with well-understood requirements and short delivery windows (60–90 days).

---

## 3. Agile Model
Iterative and incremental methodology centered around the Agile Manifesto: Individuals and interactions over processes and tools, working software over comprehensive documentation, customer collaboration over contract negotiation, and responding to change over following a plan.

### Core Comparison Summary
| Feature | Waterfall | Incremental | Prototype | Spiral | Agile |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Requirements** | Fixed upfront | Prioritized in stages | Unclear initially | High-risk & evolving | Highly dynamic |
| **Delivery** | Single final release | Staged increments | Working prototype first | Repeated spiral releases | Small, frequent sprints |
| **Risk Focus** | Low risk tolerance | Moderate | Focus on user needs | Central risk analysis | Continuous feedback |
| **Customer Role**| Beginning and end | Reviews each release | Direct evaluator | Reviews each spiral | Continuous collaborator |`,
    },

    // UNIT 2 TOPICS
    {
      unitId: unitIdMap[2],
      unitNumber: 2,
      title: "Requirements Engineering, Good Characteristics & IEEE 830 SRS",
      slug: "requirements-engineering-and-ieee-srs",
      order: 1,
      summary: "Need for SRS, functional vs non-functional requirements, characteristics of good requirements, and IEEE 830 structure.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 20,
      theoryMarkdown: `## Software Requirements Specification (SRS)

### Why Do We Need an SRS?
An SRS acts as the legal and technical contract between stakeholders and engineering teams.
1. Establishes mutual agreement on system scope and deliverables.
2. Serves as the blueprint for software architecture and database design.
3. Provides concrete criteria for QA test-case generation.
4. Aids accurate project scheduling and budget estimation.
5. Minimizes costly late-stage requirement misunderstandings.

---

## Characteristics of Good Requirements
1. **Correct:** Represents a genuine, verified user need.
2. **Complete:** Leaves no essential condition, input, or output unspecified.
3. **Unambiguous:** Has exactly one interpretation.
4. **Consistent:** Contains no contradictory statements across sections.
5. **Verifiable (Testable):** Quantifiable criteria allow testers to verify fulfillment.
6. **Feasible:** Achievable within budget, technology, and schedule boundaries.
7. **Traceable:** Identified by a unique identifier (e.g., \`REQ-012\`) traced to design and tests.
8. **Modifiable:** Organized hierarchically so edits do not corrupt other requirements.

---

## Functional vs. Non-Functional Requirements
* **Functional Requirements:** Define *what* the system does (features, inputs, business calculations, database transactions, auth).
* **Non-Functional Requirements:** Define *how well* the system performs (response latency, concurrency, security, 99.9% uptime, usability, portability).

---

## IEEE 830 Standard Format for SRS
1. **Introduction** (Purpose, Scope, Definitions, References, Document Overview)
2. **Overall Description** (Product Perspective, User Classes, Operating Environment, Constraints, Assumptions)
3. **Specific Requirements** (External Interfaces, Functional Features, Performance, Design Constraints, Quality Attributes)
4. **Appendices**
5. **Index**`,
    },
    {
      unitId: unitIdMap[2],
      unitNumber: 2,
      title: "Function-Oriented Design & Data Flow Diagrams (DFDs)",
      slug: "function-oriented-design-and-dfd",
      order: 2,
      summary: "Functional decomposition, DFD symbols, Level-0 to Level-2 diagrams, and DFD balancing rules.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 20,
      theoryMarkdown: `## Function-Oriented Design (FOD)
In FOD, the system is decomposed into a hierarchy of functional modules that transform input data streams into outputs.

### Four Standard DFD Symbols
1. **External Entity (Rectangle):** A source or sink of data outside the system boundary.
2. **Process (Circle / Rounded Rectangle):** Transforms input data to output data.
3. **Data Flow (Directed Arrow):** Illustrates the movement and direction of data packets.
4. **Data Store (Parallel Open Lines):** Represents repository of stored data at rest.

### Levels of DFD
* **Level 0 (Context Diagram):** Depicts the entire application as a single process bubble interacting with external entities.
* **Level 1 DFD:** Decomposes the single system bubble into major sub-processes (e.g., Auth, Catalog, Checkout, Payments).
* **Level 2 DFD:** Drills down into individual Level-1 processes to show granular calculations and sub-stores.

### DFD Balancing Rule
A fundamental rule: Every data flow entering or exiting a process in a higher-level DFD must appear entering or exiting the decomposed child DFD. If 2 inputs and 1 output enter Process 1.0, the Level 2 DFD for 1.0 must have those same 2 inputs and 1 output.`,
    },
    {
      unitId: unitIdMap[2],
      unitNumber: 2,
      title: "Design Principles, Module Concepts & Cohesion vs Coupling",
      slug: "cohesion-and-coupling-deep-dive",
      order: 3,
      summary: "Seven types of Cohesion, six types of Coupling, and core software modularity principles.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 25,
      theoryMarkdown: `## Modularity & Fundamental Design Principles
* **High Cohesion:** A module must perform one tightly defined, coherent responsibility.
* **Low Coupling:** Modules must have minimal interdependence on each other's internal state.

---

## Types of Cohesion (Weakest to Strongest)
1. **Coincidental Cohesion (Worst):** Unrelated tasks bundled together by accident.
2. **Logical Cohesion:** Tasks belonging to the same general category grouped together with a flag (e.g., print everything).
3. **Temporal Cohesion:** Tasks grouped because they execute during the same time window (e.g., system boot-up).
4. **Procedural Cohesion:** Tasks executed in a specific sequence, though operating on different data.
5. **Communicational Cohesion:** Tasks operate on the same common dataset or database record.
6. **Sequential Cohesion:** The output of one task directly feeds as the input to the next task.
7. **Functional Cohesion (Best):** Every single line and instruction contributes to executing one single, well-defined mathematical or domain operation.

---

## Types of Coupling (Worst to Best)
1. **Content Coupling (Worst):** One module directly modifies the private memory or code of another.
2. **Common Coupling:** Multiple modules read and write to global shared variables.
3. **External Coupling:** Modules depend on external hardware, third-party formats, or protocols.
4. **Control Coupling:** One module passes control flags to dictate the execution path of another.
5. **Stamp Coupling:** Modules pass complete data structures when only a single property was needed.
6. **Data Coupling (Best):** Modules communicate strictly by passing only primitive arguments through clean, defined interfaces.`,
    },

    // UNIT 3 TOPICS
    {
      unitId: unitIdMap[3],
      unitNumber: 3,
      title: "Software Architecture & 4+1 View Model",
      slug: "software-architecture-and-views",
      order: 1,
      summary: "High-level blueprint, Kruchten's 4+1 view model: Logical, Process, Development, Physical, and Scenario views.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 20,
      theoryMarkdown: `## Software Architecture
Software architecture is the high-level structural blueprint of a system, defining its computational elements, external interfaces, responsibilities, and communication patterns.

### The 4+1 View Model (Philippe Kruchten)
\`\`\`
          ┌──────────────────┐
          │   Logical View   │
          └────────┬─────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼────────┐ ┌───▼────────┐ ┌───▼────────┐
│Process View│ │ Development│ │Physical    │
│            │ │    View    │ │  View      │
└───┬────────┘ └───┬────────┘ └───┬────────┘
    │              │              │
    └──────────────┼──────────────┘
                   │
        ┌──────────▼──────────┐
        │Scenarios / Use Cases│
        │        (+1)         │
        └─────────────────────┘
\`\`\`

1. **Logical View:** Static structural model of classes, objects, and relationships. Caters to software designers and developers.
2. **Process View:** Runtime model capturing concurrency, threads, tasks, and synchronization. Caters to system integrators.
3. **Development View:** Code organization into packages, libraries, and compilation units. Caters to programmers.
4. **Physical View:** Mapping of software artifacts onto physical hardware nodes, network topologies, and servers. Caters to DevOps and deployment engineers.
5. **Scenario View (+1):** Concrete use-case flows that tie the other four views together and validate system behavior.`,
    },
    {
      unitId: unitIdMap[3],
      unitNumber: 3,
      title: "Component-and-Connector (C&C) Architectural Styles",
      slug: "architectural-styles-pipe-filter-client-server",
      order: 2,
      summary: "Pipe-and-Filter, Client-Server, and Shared Data (Repository) architectural patterns.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 20,
      theoryMarkdown: `## C&C Architectural Styles

### 1. Pipe-and-Filter Style
* **Concept:** Processes sequential streams of data through independent transformation steps (filters) connected by conduits (pipes).
* **Components:** Filters (perform stateless transformations).
* **Connectors:** Pipes (unidirectional byte or record streams).
* **Applications:** Compilers (Lexer -> Parser -> Semantic -> Optimizer -> CodeGen), image processing, video encoding.
* **Pros/Cons:** Highly reusable and parallelizable; but unsuitable for highly interactive event-driven UI applications.

### 2. Client-Server Style
* **Concept:** Separates service consumers (clients) from service providers (servers) communicating over a network protocol.
* **Pros:** Centralized security and database governance; independent scaling of clients and servers.
* **Cons:** Single-point-of-failure risk at server level; network latency overhead.

### 3. Shared Data (Repository) Style
* **Concept:** Central database or blackboard around which independent computational modules coordinate by querying and modifying shared state.
* **Applications:** Database management systems, CASE tool repositories, modern enterprise data warehouses.`,
    },
    {
      unitId: unitIdMap[3],
      unitNumber: 3,
      title: "UML Building Blocks, Class Diagrams & Relationships",
      slug: "uml-class-diagrams-and-relationships",
      order: 3,
      summary: "Things, Relationships, Diagrams, Class compartments, visibility, Association, Aggregation, Composition, Generalization.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 25,
      theoryMarkdown: `## Building Blocks of UML
* **Things:** Structural (Class, Interface, Node, Component), Behavioral (Interaction, State Machine), Grouping (Package), Annotational (Note).
* **Relationships:** Dependency, Association, Generalization, Realization.
* **Diagrams:** 14 standard UML diagrams split into Structural and Behavioral.

---

## Class Relationships & UML Notations
| Relationship | Description | UML Graphic Notation |
| :--- | :--- | :--- |
| **Association** | General structural connection between classes. | Solid line |
| **Aggregation** | "Has-a" weak whole-part relationship; parts can exist independently (e.g., Department & Professor). | Solid line with **hollow diamond** at whole |
| **Composition** | "Part-of" strong lifetime-bound relationship; destruction of whole destroys parts (e.g., House & Room). | Solid line with **filled diamond** at whole |
| **Generalization** | "Is-a" inheritance relationship from child to parent class. | Solid line with **hollow triangle** pointing to parent |
| **Dependency** | One class temporarily uses or references another. | Dashed line with open arrow |
| **Realization** | A class implements a specified interface. | Dashed line with hollow triangle pointing to interface |`,
    },
    {
      unitId: unitIdMap[3],
      unitNumber: 3,
      title: "Use Case Modeling & Interaction Diagrams",
      slug: "use-case-and-interaction-diagrams",
      order: 4,
      summary: "Use case scenarios, <<include>> vs <<extend>>, Sequence diagrams, and Collaboration diagrams.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 25,
      theoryMarkdown: `## Use Case Relationships
* **<<include>>:** The base use case unconditionally executes the included behavior (e.g., *Withdraw Cash* <<include>> *Authenticate User*). Arrow points from base to included use case.
* **<<extend>>:** The extending use case optionally enhances the base use case under specific extension points (e.g., *Print Receipt* <<extend>> *Withdraw Cash*). Arrow points from extending to base use case.

---

## Interaction Diagrams: Sequence vs. Collaboration
* **Sequence Diagram:** Time-ordered message exchanges. Uses vertical lifelines, activation boxes, and horizontal synchronous/asynchronous message arrows. Time progresses from top to bottom.
* **Collaboration (Communication) Diagram:** Emphasizes structural topology. Interacting objects are connected by links, and messages are numbered sequentially (e.g., \`1: login()\`, \`1.1: verifyHash()\`).`,
    },

    // UNIT 4 TOPICS
    {
      unitId: unitIdMap[4],
      unitNumber: 4,
      title: "Advanced UML: Activity, State Chart, Component & Deployment Diagrams",
      slug: "advanced-uml-activity-state-component-deployment",
      order: 1,
      summary: "Workflows in Activity Diagrams, state machines, component dependencies, and 3-tier hardware deployment topologies.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 25,
      theoryMarkdown: `## 1. Activity Diagram
Visualizes the sequential and concurrent workflow of activities in a system.
* **Elements:** Initial Node (filled circle), Activity (rounded rectangle), Decision (diamond), Fork & Join (thick synchronization bars), Final Node (bullseye).

## 2. State Chart Diagram (State Machine)
Models the dynamic lifecycle of an individual object responding to discrete events.
* **Elements:** States, Transitions, Events (triggers), Guard Conditions \`[condition]\`, and Actions \`/action\`.

## 3. Component Diagram
Shows physical software units (JARs, modules, DLLs, services) and their provided/required interface dependencies.

## 4. Deployment Diagram
Illustrates physical runtime nodes (servers, mobile devices, databases) and the communication protocols (TCP/IP, HTTPS) connecting them.`,
    },
    {
      unitId: unitIdMap[4],
      unitNumber: 4,
      title: "Object-Oriented Methodologies: Unified, Rumbaugh OMT & Booch",
      slug: "object-oriented-methodologies",
      order: 2,
      summary: "Unified Process phases, Rumbaugh's three models (Object, Dynamic, Functional), and Booch's macro/micro lifecycles.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 20,
      theoryMarkdown: `## 1. Unified Methodology (Unified Process)
Architecture-centric, use-case driven, iterative, and risk-mitigating.
* **Four Phases:**
  1. **Inception:** Define project scope, business case, and primary use cases.
  2. **Elaboration:** Baseline system architecture, address high-risk items, create executable architectural prototype.
  3. **Construction:** Build the complete system iteratively through coding and testing.
  4. **Transition:** Deploy the system into user environments; beta testing and defect correction.

## 2. Rumbaugh Methodology (OMT)
Employs three complementary orthogonal views:
* **Object Model:** Static structural layout (Classes, Objects, Inheritance).
* **Dynamic Model:** Temporal behavior (State Transition diagrams).
* **Functional Model:** Computation and data transformations (Data Flow Diagrams).

## 3. Booch Methodology
Divides development into:
* **Macro Process:** Conceptualization -> Analysis -> Design -> Evolution -> Maintenance.
* **Micro Process:** Discover classes/objects -> Identify class semantics -> Establish relationships -> Implement interfaces.`,
    },
    {
      unitId: unitIdMap[4],
      unitNumber: 4,
      title: "Software Testing Strategies: White-Box, Basis Path & Cyclomatic Complexity",
      slug: "white-box-testing-basis-path-cyclomatic-complexity",
      order: 3,
      summary: "Levels of testing, statement/branch coverage, control flow graphs, independent paths, and worked Cyclomatic Complexity formulas.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 25,
      theoryMarkdown: `## White-Box Testing & Coverage Criteria
Testers inspect internal source code, branches, conditions, and control flows.
* **Statement Coverage:** Guarantees every statement is executed at least once.
* **Branch Coverage:** Evaluates each decision branch to both True and False.

---

## Basis Path Testing & Cyclomatic Complexity
Introduced by Thomas McCabe. Determines the upper bound on the number of linearly independent paths required for complete test coverage.

### Three Mathematical Formulas for Cyclomatic Complexity \\(V(G)\\):
1. **Formula 1 (Edges and Nodes):**
$$V(G) = E - N + 2$$
where $E$ = number of CFG edges, $N$ = number of CFG nodes.

2. **Formula 2 (Predicate Nodes):**
$$V(G) = P + 1$$
where $P$ = number of binary decision/predicate nodes.

3. **Formula 3 (Enclosed Regions):**
$$V(G) = \\text{Number of Regions in Planar Graph}$$

### Worked Numerical Example
Given an if-else decision program:
* $N = 5$ nodes, $E = 6$ edges, $P = 1$ predicate node.
$$V(G) = 6 - 5 + 2 = 3$$
$$V(G) = 1 + 1 = 2$$
*(When branches merge into a common exit node, $E=5$, yielding $V(G) = 2$ independent paths).*`,
    },
    {
      unitId: unitIdMap[4],
      unitNumber: 4,
      title: "Black-Box Testing Techniques & System Testing",
      slug: "black-box-testing-and-system-testing",
      order: 4,
      summary: "Equivalence partitioning, boundary value analysis, decision tables, state transition testing, and 6 types of system testing.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 20,
      theoryMarkdown: `## Black-Box Testing
Tests software requirements and functional interfaces without examining internal code logic.

### 1. Equivalence Partitioning (EP)
Divides input domain into valid and invalid equivalence classes; one representative test case is selected from each partition.

### 2. Boundary Value Analysis (BVA)
Defects cluster at input extremes. For an age parameter $[18, 60]$, test: $17, 18, 19, 59, 60, 61$.

---

## Six Types of System Testing
1. **Recovery Testing:** Verifies automated failover and data recovery after crashes.
2. **Security Testing:** Audits unauthorized access prevention and encryption integrity.
3. **Stress Testing:** Pushes the application beyond maximum capacity to establish breaking points.
4. **Performance Testing:** Evaluates latency, throughput, and server resource consumption.
5. **Load Testing:** Validates steady-state performance under peak concurrent user loads.
6. **Deployment Testing:** Verifies clean installation and environmental configuration.`,
    },

    // UNIT 5 TOPICS
    {
      unitId: unitIdMap[5],
      unitNumber: 5,
      title: "Framework for Software Product Metrics",
      slug: "framework-for-product-metrics",
      order: 1,
      summary: "Requirements, design, source code (LOC, Halstead), testing (DRE), and maintenance metrics (MTTR, MTBF).",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 20,
      theoryMarkdown: `## Product Metrics Framework
Product metrics quantify attributes of the software deliverable itself (specifications, architecture, source code, and test cases) rather than the project process.

### 1. Requirements Metrics
* **Requirements Volatility (RV):**
$$RV = \\frac{\\text{Changed Requirements}}{\\text{Total Requirements}} \\times 100\\%$$

### 2. Source Code Metrics
* **Lines of Code (LOC)**
* **Halstead Software Science:**
  * Distinct operators: $n_1$, distinct operands: $n_2$
  * Program Vocabulary: $n = n_1 + n_2$
  * Total operators: $N_1$, total operands: $N_2$
  * Program Length: $N = N_1 + N_2$

### 3. Testing Metrics
* **Defect Removal Efficiency (DRE):**
$$DRE = \\frac{E}{E + D} \\times 100\\%$$
where $E$ = errors detected before release, $D$ = defects found by customers post-release.

### 4. Maintenance Metrics
* **Mean Time To Repair (MTTR):** Average time to correct a reported defect.
* **Mean Time Between Failures (MTBF):** Average elapsed operating time between failures.`,
    },
    {
      unitId: unitIdMap[5],
      unitNumber: 5,
      title: "Software Project Management & The SPMP Document",
      slug: "software-project-management-and-spmp",
      order: 2,
      summary: "SPM necessity, characteristics, and the 8 components of the Software Project Management Plan (SPMP).",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 15,
      theoryMarkdown: `## Software Project Management (SPM)
SPM is the discipline of planning, organizing, scheduling, tracking, and risk-managing software development activities to satisfy project deliverables within budget and timeframe constraints.

### Eight Components of a Software Project Management Plan (SPMP)
1. **Project Overview:** High-level executive summary, objectives, deliverables, and scope boundaries.
2. **Project Organization:** Team hierarchy, organizational roles, stakeholder contacts, and reporting lines.
3. **Project Schedule:** Work Breakdown Structure (WBS), milestone dates, and Gantt charts.
4. **Resource Allocation:** Required engineering staffing, hardware workstations, development toolchains.
5. **Effort & Cost Estimation:** Detailed staffing projections and financial budget allocations.
6. **Risk Management Plan:** Risk log, mitigation strategies, and disaster recovery policies.
7. **Quality Assurance Plan:** Coding standards, testing protocols, and review schedules.
8. **Project Tracking & Control:** Status reporting procedures, variance detection, and change control boards.`,
    },
    {
      unitId: unitIdMap[5],
      unitNumber: 5,
      title: "Effort Estimation & The COCOMO Model Case Study",
      slug: "effort-estimation-and-cocomo-models",
      order: 3,
      summary: "Basic, Intermediate, and Detailed COCOMO models, constants, cost drivers, EAF, and worked numericals.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 25,
      theoryMarkdown: `## Constructive Cost Model (COCOMO)
Developed by Barry Boehm in 1981. Estimates effort in Person-Months (PM) and schedule in calendar months ($T$).
$$1 \\text{ KLOC} = 1000 \\text{ Lines of Code}$$

---

## 1. Basic COCOMO
Equations:
$$\\text{Effort } E = a \\cdot (\\text{KLOC})^b$$
$$\\text{Development Time } T = 2.5 \\cdot (E)^d$$
$$\\text{Average Staff } = \\frac{E}{T}$$

### Basic COCOMO Coefficients Table
| Project Mode | Complexity & Team Nature | $a$ | $b$ | $d$ |
| :--- | :--- | :--- | :--- | :--- |
| **Organic** | Small, experienced team, familiar environment | **2.4** | **1.05** | **0.38** |
| **Semi-Detached** | Medium size, mixed experience, moderate constraints | **3.0** | **1.12** | **0.35** |
| **Embedded** | Strict hardware/operating constraints, high complexity | **3.6** | **1.20** | **0.32** |

### Worked Exam Problem: Basic COCOMO
**Problem:** A project is estimated at $32\\text{ KLOC}$ in **Organic mode**. Calculate Effort, Development Time, and Staffing.
* **Effort:**
$$E = 2.4 \\times (32)^{1.05} = 2.4 \\times 38.05 = 91.32\\text{ Person-Months}$$
* **Development Time:**
$$T = 2.5 \\times (91.32)^{0.38} = 2.5 \\times 5.56 = 13.90\\text{ Months}$$
* **Average Staff:**
$$\\text{Staff} = \\frac{91.32}{13.90} \\approx 6.57 \\implies 7\\text{ Engineers}$$

---

## 2. Intermediate COCOMO
Incorporates 15 Cost Drivers grouped into 4 categories (Product, Hardware, Personnel, Project) to compute the **Effort Adjustment Factor (EAF)**:
$$EAF = \\prod_{i=1}^{15} EM_i$$
$$E = a \\cdot (\\text{KLOC})^b \\times EAF$$
*(Organic intermediate constant $a = 3.2$)*`,
    },
    {
      unitId: unitIdMap[5],
      unitNumber: 5,
      title: "Risk Management & Project Tracking with EVM",
      slug: "risk-management-and-evm-tracking",
      order: 4,
      summary: "Six steps in Risk Management, 4 strategies, Gantt charts, and Earned Value Management (EVM) variance formulas.",
      examWeightage: "High - 6 Marks",
      estimatedMinutes: 20,
      theoryMarkdown: `## Risk Management
A risk is an uncertain future event that could negatively impact project schedule, cost, quality, or deliverables.

### Six Steps in the Risk Management Cycle
1. **Risk Identification:** Brainstorming potential vulnerabilities.
2. **Risk Analysis:** Assessing probability (likelihood) and impact (severity).
3. **Risk Prioritization:** Ranking risks using a risk exposure matrix ($RE = P \\times I$).
4. **Risk Planning:** Crafting contingency plans.
5. **Risk Monitoring:** Tracking risk triggers throughout the lifecycle.
6. **Risk Control:** Executing mitigation plans when risks materialize.

### Four Core Risk Strategies:
* **Avoidance:** Changing requirements to eliminate the threat entirely.
* **Reduction:** Proactive actions to lower likelihood or damage.
* **Transfer:** Shifting liability to a third party (e.g., insurance, vendor contracts).
* **Acceptance:** Acknowledging the risk and maintaining contingency reserves.

---

## Earned Value Management (EVM)
A quantitative project management technique measuring cost and schedule variances against baseline commitments.
* **PV (Planned Value):** Budgeted cost of work scheduled to be completed.
* **EV (Earned Value):** Budgeted cost of work actually completed.
* **AC (Actual Cost):** Actual money expended for work performed.

### Key EVM Formulas:
$$\\text{Schedule Variance (SV)} = EV - PV$$
*(Positive SV = Ahead of schedule; Negative SV = Behind schedule)*

$$\\text{Cost Variance (CV)} = EV - AC$$
*(Positive CV = Under budget; Negative CV = Over budget)*`,
    },
  ];

  await Topic.insertMany(topicsData);
  console.log(`Created ${topicsData.length} Syllabus Topics across all 5 units.`);

  // 4. Create 16 Curated Reference Diagrams (Unit 4 / General UML Reference)
  const diagramsData = [
    {
      diagramNumber: 1,
      fileName: "01_Library_Activity.png",
      title: "Library Management System — Activity Diagram",
      domain: "Library",
      diagramType: "Activity",
      unitNumber: 4,
      imageUrl: "/diagrams/01_Library_Activity.png",
      description: "Visualizes the complete operational workflow of borrowing a library book, including student login, catalog search, availability decision, borrowing eligibility verification, and account record updating.",
      keyElements: ["Student Login", "Search Book", "Availability Decision", "Borrowing Eligibility", "Issue Book", "Update Record", "End State"],
    },
    {
      diagramNumber: 2,
      fileName: "02_Library_StateChart.png",
      title: "Library Management System — State Chart Diagram",
      domain: "Library",
      diagramType: "StateChart",
      unitNumber: 4,
      imageUrl: "/diagrams/02_Library_StateChart.png",
      description: "Models the discrete states of a library book entity throughout its lifecycle: Available, Reserved, Borrowed, Returned, Overdue, and Lost/Damaged.",
      keyElements: ["Available State", "Reserved State", "Borrowed State", "Returned State", "Overdue State", "Lost State"],
    },
    {
      diagramNumber: 3,
      fileName: "03_Library_Component.png",
      title: "Library Management System — Component Diagram",
      domain: "Library",
      diagramType: "Component",
      unitNumber: 4,
      imageUrl: "/diagrams/03_Library_Component.png",
      description: "Illustrates the modular architecture of the library system, showing User Interface, Authentication Service, Book Catalog Service, Issue & Return Service, Fine Management, and Library Database.",
      keyElements: ["User Interface", "Library Management Service", "Authentication Service", "Catalog Service", "Fine Service", "Library DB"],
    },
    {
      diagramNumber: 4,
      fileName: "04_Library_Deployment.png",
      title: "Library Management System — Deployment Diagram",
      domain: "Library",
      diagramType: "Deployment",
      unitNumber: 4,
      imageUrl: "/diagrams/04_Library_Deployment.png",
      description: "Depicts the physical execution hardware nodes and communication protocols: Client Workstation (Browser), Web Server (Nginx), Application Server (Node/Java), and RDBMS Database Server.",
      keyElements: ["Client Browser Node", "Web Server Node", "Application Server Node", "Database Server Node", "HTTPS & TCP/IP Links"],
    },
    {
      diagramNumber: 5,
      fileName: "05_LMS_Activity.png",
      title: "Learning Management System — Activity Diagram",
      domain: "LMS",
      diagramType: "Activity",
      unitNumber: 4,
      imageUrl: "/diagrams/05_LMS_Activity.png",
      description: "Shows the student learning journey: student course enrollment, syllabus viewing, video lecture consumption, quiz attempt, score evaluation, and completion certificate generation.",
      keyElements: ["Enrollment", "Content Reading", "Quiz Attempt", "Score Checking", "Certificate Generation"],
    },
    {
      diagramNumber: 6,
      fileName: "06_LMS_StateChart.png",
      title: "Learning Management System — State Chart Diagram",
      domain: "LMS",
      diagramType: "StateChart",
      unitNumber: 4,
      imageUrl: "/diagrams/06_LMS_StateChart.png",
      description: "Captures the lifecycle states of an educational module or assignment: Draft, Published, Enrolled, In Progress, Submitted, Graded, and Archived.",
      keyElements: ["Draft", "Published", "Enrolled", "In Progress", "Submitted", "Graded"],
    },
    {
      diagramNumber: 7,
      fileName: "07_LMS_Component.png",
      title: "Learning Management System — Component Diagram",
      domain: "LMS",
      diagramType: "Component",
      unitNumber: 4,
      imageUrl: "/diagrams/07_LMS_Component.png",
      description: "Breaks down LMS software services: Student Portal, Instructor Studio, Video Streaming Service, Assessment Engine, Analytics Service, and Object Storage.",
      keyElements: ["Student UI", "Instructor UI", "Video Streaming", "Assessment Engine", "Cloud Storage"],
    },
    {
      diagramNumber: 8,
      fileName: "08_LMS_Deployment.png",
      title: "Learning Management System — Deployment Diagram",
      domain: "LMS",
      diagramType: "Deployment",
      unitNumber: 4,
      imageUrl: "/diagrams/08_LMS_Deployment.png",
      description: "Multi-region cloud deployment topology: Cloudflare Edge CDN, Next.js Frontend Cluster, Microservices Containers in Kubernetes, and Distributed Document Store.",
      keyElements: ["Edge CDN", "K8s App Cluster", "MongoDB Replica Set", "Object Storage CDN"],
    },
    {
      diagramNumber: 9,
      fileName: "09_University_Activity.png",
      title: "University Management System — Activity Diagram",
      domain: "University",
      diagramType: "Activity",
      unitNumber: 4,
      imageUrl: "/diagrams/09_University_Activity.png",
      description: "Models student university admission workflow: Application submission, credential verification, merit list generation, seat allocation, fee payment, and student ID generation.",
      keyElements: ["Application", "Document Verification", "Merit List", "Fee Payment", "ID Issuance"],
    },
    {
      diagramNumber: 10,
      fileName: "10_University_StateChart.png",
      title: "University Management System — State Chart Diagram",
      domain: "University",
      diagramType: "StateChart",
      unitNumber: 4,
      imageUrl: "/diagrams/10_University_StateChart.png",
      description: "Details student academic lifecycle: Applicant -> Admitted -> Enrolled -> In Good Standing -> Probationary -> Graduated / Withdrawn.",
      keyElements: ["Applicant", "Admitted", "Enrolled", "Active", "Probation", "Graduated"],
    },
    {
      diagramNumber: 11,
      fileName: "11_University_Component.png",
      title: "University Management System — Component Diagram",
      domain: "University",
      diagramType: "Component",
      unitNumber: 4,
      imageUrl: "/diagrams/11_University_Component.png",
      description: "University ERP structural components: Admissions Module, Examination Management, Student Information System (SIS), Faculty Portal, Finance & Accounts.",
      keyElements: ["Admissions Module", "Examination Engine", "SIS Service", "Finance Component", "Enterprise DB"],
    },
    {
      diagramNumber: 12,
      fileName: "12_University_Deployment.png",
      title: "University Management System — Deployment Diagram",
      domain: "University",
      diagramType: "Deployment",
      unitNumber: 4,
      imageUrl: "/diagrams/12_University_Deployment.png",
      description: "Campus high-availability deployment: Campus LAN boundary, Load Balancer, Active/Standby Web Application Servers, and High-Security Campus Database.",
      keyElements: ["Campus LAN", "Hardware Load Balancer", "Web Cluster", "Redundant DB Cluster"],
    },
    {
      diagramNumber: 13,
      fileName: "13_Banking_Activity.png",
      title: "Online Banking System — Activity Diagram",
      domain: "Banking",
      diagramType: "Activity",
      unitNumber: 4,
      imageUrl: "/diagrams/13_Banking_Activity.png",
      description: "Illustrates secure fund transfer workflow: Multi-factor authentication, beneficiary selection, funds balance check, OTP verification, ledger debit/credit, and transaction receipt dispatch.",
      keyElements: ["MFA Login", "Beneficiary Selection", "Balance Check", "OTP Validation", "Ledger Update", "SMS Receipt"],
    },
    {
      diagramNumber: 14,
      fileName: "14_Banking_StateChart.png",
      title: "Online Banking System — State Chart Diagram",
      domain: "Banking",
      diagramType: "StateChart",
      unitNumber: 4,
      imageUrl: "/diagrams/14_Banking_StateChart.png",
      description: "Captures electronic payment transaction states: Created -> Pending Verification -> Processing -> Cleared -> Settled / Failed / Reversed.",
      keyElements: ["Created", "Pending Verification", "Processing", "Settled", "Failed", "Reversed"],
    },
    {
      diagramNumber: 15,
      fileName: "15_Banking_Component.png",
      title: "Online Banking System — Component Diagram",
      domain: "Banking",
      diagramType: "Component",
      unitNumber: 4,
      imageUrl: "/diagrams/15_Banking_Component.png",
      description: "Core banking components: Online Banking UI, API Gateway, Authentication Service, Account Service, Fraud Detection Engine, Payment Gateway, and Transaction Ledger.",
      keyElements: ["Banking UI", "API Gateway", "Auth Service", "Account Service", "Fraud Detection", "Core Ledger"],
    },
    {
      diagramNumber: 16,
      fileName: "16_Banking_Deployment.png",
      title: "Online Banking System — Deployment Diagram",
      domain: "Banking",
      diagramType: "Deployment",
      unitNumber: 4,
      imageUrl: "/diagrams/16_Banking_Deployment.png",
      description: "High-security banking deployment architecture: Public DMZ, Hardware Security Module (HSM), Application Server tier, and PCI-DSS Compliant Database cluster.",
      keyElements: ["Public DMZ", "Web Application Firewall", "Hardware Security Module", "PCI-DSS Data Tier"],
    },
  ];

  await DiagramReference.insertMany(diagramsData);
  console.log("Seeded all 16 Reference Diagrams.");

  // 5. Seed Real 6-Mark Exam Q&A Bank (All 79 Authoritative Questions from Extracted Notes)
  const examQAData = EXAM_QUESTIONS.map((q) => ({
    unitId: unitIdMap[q.unitNumber],
    unitNumber: q.unitNumber,
    questionNumber: q.questionNumber,
    question: q.question,
    marks: q.marks,
    priority: q.priority,
    structuredAnswer: {
      definition: "",
      points: [],
      conclusion: "",
    },
    rawAnswerMarkdown: q.answerMarkdown,
    examTips: q.examTips,
  }));

  await QuestionAnswer.insertMany(examQAData);
  console.log(`Seeded ${examQAData.length} Authoritative 6-Mark Exam Q&As.`);

  // 6. Seed Unit Quizzes
  const quizzesData = [
    {
      unitNumber: 1,
      title: "Unit 1 Mastery Quiz: SDLC & Process Models",
      description: "Test your understanding of classical and evolutionary process models, SDLC phases, and umbrella activities.",
      timeLimitMinutes: 10,
      isPublished: true,
      questions: [
        {
          questionText: "Which process model is most appropriate when requirements are completely stable, well-understood, and unlikely to change?",
          options: ["Waterfall Model", "Agile Model", "Spiral Model", "Prototype Model"],
          correctOptionIndex: 0,
          explanation: "The Waterfall model is ideal for small, well-defined projects with stable requirements where sequential phases can be executed without frequent back-tracking.",
        },
        {
          questionText: "In the V-Model, which testing phase corresponds directly to the Requirements Analysis phase?",
          options: ["Unit Testing", "Integration Testing", "System Testing", "Acceptance Testing"],
          correctOptionIndex: 3,
          explanation: "Acceptance Testing validates that the software meets customer business requirements identified during the Requirements Analysis phase.",
        },
        {
          questionText: "What is the primary driving factor in the Spiral Model?",
          options: ["Speed of delivery", "Risk analysis and management", "Component reusability", "Formal documentation"],
          correctOptionIndex: 1,
          explanation: "The Spiral model was specifically designed by Barry Boehm as a risk-driven process that mitigates technical and managerial risks at each spiral cycle.",
        },
        {
          questionText: "Which of the following is classified as an Umbrella Activity in Software Engineering?",
          options: ["Coding", "System Design", "Software Configuration Management (SCM)", "User Acceptance Testing"],
          correctOptionIndex: 2,
          explanation: "SCM, Quality Assurance, and Risk Management are umbrella activities because they span across all development phases rather than belonging to a single phase.",
        },
      ],
    },
    {
      unitNumber: 2,
      title: "Unit 2 Mastery Quiz: Requirements & Design Modularity",
      description: "Validate your knowledge on IEEE 830 standards, DFDs, cohesion types, and coupling classifications.",
      timeLimitMinutes: 10,
      isPublished: true,
      questions: [
        {
          questionText: "Which type of cohesion is considered the most desirable and highest in software engineering?",
          options: ["Temporal Cohesion", "Communicational Cohesion", "Functional Cohesion", "Coincidental Cohesion"],
          correctOptionIndex: 2,
          explanation: "Functional cohesion occurs when all elements within a module contribute to executing a single, well-defined mathematical or domain function.",
        },
        {
          questionText: "Which type of coupling is considered the most undesirable (highest degree of interdependence)?",
          options: ["Data Coupling", "Stamp Coupling", "Control Coupling", "Content Coupling"],
          correctOptionIndex: 3,
          explanation: "Content coupling is the worst form because one module directly reads or modifies the internal code or private memory of another module.",
        },
        {
          questionText: "What does the DFD Balancing Rule mandate?",
          options: [
            "Every process must have exactly two inputs and two outputs",
            "Data flows entering and leaving a parent process must match those entering and leaving its child DFD",
            "Data stores cannot interact with processes",
            "External entities must be balanced with equal numbers of data stores",
          ],
          correctOptionIndex: 1,
          explanation: "Balancing guarantees that inputs and outputs at higher DFD levels are preserved without omission in lower-level decomposed DFDs.",
        },
      ],
    },
    {
      unitNumber: 3,
      title: "Unit 3 Mastery Quiz: Architecture & UML Modeling",
      description: "Assess your mastery of the 4+1 View Model, C&C styles, Class diagram notations, and Interaction diagrams.",
      timeLimitMinutes: 10,
      isPublished: true,
      questions: [
        {
          questionText: "In UML Class Diagrams, what notation represents Composition (strong whole-part relationship)?",
          options: ["A dashed arrow", "A solid line with a hollow diamond", "A solid line with a filled diamond", "A hollow triangle"],
          correctOptionIndex: 2,
          explanation: "A filled diamond represents Composition, where the lifecycle of the part is strictly bound to the lifetime of the whole.",
        },
        {
          questionText: "Which architectural style is best illustrated by a compiler processing lexical analysis, parsing, and code generation in sequence?",
          options: ["Client-Server Style", "Shared Data / Repository Style", "Pipe-and-Filter Style", "Event-Driven Style"],
          correctOptionIndex: 2,
          explanation: "Pipe-and-Filter transforms discrete streams of data through successive independent filter components connected by pipes.",
        },
        {
          questionText: "In Use Case diagrams, what does the <<include>> stereotype signify?",
          options: [
            "The included use case is executed conditionally",
            "The base use case always and unconditionally incorporates the included behavior",
            "The included use case is an optional plugin",
            "The included use case represents an external actor",
          ],
          correctOptionIndex: 1,
          explanation: "The <<include>> relationship represents mandatory inclusion of common functionality required by the base use case.",
        },
      ],
    },
    {
      unitNumber: 4,
      title: "Unit 4 Mastery Quiz: Advanced UML & Testing Strategies",
      description: "Test your skills on White-Box Basis Path testing, Cyclomatic Complexity calculations, and Black-Box techniques.",
      timeLimitMinutes: 10,
      isPublished: true,
      questions: [
        {
          questionText: "If a Control Flow Graph has 9 edges (E) and 7 nodes (N), what is its Cyclomatic Complexity V(G)?",
          options: ["2", "4", "5", "3"],
          correctOptionIndex: 1,
          explanation: "Using Formula 1: V(G) = E - N + 2 = 9 - 7 + 2 = 4 independent paths.",
        },
        {
          questionText: "Which Black-Box testing technique specifically tests values at the minimum, maximum, and immediate boundary limits?",
          options: ["Equivalence Partitioning", "Boundary Value Analysis (BVA)", "Basis Path Testing", "Statement Coverage"],
          correctOptionIndex: 1,
          explanation: "BVA focuses on input extremes where boundary faults are statistically most prevalent.",
        },
        {
          questionText: "What is the key difference between Verification and Validation?",
          options: [
            "Verification checks if we built the product right; Validation checks if we built the right product",
            "Verification is done by clients; Validation is done by developers",
            "Verification is dynamic testing; Validation is static code inspection",
            "There is no difference in software engineering",
          ],
          correctOptionIndex: 0,
          explanation: "Verification ensures compliance with technical specifications; Validation ensures the final product fulfills actual customer requirements.",
        },
      ],
    },
    {
      unitNumber: 5,
      title: "Unit 5 Mastery Quiz: Product Metrics & COCOMO",
      description: "Evaluate your readiness on COCOMO effort estimations, Defect Removal Efficiency (DRE), and EVM schedule variances.",
      timeLimitMinutes: 10,
      isPublished: true,
      questions: [
        {
          questionText: "In Basic COCOMO, which project mode represents small teams developing familiar software in a relaxed environment?",
          options: ["Semi-Detached Mode", "Embedded Mode", "Organic Mode", "Detailed Mode"],
          correctOptionIndex: 2,
          explanation: "Organic mode applies to experienced teams with well-understood requirements, using coefficients a = 2.4 and b = 1.05.",
        },
        {
          questionText: "In Earned Value Management (EVM), what does a positive Schedule Variance (SV = EV - PV > 0) indicate?",
          options: ["The project is over budget", "The project is behind schedule", "The project is ahead of schedule", "The project has incurred zero costs"],
          correctOptionIndex: 2,
          explanation: "When Earned Value (EV) exceeds Planned Value (PV), more work has been accomplished than planned, meaning the project is ahead of schedule.",
        },
        {
          questionText: "If 40 defects were detected during development (E) and 10 defects were uncovered by users post-deployment (D), what is the Defect Removal Efficiency (DRE)?",
          options: ["80%", "75%", "90%", "25%"],
          correctOptionIndex: 0,
          explanation: "DRE = (E / (E + D)) * 100 = (40 / (40 + 10)) * 100 = (40 / 50) * 100 = 80%.",
        },
      ],
    },
  ];

  await Quiz.insertMany(quizzesData);
  console.log("Seeded 5 Unit Quizzes with comprehensive questions.");

  // 7. Seed Previous Examination Question Papers
  const papersData = [
    {
      year: 2023,
      month: "November / December",
      semester: "III Year B.Tech I Semester",
      regulation: "R20",
      examType: "Regular Examination",
      title: "Software Engineering End-Semester Exam Paper — Nov 2023",
      fileUrl: "/docs/unit-wise-imp/Software_Engineering_Unit_1_6_Mark_Answers.pdf",
      fileSizeBytes: 62397,
    },
    {
      year: 2022,
      month: "November / December",
      semester: "III Year B.Tech I Semester",
      regulation: "R20",
      examType: "Regular Examination",
      title: "Software Engineering End-Semester Exam Paper — Nov 2022",
      fileUrl: "/docs/unit-wise-imp/Software_Engineering_Unit_2_Complete_Notes.pdf",
      fileSizeBytes: 60522,
    },
    {
      year: 2021,
      month: "December",
      semester: "III Year B.Tech I Semester",
      regulation: "R20",
      examType: "Regular Examination",
      title: "Software Engineering End-Semester Exam Paper — Dec 2021",
      fileUrl: "/docs/unit-wise-imp/Software_Engineering_Unit_3_Complete_Notes.pdf",
      fileSizeBytes: 79620,
    },
  ];

  await PreviousQuestionPaper.insertMany(papersData);
  console.log("Seeded Previous Year Examination Papers.");

  // 8. Seed Announcements
  const announcementsData = [
    {
      title: "Mid-Term Software Engineering Examination Schedule Announced",
      content:
        "The first mid-term examination covering Unit I (Process Models) and Unit II (SRS & DFD) is scheduled for next Monday. Please review the 6-mark structured answers and practice DFD balancing.",
      priority: "exam",
      authorName: "Prof. Ananya Roy (SE Faculty)",
      isPublished: true,
    },
    {
      title: "New UML Drawing Studio Now Live for All Students",
      content:
        "The interactive diagramming studio powered by diagrams.net is now active. You can open any of the 16 reference architecture diagrams as editable templates or start custom designs.",
      priority: "normal",
      authorName: "Dr. Suresh Sharma (HOD / Admin)",
      isPublished: true,
    },
  ];

  await Announcement.insertMany(announcementsData);
  console.log("Seeded Campus Announcements.");

  console.log("\n=======================================================");
  console.log("MASTER SEEDING COMPLETED SUCCESSFULLY!");
  console.log("=======================================================\n");
  await mongoose.disconnect();
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seeding failed with error:", err);
      process.exit(1);
    });
}

