import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { ModeCards } from "@/components/landing/mode-cards"
import { ExamplePreview } from "@/components/landing/example-preview"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ModeCards />
        <ExamplePreview />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
