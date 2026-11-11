export interface UnitData {
  unitNumber: number;
  title: string;
  periods: number;
  slug: string;
  description: string;
  learningOutcomes: string[];
}

export interface TopicData {
  id: string;
  unitNumber: number;
  title: string;
  slug: string;
  order: number;
  summary: string;
  examWeightage: string;
  estimatedMinutes: number;
  theoryMarkdown: string;
}

export interface QuestionAnswerData {
  id: string;
  unitNumber: number;
  questionNumber: number;
  question: string;
  marks: number;
  priority: "high" | "medium" | "low";
  examTips: string;
  answerMarkdown: string;
}

export interface QuizQuestionData {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizData {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  timeLimitMinutes: number;
  questions: QuizQuestionData[];
}

export const UNITS_DATA: UnitData[] = [
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
  },
];

export const TOPICS_DATA: TopicData[] = [
  // UNIT 1
  {
    id: "u1-t1",
    unitNumber: 1,
    title: "Importance of Software Engineering & Core Activities",
    slug: "importance-of-software-engineering",
    order: 1,
    summary: "Definition of SE, complexity management, quality assurance, problem solving, modeling, and knowledge acquisition activities.",
    examWeightage: "High - 6 Marks",
    estimatedMinutes: 20,
    theoryMarkdown: `## 1. Importance of Software Engineering

### Definition
**Software Engineering** is a systematic approach to designing, developing, testing, deploying, and maintaining software. It applies engineering principles to software development to produce reliable, efficient, and high-quality software.

### Seven Key Reasons Why Software Engineering is Critical
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
**Definition:** Problem-solving is the activity of understanding a real-world problem and developing a software solution to solve it. Software engineers identify the problem, analyze requirements, design a solution, implement it, and test the result.

### Steps Involved
1. **Problem Identification:** Understand the problem that needs to be solved. *(Example: A college wants to automate student attendance).*
2. **Requirement Analysis:** Identify what the software must do. *(Example: The system must record attendance, calculate percentages, and generate reports).*
3. **Solution Design:** Plan the structure, algorithms, database, and interfaces required to solve the problem.
4. **Implementation:** Convert the design into a working program using a programming language.
5. **Testing:** Check whether the software produces the expected results and identify errors.
6. **Evaluation:** Verify whether the developed software solves the original problem correctly.

---

## 3. Modelling Activity
**Definition:** Modelling is the process of representing a software system using diagrams, structures, or simplified descriptions before actual implementation. A model helps developers understand how the system should work.

### Four Types of Modelling
* **Requirement Modelling:** Represents what the user expects from the system *(e.g., Use-case diagrams showing student and faculty interactions)*.
* **Structural Modelling:** Represents the components of a system and their relationships *(e.g., Class diagrams showing Student, Teacher, Course)*.
* **Behavioural Modelling:** Represents how the system behaves when events occur *(e.g., State machine of an order being placed, processed, and delivered)*.
* **Data Modelling:** Represents how information is organized and related *(e.g., ER diagram containing Student, Course, and Attendance tables)*.

---

## 4. Knowledge Acquisition & Rationale-Driven Activities
* **Knowledge Acquisition:** Process of collecting, understanding, organizing, and recording information needed to develop software. Sources include customers, domain experts, existing systems, documents, and business rules.
* **Rationale-Driven Activity:** Developers record the *reasons* behind important technical decisions made during development (e.g., choosing MongoDB over MySQL based on schema flexibility). This *design rationale* prevents repeating previously rejected approaches and aids future maintainability.`,
  },
  {
    id: "u1-t2",
    unitNumber: 1,
    title: "Umbrella Activities & Software Engineering Challenges",
    slug: "umbrella-activities-and-challenges",
    order: 2,
    summary: "Eight critical umbrella activities and primary challenges faced by modern software development teams.",
    examWeightage: "High - 6 Marks",
    estimatedMinutes: 15,
    theoryMarkdown: `## Umbrella Activities in Software Engineering

### Definition
Umbrella activities are activities performed throughout the software development process to support and improve the quality of the software project. Unlike activities performed only during a particular phase, umbrella activities continue across multiple phases of development.

### Eight Major Umbrella Activities
1. **Software Project Tracking and Control:** Monitors project progress and compares actual progress with the planned schedule.
2. **Risk Management:** Identifies possible problems and prepares contingency plans to reduce their impact *(e.g., planning an alternative if a critical cloud API fails)*.
3. **Software Quality Assurance (SQA):** Ensures that software processes and products adhere to defined quality standards.
4. **Technical Reviews:** Reviews requirements, designs, and code to identify defects before they become expensive to fix.
5. **Software Configuration Management (SCM):** Manages changes to source code, documents, and other project components *(e.g., using Git to track code versions)*.
6. **Measurement:** Collects metrics such as defect counts, development effort, and velocity.
7. **Software Documentation:** Creates and maintains documents describing requirements, architecture, testing, and operation.
8. **Reusability Management:** Identifies and manages software components that can be reused in other projects.

> **Exam Tip:** Umbrella activities are an easy topic to score full marks on if you list and explain at least six activities with examples.

---

## Software Engineering Challenges
1. **Complexity:** Large systems contain many modules and interactions, making them difficult to understand and manage.
2. **Changing Requirements:** Customer needs evolve during development, affecting design, budget, and deadlines.
3. **Time and Cost Constraints:** Delivering high-quality systems within fixed budgets and tight semester or market windows.
4. **Software Quality & Security:** Protecting sensitive information from unauthorized access, cyber attacks, and data leaks.
5. **Maintenance:** Managing bug fixes, updates, and compatibility with new operating environments after deployment.
6. **Scalability:** Handling surges in users, transactions, and data without degradation.
7. **Team Communication:** Preventing misunderstandings among developers, testers, managers, and clients.`,
  },
  {
    id: "u1-t3",
    unitNumber: 1,
    title: "Software Development Life Cycle (SDLC) & Classical Models",
    slug: "sdlc-and-process-models",
    order: 3,
    summary: "Seven phases of SDLC, Waterfall Model, Incremental Model, Prototype Model, and the V-Model.",
    examWeightage: "High - 6 Marks",
    estimatedMinutes: 25,
    theoryMarkdown: `## Software Development Life Cycle (SDLC)

The SDLC is a structured process used to develop software through a sequence of phases, from identifying requirements to maintaining the finished product.

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

### Seven Phases of SDLC
1. **Planning and Feasibility Study:** Evaluates technical, economic, and operational feasibility.
2. **Requirement Analysis:** Gathers customer requirements and documents them in the Software Requirements Specification (SRS).
3. **System Design:** Architects software structure, database schemas, interfaces, and component boundaries.
4. **Implementation:** Translates designs into executable source code using programming languages.
5. **Testing:** Verifies software against requirements (Unit, Integration, System, Acceptance testing).
6. **Deployment:** Installs and releases the software into production environments.
7. **Maintenance:** Corrects post-release defects, optimizes performance, and adapts to environmental changes.

---

## Classical Process Models

### 1. Waterfall Model
* **Principle:** Linear-sequential flow. Each phase must be completed before the next phase begins.
* **Phases:** Requirements -> Design -> Coding -> Testing -> Deployment -> Maintenance.
* **Pros:** Simple and easy to understand; clear milestones; well-documented.
* **Cons:** Inflexible to changing requirements; working software delivered late; late-stage testing leads to costly defect fixes.
* **Ideal For:** Small projects with stable, crystal-clear requirements.

### 2. Incremental Model
* **Principle:** Develops software in multiple smaller parts called increments. Each increment adds functional features to working software.
* **Pros:** Working software delivered early; customer feedback guides subsequent increments; testing is simplified.
* **Cons:** Demands robust overall architecture; integration between increments requires disciplined engineering.

### 3. Prototype Model
* **Principle:** Develops an early, simplified version of the software to clarify and validate customer requirements before building the final system.
* **Phases:** Requirements Gathering -> Quick Design -> Build Prototype -> Customer Evaluation -> Refine Prototype -> Final Design & Implementation.
* **Ideal For:** Applications where customer requirements or UI workflows are ambiguous.

### 4. V-Model (Verification and Validation Model)
* **Principle:** Connects every development phase on the left with a corresponding testing phase on the right.
* **Phases:**
  * Requirements Analysis <---> Acceptance Testing
  * System Design <---> System Testing
  * Architecture Design <---> Integration Testing
  * Module Design <---> Unit Testing`,
  },
  {
    id: "u1-t4",
    unitNumber: 1,
    title: "Evolutionary & Agile Models: Spiral, RAD, and Agile",
    slug: "spiral-rad-agile-models",
    order: 4,
    summary: "Spiral risk-driven model, Rapid Application Development (RAD), and Agile iteration.",
    examWeightage: "High - 6 Marks",
    estimatedMinutes: 20,
    theoryMarkdown: `## 1. Spiral Model (Risk-Driven Model)
Introduced by Barry Boehm. Combines iterative development with systematic risk analysis. The software is developed through repeated cycles called spirals.

### Four Quadrants in Each Spiral:
1. **Planning:** Identifies objectives, alternative solutions, and constraints for the current cycle.
2. **Risk Analysis:** Evaluates technical and management risks; creates prototypes to mitigate dangers.
3. **Engineering:** Designs, develops, and tests the current increment.
4. **Customer Evaluation:** Reviews progress and plans the next spiral.

* **Pros:** Strong emphasis on risk management; accommodates evolving requirements; suited for large, high-risk systems.
* **Cons:** Expensive; demands specialized risk-analysis expertise.

---

## 2. Rapid Application Development (RAD)
Emphasizes rapid prototyping and component reuse over prolonged planning.
* **Phases:** Requirements Planning -> User Design -> Construction -> Cutover.
* **Characteristics:** Short development lifecycles (60–90 days); requires skilled teams and modular architecture.

---

## 3. Agile Model
An iterative and incremental approach that delivers working software in small releases (sprints) and adapts to changing requirements through continuous customer collaboration.

### Core Comparison Summary
| Feature | Waterfall | Incremental | Prototype | Spiral | Agile |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Requirements** | Fixed upfront | Prioritized in stages | Unclear initially | High-risk & evolving | Highly dynamic |
| **Delivery** | Single final release | Staged increments | Working prototype first | Repeated spiral releases | Small, frequent sprints |
| **Risk Focus** | Low risk tolerance | Moderate | Focus on user needs | Central risk analysis | Continuous feedback |
| **Customer Role**| Beginning and end | Reviews each release | Direct evaluator | Reviews each spiral | Continuous collaborator |`,
  },

  // UNIT 2
  {
    id: "u2-t1",
    unitNumber: 2,
    title: "Requirements Engineering, Characteristics & IEEE 830 SRS",
    slug: "requirements-engineering-and-ieee-srs",
    order: 1,
    summary: "Need for SRS, functional vs non-functional requirements, characteristics of good requirements, and IEEE 830 structure.",
    examWeightage: "High - 6 Marks",
    estimatedMinutes: 20,
    theoryMarkdown: `## Software Requirements Specification (SRS)

### Why Do We Need an SRS?
An SRS acts as the legal and technical contract between stakeholders and engineering teams.
1. **Clear Understanding:** Explicitly documents expected behavior and features.
2. **Stakeholder Alignment:** Serves as a single source of truth for clients, developers, and QA engineers.
3. **Design Blueprint:** Architects use the SRS to plan module hierarchy, database schemas, and interfaces.
4. **Testing Baseline:** Testers derive functional and non-functional test cases directly from SRS clauses.
5. **Cost and Schedule Estimation:** Enables accurate estimation of engineering effort and timeline.

---

## Characteristics of Good Requirements
1. **Correct:** Represents a genuine, verified user need.
2. **Complete:** Leaves no essential condition, input, or output unspecified.
3. **Unambiguous:** Has exactly one possible interpretation.
4. **Consistent:** Contains no contradictory statements across sections.
5. **Verifiable (Testable):** Quantifiable criteria allow testers to verify fulfillment *(e.g., "Response time < 2s under 1000 concurrent users")*.
6. **Feasible:** Achievable within budget, technology, and schedule boundaries.
7. **Traceable:** Identified by a unique identifier (e.g., \`REQ-012\`) traced to design and tests.
8. **Modifiable:** Organized hierarchically so edits do not introduce inconsistencies.

---

## Functional vs. Non-Functional Requirements
* **Functional Requirements:** Define *what* the system does (features, inputs, calculations, database transactions, auth).
* **Non-Functional Requirements:** Define *how well* the system performs (latency, concurrency, security, 99.9% uptime, usability, portability).

---

## IEEE 830 Standard Format for SRS
1. **Introduction:** Purpose, Scope, Definitions, Acronyms, References, Overview.
2. **Overall Description:** Product Perspective, Product Functions, User Characteristics, Constraints, Assumptions.
3. **Specific Requirements:** External Interfaces, Functional Requirements, Performance Requirements, Design Constraints, Quality Attributes.
4. **Appendices:** Supporting tables, diagrams, technical references.
5. **Index:** Keyword cross-references.`,
  },
  {
    id: "u2-t2",
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
1. **External Entity (Rectangle):** A source or sink of data outside the system boundary *(e.g., Student, Bank Server)*.
2. **Process (Circle / Rounded Rectangle):** Transforms input data into output data *(e.g., 1.0 Search Book)*.
3. **Data Flow (Directed Arrow):** Illustrates the movement and direction of data packets.
4. **Data Store (Parallel Open Lines):** Represents a repository of stored data at rest *(e.g., Book Catalog)*.

### Levels of DFD
* **Level 0 (Context Diagram):** Depicts the entire application as a single process bubble interacting with external entities.
* **Level 1 DFD:** Decomposes the single system bubble into major sub-processes (e.g., Search Book, Issue Book, Return Book).
* **Level 2 DFD:** Drills down into individual Level-1 processes to show granular calculations and sub-stores.

### DFD Balancing Rule
A fundamental rule: Every data flow entering or exiting a process in a higher-level DFD must appear entering or exiting the decomposed child DFD. If 2 inputs and 1 output enter Process 1.0, the Level 2 DFD for 1.0 must have those same 2 inputs and 1 output.`,
  },
  {
    id: "u2-t3",
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
3. **Temporal Cohesion:** Tasks grouped because they occur at the same time (e.g., system boot-up).
4. **Procedural Cohesion:** Tasks executed in a specific sequence, though operating on different data.
5. **Communicational Cohesion:** Tasks operate on the same common dataset or database record.
6. **Sequential Cohesion:** The output of one task directly feeds as the input to the next task.
7. **Functional Cohesion (Best):** Every single instruction contributes to executing one single, well-defined mathematical or domain operation.

---

## Types of Coupling (Worst to Best)
1. **Content Coupling (Worst):** One module directly modifies the private memory or code of another.
2. **Common Coupling:** Multiple modules read and write to global shared variables.
3. **External Coupling:** Modules depend on external hardware, third-party formats, or protocols.
4. **Control Coupling:** One module passes control flags to dictate the execution path of another.
5. **Stamp Coupling:** Modules pass complete data structures when only a single property was needed.
6. **Data Coupling (Best):** Modules communicate strictly by passing only primitive arguments through clean, defined interfaces.`,
  },

  // UNIT 3
  {
    id: "u3-t1",
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
    id: "u3-t2",
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
    id: "u3-t3",
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
    id: "u3-t4",
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

  // UNIT 4
  {
    id: "u4-t1",
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
    id: "u4-t2",
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
    id: "u4-t3",
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
    id: "u4-t4",
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

  // UNIT 5
  {
    id: "u5-t1",
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
    id: "u5-t2",
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
    id: "u5-t3",
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
$$\\text{Effort } E = a \\cdot (\\text{KLOC})^b \\quad [\\text{Person-Months}]$$
$$\\text{Development Time } T = 2.5 \\cdot (E)^d \\quad [\\text{Months}]$$
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
    id: "u5-t4",
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

