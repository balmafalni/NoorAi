"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveResult } from "@/lib/nooraiStorage"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sparkles, BookOpen, Landmark } from "lucide-react"

type ModeUI = "faith" | "history"
type ModeAPI = "faith_advice" | "history_facts"
type Goal = "saves" | "shares" | "comments" | "follows"
type Language = "arabic" | "english" | "bilingual"
type Tone = "calm" | "emotional" | "intense"

export function CreateReelForm() {
  const router = useRouter()

  // UI mode tabs (faith/history)
  const [mode, setMode] = useState<ModeUI>("faith")

  // Form state (now actually connected)
  const [topic, setTopic] = useState("")
  const [lengthSeconds, setLengthSeconds] = useState<30 | 45 | 60>(30)
  const [goal, setGoal] = useState<Goal>("saves")
  const [language, setLanguage] = useState<Language>("english")
  const [tone, setTone] = useState<Tone>("calm")
  const [referenceText, setReferenceText] = useState("")
  const [sourceNotes, setSourceNotes] = useState("")

  // UX state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function modeToApi(m: ModeUI): ModeAPI {
    return m === "faith" ? "faith_advice" : "history_facts"
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const cleanTopic = topic.trim()
    if (!cleanTopic) {
      setError("Topic is required.")
      return
    }

    const payload = {
      mode: modeToApi(mode),
      topic: cleanTopic,
      lengthSeconds,
      goal,
      language,
      tone,
      referenceText: mode === "faith" ? referenceText : "",
      sourceNotes: mode === "history" ? sourceNotes : "",
    }

    setLoading(true)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        setError(json?.error || `Generation failed (${res.status}).`)
        return
      }

      const data = json?.data
      if (!data) {
        setError("No data returned from server.")
        return
      }

      // ✅ create id, save, then navigate
      const id = Date.now().toString()
      saveResult(id, data)
      router.push(`/dashboard/results/${id}`)
    } catch (err: any) {
      setError(err?.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleGenerate}>
      {/* Mode Tabs */}
      <Tabs
        value={mode}
        onValueChange={(v) => {
          setMode(v as ModeUI)
          setError(null)
        }}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2 bg-muted">
          <TabsTrigger
            value="faith"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Faith / Advice</span>
            <span className="sm:hidden">Faith</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            <Landmark className="h-4 w-4" />
            <span className="hidden sm:inline">History Facts</span>
            <span className="sm:hidden">History</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-card-foreground">
            Reel Details
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* Topic */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="topic" className="text-card-foreground">
              Topic
            </Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                mode === "faith"
                  ? "e.g. The power of patience in Islam, dealing with hardship..."
                  : "e.g. The fall of Al-Andalus, the House of Wisdom in Baghdad..."
              }
              className="min-h-24 resize-none border-input bg-background text-foreground placeholder:text-muted-foreground"
              disabled={loading}
            />
          </div>

          {/* Length & Goal */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-card-foreground">Length</Label>
              <RadioGroup
                value={String(lengthSeconds)}
                onValueChange={(v) => setLengthSeconds(Number(v) as 30 | 45 | 60)}
                className="flex gap-3"
                disabled={loading}
              >
                {["30", "45", "60"].map((val) => (
                  <div key={val} className="flex items-center gap-2">
                    <RadioGroupItem value={val} id={`length-${val}`} />
                    <Label
                      htmlFor={`length-${val}`}
                      className="text-sm text-card-foreground cursor-pointer"
                    >
                      {val}s
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="goal" className="text-card-foreground">
                Goal
              </Label>
              <Select
                value={goal}
                onValueChange={(v) => setGoal(v as Goal)}
                disabled={loading}
              >
                <SelectTrigger
                  id="goal"
                  className="border-input bg-background text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saves">Saves</SelectItem>
                  <SelectItem value="shares">Shares</SelectItem>
                  <SelectItem value="comments">Comments</SelectItem>
                  <SelectItem value="follows">Follows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Language & Tone */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="language" className="text-card-foreground">
                Language
              </Label>
              <Select
                value={language}
                onValueChange={(v) => setLanguage(v as Language)}
                disabled={loading}
              >
                <SelectTrigger
                  id="language"
                  className="border-input bg-background text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="bilingual">Bilingual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tone" className="text-card-foreground">
                Tone
              </Label>
              <Select
                value={tone}
                onValueChange={(v) => setTone(v as Tone)}
                disabled={loading}
              >
                <SelectTrigger
                  id="tone"
                  className="border-input bg-background text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="emotional">Emotional</SelectItem>
                  <SelectItem value="intense">Intense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mode-specific optional fields */}
          {mode === "faith" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="reference" className="text-card-foreground">
                Reference Text{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="reference"
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
                placeholder="Paste a Quran verse, Hadith, or scholar quote you want to build the reel around..."
                className="min-h-20 resize-none border-input bg-background text-foreground placeholder:text-muted-foreground"
                disabled={loading}
              />
            </div>
          )}

          {mode === "history" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="source" className="text-card-foreground">
                Source Notes{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="source"
                value={sourceNotes}
                onChange={(e) => setSourceNotes(e.target.value)}
                placeholder="Add any specific dates, names, or sources you want included..."
                className="min-h-20 resize-none border-input bg-background text-foreground placeholder:text-muted-foreground"
                disabled={loading}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}