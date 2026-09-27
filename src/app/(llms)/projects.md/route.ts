import { PROJECTS } from "@/features/portfolio/data/projects"

const content = `# Projects

${PROJECTS.map((item) => {
  const projectUrl = item.link ? `\n\nProject URL: ${item.link}` : ""
  const skills = `\n\nSkills: ${item.skills.join(", ")}`
  const description = item.description ? `\n\n${item.description.trim()}` : ""
  return `## ${item.title}${projectUrl}${skills}${description}`
}).join("\n\n")}
`

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
