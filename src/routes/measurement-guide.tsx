import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GARMENT_TYPES } from "@/lib/brand";
import { useMeasurementFields } from "@/lib/queries";

export const Route = createFileRoute("/measurement-guide")({
  head: () => ({
    meta: [
      { title: "Measurement Guide — How to Measure Yourself | Krishna Tailor's" },
      {
        name: "description",
        content:
          "Step-by-step instructions for blouse, suit, kurti, gown and lehenga measurements in inches or cm, with tips to avoid the most common mistakes.",
      },
      { property: "og:title", content: "Measurement Guide — Krishna Tailor's" },
      {
        property: "og:description",
        content:
          "Garment-specific measuring instructions so your custom outfit fits the first time.",
      },
    ],
  }),
  component: MeasurementGuide,
});

const TIPS = [
  "Wear the innerwear you plan to wear with the outfit — especially the bra for blouse measurements.",
  "Keep the tape snug against the body but never tight enough to press in.",
  "Stand relaxed and breathe normally; do not hold your breath or pull your stomach in.",
  "Ask someone to help with shoulder, armhole and back measurements.",
  "Measure once, note it down, then measure again to confirm.",
  "Use one unit throughout — either inches or centimetres, never a mix.",
];

function GarmentFields({ garment }: { garment: string }) {
  const { data: fields } = useMeasurementFields(garment);
  const list = fields ?? [];
  if (!list.length) {
    return <p className="text-sm text-muted-foreground">Loading fields…</p>;
  }
  return (
    <ul className="space-y-4">
      {list.map((f) => (
        <li key={f.id}>
          <p className="font-medium text-primary">
            {f.label}
            {f.required ? (
              <span className="ml-2 text-xs text-muted-foreground">required</span>
            ) : null}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {f.instruction}
          </p>
        </li>
      ))}
    </ul>
  );
}

function MeasurementGuide() {

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Measurements"
        title="Measurement Guide"
        subtitle="Fit is 80% of a good garment. Ten careful minutes here saves a week of alterations."
        image="/images/measurement.jpg"
      />

      <Section eyebrow="Before you start" title="Six rules that prevent most fit problems">
        <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {TIPS.map((tip) => (
            <li key={tip} className="card-luxe rounded-sm p-5 text-sm text-muted-foreground">
              {tip}
            </li>
          ))}
        </ul>
      </Section>

      <div className="border-y border-border bg-secondary/50">
        <Section
          eyebrow="By garment"
          title="What we need, and how to measure it"
          subtitle="Every garment type uses its own measurement sheet. Expand the one you are ordering."
        >
          <Accordion type="single" collapsible className="mx-auto max-w-3xl">
            {GARMENT_TYPES.map((garment) => (
              <AccordionItem key={garment.value} value={garment.value}>
                <AccordionTrigger className="font-display text-lg text-primary">
                  {garment.label}
                </AccordionTrigger>
                <AccordionContent>
                  <GarmentFields garment={garment.value} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      </div>

      <Section className="text-center">
        <h2 className="text-3xl text-primary sm:text-4xl">Rather not measure yourself?</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Our measurement staff can visit your home or take measurements at the studio, free
          with any confirmed order.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/book-measurement">Book professional measurement</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/custom-order">Start custom order</Link>
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}
