import type { Experience } from "@/features/portfolio/types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "gamedev-utopia",
    companyName: "GameDev Utopia",
    location: "Pune, Maharashtra",
    locationType: "On-site",
    positions: [
      {
        id: "content-head",
        title: "Content Head",
        employmentType: "Volunteering & Leadership",
        employmentPeriod: {
          start: "08.2025",
          end: "07.2026",
        },
        description: `Led content strategy for a student game development club.

- Grew the club's LinkedIn following by 1,500+ members through targeted content strategy and cross-functional collaboration with design and marketing teams.
- Led and mentored a creative team, using documentation standards, task delegation, and open feedback loops to deliver consistent, high-quality output.`,
        isExpanded: true,
      },
    ],
  },
]
