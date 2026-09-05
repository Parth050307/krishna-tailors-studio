import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/refund-cancellation")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy — Krishna Tailor's" },
      {
        name: "description",
        content:
          "When a custom tailoring order can be cancelled, what is refundable at each stage, and how alterations and refunds are processed.",
      },
      { property: "og:title", content: "Refund & Cancellation — Krishna Tailor's" },
      {
        property: "og:description",
        content: "Stage-wise cancellation and refund rules for custom-stitched garments.",
      },
    ],
  }),
  component: RefundPolicy,
});

const STAGES: [string, string, string][] = [
  ["Before cutting", "Full refund", "Cancel any time before the fabric is cut and the full amount paid is refunded."],
  ["Fabric confirmed, not cut", "Refund minus fabric cost", "Studio fabric already purchased for your order is deducted; the fabric is yours to collect."],
  ["Cutting started", "50% refund", "Cut panels cannot be reused for another client, so half the stitching charge is retained."],
  ["Stitching onwards", "No refund", "Once stitching has begun the garment is unique to your measurements and cannot be resold."],
  ["Delivered", "Alteration only", "One free alteration within 10 days; refunds are not available on delivered custom garments."],
];

function RefundPolicy() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Legal"
        title="Refund & Cancellation"
        subtitle="Custom garments are made only for you, so refunds depend on how far the work has progressed."
      />

      <Section eyebrow="Stage-wise" title="What you get back, and when">
        <div className="mx-auto max-w-3xl space-y-4">
          {STAGES.map(([stage, outcome, detail]) => (
            <div key={stage} className="card-luxe rounded-sm p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl text-primary">{stage}</h3>
                <span className="rounded-sm border border-gold/60 px-2.5 py-1 text-xs text-primary">
                  {outcome}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="border-t border-border bg-secondary/50">
        <Section>
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h2 className="font-display text-2xl text-primary">How to cancel</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Open the order in your dashboard and use the cancellation request, or call
                the studio with your order number. Cancellation is effective from the time
                we receive it, not from when it is processed.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-primary">Refund processing</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Payments are currently in test mode, so refunds are recorded against the
                order and reflected as Refunded in your payment history. Once live payments
                are enabled, approved refunds will be returned to the original payment
                method within 5-7 working days.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-primary">Appointments</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Measurement appointments can be rescheduled or cancelled free of charge up
                to four hours before the slot. Repeated no-shows for home visits may
                require a visiting charge on future bookings.
              </p>
            </div>
          </div>
        </Section>
      </div>
    </SiteLayout>
  );
}
