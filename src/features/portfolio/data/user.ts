import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Prathamesh",
  lastName: "Kadam",
  displayName: "Prathamesh Kadam",
  username: "Pratham-1229",
  gender: "male",
  pronouns: "he/him",
  bio: "I'm a Computer Engineering student at Pune Institute of Computer Technology (PICT) with a strong interest in building impactful tech solutions. I'm currently working on projects in web development and AI/ML, exploring how technology can solve real-world problems — and continuously deepening my understanding of cloud computing, operating systems, databases, and advanced C++. I enjoy problem-solving, building scalable applications, and exploring new technologies, and I'm always eager to learn, collaborate, and grow as a developer.",
  flipSentences: [
    "Computer Engineering student at PICT.",
    "Building scalable web apps & compilers.",
    "Exploring AI/ML and systems engineering.",
    "Passionate about problem-solving & C++.",
  ],
  address: "Pune, Maharashtra, India",
  emailB64: "cHJhdGhhbWVzaGsyOTA1QGdtYWlsLmNvbQ==", // prathameshk2905@gmail.com
  website: "https://github.com/Pratham-1229",
  jobTitle: "Computer Engineering Student",
  jobs: [
    {
      title: "Computer Engineering Student",
      company: "PICT",
      website: "https://pict.edu",
    },
  ],
  about: `- I'm a Computer Engineering student at Pune Institute of Computer Technology (PICT) with a strong interest in building impactful tech solutions.
- Currently working on projects in web development and AI/ML, exploring how technology can solve real-world problems.
- Deepening my understanding of cloud computing, operating systems, databases, and advanced C++.
- Passionate about problem-solving, building scalable applications, and exploring new technologies.
`,
  avatar: "/images/avatar.jpg",
  ogImage: "/images/avatar.jpg",
  timeZone: "Asia/Kolkata",
  keywords: [
    "Prathamesh Kadam",
    "Prathamesh Atul Kadam",
    "Computer Engineering",
    "Backend Developer",
    "FastAPI",
    "C++",
    "Compilers",
    "LLM Engineering",
    "RAG",
    "PICT",
  ],
  dateCreated: "2025-01-01",
}
