"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ProfileMenu } from "@/components/profile-menu"

export function ScrollNavbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "My Movies", href: "/scroll/my-movies" },
    { name: "Scroll", href: "/scroll" },
    { name: "Rooms", href: "/scroll/rooms" },
  ]

  return (
    <nav className="border-b-2 border-black/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Spacer for balance */}
          <div className="w-10" />

          {/* Centered navigation links */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-lg font-medium text-black hover:text-black/70 transition-colors pb-1"
                >
                  {item.name}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-black" />}
                </Link>
              )
            })}
          </div>

          {/* Profile menu on the right */}
          <ProfileMenu />
        </div>
      </div>
    </nav>
  )
}
