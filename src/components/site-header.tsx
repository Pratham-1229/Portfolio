import dynamic from "next/dynamic"
import Link from "next/link"

import { MAIN_NAV } from "@/config/site"
import { Separator } from "@/components/ui/separator"
import { ChanhDaiMark } from "@/components/chanhdai-mark"
import { NavDesktop } from "@/components/nav-desktop"
import { NavItemGitHub } from "@/components/nav-item-github"
import { ThemeToggle } from "@/components/theme-toggle"

const CommandMenu = dynamic(() => import("@/components/command-menu"))

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2">
      <div className="screen-line-top screen-line-bottom mx-auto flex h-(--header-height) items-center gap-2 border-x screen-line-bottom-border screen-line-top-border pr-2 pl-4 after:z-1 sm:gap-4 md:max-w-3xl">
        <Link href="/" aria-label="Home">
          <ChanhDaiMark className="h-6 shrink-0" />
        </Link>

        <div className="flex-1" />

        <NavDesktop items={MAIN_NAV} />

        <div className="flex items-center max-sm:*:data-[slot=command-menu-trigger]:hidden">
          <Separator
            orientation="vertical"
            className="mr-2 max-sm:hidden data-vertical:h-5 data-vertical:self-center"
          />
          <CommandMenu enabledHotkeys />
          <Separator
            orientation="vertical"
            className="mx-2 max-sm:hidden data-vertical:h-5 data-vertical:self-center"
          />
          <NavItemGitHub />
          <Separator
            orientation="vertical"
            className="mx-2 data-vertical:h-5 data-vertical:self-center"
          />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
