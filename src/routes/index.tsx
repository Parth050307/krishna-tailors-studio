import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Scissors,
  Ruler,
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Star,
  ArrowRight,
} from "lucide-react";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import { ServiceCard } from "@/components/site/ServiceCard";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useServices, useGallery, useReviews, useFaqs } from "@/lib/queries";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Krishna Tailor's — Tailored to Perfection. Designed for You." },
      {
        name: "description",
        content:
          "Premium women's tailoring in India: saree blouses, lehengas, anarkalis, gowns and bridal wear stitched to your exact measurements. Book a measurement or start a custom order.",
      },
      {
        property: "og:title",
        content: "Krishna Tailor's — Custom Women's Couture Tailoring",
      },
      {
        property: "og:description",
        content:
          "Blouses, lehengas, gowns and bridal wear made to your measurements, with live order tracking.",
      },
    ],
  }),
  component: Home,
});

const WHY = [
  {
    icon: Ruler,
    title: "Measurement-first fit",
    body: "Garment-specific measurement sheets, guided instructions and free professional measurement at home or in studio.",
  },
  {
    icon: Scissors,
    title: "Master cutters",
    body: "Every garment is drafted by hand by cutters with 15+ years in bridal and couture tailoring.",
  },
  {
    icon: Sparkles,
    title: "Real handwork",
    body: "Zardosi, zari, gota, mirror and sequin work done in-house — never outsourced, never rushed.",
  },
  {
    icon: ShieldCheck,
    title: "Fit guarantee",
    body: "One free alteration on every order within 10 days. Bridal orders include three fittings.",
  },
  {
    icon: Truck,
    title: "Delivery across India",
    body: "Track your order from cutting to delivery, with pickup available at the Surat studio.",
  },
  {
    icon: HeartHandshake,
    title: "Women-led studio",
    body: "A comfortable, respectful space with female measurement staff on request.",
  },
];

const STEPS = [
  { n: "01", t: "Choose your garment", d: "Pick a service and occasion, or bring us a reference." },
  { n: "02", t: "Design & fabric", d: "Select neck, sleeve, back and customization — our fabric or yours." },
  { n: "03", t: "Measurements", d: "Enter them yourself, follow our guide, or book a professional visit." },
  { n: "04", t: "Confirm & pay", d: "See a full INR breakdown with taxes, discount and delivery." },
  { n: "05", t: "We craft it", d: "Cutting, stitching, finishing and quality check — tracked live." },
  { n: "06", t: "Delivery or pickup", d: "Delivered to your door or collected from the studio." },
];

