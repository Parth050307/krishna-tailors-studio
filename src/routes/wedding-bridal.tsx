import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { ServiceCard } from "@/components/site/ServiceCard";
import { Button } from "@/components/ui/button";
import { useServices } from "@/lib/queries";

export const Route = createFileRoute("/wedding-bridal")({
  head: () => ({
    meta: [
      { title: "Wedding & Bridal Tailoring — Krishna Tailor's" },
      {
        name: "description",
        content:
          "Bridal lehengas, engagement, haldi, mehendi, sangeet and reception outfits made on a guided timeline with three fitting sessions.",
      },
      { property: "og:title", content: "Wedding & Bridal Couture — Krishna Tailor's" },
      {
        property: "og:description",
        content:
          "Structured bridal blouses, coordinated family outfits and a 45-day bridal timeline.",
      },
    ],
  }),
  component: WeddingBridal,
});

const TIMELINE = [
  ["Day 1", "Consultation", "Silhouette, palette, budget and the exact wedding-day schedule."],
  ["Week 1", "Fabric curation", "Choose from our library or bring your own fabric and borders."],
  ["Week 2", "Measurements & draft", "Full bridal measurement sheet plus a muslin toile for the blouse."],
  ["Week 3-4", "Embroidery", "Hand zardosi, zari and sequin work on cut panels."],
  ["Week 5", "First & second fitting", "Bodice fit, flare drop and dupatta drape checked on you."],
  ["Week 6", "Final fitting & delivery", "Delivered two weeks before the wedding date."],
];

function WeddingBridal() {
  const { data: services } = useServices();
  const bridal = (services ?? []).filter(
    (s) => s.category === "Bridal" || s.category === "Wedding",
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Wedding & Bridal"
        title="For the days that get photographed forever"
        subtitle="Bridal, engagement, haldi, mehendi, sangeet and reception outfits — planned properly, fitted three times, delivered early."
        image="/images/hero-bridal.jpg"
      />

      <Section eyebrow="The bridal journey" title="A 45-day plan, not a rush job">
        <ol className="mx-auto max-w-3xl space-y-0">
          {TIMELINE.map(([when, title, body], i) => (
            <li key={title} className="flex gap-5 border-l border-gold/50 pb-8 pl-6 last:pb-0">
              <div className="-ml-9 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-gold bg-background text-[0.6rem] text-primary">
                {i + 1}
              </div>
              <div>
                <p className="eyebrow">{when}</p>
                <h3 className="mt-1 font-display text-xl text-primary">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <div className="border-y border-border bg-secondary/50">
        <Section
          eyebrow="Occasion wear"
          title="Every function, covered"
          subtitle="Coordinate the whole family across the wedding week in one palette."
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bridal.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </Section>
      </div>

      <Section className="text-center">
        <div className="motif-bg rounded-sm border border-gold/50 bg-card px-6 py-14">
          <h2 className="text-3xl text-primary sm:text-4xl">Booking a wedding season?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Bridal slots are limited per month. Book a consultation early and we will hold
            your timeline.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/book-measurement">Book bridal consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/custom-order">Start a bridal order</Link>
            </Button>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
