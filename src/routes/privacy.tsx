import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Krishna Tailor's" },
      {
        name: "description",
        content:
          "How Krishna Tailor's collects, stores and protects your measurements, addresses, reference uploads and order information.",
      },
      { property: "og:title", content: "Privacy Policy — Krishna Tailor's" },
      {
        property: "og:description",
        content: "Your measurements and uploads are private to you and your order's staff.",
      },
    ],
  }),
  component: Privacy,
});

const SECTIONS: [string, string[]][] = [
  [
    "What we collect",
    [
      "Account details: name, email, phone number and password (stored only as a secure hash).",
      "Body measurements you enter or that our staff record for you, along with the unit and profile name.",
      "Delivery addresses, city, pincode and landmark details.",
      "Reference images and documents you upload for a design.",
      "Order, appointment, payment status and communication history.",
    ],
  ],
  [
    "Why we collect it",
    [
      "To draft and stitch your garment to the correct fit.",
      "To schedule measurement appointments and deliveries.",
      "To send order, payment and appointment updates.",
      "To resolve alteration requests and maintain your measurement history.",
    ],
  ],
  [
    "Who can see your data",
    [
      "You, through your account.",
      "Only the studio staff assigned to your order — measurement staff, the tailor stitching it, quality check and delivery staff.",
      "Studio management for billing and support.",
      "No other customer can ever see your measurements, orders, addresses or uploads. Access is enforced at the database level, not just in the app.",
    ],
  ],
  [
    "Uploads and storage",
    [
      "Reference files are stored in private storage. Links are time-limited and generated only for you and assigned staff.",
      "We accept JPG, PNG, WEBP and PDF files up to 10 MB each.",
    ],
  ],
  [
    "Payments",
    [
      "We never store card numbers, CVV or UPI credentials.",
      "Payments are currently processed in test mode; when live payments are enabled they will be handled by a certified payment gateway.",
    ],
  ],
  [
    "Retention and deletion",
    [
      "Measurement profiles stay until you delete them.",
      "Order records are retained for accounting and warranty purposes.",
      "You can request deletion of your account and personal data by writing to us.",
    ],
  ],
];

function Privacy() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Measurements are personal. We treat them that way."
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
          <p className="text-sm text-muted-foreground">
            Questions about your data? Write to {BRAND.name} at the contact details listed
            on our contact page and we will respond within three working days.
          </p>
        </div>
      </Section>
    </SiteLayout>
  );
}
