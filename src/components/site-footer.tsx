import { SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { cn } from "@/lib/utils"
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

export function SiteFooter() {
  const githubLink = SOCIAL.github
  const linkedinLink = SOCIAL.linkedin

  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line md:max-w-3xl">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-12" />
        </div>

        <dl className="flex flex-col gap-4 py-8 font-mono [&_dd]:text-sm [&_dt]:text-right [&_dt]:text-sm [&_dt]:text-muted-foreground">
          <Item>
            <dt>Built by</dt>
            <dd>{USER.displayName}</dd>
          </Item>

          <Item>
            <dt>Source code</dt>
            <dd>
              <a
                className="link-underline"
                href={SOURCE_CODE_GITHUB_URL}
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
            </dd>
          </Item>

          <Item>
            <dt>Based on</dt>
            <dd>
              <a
                className="link-underline"
                href="https://github.com/ncdai/chanhdai.com"
                target="_blank"
                rel="noopener"
              >
                chanhdai.com
              </a>
            </dd>
          </Item>
        </dl>

        <div className="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
          <div className="mx-auto flex items-center justify-center gap-3 border-x border-line bg-background px-4">
            {SOCIAL.x && (
              <>
                <a
                  className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
                  href={SOCIAL.x.href}
                  target="_blank"
                  rel="noopener"
                  aria-label="X Profile"
                >
                  <XIcon className="size-4" />
                </a>
                <Separator />
              </>
            )}

            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={githubLink.href}
              target="_blank"
              rel="noopener"
              aria-label="GitHub Profile"
            >
              <GitHubIcon className="size-4" />
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={linkedinLink.href}
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn Profile"
            >
              <LinkedInIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="h-(--fade-bottom-height)" />
      <div className="pb-[env(safe-area-inset-bottom,0)]" />
    </footer>
  )
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex h-11 w-px bg-line", className)} {...props} />
}

function Item({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-2 gap-4", className)} {...props} />
}
