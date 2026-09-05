import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, IndianRupee, Ruler, Sparkles } from "lucide-react";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/site/ServiceCard";
import { useService, useServices } from "@/lib/queries";
import { inr } from "@/lib/format";
import { CUSTOMIZATION_ADDONS, NECK_DESIGNS, SLEEVE_DESIGNS, BACK_DESIGNS } from "@/lib/brand";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${name} — Krishna Tailor's` },
        {
          name: "description",
          content: `${name} stitched to your measurements at Krishna Tailor's, with design, fabric and customization options plus live order tracking.`,
        },
        { property: "og:title", content: `${name} — Krishna Tailor's` },
        {
          property: "og:description",
          content: `Custom ${name.toLowerCase()} tailoring with guided measurements and transparent INR pricing.`,
        },
      ],
    };
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data: service, isLoading } = useService(slug);
  const { data: all } = useServices();

  if (isLoading) {
    return (
      <SiteLayout>
        <Section>
          <p className="text-center text-sm text-muted-foreground">Loading…</p>
        </Section>
      </SiteLayout>
    );
  }

  if (!service) {
    return (
      <SiteLayout>
        <Section title="Service not found" subtitle="This service may have been renamed.">
          <div className="text-center">
            <Button asChild>
              <Link to="/services">Back to all services</Link>
            </Button>
          </div>
        </Section>
      </SiteLayout>
    );
  }

  const related = (all ?? [])
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3);

  return (
    <SiteLayout>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-sm border border-border bg-muted">
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={service.name}
                className="aspect-4/5 w-full object-cover"
              />
            ) : null}
          </div>
          <div>
            <p className="eyebrow">{service.category}</p>
            <h1 className="mt-3 text-4xl text-primary sm:text-5xl">{service.name}</h1>
            <div className="gold-rule mt-6 max-w-32" aria-hidden />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {service.long_description}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4">
              <div className="card-luxe rounded-sm p-4">
                <dt className="flex items-center gap-1.5 text-xs tracking-wide text-muted-foreground uppercase">
                  <IndianRupee className="size-3.5" /> Starting at
                </dt>
                <dd className="mt-1 font-display text-2xl text-primary">
                  {inr(service.base_price)}
                </dd>
              </div>
              <div className="card-luxe rounded-sm p-4">
                <dt className="flex items-center gap-1.5 text-xs tracking-wide text-muted-foreground uppercase">
                  <Clock className="size-3.5" /> Stitching time
                </dt>
                <dd className="mt-1 font-display text-2xl text-primary">
                  {service.stitching_days} days
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/custom-order" search={{ service: service.slug }}>
                  Order this service
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/book-measurement">Book measurement</Link>
              </Button>
            </div>

            <div className="mt-10 space-y-6">
              <div>
                <p className="flex items-center gap-2 font-display text-lg text-primary">
                  <Ruler className="size-4" /> Design choices
                </p>
                <div className="mt-3 space-y-3 text-sm">
                  <p>
                    <span className="text-muted-foreground">Necklines: </span>
                    {NECK_DESIGNS.join(", ")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Sleeves: </span>
                    {SLEEVE_DESIGNS.join(", ")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Back designs: </span>
                    {BACK_DESIGNS.join(", ")}
                  </p>
                </div>
              </div>
              <div>
                <p className="flex items-center gap-2 font-display text-lg text-primary">
                  <Sparkles className="size-4" /> Customization add-ons
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {CUSTOMIZATION_ADDONS.map((addon) => (
                    <li
                      key={addon.key}
                      className="flex items-center justify-between rounded-sm border border-border bg-card px-3 py-2 text-sm"
                    >
                      <span>{addon.label}</span>
                      <span className="text-muted-foreground">+{inr(addon.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {related.length ? (
        <div className="border-t border-border bg-secondary/50">
          <Section eyebrow="You may also like" title={`More ${service.category} services`}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </Section>
        </div>
      ) : null}
    </SiteLayout>
  );
}
