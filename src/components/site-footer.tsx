import Link from "next/link"

import { SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { cn } from "@/lib/utils"
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-12" />
        </div>

        <div className="flex flex-col gap-3 px-4 py-8 font-mono text-sm text-muted-foreground">
          <p>
            Inspired by{" "}
            <a
              className="text-foreground link-underline"
              href="https://chanhdai.com"
              target="_blank"
              rel="noopener"
            >
              chanhdai.com
            </a>
            {" / "}
            <a
              className="text-foreground link-underline"
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener"
            >
              tailwindcss.com
            </a>
            {" / "}
            <a
              className="text-foreground link-underline"
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener"
            >
              ui.shadcn.com
            </a>
            {" / "}
            <a
              className="text-foreground link-underline"
              href="https://vercel.com"
              target="_blank"
              rel="noopener"
            >
              vercel.com
            </a>
          </p>

          <p>
            Built by <span className="text-foreground">{USER.displayName}</span>
            . Focused on scalable web apps, clean systems, and purposeful
            design.
          </p>

          <p>
            © 2026 {USER.displayName}. View the source on{" "}
            <a
              className="text-foreground link-underline"
              href={SOURCE_CODE_GITHUB_URL}
              target="_blank"
              rel="noopener"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        <div className="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
          <div className="mx-auto flex flex-wrap items-center justify-center gap-3 border-x border-line bg-background px-4 py-3 font-mono text-xs text-muted-foreground">
            <Link
              className="transition-[color] hover:text-foreground"
              href="/llms.txt"
              target="_blank"
            >
              llms.txt
            </Link>

            <Separator />

            <a
              className="transition-[color] hover:text-foreground"
              href={SOCIAL.resume.href}
              target="_blank"
              rel="noopener"
            >
              Resume
            </a>

            {SOCIAL.x && (
              <>
                <Separator />
                <a
                  className="transition-[color] hover:text-foreground"
                  href={SOCIAL.x.href}
                  target="_blank"
                  rel="noopener"
                >
                  X
                </a>
              </>
            )}

            <Separator />

            <a
              className="transition-[color] hover:text-foreground"
              href={SOCIAL.github.href}
              target="_blank"
              rel="noopener"
            >
              GitHub
            </a>

            <Separator />

            <a
              className="transition-[color] hover:text-foreground"
              href={SOCIAL.linkedin.href}
              target="_blank"
              rel="noopener"
            >
              LinkedIn
            </a>

            {SOCIAL.instagram && (
              <>
                <Separator />
                <a
                  className="transition-[color] hover:text-foreground"
                  href={SOCIAL.instagram.href}
                  target="_blank"
                  rel="noopener"
                >
                  Instagram
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <SiteFooterInteractiveLogotype />

      <div className="h-(--fade-bottom-height)" />
      <div className="pb-[env(safe-area-inset-bottom,0)]" />
    </footer>
  )
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("h-3 w-px bg-line", className)} {...props} />
}
