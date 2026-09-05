import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import { inr } from "@/lib/format";

export type ServiceLike = {
  slug: string;
  name: string;
  category: string;
  short_description: string;
  base_price: number;
  stitching_days: number;
  image_url: string | null;
};

export function ServiceCard({ service }: { service: ServiceLike }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug: service.slug }}
      className="card-luxe group flex flex-col overflow-hidden rounded-sm"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-secondary">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute top-3 left-3 rounded-sm bg-background/90 px-2.5 py-1 text-[0.62rem] tracking-[0.18em] text-primary uppercase">
          {service.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-primary">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {service.short_description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <div>
            <p className="text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
              From
            </p>
            <p className="font-display text-lg text-foreground">{inr(service.base_price)}</p>
          </div>
          <div className="text-right">
            <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" /> {service.stitching_days} days
            </p>
            <p className="mt-1 flex items-center justify-end gap-1 text-xs font-medium text-primary">
              View details <ArrowUpRight className="size-3.5" />
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
