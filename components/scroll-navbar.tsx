"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "@/components/profile-menu";

export function ScrollNavbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Watchlist", href: "/scroll/watchlist" },
    { name: "Scroll", href: "/scroll" },
    { name: "Rooms", href: "/scroll/rooms" },
  ];

  return (
    <nav className="border-b-2 border-black/10 relative">
      <div className="px-6 py-4">
        <div className="flex items-center justify-center max-w-7xl mx-auto">
          {/* Centered navigation links */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-lg font-medium text-black hover:text-black/70 transition-colors pb-1 whitespace-nowrap"
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-black" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile menu - positioned absolutely to the right */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <ProfileMenu />
      </div>
    </nav>
  );
}
