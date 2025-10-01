import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ScrollNavbar } from "@/components/scroll-navbar"
import { VideoCard } from "@/components/infinite-scroll/video-card"
import { Video } from "lucide-react"

export default async function ScrollPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollNavbar />

      <VideoCard videoId={"hello"}/>
      <main className="max-w-7xl mx-auto px-6 py-12">{/* Content will go here */}</main>
    </div>
  )
}
