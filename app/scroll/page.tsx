import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ScrollNavbar } from "@/components/scroll-navbar";
import { ScrollFeed } from "@/components/infinite-scroll/scroll-feed";

export default async function ScrollPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <ScrollNavbar />

      <main className="flex-1 overflow-hidden">
        <ScrollFeed />
      </main>
    </div>
  );
}
