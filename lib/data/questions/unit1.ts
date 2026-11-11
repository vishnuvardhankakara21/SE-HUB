import { ExamQuestion } from "../questions";

export const UNIT_1_QUESTIONS: ExamQuestion[] = [
  {
    "id": "q-u1-1",
    "unitNumber": 1,
    "questionNumber": 1,
    "question": "What is Software Engineering? Explain its importance in modern software development.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition (1 Mark) + 6 Key Explained Points (4 Marks) + Conclusion (1 Mark)",
    "examTips": "Write the IEEE definition followed by at least 6 bullet points with bold headings (Handles Complexity, Quality, Cost, Time, Teamwork, Maintainability).",
    "answerMarkdown": "### 1. Definition\nSoftware Engineering is a systematic approach to designing, developing, testing, deploying, and maintaining\nsoftware. It applies engineering principles to software development to produce reliable, efficient, and high-quality\nsoftware.\n### Importance of Software Engineering\n1. **Handles Complexity:** Software projects can contain thousands of lines of code and many interconnected\ncomponents. Software engineering helps organize and manage this complexity.\n2. **Improves Software Quality:** It follows standards, testing procedures, and design principles to develop reliable\nand error-free software.\n3. **Reduces Development Cost:** Proper planning and early error detection help reduce the cost of fixing mistakes\nlater.\n4. **Saves Time:** A systematic development process helps teams complete projects within the planned schedule.\n5. **Supports Teamwork:** Software engineering defines responsibilities, documentation, and communication\nmethods so that multiple developers can work together.\n6. **Improves Maintainability:** Well-designed software is easier to modify, update, and repair.\n7. **Increases Customer Satisfaction:** Requirement analysis helps developers understand customer needs and\ndeliver software that meets expectations.\n### Conclusion\nSoftware engineering is important because it helps develop high-quality, reliable, maintainable, and\ncost-effective software within the required time."
  },
  {
    "id": "q-u1-2",
    "unitNumber": 1,
    "questionNumber": 2,
    "question": "Explain the Problem-Solving Activity in Software Engineering with its steps and a real-world example.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition (1 Mark) + 6 Steps Explained (3 Marks) + Example (1 Mark) + Conclusion (1 Mark)",
    "examTips": "List the 6 sequential steps: Problem Identification, Requirement Analysis, Solution Design, Implementation, Testing, Evaluation, followed by the Attendance System example.",
    "answerMarkdown": "### 1. Definition\nProblem-solving is the activity of understanding a real-world problem and developing a software solution to solve it.\nSoftware engineers identify the problem, analyze requirements, design a solution, implement it, and test the result.\n### 2. Steps Involved\n1. **Problem Identification:** Understand the problem that needs to be solved. Example: A college wants to automate\nstudent attendance.\n2. **Requirement Analysis:** Identify what the software must do. Example: The system must record attendance,\ncalculate percentages, and generate reports.\n3. **Solution Design:** Plan the structure, algorithms, database, and interfaces required to solve the problem.\n4. **Implementation:** Convert the design into a working program using a programming language.\n5. **Testing:** Check whether the software produces the expected results and identify errors.\n6. **Evaluation:** Verify whether the developed software solves the original problem correctly.\n\n### Example\nFor a college attendance system: identify the attendance problem; collect student and faculty requirements; design\nthe database and user interface; develop the application; test attendance calculations; and deliver the working\nsystem.\n### Conclusion\nProblem-solving is a fundamental software engineering activity because it transforms a real-world\nproblem into a practical software solution."
  },
  {
    "id": "q-u1-3",
    "unitNumber": 1,
    "questionNumber": 3,
    "question": "What is the Modelling Activity in Software Engineering? Explain the types of models and their importance.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition (1 Mark) + 4 Types of Modelling with Examples (3 Marks) + Importance & Conclusion (2 Marks)",
    "examTips": "Detail Requirement Modelling (Use Cases), Structural Modelling (Class diagrams), Behavioural Modelling (State transitions), and Data Modelling (ER diagrams).",
    "answerMarkdown": "### 1. Definition\nModelling is the process of representing a software system using diagrams, structures, or simplified descriptions\nbefore actual implementation. A model helps developers understand how the system should work.\n### 2. Types of Modelling\n1. **Requirement Modelling:** Represents what the user expects from the system. Example: Use-case diagrams\nshowing the activities of students and faculty.\n2. **Structural Modelling:** Represents the components of a system and their relationships. Example: Class diagrams\nshowing classes such as Student, Teacher, and Course.\n3. **Behavioural Modelling:** Represents how the system behaves when different events occur. Example: A student\nlogs in, views attendance, and logs out.\n4. **Data Modelling:** Represents how information is organized and related. Example: A database model containing\nStudent, Course, and Attendance tables.\n### 3. Importance of Modelling\n• Makes complex systems easier to understand.\n• Helps identify design problems early.\n• Improves communication between developers and customers.\n• Provides a blueprint for implementation.\n• Reduces development errors and rework.\n### Example\nBefore developing an online shopping application, engineers create models for customers, products, shopping carts,\npayments, and orders. These models help developers understand the system before writing code.\n### Conclusion\nModelling provides a clear representation of the software system and helps developers design a correct\nsolution before implementation."
  },
  {
    "id": "q-u1-4",
    "unitNumber": 1,
    "questionNumber": 4,
    "question": "Explain the Knowledge Acquisition Activity in Software Engineering. What are its steps and importance?",
    "marks": 6,
    "priority": "medium",
    "markingScheme": "Definition (1 Mark) + 6 Sequential Steps (3 Marks) + Example & Importance (2 Marks)",
    "examTips": "Highlight that requirements come from stakeholders, domain experts, and existing systems. Use a Hospital Management System example.",
    "answerMarkdown": "### 1. Definition\nKnowledge acquisition is the process of collecting, understanding, organizing, and recording the information needed\nto develop software. This knowledge can come from customers, domain experts, existing systems, documents, and\nbusiness rules.\n### 2. Steps Involved\n1. **Identify Knowledge Sources:** Determine who or what can provide the required information. Example: Teachers,\nstudents, and college administrators.\n2. **Collect Information:** Gather information through interviews, questionnaires, observation, and document analysis.\n3. **Analyze the Information:** Understand the collected information and identify important requirements and rules.\n\n4. **Organize the Knowledge:** Arrange the information into requirements, business rules, data structures, and\nsystem behaviour.\n5. **Document the Knowledge:** Record the information in requirement specifications and other project documents.\n6. **Validate the Knowledge:** Confirm with users and experts that the collected information is correct and complete.\n### Example\nWhile developing a hospital management system, software engineers collect information about patient registration,\ndoctor appointments, medical records, billing, and pharmacy operations. This knowledge is used to develop the\ncorrect system.\n### Importance\n• Helps developers understand the application domain.\n• Reduces misunderstandings about requirements.\n• Prevents missing important features.\n• Improves software correctness.\n• Supports better design decisions.\n### Conclusion\nKnowledge acquisition helps software engineers understand user needs and domain rules, enabling\nthem to develop software that solves the correct problem."
  },
  {
    "id": "q-u1-5",
    "unitNumber": 1,
    "questionNumber": 5,
    "question": "What is a Rationale-Driven Activity in Software Engineering? Explain its elements, importance, and give an example.",
    "marks": 6,
    "priority": "medium",
    "markingScheme": "Definition (1 Mark) + 6 Main Elements (3 Marks) + Architecture Example (1 Mark) + Importance (1 Mark)",
    "examTips": "Explain that rationale records WHY a technical decision was made (e.g. choosing PostgreSQL over MongoDB for ACID compliance), not just what was decided.",
    "answerMarkdown": "### 1. Definition\nA rationale-driven activity is a software engineering activity in which developers record the reasons behind important\ndecisions made during software development. It explains why a particular decision was made, not just what decision\nwas made.\n### 2. Main Elements\n1. **Decision Identification:** Identify a problem or situation that requires a decision.\n2. **Identify Alternatives:** Consider different possible solutions.\n3. **Evaluate Alternatives:** Compare solutions based on cost, performance, security, complexity, and other factors.\n4. **Select a Solution:** Choose the most appropriate alternative.\n5. **Record the Reason:** Document why the selected solution is better than the alternatives.\n6. **Review the Decision:** Reconsider the decision when requirements or circumstances change.\n### Example\nSuppose a developer must choose a database for an online shopping application. Possible alternatives are MySQL,\nMongoDB, and PostgreSQL. The developer compares them based on data structure, scalability, performance, and\nproject requirements. The developer selects a database and documents the reasons for the choice. This\ndocumented reasoning is called the design rationale.\n### Importance\n• Makes design decisions easier to understand.\n• Helps future developers maintain the software.\n• Avoids repeating previously rejected solutions.\n• Supports teamwork and technical discussions.\n• Helps evaluate decisions when requirements change.\n### Conclusion\nRationale-driven activity improves the transparency and maintainability of software projects by recording\nthe reasoning behind important technical decisions."
  },
  {
    "id": "q-u1-6",
    "unitNumber": 1,
    "questionNumber": 6,
    "question": "What are Umbrella Activities in Software Engineering? Explain any six important umbrella activities.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition (1 Mark) + 6 Umbrella Activities Explained (4 Marks) + Conclusion (1 Mark)",
    "examTips": "State that umbrella activities span the entire lifecycle. Explain Project Tracking, SQA, Risk Management, SCM, Technical Reviews, and Documentation.",
    "answerMarkdown": "### 1. Definition\nUmbrella activities are activities performed throughout the software development process to support and improve\nthe quality of the software project. Unlike activities performed only during a particular phase, umbrella activities\ncontinue across multiple phases of development.\n### 2. Important Umbrella Activities\n1. **Project Tracking and Control:** Monitors project progress and compares actual progress with the planned\nschedule.\n2. **Risk Management:** Identifies possible problems and prepares plans to reduce their impact. Example: Planning\nan alternative if a critical technology fails.\n3. **Software Quality Assurance (SQA):** Ensures that software processes and products follow defined quality\nstandards.\n4. **Technical Reviews:** Reviews requirements, designs, and code to identify defects before they become expensive\nto fix.\n5. **Software Configuration Management (SCM):** Manages changes to source code, documents, and other project\ncomponents. Example: Using Git to track code changes.\n6. **Measurement:** Collects metrics such as defect counts, development effort, and project progress.\n7. **Software Documentation:** Creates and maintains documents describing requirements, design, testing, and\nusage.\n8. **Reusability Management:** Identifies and manages software components that can be reused in other projects.\n### Importance\n• Improves software quality.\n• Helps control project cost and schedule.\n• Reduces project risks.\n• Supports change management.\n• Improves coordination among team members.\n### Conclusion\nUmbrella activities support all major software engineering activities and help ensure that software is\ndeveloped systematically and with high quality.\nExam tip: Umbrella activities are especially easy to score marks on if you explain at least six activities with one or two\nlines each."
  },
  {
    "id": "q-u1-7",
    "unitNumber": 1,
    "questionNumber": 7,
    "question": "Discuss the major challenges faced in modern Software Engineering with practical examples.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition (1 Mark) + 6-8 Explained Challenges (4 Marks) + Example & Resolution (1 Mark)",
    "examTips": "Highlight Complexity, Changing Requirements, Time & Cost Constraints, Quality, Security, Maintenance, and Team Communication.",
    "answerMarkdown": "### 1. Definition\nSoftware engineering challenges are difficulties faced by developers while designing, developing, testing, deploying,\nand maintaining software systems.\n### 2. Major Software Engineering Challenges\n1. **Complexity:** Large software systems contain many modules and interactions, making them difficult to understand\nand manage.\n2. **Changing Requirements:** Customer needs may change during development. These changes can affect the\ndesign, cost, and schedule.\n3. **Time and Cost Constraints:** Software must often be delivered within a fixed budget and deadline.\n4. **Software Quality:** Developing software that is reliable, secure, efficient, and easy to maintain is challenging.\n\n5. **Security:** Software must protect sensitive information against unauthorized access, attacks, and data leaks.\n6. **Maintenance:** Existing software needs bug fixes, updates, and new features after deployment.\n7. **Scalability:** Software must handle increasing users, transactions, and data without significant performance\ndegradation.\n8. **Team Communication:** Miscommunication among developers, testers, managers, and customers can lead to\nincorrect requirements and implementation errors.\n### Example\nAn online banking application must handle thousands of transactions, protect customer information, maintain\naccuracy, and remain available. Meeting all these requirements simultaneously creates several engineering\nchallenges.\n### Conclusion\nSoftware engineering challenges can be addressed through proper planning, requirement analysis,\ntesting, security practices, risk management, and continuous maintenance."
  },
  {
    "id": "q-u1-8",
    "unitNumber": 1,
    "questionNumber": 8,
    "question": "Explain the Software Development Life Cycle (SDLC) with a neat phase diagram, phases, and advantages.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition (1 Mark) + Linear Flow Diagram (1 Mark) + 7 Phases (3 Marks) + Advantages (1 Mark)",
    "examTips": "Draw the vertical pipeline: Planning -> Requirements -> Design -> Coding -> Testing -> Deployment -> Maintenance.",
    "answerMarkdown": "### 1. Definition\nThe Software Development Life Cycle (SDLC) is a structured process used to develop software through a sequence\nof phases, from identifying requirements to maintaining the finished product.\n### 2. Phases of SDLC\n1. **Planning and Feasibility Study:** Determine the project's objectives, estimated cost, required resources,\nschedule, and feasibility. Feasibility may include technical, economic, operational, and schedule considerations.\n2. **Requirement Analysis:** Collect and analyze customer requirements. The requirements are documented in the\nSoftware Requirements Specification (SRS).\n3. **System Design:** Prepare the software architecture, database design, user interfaces, and component\nspecifications.\n4. **Implementation (Coding):** Developers convert the design into source code using programming languages.\n5. **Testing:** Test the software to identify defects and verify that it meets the requirements. Common testing levels\ninclude unit testing, integration testing, system testing, and acceptance testing.\n6. **Deployment:** Install and release the software for actual users.\n7. **Maintenance:** Fix bugs, improve performance, adapt to environmental changes, and add necessary features\nafter deployment.\n### 3. SDLC Diagram\nPlanning\n|\nv\nRequirements\n|\nv\nDesign\n|\nv\nImplementation\n|\nv\nTesting\n|\nv\nDeployment\n|\nv\nMaintenance\n\n### 4. Advantages of SDLC\n• Provides a systematic development process.\n• Improves project planning and management.\n• Helps identify errors early.\n• Improves software quality.\n• Makes project progress easier to monitor.\n• Supports proper documentation.\n### Conclusion\nSDLC provides a structured framework for developing, delivering, and maintaining reliable software\nwithin the required time and budget.\nPART B: SOFTWARE PROCESS MODELS"
  },
  {
    "id": "q-u1-9",
    "unitNumber": 1,
    "questionNumber": 9,
    "question": "Explain the Waterfall Model in detail with a diagram, phases, advantages, and limitations.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition (1 Mark) + Cascading Diagram (1 Mark) + Phases (2 Marks) + Advantages & Limitations (2 Marks)",
    "examTips": "Emphasize that phase transitions only occur after formal sign-off, and working software is produced late in the cycle.",
    "answerMarkdown": "### 1. Definition\nThe Waterfall Model is a traditional software development model in which development proceeds through a\nsequence of phases. Each phase is generally completed before the next phase begins. It is called the waterfall\nmodel because progress flows downward from one phase to another.\nDiagram\nRequirements\n|\nv\nDesign\n|\nv\nImplementation\n|\nv\nTesting\n|\nv\nDeployment\n|\nv\nMaintenance\n### Phases\n1. **Requirements Analysis:** All requirements are collected and documented before development begins.\n2. **System Design:** The architecture, database, and system components are designed.\n3. **Implementation:** Developers write the program according to the design.\n4. **Testing:** The completed software is tested to find defects and verify requirements.\n5. **Deployment:** The software is delivered to users.\n6. **Maintenance:** Errors are corrected and necessary updates are provided.\n### Advantages\n• Simple and easy to understand.\n• Clear phases and milestones.\n• Easy to manage when requirements are stable.\n• Provides clear documentation.\n• Suitable for small projects with well-defined requirements.\n\n### Disadvantages\n• Difficult to accommodate changing requirements.\n• Working software becomes available relatively late.\n• Testing occurs after implementation.\n• Errors discovered late may be expensive to correct.\n• Limited customer feedback during development.\n### Example\nA small government record-management system with fixed, clearly documented requirements may be developed\nusing the Waterfall Model.\n### Conclusion\nThe Waterfall Model is suitable for projects with stable and well-understood requirements, but it is less\nsuitable when frequent changes are expected."
  },
  {
    "id": "q-u1-10",
    "unitNumber": 1,
    "questionNumber": 10,
    "question": "Explain the Incremental Model with a diagram, working methodology, advantages, and disadvantages.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition (1 Mark) + Diagram (1 Mark) + Increment Staging (2 Marks) + Pros & Cons (2 Marks)",
    "examTips": "Use an E-Commerce example: Increment 1 (Core login/catalog), Increment 2 (Cart), Increment 3 (Payment), Increment 4 (Tracking).",
    "answerMarkdown": "### 1. Definition\nThe Incremental Model develops software in multiple smaller parts called increments. Each increment adds new\nfunctionality to the existing working software. Instead of delivering the entire system at once, developers release it in\nstages.\nDiagram\nRequirements\n|\nv\nOverall Design\n|\nv\nIncrement 1 -> Core Features\n|\nv\nIncrement 2 -> Additional Features\n|\nv\nIncrement 3 -> More Features\n|\nv\nComplete Software\n### Working Steps\n1. **Requirement Analysis:** Identify the overall system requirements and prioritize the features.\n2. **Overall Design:** Prepare a high-level design for the complete system.\n3. **First Increment:** Develop and test the most important features.\n4. **Subsequent Increments:** Add more features in separate development cycles.\n5. **Integration and Testing:** Ensure that each new increment works correctly with existing functionality.\n6. **Final Delivery:** Deliver the complete system after all planned increments are implemented.\n### Example\nAn online shopping application can be developed incrementally: Increment 1—User registration and login;\nIncrement 2—Product catalogue; Increment 3—Shopping cart and ordering; Increment 4—Online payment and\norder tracking. Users can start using the core features before all features are completed.\n### Advantages\n• Working software is delivered early.\n• Important features can be developed first.\n\n• Customer feedback can guide later increments.\n• Testing and debugging are easier for smaller parts.\n• Changes can be incorporated into later increments.\n### Disadvantages\n• Requires good overall architecture.\n• Integration between increments can be difficult.\n• Planning and managing increments requires effort.\n• Not every system can be divided easily into independent increments.\n### Conclusion\nThe Incremental Model is useful when software can be divided into smaller functional parts and early\ndelivery is important."
  },
  {
    "id": "q-u1-11",
    "unitNumber": 1,
    "questionNumber": 11,
    "question": "Describe the Prototype Model of software development with a neat diagram, phases, and suitability.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition (1 Mark) + Prototyping Feedback Loop Diagram (2 Marks) + Phases (2 Marks) + Pros & Cons (1 Mark)",
    "examTips": "Draw the cyclic feedback loop: Requirements -> Quick Design -> Build Prototype -> Customer Evaluation -> Refine.",
    "answerMarkdown": "### 1. Definition\nThe Prototype Model develops an early, simplified version of software to understand and validate customer\nrequirements before developing the final system. A prototype helps customers visualize the system and provide\nfeedback.\nDiagram\nGather Requirements\n|\nv\nQuick Design\n|\nv\nBuild Prototype\n|\nv\nCustomer Evaluation\n|\nv\nUser Feedback\n|\nv\nRefine Prototype\n|\nv\nRequirements Clear?\n/ \\\nNo Yes\n| |\nv v\nRefine Final Design\nPrototype |\nv\nCoding\n|\nv\nTesting\n|\nv\nDeployment\n### Phases\n1. **Requirement Collection:** Collect the initial requirements from the customer.\n2. **Quick Design:** Create a simple design focusing on the main features and user interface.\n3. **Prototype Development:** Build a preliminary version of the system.\n4. **Customer Evaluation:** Allow users to examine the prototype and provide feedback.\n\n5. **Refinement:** Modify the prototype according to the feedback.\n6. **Final Development:** Once the requirements are sufficiently clear, develop, test, and deploy the actual software.\n### Example\nA company wants to develop a mobile banking application but is unsure about the best interface. Developers create\na prototype containing login, account balance, and transaction screens. Customers review it and suggest changes\nbefore the actual application is developed.\n### Advantages\n• Helps clarify unclear requirements.\n• Encourages customer involvement.\n• Identifies usability problems early.\n• Reduces the risk of developing the wrong product.\n• Improves understanding between customers and developers.\n### Disadvantages\n• Repeated changes may increase development time.\n• Customers may mistake the prototype for the finished product.\n• Developers may use poor design practices to build the prototype quickly.\n• Excessive refinement can increase cost.\n### Conclusion\nThe Prototype Model is particularly useful when customer requirements are unclear or the user interface\nneeds frequent evaluation."
  },
  {
    "id": "q-u1-12",
    "unitNumber": 1,
    "questionNumber": 12,
    "question": "Explain the V-Model (Verification and Validation Model) with its V-shaped diagram and phase mapping.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition (1 Mark) + V-Diagram (2 Marks) + Verification vs Validation (1 Mark) + Phase Mappings (2 Marks)",
    "examTips": "Explicitly map: Requirements <-> Acceptance Testing; System Design <-> System Testing; Architecture <-> Integration Testing; Module Design <-> Unit Testing.",
    "answerMarkdown": "### 1. Definition\nThe V-Model, also called the Verification and Validation Model, is a software development model in which\ndevelopment phases are associated with corresponding testing phases. It is called the V-Model because its phases\nare commonly represented in the shape of the letter V.\nDiagram\nVerification Validation\nRequirements ----------> Acceptance Testing\n\\ /\n\\ /\nSystem Design --------> System Testing\n\\ /\n\\ /\nArchitecture --------> Integration Testing\n\\ /\n\\ /\nModule Design\n\\ /\n\\ /\nCoding\nDevelopment activities are on the left,\ncoding is at the bottom, and corresponding\ntesting activities are on the right.\n### Phases\n1. **Requirement Analysis:** Understand customer needs. These requirements are later validated through\nacceptance testing.\n\n2. **System Design:** Define the overall system structure. System testing checks the complete system against the\nspecified requirements.\n3. **Architectural Design:** Identify the major modules and their interactions. Integration testing checks\ncommunication between these modules.\n4. **Module Design:** Design the internal logic of individual modules. Unit testing checks the individual modules.\n5. **Coding:** Implement the software based on the completed designs.\n6. **Testing:** Perform the corresponding testing activities to verify that the developed system satisfies its\nspecifications.\nVerification and Validation\n• Verification: Are we building the product correctly according to its specifications?\n• Validation: Are we building the correct product that meets the user's needs?\n### Advantages\n• Testing is planned early.\n• Development phases are clearly defined.\n• Defects can be identified systematically.\n• Suitable for projects with stable requirements.\n• Easy to manage and monitor.\n### Disadvantages\n• Difficult to accommodate changing requirements.\n• Working software is generally available late.\n• No early working prototype is required by the model.\n• Changes to earlier phases may be costly.\n### Example\nThe V-Model may be appropriate for medical-device software where requirements are stable and systematic\nverification and validation are essential.\n### Conclusion\nThe V-Model emphasizes systematic testing and is suitable for projects where requirements are clear\nand quality assurance is critical."
  },
  {
    "id": "q-u1-13",
    "unitNumber": 1,
    "questionNumber": 13,
    "question": "Explain the Spiral Model with its 4 quadrants, risk analysis mechanism, and advantages.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition & Barry Boehm credit (1 Mark) + 4 Quadrants (3 Marks) + Diagram & Pros/Cons (2 Marks)",
    "examTips": "Highlight Quadrant 1 (Determine Objectives), Quadrant 2 (Risk Analysis & Prototyping), Quadrant 3 (Engineering), Quadrant 4 (Review & Plan next spiral).",
    "answerMarkdown": "### 1. Definition\nThe Spiral Model is a risk-driven software development model that combines iterative development with systematic\nrisk analysis. The software is developed through repeated cycles called spirals. Each cycle includes planning, risk\nanalysis, development, and evaluation.\n\nDiagram\n+----------------------+\n| 1. Planning |\n| Requirements |\n+----------+-----------+\n|\nv\n+----------------------+\n| 2. Risk Analysis |\n| Identify Risks |\n+----------+-----------+\n|\nv\n+----------------------+\n| 3. Development |\n| Build and Test |\n+----------+-----------+\n|\nv\n+----------------------+\n| 4. Evaluation |\n| Customer Review |\n+----------+-----------+\n|\n+----> Next Spiral\nIn an actual Spiral Model diagram, the cycles\nexpand outward to represent increasing project\neffort or progress.\n### Phases of Each Spiral\n1. **Planning:** Determine the objectives, requirements, alternatives, and constraints for the current cycle.\n2. **Risk Analysis:** Identify and evaluate potential risks. Develop strategies to reduce major risks.\n3. **Engineering:** Design, develop, and test the software or the next increment.\n4. **Customer Evaluation:** Obtain feedback, evaluate the results, and plan the next spiral.\n### Example\nA large banking system may use the Spiral Model because security risks, integration challenges, and performance\nrequirements need to be evaluated throughout development.\n### Advantages\n• Strong emphasis on risk management.\n• Supports changing requirements.\n• Allows repeated customer feedback.\n• Suitable for large and complex projects.\n• Problems can be identified during successive cycles.\n### Disadvantages\n• Expensive to implement.\n• Requires expertise in risk analysis.\n• Management can be complex.\n• Unsuitable for small projects with low risk.\n### Conclusion\nThe Spiral Model is best suited for large, complex, high-risk projects where risks must be evaluated\ncontinuously throughout development."
  },
  {
    "id": "q-u1-14",
    "unitNumber": 1,
    "questionNumber": 14,
    "question": "Explain the Rapid Application Development (RAD) Model with its phases, advantages, and limitations.",
    "marks": 6,
    "priority": "medium",
    "markingScheme": "Definition (1 Mark) + 4 Phases (3 Marks) + Pros & Cons (2 Marks)",
    "examTips": "Describe Requirements Planning, User Design, Construction (reusable components), and Cutover (deployment).",
    "answerMarkdown": "### 1. Definition\nRapid Application Development (RAD) is a software process model that emphasizes rapid development, reusable\ncomponents, prototyping, user involvement, and frequent delivery. Its main goal is to develop working software\nquickly without sacrificing necessary quality.\n### Phases\n1. **Requirements Planning:** Developers and customers identify the project's objectives, requirements, and scope.\n2. **User Design:** Users and developers collaborate to create prototypes and refine the system design.\n3. **Construction:** Developers build the software using reusable components, development tools, and iterative\nimprovements.\n4. **Cutover:** The system is tested, converted to the production environment, deployed, and handed over to users.\nDiagram\nRequirements Planning\n|\nv\nUser Design\n|\nv\nConstruction\n|\nv\nCutover\n|\nv\nFinal Application\n### Example\nA company needs an internal employee-management application quickly. Using RAD, developers create prototypes,\nobtain feedback from employees, reuse existing components, and rapidly build modules for employee records,\nleave management, and reporting.\n### Advantages\n• Enables faster development.\n• Encourages continuous user involvement.\n• Supports frequent feedback and changes.\n• Promotes component reuse.\n• Working software can be delivered quickly.\n### Disadvantages\n• Requires skilled developers.\n• Requires continuous customer participation.\n• May not be suitable for very large or highly complex systems.\n• Needs tools and resources that support rapid development.\n• Poor coordination can create integration problems.\n### Conclusion\nRAD is suitable for projects requiring rapid delivery, active customer participation, and software that can\nbe divided into modules."
  },
  {
    "id": "q-u1-15",
    "unitNumber": 1,
    "questionNumber": 15,
    "question": "Explain the Agile Methodology, its core values, iterative development cycle, and advantages.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Definition (1 Mark) + Agile Manifesto Values (2 Marks) + Iterative Cycle (2 Marks) + Advantages (1 Mark)",
    "examTips": "Mention the 4 Agile values (Individuals/Interactions, Working Software, Customer Collaboration, Responding to Change) and sprints/iterations of 1-4 weeks.",
    "answerMarkdown": "### 1. Definition\nAgile is an iterative and incremental software development approach that delivers working software in small\nreleases and adapts to changing customer requirements. It emphasizes collaboration, customer feedback,\ncontinuous improvement, and frequent delivery.\nDiagram\nRequirements\n|\nv\nPlanning\n|\nv\nDesign\n|\nv\nDevelopment\n|\nv\nTesting\n|\nv\nRelease\n|\nv\nFeedback\n|\n+------> Next Iteration\n### Working Steps of Agile\n1. **Requirement Collection:** Identify and prioritize features based on customer needs.\n2. **Iteration Planning:** Select a small set of features to develop during the next iteration or sprint.\n3. **Design and Development:** Design and implement the selected features.\n4. **Testing:** Test the developed features to ensure they work correctly.\n5. **Release:** Deliver the working software or increment to the customer.\n6. **Feedback and Improvement:** Collect customer feedback and use it to plan the next iteration.\n### Example\nA food-delivery application can be developed using Agile: Sprint 1—User registration and login; Sprint\n2—Restaurant listing; Sprint 3—Food ordering; Sprint 4—Payment integration; Sprint 5—Order tracking. At the end\nof each sprint, the team reviews the work and adjusts future plans based on feedback.\n### Advantages\n• Easily accommodates changing requirements.\n• Delivers working software frequently.\n• Encourages customer collaboration.\n• Identifies defects through continuous testing.\n• Improves communication among team members.\n• Provides opportunities for continuous improvement.\n### Disadvantages\n• Frequent changes may affect cost and schedule.\n• Requires regular customer involvement.\n• Final cost and delivery dates may be difficult to predict when scope changes frequently.\n\n• Documentation may be insufficient if neglected.\n• Requires effective teamwork and communication.\n### Conclusion\nAgile is suitable for projects where requirements change frequently and customers need regular releases\nof working software.\nPART C: IMPORTANT COMPARISONS FOR EXAMS\nThese comparisons are useful if your examiner asks a question such as “Differentiate between the following\nmodels.”"
  },
  {
    "id": "q-u1-16",
    "unitNumber": 1,
    "questionNumber": 16,
    "question": "Compare and differentiate between the Waterfall Model and the Incremental Model.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "6 Distinct Comparison Parameters in Tabular Format (6 Marks)",
    "examTips": "Compare Delivery approach, Flexibility to Change, Feedback timing, Risk level, Complexity management, and Delivery milestones.",
    "answerMarkdown": "Waterfall Model Incremental Model\nDevelopment proceeds through sequential phases. Development proceeds through multiple increments.\nThe complete product is generally delivered after all phases are completed.\tWorking software is delivered in stages.\nChanges to requirements are difficult to accommodate. Changes can often be included in later increments.\nCustomer feedback during development is generally limited. Feedback can be collected after each increment.\nSuitable for stable requirements. Suitable when features can be delivered in stages.\nKey difference: Waterfall develops the system mainly as one complete sequence, while Incremental delivers it\nthrough multiple functional releases."
  },
  {
    "id": "q-u1-17",
    "unitNumber": 1,
    "questionNumber": 17,
    "question": "Differentiate between the Prototype Model and the Spiral Model.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "6 Distinct Comparison Parameters in Tabular Format (6 Marks)",
    "examTips": "Contrast primary focus (requirements understanding vs risk management), cost, project size suitability, and iterations.",
    "answerMarkdown": "Prototype Model Spiral Model\nFocuses on understanding and refining requirements. Focuses on identifying and managing risks.\nBuilds an early version of the proposed system. Develops the system through repeated risk-driven cycles.\nCustomer feedback is used to refine the requirements and design.Customer evaluation helps guide the next spiral.\nUseful when requirements are unclear. Useful when project risks are high.\nRepeated prototyping may increase cost. Risk analysis and repeated cycles may increase cost.\nKey difference: Prototyping primarily clarifies what the customer wants, whereas Spiral places particular emphasis on\nmanaging project risks."
  },
  {
    "id": "q-u1-18",
    "unitNumber": 1,
    "questionNumber": 18,
    "question": "Differentiate between the Waterfall Model and the V-Model.",
    "marks": 6,
    "priority": "medium",
    "markingScheme": "6 Distinct Comparison Parameters in Tabular Format (6 Marks)",
    "examTips": "Focus on testing phase placement: late in Waterfall vs parallel testing planning alongside development in V-Model.",
    "answerMarkdown": "Waterfall Model V-Model\nUses sequential development phases. Uses development phases associated with corresponding testing phases.\nTesting is generally performed after implementation. Testing is planned alongside development activities.\nTesting activities are not explicitly paired with each development phase in the basic model.\tUnit, integration, system, and acceptance testing are associated with development\nSuitable for stable requirements. Suitable for stable requirements requiring systematic verification and validation.\nEmphasizes sequential development. Emphasizes sequential development and structured testing.\n\nKey difference: The V-Model explicitly connects development activities with corresponding testing activities."
  },
  {
    "id": "q-u1-19",
    "unitNumber": 1,
    "questionNumber": 19,
    "question": "Compare the Rapid Application Development (RAD) Model and the Agile Model.",
    "marks": 6,
    "priority": "medium",
    "markingScheme": "6 Distinct Comparison Parameters in Tabular Format (6 Marks)",
    "examTips": "Compare development philosophy, component reusability, sprint cadence, customer participation, and methodology scope.",
    "answerMarkdown": "RAD Model Agile Model\nEmphasizes rapid development using prototyping and reusable components.\tEmphasizes iterative development, collaboration, and adaptation.\nFocuses strongly on reducing development time. Focuses on delivering value continuously and responding to change.\nOften relies on specialized tools and reusable components. Can use various tools and engineering practices.\nRequires close user involvement during design. Requires ongoing customer collaboration and feedback.\nWorks well when the project can be modularized and developed rapidly.\tWorks well when requirements evolve over time.\nKey difference: RAD focuses strongly on rapid construction, while Agile emphasizes iterative delivery, collaboration,\nand adaptability.\nPART D: WHICH TOPICS SHOULD YOU PREPARE FIRST?"
  },
  {
    "id": "q-u1-20",
    "unitNumber": 1,
    "questionNumber": 20,
    "question": "Summarize the semester exam preparation strategy and high-scoring answer structure for Unit 1.",
    "marks": 6,
    "priority": "high",
    "markingScheme": "Marking Distribution (2 Marks) + Priority Topics (2 Marks) + Answer Presentation Rules (2 Marks)",
    "examTips": "Follow the 6-mark scoring rubric: Definition (1m) + 6 Points / Diagram (3-4m) + Example / Conclusion (1m).",
    "answerMarkdown": "Priority Topic What to remember\n1 SDLC Definition, seven phases, diagram, advantages\n2 Waterfall Model Phases, diagram, advantages, disadvantages\n3 Incremental Model Meaning, increments, example, pros and cons\n4 Spiral Model Four activities, risk analysis, diagram\n5 Agile Model Iterations, feedback, advantages, disadvantages\n6 V-Model Diagram, verification, validation, testing levels\n7 Prototype Model Prototype cycle, feedback, applications\n8 RAD Model Four phases, rapid development, limitations\n9 Umbrella Activities Explain at least six activities\n10 Software Engineering Challenges Explain at least six challenges\n11 Problem-Solving Activity Steps and example\n12 Modelling Activity Types and importance\n13 Knowledge Acquisition Steps and example\n14 Rationale-Driven Activity Decisions, alternatives, justification\nHow to Write a 6-Mark Answer\nFor most of these questions, use this structure:\n1. Definition: 1 mark.\n2. Explanation or phases: 2–3 marks.\n3. Diagram or example: 1 mark.\n\n4. Advantages, disadvantages, or importance: 1–2 marks.\nThe exact marking scheme depends on your university, but this structure helps you cover the important points.\nFinal exam tip: Practise drawing the Waterfall, Incremental, Prototype, V-Model, Spiral, and Agile diagrams. For\nprocess-model questions, a correct diagram combined with a definition, working steps, advantages, disadvantages,\nand an example makes your answer more complete."
  }
];
