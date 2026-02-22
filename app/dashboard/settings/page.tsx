import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-card-foreground">Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-card-foreground">Display Name</Label>
              <Input
                id="name"
                defaultValue="Ahmed"
                className="border-input bg-background text-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-card-foreground">Email</Label>
              <Input
                id="email"
                defaultValue="ahmed@example.com"
                className="border-input bg-background text-foreground"
              />
            </div>
            <Button
              size="sm"
              className="w-fit bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Plan */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-card-foreground">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-card-foreground">Creator Plan</span>
                  <Badge className="bg-primary/10 text-primary border-0 text-[10px]">Active</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">60 generations / month. Renews Mar 1, 2026.</p>
              </div>
              <Button size="sm" variant="outline" className="border-border text-foreground">
                Manage
              </Button>
            </div>

            <Separator className="my-4 bg-border" />

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-card-foreground">Usage this month</span>
                <p className="mt-1 text-xs text-muted-foreground">42 of 60 generations used</p>
              </div>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[70%] rounded-full bg-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30 bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Once you delete your account, there is no going back.
            </p>
            <Button size="sm" variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
