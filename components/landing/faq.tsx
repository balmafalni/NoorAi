import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How accurate is the generated content?",
    answer:
      "NoorAi uses curated Islamic knowledge bases and verified historical sources. For Faith/Advice content, all Quran and Hadith references are cross-checked with authenticated collections. For History Facts, each claim is tagged with a certainty badge (Confirmed, Disputed, or Legend) so you always know the reliability level.",
  },
  {
    question: "Are references and sources included?",
    answer:
      "Yes. Every generation includes a verification note with source references. Faith/Advice reels cite specific Quran verses and Hadith collections. History Facts reels include source notes with links to scholarly references when available.",
  },
  {
    question: "Does NoorAi support bilingual content?",
    answer:
      "Absolutely. You can generate content in Arabic, English, or bilingual mode. In bilingual mode, you can choose Arabic-first or English-first ordering, and even mix languages naturally within the script. We support MSA, Levantine, Gulf, and Egyptian Arabic dialects.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer a 7-day free trial on all plans. If you're not satisfied within the first 14 days of a paid subscription, contact us for a full refund. No questions asked.",
  },
]

export function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 lg:px-6 lg:py-28">
      <div className="mb-12 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
          Everything you need to know about NoorAi.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="text-left text-foreground hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
