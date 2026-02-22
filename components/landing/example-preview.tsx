"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const tabData: Record<string, { label: string; content: string[] }> = {
  hooks: {
    label: "Hooks",
    content: [
      '"Did you know a single verse changed an entire empire?"',
      '"This sahabi gave up everything — and history forgot him."',
      '"3 words from the Prophet that still apply today."',
    ],
  },
  script: {
    label: "Script",
    content: [
      "0-3s: Open with a striking visual — a calligraphy close-up. Narrator delivers the hook in a low, urgent tone.",
      "3-8s: Introduce the historical context. Show a map animation of the early Islamic empire expanding.",
      "8-18s: Dive into the story. Cut between re-enactment b-roll and text overlays with key dates.",
      "18-25s: Reveal the twist or lesser-known fact. Use a dramatic pause with ambient oud music.",
      "25-30s: Close with a reflective CTA. Text overlay: 'Share this with someone who needs to hear it.'",
    ],
  },
  shotlist: {
    label: "Shot List",
    content: [
      "Shot 1: Close-up of Arabic calligraphy being written (overhead angle)",
      "Shot 2: Map animation — expansion from Medina outward",
      "Shot 3: B-roll of desert landscape at golden hour",
      "Shot 4: Text overlay with date (white on dark) with subtle parallax",
      "Shot 5: Speaker direct-to-camera for CTA (warm lighting, shallow DOF)",
    ],
  },
  caption: {
    label: "Caption",
    content: [
      "This story changed how I see patience forever.",
      "",
      "Most people skip over this part of history — but it holds one of the most powerful lessons about trust in Allah.",
      "",
      "Save this for when you need a reminder.",
      "#IslamicHistory #FaithReels #NoorAi #HistoryFacts #ContentCreator",
    ],
  },
}

export function ExamplePreview() {
  const [activeTab, setActiveTab] = useState("hooks")

  return (
    <section id="examples" className="mx-auto max-w-6xl px-4 py-20 lg:px-6 lg:py-28">
      <div className="mb-12 text-center lg:mb-16">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          See what NoorAi generates
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
          Real output from a single topic. Every tab is generated in seconds.
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">History Facts</Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">30s Reel</Badge>
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground">English</Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 w-full justify-start bg-muted">
              {Object.entries(tabData).map(([key, { label }]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(tabData).map(([key, { content }]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="space-y-3">
                  {content.map((line, i) => {
                    if (line === "") return <div key={i} className="h-2" />
                    return (
                      <div
                        key={i}
                        className={`rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-card-foreground ${
                          key === "script" ? "font-mono text-xs" : ""
                        }`}
                      >
                        {key === "hooks" ? (
                          <span className="text-primary">{line}</span>
                        ) : (
                          line
                        )}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}
