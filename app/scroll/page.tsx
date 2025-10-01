import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ScrollNavbar } from "@/components/scroll-navbar"

export default async function ScrollPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollNavbar />

      {/* Main content area - blank for now */}
      <main className="max-w-7xl mx-auto px-6 py-12">{/* Content will go here */}</main>
    </div>
  )
}
