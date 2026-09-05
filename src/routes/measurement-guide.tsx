import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GARMENT_TYPES } from "@/lib/brand";
import { useMeasurementFields } from "@/lib/queries";

export const Route = createFileRoute("/measurement-guide")({
  head: () => ({
    meta: [
      { title: "Measurement Guide — How to Measure Yourself | Krishna Tailor's" },
      {
        name: "description",
        content:
          "Step-by-step instructions for blouse, suit, kurti, gown and lehenga measurements in inches or cm, with tips to avoid the most common mistakes.",
      },
      { property: "og:title", content: "Measurement Guide — Krishna Tailor's" },
      {
        property: "og:description",
        content:
          "Garment-specific measuring instructions so your custom outfit fits the first time.",
      },
    ],
  }),
  component: MeasurementGuide;
});

function MeasurementGuide() {
  return <div />;
}
