import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Studio — Krishna Tailor's" },
      {
        name: "description",
        content:
          "Krishna Tailor's has been drafting women's couture garments in Surat since 2009 — master cutters, in-house handwork and a measurement-first philosophy.",
      },
      { property: "og:title", content: "About Krishna Tailor's" },
      {
        property: "og:description",
        content:
          "A women-led couture tailoring studio in Surat, crafting blouses, lehengas, gowns and bridal wear since 2009.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our story"
        title="A studio built around one obsession: fit"
        subtitle={`${BRAND.name} began in 2009 as a single-machine workroom in Surat. Today it is a full couture studio — and the obsession has not changed.`}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <img
            src="/images/atelier-embroidery.jpg"
            alt="Hand embroidery in the Krishna Tailor's workroom"
            loading="lazy"
            width={1200}
            height={900}
            className="w-full rounded-sm object-cover shadow-soft"
          />
          <div className="space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              Krishna bhai learned cutting from his father, who stitched for a Surat mill
              town where nothing came ready-made. He opened the studio in 2009 with one
              rule: a garment leaves only when it sits correctly on the person it was made
              for.
            </p>
            <p>
              That rule is why we build a separate measurement sheet for every garment
              type, why we insist on a trial fitting for bridal pieces, and why one free
              alteration is included with every order rather than sold as an extra.
            </p>
            <p>
              Today the studio runs with master cutters, in-house embroidery artisans,
              quality-check staff and a measurement team that travels across Surat,
              Ahmedabad, Vadodara and Mumbai. Our clients are brides, mothers, working
              women, and daughters ordering their first blouse.
            </p>
            <p>
              We are deliberately not a fast-fashion label. We take fewer orders, plan
              longer timelines for bridal work, and would rather tell you a date honestly
              than promise a week and disappoint you.
            </p>
          </div>
        </div>
      </Section>

      <div className="border-y border-border bg-secondary/50">
        <Section eyebrow="What we stand for" title="Four commitments">
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              [
                "Honest timelines",
                "You get the real delivery date before you pay, and a live timeline afterwards.",
              ],
              [
                "Private by default",
                "Your measurements, addresses and reference photos are visible only to you and the staff working on your order.",
              ],
              [
                "In-house handwork",
                "Embroidery and finishing happen in our workroom, never subcontracted to unknown units.",
              ],
              [
                "Comfort matters",
                "Heavy bridal work is engineered with structure and lining so you can actually wear it all day.",
              ],
            ].map(([title, body]) => (
              <div key={title} className="card-luxe rounded-sm p-6">
                <h3 className="font-display text-xl text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </SiteLayout>
  );
}
