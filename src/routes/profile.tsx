import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — Krishna Tailor's" },
      {
        name: "description",
        content: "View and update your Krishna Tailor's profile and contact preferences.",
      },
      { property: "og:title", content: "Profile & Settings — Krishna Tailor's" },
      { property: "og:description", content: "Manage your account details." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name.").max(100),
  phone: z
    .string()
    .trim()
    .max(15, "Phone number is too long.")
    .regex(/^[0-9+\-\s]*$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  city: z.string().trim().max(100, "City name is too long.").optional().or(z.literal("")),
  preferred_unit: z.enum(["in", "cm"]),
});

function ProfilePage() {
  const { user, profile, loading, refresh } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState<"INCHES" | "CM">("INCHES");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setPhone(profile.phone ?? "");
    setCity(profile.city ?? "");
    setUnit(profile.preferred_unit === "CM" ? "CM" : "INCHES");
  }, [profile]);

  if (loading) {
    return (
      <SiteLayout>
        <Section>
          <p className="text-muted-foreground">Loading your profile…</p>
        </Section>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <Section className="text-center">
          <h1 className="text-3xl text-primary">Please log in</h1>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/auth">Login or register</Link>
            </Button>
          </div>
        </Section>
      </SiteLayout>
    );
  }

  const save = async () => {
    const parsed = profileSchema.safeParse({
      full_name: fullName,
      phone,
      city,
      preferred_unit: unit,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: parsed.data.full_name,
        phone: parsed.data.phone || null,
        city: parsed.data.city || null,
        preferred_unit: parsed.data.preferred_unit,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Could not save your profile. Please try again.");
      return;
    }
    await refresh();
    toast.success("Your profile has been updated.");
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Your account"
        title="Profile & Settings"
        subtitle="Keep your contact details up to date so we can reach you about your orders."
      />
      <Section>
        <div className="mx-auto max-w-xl">
          <div className="card-luxe rounded-sm p-6 md:p-8">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="pf-email">Email</Label>
                <Input id="pf-email" value={user.email ?? ""} disabled />
                <p className="text-xs text-muted-foreground">
                  Your sign-in email cannot be changed here.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pf-name">Full name</Label>
                <Input
                  id="pf-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pf-phone">Phone</Label>
                <Input
                  id="pf-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  maxLength={15}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pf-city">City</Label>
                <Input
                  id="pf-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div className="grid gap-2">
                <Label>Preferred measurement unit</Label>
                <Select value={unit} onValueChange={(v) => setUnit(v as "INCHES" | "CM")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCHES">Inches</SelectItem>
                    <SelectItem value="CM">Centimetres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button onClick={save} disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
                <Button asChild variant="outline">
                  <Link to="/dashboard">Back to dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
