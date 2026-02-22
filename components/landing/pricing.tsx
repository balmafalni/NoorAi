import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const tiers = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "For creators just getting started with reel content.",
    features: [
      "15 reel generations / month",
      "Both content modes",
      "3 hook variations",
      "English output",
      "Basic shot list",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Creator",
    price: "$19",
    period: "/month",
    description: "For active creators who post multiple times a week.",
    features: [
      "60 reel generations / month",
      "Bilingual output (AR/EN)",
      "5 hook variations",
      "Advanced shot list with b-roll",
      "Brand voice presets",
      "Priority generation",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Studio",
    price: "$39",
    period: "/month",
    description: "For teams and agencies managing multiple creators.",
    features: [
      "Unlimited generations",
      "All languages & dialects",
      "10 hook variations",
      "Full verification notes",
      "Unlimited presets",
      "API access",
      "Team collaboration",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 lg:px-6 lg:py-28">
      <div className="mb-12 text-center lg:mb-16">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
          Start free. Upgrade when you need more power.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative border-border bg-card ${
              tier.popular ? "ring-2 ring-primary" : ""
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-card-foreground">{tier.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 flex flex-col gap-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-card-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button
                  className={`w-full ${
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
