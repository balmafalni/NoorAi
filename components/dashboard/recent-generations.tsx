import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Landmark } from "lucide-react"

const recentItems = [
  {
    id: 1,
    title: "The Power of Patience in Islam",
    mode: "faith" as const,
    date: "Feb 20, 2026",
    length: "30s",
    language: "English",
  },
  {
    id: 2,
    title: "Fall of Al-Andalus",
    mode: "history" as const,
    date: "Feb 19, 2026",
    length: "45s",
    language: "Bilingual",
  },
  {
    id: 3,
    title: "5 Habits from the Sunnah",
    mode: "faith" as const,
    date: "Feb 18, 2026",
    length: "60s",
    language: "Arabic",
  },
  {
    id: 4,
    title: "The House of Wisdom in Baghdad",
    mode: "history" as const,
    date: "Feb 17, 2026",
    length: "30s",
    language: "English",
  },
]

export function RecentGenerations() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Generations</h2>
      <div className="flex flex-col gap-3">
        {recentItems.map((item) => (
          <Card key={item.id} className="border-border bg-card transition-colors hover:bg-accent/30">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                {item.mode === "faith" ? (
                  <BookOpen className="h-4 w-4 text-primary" />
                ) : (
                  <Landmark className="h-4 w-4 text-primary" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-card-foreground">{item.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] bg-secondary text-secondary-foreground">
                    {item.mode === "faith" ? "Faith" : "History"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.length}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
              </div>

              <Link href="/dashboard/results">
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground">
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">Open result</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
