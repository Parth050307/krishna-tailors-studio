import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Krishna Tailor's" },
      {
        name: "description",
        content:
          "Order terms for Krishna Tailor's custom tailoring: measurement accuracy, fabric supply, timelines, fittings, alterations and payment conditions.",
      },
      { property: "og:title", content: "Terms of Service — Krishna Tailor's" },
      {
        property: "og:description",
        content: "The conditions that apply to every custom tailoring order we accept.",
      },
    ],
  }),
  component: Terms,
});

const SECTIONS: [string, string[]][] = [
  [
    "Orders and confirmation",
    [
      "An order is confirmed only after the design, measurements and payment status are recorded in your account.",
      "Order numbers are issued in the format KT-YYYY-00001 and are used for all communication.",
    ],
  ],
  [
    "Measurements",
    [
      "If you provide your own measurements, the fit is based on those figures. We stitch to the sheet you submit.",
      "If our staff take the measurements, fit corrections due to measuring errors are free of charge.",
      "Measurements taken more than six months ago may be re-confirmed before cutting.",
    ],
  ],
  [
    "Fabric",
    [
      "You may supply your own fabric. Please send the quantity we advise for the garment; shortfalls may delay the order.",
      "We are not responsible for defects, colour bleeding or shrinkage in customer-supplied fabric.",
      "Studio fabric is charged per metre at the rate shown at the time of ordering.",
    ],
  ],
  [
    "Timelines",
    [
      "Stitching days shown per service begin after measurement and design confirmation, not from payment.",
      "Bridal and heavy embroidery work follows a separate agreed timeline.",
      "Festival seasons may extend timelines; you will be told before confirmation.",
    ],
  ],
  [
    "Fittings and alterations",
    [
      "One free alteration is included within 10 days of delivery.",
      "Alterations arising from weight change, or requests to change the design after cutting, are chargeable.",
      "Bridal orders include up to three fitting sessions.",
    ],
  ],
  [
    "Payment",
    [
      "Payments are currently in test mode for demonstration. No real money is charged.",
      "When live payments are enabled, an advance may be required before cutting begins.",
      "Card and UPI credentials are never stored by us.",
    ],
  ],
  [
    "Conduct and content",
    [
      "Reference uploads must be your own or lawfully shareable images.",
      "Accounts used to misuse the platform or other customers' data may be suspended.",
    ],
  ],
];

function Terms() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="Plain conditions so both sides know exactly what was agreed."
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-10">
          {SECTIONS.map(([title, items]) => (
            <div key={title}>
              <h2 className="font-display text-2xl text-primary">{title}</h2>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li
                    key={item}
                    className="border-l border-gold/60 pl-4 text-sm leading-relaxed text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