function Home() {
  const { data: services } = useServices();
  const { data: gallery } = useGallery();
  const { data: reviews } = useReviews(6);
  const { data: faqs } = useFaqs();

  const featured = (services ?? []).filter((s) => s.featured).slice(0, 6);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="relative flex items-center bg-background px-4 py-16 sm:px-8 sm:py-24 lg:px-14">
            <div className="motif-bg absolute inset-0 opacity-[0.25]" aria-hidden />
            <div className="relative fade-up">
              <p className="eyebrow">Couture Tailoring · Est. {BRAND.established}</p>
              <h1 className="mt-5 text-5xl leading-[1.05] text-primary sm:text-6xl xl:text-7xl">
                Tailored to Perfection.
                <span className="block italic">Designed for You.</span>
              </h1>
              <div className="gold-rule mt-7 max-w-40" aria-hidden />
              <p className="mt-7 max-w-lg text-base leading-relaxed text-muted-foreground">
                {BRAND.name} is a women's couture studio in Surat crafting saree blouses,
                lehengas, anarkalis, gowns and full bridal wear — drafted from your own
                measurements, finished by hand.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/custom-order">
                    Start a Custom Order <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/book-measurement">Book Measurement</Link>
                </Button>
              </div>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-7">
                {[
                  ["17+", "Years stitching"],
                  ["9,000+", "Garments delivered"],
                  ["24", "Tailoring services"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="font-display text-3xl text-primary">{value}</dt>
                    <dd className="mt-1 text-xs tracking-wide text-muted-foreground">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="relative min-h-80 lg:min-h-[42rem]">
            <img
              src="/images/hero-bridal.jpg"
              alt="Bride in a wine and gold bridal lehenga in the Krishna Tailor's atelier"
              width={1600}
              height={1104}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-background/80 to-transparent p-6 pt-24 lg:hidden" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <Section
        eyebrow="What we make"
        title="Signature tailoring services"
        subtitle="From an everyday kurti to a 45-day bridal lehenga — 24 services, all stitched to your measurements."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/services">View all 24 services</Link>
          </Button>
        </div>
      </Section>

      {/* WHY CHOOSE US */}
      <div className="border-y border-border bg-secondary/50">
        <Section
          eyebrow="Why Krishna Tailor's"
          title="Fit is not a detail. It is the whole thing."
          subtitle="Everything in our studio is built around getting your garment to sit exactly right."
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-gold/50 bg-background">
                  <item.icon className="size-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-primary">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* BRIDAL */}
      <Section className="lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <img
              src="/images/atelier-embroidery.jpg"
              alt="Hand zardosi embroidery on wine silk"
              loading="lazy"
              width={1200}
              height={900}
              className="w-full rounded-sm object-cover shadow-luxe"
            />
            <div className="absolute -right-3 -bottom-6 hidden w-44 rounded-sm border border-gold/60 bg-card p-4 shadow-soft sm:block">
              <p className="eyebrow">Bridal timeline</p>
              <p className="mt-2 font-display text-2xl text-primary">45 days</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Consultation, three fittings and delivery two weeks before the date.
              </p>
            </div>
          </div>
          <div>
            <p className="eyebrow">Wedding & Bridal</p>
            <h2 className="mt-3 text-3xl text-primary sm:text-4xl">
              For the days that get photographed forever
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Bridal, engagement, haldi, mehendi, sangeet and reception outfits — planned
              on a proper timeline, with structured bridal blouses that carry heavy
              embroidery without hurting you by the third hour.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Structured, boned bridal blouses",
                "Fabric curation from our library",
                "Three scheduled fitting sessions",
                "Coordinated family & bridesmaid outfits",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/85">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/wedding-bridal">Explore bridal services</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/book-measurement">Book a consultation</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <div className="border-y border-border bg-primary text-primary-foreground">
        <Section
          eyebrow="The process"
          title="Six steps from idea to delivery"
          className="[&_h2]:text-primary-foreground [&_p.eyebrow]:text-gold"
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="border-t border-primary-foreground/20 pt-5">
                <p className="font-display text-3xl text-gold">{step.n}</p>
                <h3 className="mt-2 font-display text-xl">{step.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-primary-foreground/75">
                  {step.d}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/how-it-works">See the full process</Link>
            </Button>
          </div>
        </Section>
      </div>

      {/* MEASUREMENTS */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Measurements</p>
            <h2 className="mt-3 text-3xl text-primary sm:text-4xl">
              Three ways to get measured
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every garment type has its own measurement sheet — a blouse needs eleven
              fields, a lehenga needs ten different ones. Save profiles like Regular,
              Wedding and Blouse, switch between inches and centimetres, and reuse them on
              every future order.
            </p>
            <div className="mt-8 space-y-4">
              {[
                ["I know my measurements", "Enter them once, save as a profile, reuse forever."],
                ["Help me measure myself", "Guided instructions field by field, with valid ranges."],
                ["Book professional measurement", "Our staff visit your home or measure you in studio."],
              ].map(([t, d]) => (
                <div key={t} className="card-luxe rounded-sm p-4">
                  <p className="font-display text-lg text-primary">{t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/measurement-guide">Read the measurement guide</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/book-measurement">Book measurement</Link>
              </Button>
            </div>
          </div>
          <img
            src="/images/measurement.jpg"
            alt="A tailor taking a client's measurements in the studio"
            loading="lazy"
            width={1200}
            height={800}
            className="w-full rounded-sm object-cover shadow-soft"
          />
        </div>
      </Section>

      {/* GALLERY */}
      <div className="border-y border-border bg-secondary/50">
        <Section
          eyebrow="Recent work"
          title="From our atelier"
          subtitle="A small selection of pieces made for our clients."
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(gallery ?? []).slice(0, 8).map((item) => (
              <figure
                key={item.id}
                className="group relative aspect-3/4 overflow-hidden rounded-sm bg-muted"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary/90 to-transparent p-3 pt-10 text-xs text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/gallery">Open the full gallery</Link>
            </Button>
          </div>
        </Section>
      </div>

      {/* REVIEWS */}
      <Section
        eyebrow="Client words"
        title="Loved by brides, mothers and daughters"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(reviews ?? []).map((review) => (
            <blockquote key={review.id} className="card-luxe rounded-sm p-6">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/85 italic">
                “{review.comment}”
              </p>
              <footer className="mt-5 border-t border-border pt-3">
                <p className="font-display text-base text-primary">
                  {review.customer_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {review.city} · {review.garment}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <div className="border-t border-border bg-secondary/50">
        <Section eyebrow="Questions" title="Frequently asked">
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible>
              {(faqs ?? []).map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left font-display text-lg text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>
      </div>

      {/* CTA */}
      <Section className="text-center">
        <div className="motif-bg relative overflow-hidden rounded-sm border border-gold/50 bg-card px-6 py-16 sm:px-12">
          <div className="relative mx-auto max-w-2xl">
            <p className="eyebrow">Ready when you are</p>
            <h2 className="mt-4 text-3xl text-primary sm:text-4xl">
              Let's make something that fits only you
            </h2>
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Start a custom order in a few minutes, or book a measurement appointment and
              we will take it from there.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/custom-order">Start Custom Order</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Talk to the studio</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
