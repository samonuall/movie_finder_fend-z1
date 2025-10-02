import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/scroll";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      let redirectUrl = "";
      if (!isLocalEnv) {
        if (process.env.NEXT_PUBLIC_SITE_URL) {
          redirectUrl = process.env.NEXT_PUBLIC_SITE_URL;
        } else if (forwardedHost) {
          redirectUrl = `https://${forwardedHost}`;
        } else {
          return NextResponse.redirect(`${origin}/auth/error`);
        }
      } else {
        redirectUrl = origin;
      }

      return NextResponse.redirect(`${redirectUrl}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`);
}
