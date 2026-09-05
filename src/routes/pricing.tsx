import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useServices, useFabrics } from "@/lib/queries";
import { inr } from "@/lib/format";
import { CUSTOMIZATION_ADDONS } from "@/lib/brand";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Stitching Charges in INR | Krishna Tailor's" },
      {
        name: "description",
        content:
          "Transparent stitching charges for blouses, suits, kurtis, gowns, lehengas and bridal wear, plus fabric rates, customization add-ons, taxes and delivery charges.",
      },
      { property: "og:title", content: "Pricing — Krishna Tailor's" },
      {
        property: "og:description",
        content: "Service-wise stitching charges, fabric rates and add-on pricing in INR.",
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const { data: services } = useServices();
  const { data: fabrics } = useFabrics();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Pricing"
        title="Clear rates, no surprises"
        subtitle="Prices below are stitching charges. Fabric, customization, GST and delivery are shown separately on your order summary before you pay."
      />

      <Section eyebrow="Stitching charges" title="Service-wise pricing">
        <div className="overflow-x-auto rounded-sm border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Starts at</TableHead>
                <TableHead className="text-right">Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(services ?? []).map((s) => (
                <TableRow key={s.slug}>
                  <TableCell>
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {s.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.category}</TableCell>
                  <TableCell className="text-right">{inr(s.base_price)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {s.stitching_days}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <div className="border-y border-border bg-secondary/50">
        <Section eyebrow="Add-ons" title="Customization charges">
          <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
            {CUSTOMIZATION_ADDONS.map((a) => (
              <div
                key={a.key}
                className="flex items-center justify-between rounded-sm border border-border bg-card px-4 py-3 text-sm"
              >
                <span className="text-primary">{a.label}</span>
                <span className="text-muted-foreground">+{inr(a.price)}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section eyebrow="Fabrics" title="Studio fabric rates (per metre)">
        <div className="overflow-x-auto rounded-sm border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fabric</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Colour</TableHead>
                <TableHead className="text-right">Per metre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(fabrics ?? []).map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="text-primary">{f.name}</TableCell>
                  <TableCell className="text-muted-foreground">{f.fabric_type}</TableCell>
                  <TableCell className="text-muted-foreground">{f.color}</TableCell>
                  <TableCell className="text-right">{inr(f.price_per_meter)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Bringing your own fabric? There is no fabric charge — only stitching and add-ons.
        </p>
      </Section>

      <div className="border-t border-border">
        <Section className="text-center">
          <h2 className="text-3xl text-primary sm:text-4xl">Want an exact quote?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Build your order and you will see the full breakdown — stitching, fabric,
            add-ons, GST, discount and delivery — before any payment.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/custom-order">Get my quote</Link>
            </Button>
          </div>
        </Section>
      </div>
    </SiteLayout>
  );
}
