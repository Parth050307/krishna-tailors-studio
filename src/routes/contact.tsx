import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/lib/queries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact the Studio — Krishna Tailor's" },
      {
        name: "description",
        content:
          "Call, WhatsApp or visit the Krishna Tailor's studio in Surat, or send us a message about a custom order, bridal booking or alteration.",
      },
      { property: "og:title", content: "Contact Krishna Tailor's" },
      {
        property: "og:description",
        content: "Studio address, timings and a direct message form.",
      },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().regex(/^[0-9+\-\s]{8,15}$/, "Enter a valid phone number"),
  message: z.string().trim().min(10, "Tell us a little more").max(1000),
});

type Contact = { phone?: string; whatsapp?: string; email?: string; address?: string; hours?: string };

function Contact() {
  const { data: settings } = useSettings();
  const contact = (settings?.["contact"] ?? {}) as Contact;
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    toast.success("Thank you — the studio will call you back shortly.");
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Say hello"
        title="Contact the Studio"
        subtitle="Questions about a design, a wedding timeline or an alteration? Talk to us."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            {[
              ["Studio", contact.address ?? "Ring Road, Surat, Gujarat"],
              ["Phone", contact.phone ?? "+91 98250 00000"],
              ["WhatsApp", contact.whatsapp ?? contact.phone ?? "+91 98250 00000"],
              ["Email", contact.email ?? "hello@krishnatailors.in"],
              ["Timings", contact.hours ?? "Mon-Sat, 10:00 am - 8:00 pm"],
            ].map(([label, value]) => (
              <div key={label} className="border-l border-gold/60 pl-4">
                <p className="eyebrow">{label}</p>
                <p className="mt-1 text-sm text-primary sm:text-base">{value}</p>
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="card-luxe space-y-5 rounded-sm p-6">
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                value={form.name}
                maxLength={100}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                maxLength={15}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                value={form.message}
                maxLength={1000}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2"
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Send message
            </Button>
          </form>
        </div>
      </Section>
    </SiteLayout>
  );
}
