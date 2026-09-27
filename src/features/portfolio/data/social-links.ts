import type { SocialProfile } from "@/features/portfolio/types/social-links"

/**
 * Keyed registry of social profiles — the single source of truth. Icons are
 * bound separately in `social-link-icons.tsx` (keyed by the same `SocialName`),
 * so adding a profile here forces the icon map to stay in sync at compile time.
 */
export const SOCIAL = {
  github: {
    title: "GitHub",
    handle: "Pratham-1229",
    href: "https://github.com/Pratham-1229",
    sameAs: true,
  },
  linkedin: {
    title: "LinkedIn",
    handle: "prathamesh-kadam-pk1229",
    href: "https://www.linkedin.com/in/prathamesh-kadam-pk1229",
    sameAs: true,
  },
  x: {
    title: "X (Twitter)",
    handle: "@probro1229",
    href: "https://x.com/probro1229",
    sameAs: true,
  },
  instagram: {
    title: "Instagram",
    handle: "@prathamesh_1229",
    href: "https://instagram.com/prathamesh_1229",
    sameAs: true,
  },
  email: {
    title: "Email",
    handle: "prathameshk2905@gmail.com",
    href: "mailto:prathameshk2905@gmail.com",
  },
} satisfies Record<string, SocialProfile>

export type SocialName = keyof typeof SOCIAL

export type SocialLink = SocialProfile & { name: SocialName }

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }))
