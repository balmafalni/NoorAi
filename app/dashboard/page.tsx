import { CreateReelForm } from "@/components/dashboard/create-reel-form"
import { RecentGenerations } from "@/components/dashboard/recent-generations"

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create a Reel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose your mode, set the details, and generate a full reel script.
        </p>
      </div>

      <CreateReelForm />

      <div className="mt-12">
        <RecentGenerations />
      </div>
    </div>
  )
}
