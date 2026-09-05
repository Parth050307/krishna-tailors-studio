import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, User2, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BRAND } from "@/lib/brand";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/wedding-bridal", label: "Wedding & Bridal" },
  { to: "/gallery", label: "Gallery" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/measurement-guide", label: "Measurements" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex flex-col leading-none">
          <span className="font-display text-lg tracking-[0.16em] text-primary sm:text-xl">
            {BRAND.name}
          </span>
          <span className="mt-1 hidden text-[0.6rem] tracking-[0.28em] text-muted-foreground uppercase sm:block">
            Couture Tailoring · Est. {BRAND.established}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative text-[0.8rem] tracking-wide text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-medium" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
              <Link to="/admin">
                <Shield className="mr-1.5 size-4" /> Admin
              </Link>
            </Button>
          ) : null}
          {user ? (
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link to="/dashboard">
                <LayoutDashboard className="mr-1.5 size-4" /> Dashboard
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/auth">
                <User2 className="mr-1.5 size-4" /> Login
              </Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link to="/custom-order">Start Custom Order</Link>
          </Button>
          <button
            aria-label="Toggle menu"
            className="rounded-sm p-2 text-foreground xl:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-card xl:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:grid-cols-2 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-2 text-sm text-foreground/85 hover:bg-secondary hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={user ? "/dashboard" : "/auth"}
              onClick={() => setOpen(false)}
              className="rounded-sm px-2 py-2 text-sm font-medium text-primary"
            >
              {user ? "My Dashboard" : "Login / Register"}
            </Link>
            <Link
              to="/book-measurement"
              onClick={() => setOpen(false)}
              className="rounded-sm px-2 py-2 text-sm font-medium text-primary"
            >
              Book Measurement
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
