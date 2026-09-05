import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { useSettings } from "@/lib/queries";

export function SiteFooter() {
  const { data: settings } = useSettings();
  const contact = (settings?.["contact"] ?? {}) as {
    address?: string;
    phone?: string;
    email?: string;
    hours?: string;
  };

  return (
    <footer className="mt-24 border-t border-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-xl tracking-[0.16em] text-sidebar-primary">
            {BRAND.name}
          </p>
          <p className="mt-3 font-display text-lg text-sidebar-foreground/90 italic">
            {BRAND.tagline}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/70">
            A women's couture tailoring studio crafting blouses, lehengas, gowns and
            bridal wear to individual measurements since {BRAND.established}.
          </p>
        </div>

        <div>
          <p className="eyebrow text-sidebar-primary">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-sidebar-foreground/80">
            {[
              { to: "/services", label: "All Services" },
              { to: "/wedding-bridal", label: "Wedding & Bridal" },
              { to: "/gallery", label: "Gallery" },
              { to: "/how-it-works", label: "How It Works" },
              { to: "/pricing", label: "Pricing" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-sidebar-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-sidebar-primary">Customers</p>
          <ul className="mt-4 space-y-2 text-sm text-sidebar-foreground/80">
            {[
              { to: "/custom-order", label: "Start a Custom Order" },
              { to: "/book-measurement", label: "Book Measurement" },
              { to: "/measurement-guide", label: "Measurement Guide" },
              { to: "/dashboard", label: "My Dashboard" },
              { to: "/auth", label: "Login / Register" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-sidebar-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-sidebar-primary">Visit the studio</p>
          <ul className="mt-4 space-y-3 text-sm text-sidebar-foreground/80">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
              <span>{contact.address ?? "Surat, Gujarat"}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
              <span>{contact.phone ?? "+91 98250 11001"}</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
              <span>{contact.email ?? "studio@krishnatailors.in"}</span>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-sidebar-primary" />
              <span>{contact.hours ?? "Mon-Sat, 10:00 AM - 8:00 PM"}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sidebar-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-sidebar-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="hover:text-sidebar-primary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-sidebar-primary">
              Terms of Service
            </Link>
            <Link to="/refund-cancellation" className="hover:text-sidebar-primary">
              Refund & Cancellation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
