import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ScrollNavbar } from "@/components/scroll-navbar";

export default async function WatchlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollNavbar />
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-black mb-4">
            Your Watchlist is Empty
          </h2>
          <p className="text-black/60">
            Movies you want to watch will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
