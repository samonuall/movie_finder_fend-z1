"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Profile Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition-colors"
        aria-label="Profile menu"
      >
        <User className="w-5 h-5 text-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black/10 shadow-lg z-[9999]">
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/scroll/preferences");
              }}
              className="w-full px-4 py-2.5 text-left text-black hover:bg-black/5 transition-colors"
            >
              Movie Preference
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/scroll/settings");
              }}
              className="w-full px-4 py-2.5 text-left text-black hover:bg-black/5 transition-colors"
            >
              Settings
            </button>
            <div className="border-t border-black/10 my-1" />
            <div className="px-4 py-2.5">
              <div className="text-sm font-medium text-black mb-1">About</div>
              <div className="text-xs text-black/60 leading-relaxed">
                Movie data provided by{" "}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  TMDB
                </a>
                . Streaming provider information from{" "}
                <a
                  href="https://www.justwatch.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  JustWatch
                </a>
                .
              </div>
            </div>
            <div className="border-t border-black/10 my-1" />
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-black/5 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
