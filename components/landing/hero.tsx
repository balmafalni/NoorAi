import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/0.08,transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 lg:px-6 lg:pb-32 lg:pt-36">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>AI-powered reel scripts in seconds</span>
          </div>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Turn your ideas into
            <span className="text-primary"> viral reels</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Generate complete reel scripts with hooks, shot lists, captions, and
            CTAs. Built for creators who share faith, advice, and history.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90">
                Generate a Reel
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#examples">
              <Button size="lg" variant="outline" className="px-8 border-border text-foreground hover:bg-accent">
                See Examples
              </Button>
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16">
            {[
              { value: "10k+", label: "Reels generated" },
              { value: "85%", label: "Avg. save rate" },
              { value: "2 min", label: "Avg. generation" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
