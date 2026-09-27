"use client"

import React, { useCallback, useState } from "react"
import { useRouter } from "@bprogress/next/app"
import {
  AwardIcon,
  BoxIcon,
  BriefcaseBusinessIcon,
  DownloadIcon,
  FileTextIcon,
  GraduationCapIcon,
  LayersIcon,
  MoonStarIcon,
  SunMediumIcon,
  TextInitialIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"

import { useClickSound } from "@/hooks/soundcn/use-click-sound"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons"
import { SOCIAL_LINKS } from "@/features/portfolio/data/social-links"

import { SearchIcon } from "./icons"
import { Button } from "./ui/button"
import { Kbd, KbdGroup } from "./ui/kbd"

type CommandLinkItem = {
  title: string
  href: string
  icon?: React.ReactElement
  shortcut?: string
  keywords?: string[]
  openInNewTab?: boolean
}

const PORTFOLIO_LINKS: CommandLinkItem[] = [
  {
    title: "Hello",
    href: "/#hello",
    icon: <TextInitialIcon />,
  },
  {
    title: "Stack",
    href: "/#stack",
    icon: <LayersIcon />,
  },
  {
    title: "Leadership & Volunteering",
    href: "/#experience",
    icon: <BriefcaseBusinessIcon />,
  },
  {
    title: "Education",
    href: "/#education",
    icon: <GraduationCapIcon />,
  },
  {
    title: "Projects",
    href: "/#projects",
    icon: <BoxIcon />,
  },
  {
    title: "Recognition",
    href: "/#recognition",
    icon: <AwardIcon />,
  },
]

const OTHER_LINK_ITEMS: CommandLinkItem[] = [
  {
    title: "Download vCard",
    href: "/vcard",
    icon: <DownloadIcon />,
  },
  {
    title: "llms.txt",
    href: "/llms.txt",
    icon: <FileTextIcon />,
    openInNewTab: true,
  },
]

export function CommandMenu({
  enabledHotkeys = false,
}: {
  enabledHotkeys?: boolean
}) {
  const router = useRouter()
  const { setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [click] = useClickSound()

  useHotkeys(
    "mod+k, slash",
    (e) => {
      e.preventDefault()
      setOpen((open) => !open)
    },
    { enabled: enabledHotkeys }
  )

  const handleOpenLink = useCallback(
    (href: string, openInNewTab = false) => {
      setOpen(false)
      if (openInNewTab) {
        window.open(href, "_blank", "noopener")
      } else {
        router.push(href)
      }
    },
    [router]
  )


  const createThemeHandler = useCallback(
    (theme: "light" | "dark") => () => {
      setOpen(false)
      setTheme(theme)
      click()
    },
    [click, setTheme]
  )

  return (
    <>
      <CommandMenuTrigger onClick={() => setOpen(true)} />

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Sections">
            {PORTFOLIO_LINKS.map((link) => (
              <CommandItem
                key={link.href}
                onSelect={() => handleOpenLink(link.href, link.openInNewTab)}
              >
                {link.icon}
                <span>{link.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Social">
            {SOCIAL_LINKS.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => handleOpenLink(item.href, true)}
              >
                {SOCIAL_ICONS[item.name]}
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Theme">
            <CommandItem onSelect={createThemeHandler("light")}>
              <SunMediumIcon />
              <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={createThemeHandler("dark")}>
              <MoonStarIcon />
              <span>Dark</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Other">
            {OTHER_LINK_ITEMS.map((link) => (
              <CommandItem
                key={link.href}
                onSelect={() => handleOpenLink(link.href, link.openInNewTab)}
              >
                {link.icon}
                <span>{link.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default CommandMenu

function CommandMenuTrigger({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="command-menu-trigger"
      className="gap-1.5 border-none px-1.5 text-muted-foreground will-change-[scale] select-none"
      variant="ghost"
      size="sm"
      {...props}
    >
      <SearchIcon className="size-4" />
      <span className="font-sans text-xs/4 font-medium text-foreground sm:inline-block">
        Search
      </span>
      <KbdGroup className="hidden gap-0.75 sm:flex">
        <Kbd className="w-5 min-w-auto">⌘</Kbd>
        <Kbd className="w-5 min-w-auto">K</Kbd>
      </KbdGroup>
    </Button>
  )
}
