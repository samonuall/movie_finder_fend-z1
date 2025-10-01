import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm">
        <Card className="border-2 border-black">
          <CardHeader>
            <CardTitle className="text-2xl text-black">Sorry, something went wrong.</CardTitle>
          </CardHeader>
          <CardContent>
            {params?.error ? (
              <p className="text-sm text-black/70">Error code: {params.error}</p>
            ) : (
              <p className="text-sm text-black/70">An unspecified error occurred.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
