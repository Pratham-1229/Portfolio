import { FileTextIcon, MailIcon } from "lucide-react"

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/icons"
import type { SocialName } from "@/features/portfolio/data/social-links"

/**
 * Presentation binding for social profiles. Kept separate from the social
 * data so the data layer stays JSX-free. Keyed by `SocialName` so it stays
 * exhaustive with the registry.
 */
export const SOCIAL_ICONS: Record<SocialName, React.JSX.Element> = {
  github: <GitHubIcon />,
  linkedin: <LinkedInIcon />,
  x: <XIcon />,
  instagram: <InstagramIcon className="size-4" />,
  resume: <FileTextIcon className="size-4" />,
  email: <MailIcon className="size-4" />,
}
