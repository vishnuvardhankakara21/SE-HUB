/**
 * SEO & Open Graph Master Configuration
 * Central source of truth for metadata, canonical URLs, social sharing, and structured data schemas.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://se-hub-anits.vercel.app")
).replace(/\/+$/, "");

export const SITE_CONFIG = {
  name: "SE-HUB | ANITS Software Engineering Academic Platform",
  shortName: "SE-HUB",
  title: "Software Engineering Academic Learning Platform | ANITS CSE",
  description:
    "Comprehensive academic learning platform for B.Tech Software Engineering. Features 5-unit curriculum notes, university 6-mark exam Q&As, 16 reference system architectures, and interactive diagram studio.",
  keywords: [
    "Software Engineering",
    "SE B.Tech CSE",
    "ANITS Software Engineering",
    "SDLC Process Models",
    "Waterfall vs Agile",
    "SRS IEEE 830 Specification",
    "Cohesion and Coupling",
    "McCabe Cyclomatic Complexity",
    "COCOMO Estimation Model",
    "Software Testing Equivalence Partitioning",
    "UML Activity Statechart Component Diagrams",
    "Previous Question Papers Software Engineering",
    "draw.io diagram studio",
    "ANITS CSE Department",
  ],
  author: {
    name: "KAKARA VISHNU VARDHAN",
    email: "vishnuvardhankakara21@gmail.com",
    github: "https://github.com/vishnuvardhankakara21",
    role: "Lead Platform Architect & Developer",
  },
  institution: {
    name: "Anil Neerukonda Institute of Technology & Sciences (ANITS)",
    department: "Department of Computer Science & Engineering",
    accreditation: "Autonomous Institution • NAAC 'A' Grade • NBA Accredited",
    location: "Visakhapatnam, Andhra Pradesh, India",
  },
  course: {
    code: "CSE-312",
    title: "Software Engineering",
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science & Engineering",
    semester: "Semester V / III-I",
  },
};

/**
 * Returns an absolute canonical URL for any route path
 */
export function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}

