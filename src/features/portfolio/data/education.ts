import type { Education } from "@/features/portfolio/types/education"

export const EDUCATION: Education[] = [
  {
    id: "pict",
    school: "Pune Institute of Computer Technology",
    degree: "Bachelor of Engineering (B.E.)",
    fieldOfStudy: "Computer Engineering",
    period: {
      start: "2023",
      end: "2027 (Expected)",
    },
    description: `- Overall CGPA: 8.50
- Location: Pune, Maharashtra
- Coursework: Data Structures & Algorithms, OOP, DBMS, Operating Systems`,
    skills: [
      "Data Structures & Algorithms",
      "OOP",
      "DBMS",
      "Operating Systems",
    ],
  },
  {
    id: "dypatil",
    school: "Dr. D. Y. Patil Junior College",
    degree: "Maharashtra State Board (HSC), 12th",
    fieldOfStudy: "Science",
    period: {
      start: "2021",
      end: "05.2023",
    },
    description: `- Percentage: 85.00%
- Location: Pune, Maharashtra`,
  },
  {
    id: "cms",
    school: "C. M. S. English Medium Higher Secondary School",
    degree: "Maharashtra State Board (SSC), 10th",
    period: {
      start: "2011",
      end: "05.2021",
    },
    description: `- Percentage: 88.00%
- Location: Pune, Maharashtra`,
  },
]
