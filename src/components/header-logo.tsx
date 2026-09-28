"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ChanhDaiMark } from "@/components/chanhdai-mark"

export function HeaderLogo() {
  const pathname = usePathname()

  return (
    <Link
      href="/"
      aria-label="Home"
      onClick={(e) => {
        if (pathname === "/") {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      }}
    >
      <ChanhDaiMark className="h-6 shrink-0" />
    </Link>
  )
}
