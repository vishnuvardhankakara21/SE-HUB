# Software Engineering Interactive Learning Platform 🎓

A dedicated, production-grade interactive learning platform for college **Software Engineering (SE)** subject education, university examination preparation, and diagram drawing studio.

Built specifically to fulfill the college syllabus and faculty requirements with authoritative 5-unit curriculum alignment, verbatim 6-mark university examination answers, 16 full-resolution reference system architecture diagrams, and a full-featured **diagrams.net (draw.io)** embedded studio.

---

## 🚀 Key Modules & Capabilities

### 1. 📖 5-Unit Authoritative Curriculum & Theory Reader
- **Unit I:** Software Process & Agile Development (Waterfall, RAD, Spiral, Agile Manifesto, XP, Scrum)
- **Unit II:** Requirements Analysis & Modeling (FR/NFR, Use Case modeling, Activity & Swimlane, DFD Level 0/1/2)
- **Unit III:** Architectural Design & Patterns (Call-and-Return, Layered, MVC, Microservices, Component Design)
- **Unit IV:** Software Testing Strategies & UML (Unit/Integration, Black-Box/White-Box, Cyclomatic Complexity, UML Structural & Behavioral diagrams)
- **Unit V:** Project Management, Estimation & Maintenance (COCOMO I & II, Earned Value Analysis, Risk Management, Reverse/Re-engineering)
- **Interactive Markdown & KaTeX Math:** Renders formulas ($E = a \times (\text{KLOC})^b$, $V(G) = E - N + 2P$, $\text{CPI} = \frac{\text{EV}}{\text{AC}}$) with crisp academic typography and bookmarking.

### 2. 🎯 University 6-Mark Exam Preparation Bank
- Authentic, verbatim university-format answers preserving marking schemes, step-by-step points, ASCII system representations, and faculty tips.
- Filterable by Unit, Priority tag (High / Very High / Standard), and keywords.
- Single-click **"Copy Answer"** button formatted for offline study.

### 3. 🎨 16-Diagram Reference Gallery & Diagrams.net Studio
- **All 16 Diagrams** extracted from reference materials categorized across 4 classic software systems:
  1. *Library Management System* (Activity, Statechart, Component, Deployment)
  2. *Learning Management System* (Activity, Statechart, Component, Deployment)
  3. *University Management System* (Activity, Statechart, Component, Deployment)
  4. *Online Banking System* (Activity, Statechart, Component, Deployment)
- **Deep Zoom & Pan Lightbox:** Inspect complex UML models at full resolution.
- **Embedded Studio (diagrams.net / draw.io):**
  - Full-screen distraction-free workspace using HTML5 `postMessage` protocol.
  - Zero external API keys or server runtime costs required.
  - Pre-engineered SE stencil templates (Use Case, Class, Sequence, Activity, DFD Level 1, etc.).
  - Lossless XML autosave, rename, and export to PNG / SVG.
  - **"Open in Studio"** button directly on every reference diagram to jumpstart coursework assignments.

### 4. 🧪 Interactive Quizzes & Gamification
- Unit-wise multiple choice quizzes with instant answer validation.
- Explanations for correct/incorrect answers.
- Confetti celebration animation upon completion.
- Gamified learning streak counter, XP points, and achievement badges (Code Architect, UML Master, Agile Pro, Quality Guardian).

### 5. 📂 Previous University Question Papers
- Downloadable and viewable past university examinations organized by academic year.

### 6. 👩‍🏫 Teacher & 🛡️ Admin Dashboards
- **Teacher Dashboard:** Resource management (PDF, PPT, DOC, images, video links), draft/publish toggling, and learning activity insights.
- **Admin Dashboard:** Strict Role-Based Access Control (RBAC). Student registrations are separated from Teacher applications. Teacher accounts require administrative verification and approval before gaining faculty privileges.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components & Dynamic Client Suspense)
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS with custom academic color palette and dark mode accents
- **Icons:** Lucide React
- **Math Rendering:** KaTeX
- **Diagram Engine:** diagrams.net (draw.io) embedded iframe integration
- **Database:** Mongoose / MongoDB with a **Hybrid In-Memory Fallback Layer** (platform runs seamlessly even without an external database instance configured).

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18.18+ or v20+)
- npm or pnpm

### 1. Installation
The project is located at:
```bash
cd "C:\Users\vishnu\.gemini\antigravity\scratch\se-learning-platform"
npm install
```

### 2. Environment Configuration (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(If left unset, the platform functions out-of-the-box with built-in authoritative data stores).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Production Build & Start
```bash
npm run build
npm start
```

### 5. Database Seeding (When connecting to MongoDB)
```bash
npm run seed
```

---

## 📁 Project Structure

```
se-learning-platform/
├── app/
│   ├── (auth)/login/ & register/     # Role-aware authentication views
│   ├── (dashboard)/
│   │   ├── student/                 # Student learning hub, syllabus, notes, exam-prep, quizzes
│   │   │   ├── diagrams/            # 16-diagram reference gallery
│   │   │   │   └── studio/          # Fullscreen draw.io studio workspace
│   │   │   ├── exam-prep/           # 6-mark Q&A repository
│   │   │   ├── learn/               # Theory notes with dynamic [unitNumber]/[slug]
│   │   │   ├── previous-papers/     # Past university papers
│   │   │   ├── quizzes/             # Interactive MCQ test suite
│   │   │   └── syllabus/            # 5-unit curriculum roadmap
│   │   ├── teacher/                 # Faculty resource management & publishing
│   │   └── admin/                   # Platform administration & teacher approval queue
│   ├── api/diagrams/personal/       # Diagram XML persistence API
│   ├── layout.tsx & globals.css     # Root layout & styling
│   └── page.tsx                     # Landing page
├── components/
│   ├── dashboard/                   # Sidebar, Navbar, Progress bars
│   ├── diagrams/                    # DrawingBoardEmbed, DiagramReferenceCard, DiagramLightbox
│   └── reader/                      # QuestionCard, Markdown/Formula reader
├── docs/                            # Extracted authoritative curriculum & 16 reference diagrams
├── lib/
│   ├── data/                        # Curriculum, 6-mark Q&As, 16 diagrams metadata
│   ├── db/models/                   # 13 Mongoose schemas for production DB
│   └── templates/                   # Draw.io XML templates for SE diagrams
└── public/
    └── diagrams/                    # 16 Web-optimized PNG diagram reference assets
```

---

## 👨‍🏫 Faculty Handover Note
All questions, answers, formulas, and syllabus units have been directly transcribed without truncation or generative summarization from the college notes provided in `assets-SE.zip`.

