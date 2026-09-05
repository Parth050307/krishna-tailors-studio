import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/60">
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover opacity-20"
        />
      ) : (
        <div className="motif-bg absolute inset-0 opacity-[0.35]" />
      )}
      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 text-4xl text-primary sm:text-5xl">{title}</h1>
        {subtitle ? (
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        ) : null}
        <div className="paisley-divider mx-auto mt-7 max-w-xs" aria-hidden>
          ✦
        </div>
      </div>
    </section>
  );
}

export function Section({
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
  center = true,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <section className={`mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 ${className}`}>
      {title ? (
        <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="mt-3 text-3xl text-primary sm:text-4xl">{title}</h2>
          {subtitle ? (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
      <div className={title ? "mt-12" : ""}>{children}</div>
    </section>
  );
}
