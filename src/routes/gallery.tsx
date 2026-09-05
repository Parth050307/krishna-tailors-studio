import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useGallery } from "@/lib/queries";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Krishna Tailor's Atelier Work" },
      {
        name: "description",
        content:
          "Browse bridal lehengas, designer blouses, anarkalis, gowns and hand embroidery made in the Krishna Tailor's studio.",
      },
      { property: "og:title", content: "Gallery — Krishna Tailor's" },
      {
        property: "og:description",
        content: "Real client pieces from our couture workroom in Surat.",
      },
    ],
  }),
  component: GalleryPage,
});

const CATEGORIES = ["All", "Bridal", "Blouse", "Ethnic", "Gown", "Wedding", "Embroidery", "Fabric"];

function GalleryPage() {
  const [category, setCategory] = useState("All");
  const { data: items } = useGallery(category);
  const { user } = useAuth();

  const save = async (galleryId: string) => {
    if (!user) {
      toast.error("Please log in to save designs.");
      return;
    }
    const { error } = await supabase
      .from("saved_designs")
      .insert({ user_id: user.id, gallery_id: galleryId });
    if (error) {
      toast.info(
        error.code === "23505" ? "Already in your saved designs." : error.message,
      );
      return;
    }
    toast.success("Saved to your designs.");
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our work"
        title="Gallery"
        subtitle="Pieces made for real clients. Save any design and reference it when you place your order."
      />
      <Section>
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>figure]:mb-4">
          {(items ?? []).map((item) => (
            <figure
              key={item.id}
              className="group relative break-inside-avoid overflow-hidden rounded-sm border border-border bg-muted"
            >
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-linear-to-t from-primary/95 to-transparent p-3 pt-12 text-primary-foreground">
                <span>
                  <span className="block font-display text-base">{item.title}</span>
                  <span className="text-[0.7rem] text-primary-foreground/75">
                    {item.category}
                  </span>
                </span>
                <button
                  aria-label={`Save ${item.title}`}
                  onClick={() => save(item.id)}
                  className="rounded-full bg-background/90 p-2 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Heart className="size-4" />
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
