import React from "react";
import { SITE_URL, SITE_CONFIG } from "@/lib/seo-config";

interface JsonLdProps {
  type?: "home" | "course" | "all";
}

export function JsonLd({ type = "all" }: JsonLdProps) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_CONFIG.name,
    alternateName: [SITE_CONFIG.shortName, "ANITS SE Academic Platform"],
    url: SITE_URL,
    description: SITE_CONFIG.description,
    inLanguage: "en-US",
    publisher: {
      "@type": "CollegeOrUniversity",
      "@id": `${SITE_URL}/#institution`,
      name: SITE_CONFIG.institution.name,
      department: {
        "@type": "EducationalOrganization",
        name: SITE_CONFIG.institution.department,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Visakhapatnam",
        addressRegion: "Andhra Pradesh",
        addressCountry: "IN",
      },
    },
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${SITE_URL}/#course-software-engineering`,
    name: "Software Engineering Academic Curriculum",
    description:
      "A complete B.Tech 5-unit curriculum covering SDLC process models, Agile Scrum, SRS IEEE 830, Cohesion and Coupling, UML diagrams, Testing methods, and COCOMO estimation.",
    courseCode: SITE_CONFIG.course.code,
    educationalCredentialAwarded:
      "Bachelor of Technology in Computer Science & Engineering",
    timeRequired: "PT60H",
    occupationalCredentialAwarded: "Software Engineering Academic Mastery",
    provider: {
      "@type": "CollegeOrUniversity",
      name: SITE_CONFIG.institution.name,
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "blended",
      courseWorkload: "60 Periods across 5 Units",
      inLanguage: "en",
    },
    syllabusSections: [
      {
        "@type": "Syllabus",
        name: "Unit I: Importance of Software Engineering & Process Models",
        description:
          "SDLC activities, Waterfall, Incremental, Prototype, Spiral, and Agile methodologies.",
        timeRequired: "PT12H",
      },
      {
        "@type": "Syllabus",
        name: "Unit II: Requirements Engineering, Analysis & Design",
        description:
          "SRS IEEE 830 specification, functional/non-functional requirements, and DFD modeling.",
        timeRequired: "PT12H",
      },
      {
        "@type": "Syllabus",
        name: "Unit III: System Architecture & UML Modeling",
        description:
          "Cohesion, Coupling, 4+1 Architectural Views, and UML diagrams (Class, Sequence, Statechart, Component).",
        timeRequired: "PT12H",
      },
      {
        "@type": "Syllabus",
        name: "Unit IV: Software Testing & Maintenance",
        description:
          "Black-box, White-box, Basis Path testing, and McCabe Cyclomatic Complexity V(G).",
        timeRequired: "PT12H",
      },
      {
        "@type": "Syllabus",
        name: "Unit V: Software Metrics & Project Management",
        description:
          "COCOMO Basic, Intermediate, Complete estimation models, and Risk Management.",
        timeRequired: "PT12H",
      },
    ],
  };

  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#author`,
    name: SITE_CONFIG.author.name,
    jobTitle: SITE_CONFIG.author.role,
    email: `mailto:${SITE_CONFIG.author.email}`,
    url: SITE_CONFIG.author.github,
    worksFor: {
      "@type": "CollegeOrUniversity",
      name: SITE_CONFIG.institution.name,
    },
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Curriculum Units",
        item: `${SITE_URL}/#curriculum`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "System Architecture Diagrams",
        item: `${SITE_URL}/#architectures`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Exam Preparation Q&A",
        item: `${SITE_URL}/#exam-prep`,
      },
    ],
  };

  const schemas = [websiteSchema, courseSchema, authorSchema, breadcrumbsSchema];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
export default JsonLd;

