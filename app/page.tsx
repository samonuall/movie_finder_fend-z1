import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight">
              Movie Finder
            </h1>
            <p className="text-xl text-black/70 leading-relaxed">
              Discover and explore movies with ease. Sign up to get started!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <Button
              asChild
              size="lg"
              className="bg-black text-white hover:bg-black/90 text-lg px-8 py-6 h-14"
            >
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-black text-black hover:bg-black hover:text-white text-lg px-8 py-6 bg-transparent h-14"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="flex items-center justify-center">
          <div className="w-full aspect-square max-w-lg">
            <img
              src="/modern-minimalistic-abstract-illustration.jpg"
              alt="Platform illustration"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
