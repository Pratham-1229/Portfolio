import { SITE_INFO } from "@/config/site"
import { USER } from "@/features/portfolio/data/user"

const content = `# ${SITE_INFO.name}

> ${USER.bio}

- [About](${SITE_INFO.url}/about.md): A quick intro to me, my tech stack, and how to connect.
- [Experience](${SITE_INFO.url}/experience.md): Leadership & volunteering experience and roles.
- [Education](${SITE_INFO.url}/education.md): Where I study and what I focus on.
- [Projects](${SITE_INFO.url}/projects.md): Selected projects that show my skills and creativity.
- [Recognition](${SITE_INFO.url}/recognition.md): Awards and hackathon recognition.
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
