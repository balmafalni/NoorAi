import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Landmark, Check } from "lucide-react"

const modes = [
  {
    title: "Faith / Advice",
    description: "Generate inspiring reels rooted in Islamic wisdom and practical life advice.",
    icon: BookOpen,
    benefits: [
      "Quran & Hadith referenced content",
      "Scholar-verified guidance",
      "Bilingual Arabic / English output",
      "Emotional hooks that drive saves",
      "Optional reference text input",
    ],
  },
  {
    title: "History Facts",
    description: "Create captivating reels about Islamic and world history with verified sources.",
    icon: Landmark,
    benefits: [
      "Source-cited historical facts",
      "Certainty badges (Confirmed / Legend)",
      "Timeline-style shot breakdowns",
      "Engagement-optimized hooks",
      "Optional source notes input",
    ],
  },
]

export function ModeCards() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 lg:px-6 lg:py-28">
      <div className="mb-12 text-center lg:mb-16">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Two modes. One powerful engine.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
          Choose your content type and let NoorAi craft every element of your reel.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {modes.map((mode) => (
          <Card
            key={mode.title}
            className="border-border bg-card transition-shadow hover:shadow-lg"
          >
            <CardHeader className="pb-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <mode.icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl text-card-foreground">{mode.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{mode.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-3">
                {mode.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm text-card-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
