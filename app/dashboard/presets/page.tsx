"use client"

import { useState, useRef, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Trash2,
  Save,
  X,
  Sliders,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Preset {
  id: string
  name: string
  doWords: string[]
  dontWords: string[]
  tone: number
  dialect: string
  bilingualStyle: string
  ctaStyle: string
}

const defaultPresets: Preset[] = [
  {
    id: "1",
    name: "Calm Wisdom",
    doWords: ["SubhanAllah", "reflect", "patience", "beautiful"],
    dontWords: ["clickbait", "shocking", "you won't believe"],
    tone: 25,
    dialect: "msa",
    bilingualStyle: "arabic-first",
    ctaStyle: "soft",
  },
  {
    id: "2",
    name: "History Storyteller",
    doWords: ["discover", "untold", "legacy", "civilisation"],
    dontWords: ["boring", "whatever", "random"],
    tone: 60,
    dialect: "neutral",
    bilingualStyle: "english-first",
    ctaStyle: "question",
  },
  {
    id: "3",
    name: "Emotional Impact",
    doWords: ["heart", "tears", "powerful", "unforgettable"],
    dontWords: ["cringe", "lol", "bruh"],
    tone: 85,
    dialect: "levantine",
    bilingualStyle: "mixed",
    ctaStyle: "direct",
  },
]

function ChipInput({
  label,
  chips,
  onChange,
  placeholder,
  variant = "default",
}: {
  label: string
  chips: string[]
  onChange: (chips: string[]) => void
  placeholder: string
  variant?: "default" | "destructive"
}) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function addChip() {
    const trimmed = input.trim()
    if (trimmed && !chips.includes(trimmed)) {
      onChange([...chips, trimmed])
    }
    setInput("")
  }

  function removeChip(chip: string) {
    onChange(chips.filter((c) => c !== chip))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      addChip()
    }
    if (e.key === "Backspace" && input === "" && chips.length > 0) {
      onChange(chips.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-card-foreground">{label}</Label>
      <div
        className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {chips.map((chip) => (
          <Badge
            key={chip}
            variant="secondary"
            className={cn(
              "gap-1 pr-1 text-xs",
              variant === "destructive"
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            )}
          >
            {chip}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeChip(chip)
              }}
              className="ml-0.5 rounded-sm p-0.5 hover:bg-foreground/10"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {chip}</span>
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addChip}
          placeholder={chips.length === 0 ? placeholder : ""}
          className="min-w-20 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}

const toneLabels = ["Calm", "Balanced", "Emotional", "Intense"]

function toneLabel(value: number) {
  if (value <= 25) return toneLabels[0]
  if (value <= 50) return toneLabels[1]
  if (value <= 75) return toneLabels[2]
  return toneLabels[3]
}

export default function PresetsPage() {
  const [presets, setPresets] = useState<Preset[]>(defaultPresets)
  const [selectedId, setSelectedId] = useState<string>(defaultPresets[0].id)

  const selected = presets.find((p) => p.id === selectedId) || presets[0]

  function updateSelected(updates: Partial<Preset>) {
    setPresets((prev) =>
      prev.map((p) => (p.id === selectedId ? { ...p, ...updates } : p))
    )
  }

  function addPreset() {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name: "New Preset",
      doWords: [],
      dontWords: [],
      tone: 50,
      dialect: "msa",
      bilingualStyle: "arabic-first",
      ctaStyle: "soft",
    }
    setPresets((prev) => [...prev, newPreset])
    setSelectedId(newPreset.id)
  }

  function deletePreset(id: string) {
    if (presets.length <= 1) return
    const remaining = presets.filter((p) => p.id !== id)
    setPresets(remaining)
    if (selectedId === id) {
      setSelectedId(remaining[0].id)
    }
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Preset List - Sidebar */}
      <div className="w-full shrink-0 border-b border-border bg-card p-4 lg:w-72 lg:border-b-0 lg:border-r lg:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground">Presets</h2>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 border-border text-foreground"
            onClick={addPreset}
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>

        {/* Horizontal scroll on mobile, vertical on desktop */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedId(preset.id)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors lg:w-full",
                preset.id === selectedId
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Sliders className="h-4 w-4 shrink-0" />
              <span className="truncate">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Edit Preset</h1>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-border text-destructive hover:bg-destructive/10"
                onClick={() => deletePreset(selected.id)}
                disabled={presets.length <= 1}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
              <Button
                size="sm"
                className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </div>
          </div>

          <Card className="border-border bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-card-foreground">Brand Voice</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <Label className="text-card-foreground">Preset Name</Label>
                <Input
                  value={selected.name}
                  onChange={(e) => updateSelected({ name: e.target.value })}
                  className="border-input bg-background text-foreground"
                />
              </div>

              <Separator className="bg-border" />

              {/* Do Words */}
              <ChipInput
                label="Do Words"
                chips={selected.doWords}
                onChange={(doWords) => updateSelected({ doWords })}
                placeholder="Type a word and press Enter..."
                variant="default"
              />

              {/* Don't Words */}
              <ChipInput
                label="Don't Words"
                chips={selected.dontWords}
                onChange={(dontWords) => updateSelected({ dontWords })}
                placeholder="Type a word and press Enter..."
                variant="destructive"
              />

              <Separator className="bg-border" />

              {/* Tone Slider */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-card-foreground">Tone</Label>
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                    {toneLabel(selected.tone)}
                  </Badge>
                </div>
                <Slider
                  value={[selected.tone]}
                  onValueChange={([v]) => updateSelected({ tone: v })}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Calm</span>
                  <span>Intense</span>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Dialect */}
              <div className="flex flex-col gap-2">
                <Label className="text-card-foreground">Dialect Preference</Label>
                <Select
                  value={selected.dialect}
                  onValueChange={(v) => updateSelected({ dialect: v })}
                >
                  <SelectTrigger className="border-input bg-background text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="msa">MSA (Modern Standard Arabic)</SelectItem>
                    <SelectItem value="levantine">Levantine</SelectItem>
                    <SelectItem value="gulf">Gulf</SelectItem>
                    <SelectItem value="egyptian">Egyptian</SelectItem>
                    <SelectItem value="neutral">Neutral Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bilingual Style */}
              <div className="flex flex-col gap-2">
                <Label className="text-card-foreground">Bilingual Style</Label>
                <RadioGroup
                  value={selected.bilingualStyle}
                  onValueChange={(v) => updateSelected({ bilingualStyle: v })}
                  className="flex flex-col gap-2 sm:flex-row sm:gap-4"
                >
                  {[
                    { value: "arabic-first", label: "Arabic first" },
                    { value: "english-first", label: "English first" },
                    { value: "mixed", label: "Mixed" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={`bi-${opt.value}`} />
                      <Label htmlFor={`bi-${opt.value}`} className="text-sm text-card-foreground cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* CTA Style */}
              <div className="flex flex-col gap-2">
                <Label className="text-card-foreground">CTA Style</Label>
                <RadioGroup
                  value={selected.ctaStyle}
                  onValueChange={(v) => updateSelected({ ctaStyle: v })}
                  className="flex flex-col gap-2 sm:flex-row sm:gap-4"
                >
                  {[
                    { value: "soft", label: "Soft" },
                    { value: "direct", label: "Direct" },
                    { value: "question", label: "Question" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={`cta-${opt.value}`} />
                      <Label htmlFor={`cta-${opt.value}`} className="text-sm text-card-foreground cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
