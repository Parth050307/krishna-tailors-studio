import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { ServiceCard } from "@/components/site/ServiceCard";
import { Button } from "@/components/ui/button";
import { useServices } from "@/lib/queries";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Tailoring Services — Krishna Tailor's" },
      {
        name: "description",
        content:
          "24 women's tailoring services: saree and bridal blouses, suits, anarkalis, kurtis, shararas, palazzos, gowns, western dresses, wedding wear, alterations and embroidery.",
      },
      { property: "og:title", content: "Tailoring Services — Krishna Tailor's" },
      {
        property: "og:description",
        content:
          "Browse all 24 tailoring services with starting prices and stitching timelines.",
      },
    ],
  }),
  component: ServicesPage,
});

const CATEGORIES = [
  "All",
  "Blouse",
  "Ethnic",
  "Gown",
  "Western",
  "Wedding",
  "Bridal",
  "Occasion",
  "Custom",
  "Alteration",
];

function ServicesPage() {
  const [category, setCategory] = useState("All");
  const { data: services, isLoading } = useServices(category);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our craft"
        title="Tailoring Services"
        subtitle="Every service below is stitched to your own measurements, with your choice of neck, sleeve, back and finishing details."
      />
      <Section>
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground">Loading services…</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(services ?? []).map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
