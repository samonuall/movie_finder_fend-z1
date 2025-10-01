import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function WatchlistPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/scroll" className="text-black hover:text-black/70 transition-colors">
            ← Back
          </Link>
          <h1 className="text-xl font-semibold text-black">Watchlist</h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-black mb-4">Your Watchlist is Empty</h2>
          <p className="text-black/60">Movies you want to watch will appear here</p>
        </div>
      </div>
    </div>
  )
}
