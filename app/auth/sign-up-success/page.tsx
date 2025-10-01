import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm">
        <Card className="border-2 border-black">
          <CardHeader>
            <CardTitle className="text-2xl text-black">
              Thank you for signing up!
            </CardTitle>
            <CardDescription className="text-black/70">
              Check your email to confirm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black/70">
              You&apos;ve successfully signed up. Please check your email to
              confirm your account before signing in.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
