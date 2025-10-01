import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ScrollNavbar } from "@/components/scroll-navbar"

export default async function MyMoviesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollNavbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-black mb-8">My Movies</h1>
        <p className="text-black/60">Your movie collection will appear here.</p>
      </main>
    </div>
  )
}
