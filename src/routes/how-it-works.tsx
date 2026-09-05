import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ORDER_FLOW, STATUS_LABEL } from "@/lib/brand";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Krishna Tailor's Custom Order Process" },
      {
        name: "description",
        content:
          "From garment selection and fabric to measurements, mock payment, stitching and delivery — see exactly how a Krishna Tailor's order works.",
      },
      { property: "og:title", content: "How Custom Tailoring Works — Krishna Tailor's" },
      {
        property: "og:description",
        content:
          "Eleven tracked stages from Order Placed to Delivered, with a live timeline in your dashboard.",
      },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  ["Choose your garment", "Pick from 24 services and tell us the occasion — everyday, festive, mehendi or bridal."],
  ["Design your details", "Neckline, sleeve, back design and finishing choices, with reference images you upload."],
  ["Pick the fabric", "Choose from our curated fabric library, or tell us you are bringing your own."],
  ["Add customization", "Padding, lining, hooks, zipper, lace, border, embroidery, sequins, buttons and tassels."],
  ["Give measurements", "Enter them yourself, follow our guided instructions, or book a professional measurement."],
  ["Delivery or pickup", "Choose home delivery to a saved address, or collection from the Surat studio."],
  ["Review & pay", "A full INR breakdown with taxes, discount code and delivery charge before you confirm."],
  ["We craft it", "Cutting, stitching, finishing and quality check — each stage updates your timeline."],
  ["Delivered", "Plus one free alteration within 10 days if anything needs adjusting."],
];

function HowItWorks() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="The process"
        title="How It Works"
        subtitle="No guesswork, no vague promises. Here is exactly what happens after you place an order."
      />

      <Section>
        <ol className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="card-luxe rounded-sm p-6">
              <p className="font-display text-3xl text-gold">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-xl text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <div className="border-y border-border bg-secondary/50">
        <Section
          eyebrow="Order tracking"
          title="Eleven stages, all visible to you"
          subtitle="Your dashboard shows a live timeline for every order, updated by studio staff as work progresses."
        >
          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
            {ORDER_FLOW.map((status, i) => (
              <span
                key={status}
                className="rounded-sm border border-gold/50 bg-card px-3 py-2 text-xs text-primary"
              >
                {String(i + 1).padStart(2, "0")} · {STATUS_LABEL[status]}
              </span>
            ))}
          </div>
        </Section>
      </div>

      <Section className="text-center">
        <h2 className="text-3xl text-primary sm:text-4xl">Ready to begin?</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/custom-order">Start Custom Order</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/measurement-guide">Read measurement guide</Link>
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}
