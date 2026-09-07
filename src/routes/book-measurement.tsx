import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useBookedSlots } from "@/lib/queries";

export const Route = createFileRoute("/book-measurement")({
  head: () => ({
    meta: [
      { title: "Book a Measurement Appointment — Krishna Tailor's" },
      {
        name: "description",
        content:
          "Book professional measurements at home or at the Surat studio. Choose a date and time slot, add your address and we confirm within the day.",
      },
      { property: "og:title", content: "Book a Measurement — Krishna Tailor's" },
      {
        property: "og:description",
        content: "Home visit or studio appointment with our measurement staff.",
      },
    ],
  }),
  component: BookMeasurement,
});

const SLOTS = ["10:00-11:00", "11:00-12:00", "12:00-13:00", "16:00-17:00", "17:00-18:00", "18:00-19:00"];

const schema = z.object({
  contact_name: z.string().trim().min(2, "Enter your name").max(100),
  contact_phone: z.string().trim().regex(/^[0-9+\-\s]{8,15}$/, "Enter a valid phone number"),
  scheduled_date: z.string().min(1, "Choose a date"),
  slot: z.string().min(1, "Choose a time slot"),
});

function BookMeasurement() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"HOME" | "STORE">("HOME");
  const [form, setForm] = useState({
    contact_name: "",
    contact_phone: "",
    scheduled_date: "",
    slot: "",
    address_line: "",
    city: "",
    pincode: "",
    landmark: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const { data: booked } = useBookedSlots(form.scheduled_date || undefined);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to book an appointment.");
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    if (mode === "HOME" && (!form.address_line || !form.city || !form.pincode)) {
      toast.error("Please add address, city and pincode for a home visit.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("appointments").insert({
      user_id: user.id,
      mode,
      contact_name: form.contact_name.trim(),
      contact_phone: form.contact_phone.trim(),
      scheduled_date: form.scheduled_date,
      slot: form.slot,
      address_line: mode === "HOME" ? form.address_line : null,
      city: mode === "HOME" ? form.city : null,
      pincode: mode === "HOME" ? form.pincode : null,
      landmark: mode === "HOME" ? form.landmark || null : null,
      notes: form.notes || null,
    });
    setBusy(false);
    if (error) {
      const clash =
        error.code === "23505" ||
        /duplicate key|already exists|unique constraint/i.test(error.message ?? "");
      if (clash) {
        await queryClient.invalidateQueries({ queryKey: ["booked-slots", form.scheduled_date] });
        setForm((prev) => ({ ...prev, slot: "" }));
        toast.error("That slot was just booked by someone else. Please choose another time.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Appointment requested. We will confirm shortly.");
    navigate({ to: "/dashboard" });
  };

  if (!loading && !user) {
    return (
      <SiteLayout>
        <Section className="text-center">
          <h1 className="text-3xl text-primary">Please log in to book</h1>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/auth">Login or register</Link>
            </Button>
          </div>
        </Section>
      </SiteLayout>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Appointments"
        title="Book a Measurement"
        subtitle="Our measurement staff can visit your home, or take measurements at the studio."
      />
      <Section className="max-w-2xl">
        <form onSubmit={submit} className="card-luxe space-y-6 rounded-sm p-6">
          <div className="flex gap-2">
            {(["HOME", "STORE"] as const).map((m) => (
              <Button
                key={m}
                type="button"
                size="sm"
                variant={mode === m ? "default" : "outline"}
                onClick={() => setMode(m)}
              >
                {m === "HOME" ? "Home visit" : "At the studio"}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="cname">Name</Label>
              <Input
                id="cname"
                value={form.contact_name}
                maxLength={100}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="cphone">Phone</Label>
              <Input
                id="cphone"
                value={form.contact_phone}
                maxLength={15}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                min={today}
                value={form.scheduled_date}
                onChange={(e) => setForm({ ...form, scheduled_date: e.target.value, slot: "" })}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Time slot</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {SLOTS.map((slot) => {
                  const taken = (booked ?? []).includes(slot);
                  return (
                    <Button
                      key={slot}
                      type="button"
                      size="sm"
                      disabled={taken || !form.scheduled_date}
                      variant={form.slot === slot ? "default" : "outline"}
                      onClick={() => setForm({ ...form, slot })}
                    >
                      {slot}
                      {taken ? " · booked" : ""}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {mode === "HOME" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="addr">Address</Label>
                <Input
                  id="addr"
                  value={form.address_line}
                  maxLength={200}
                  onChange={(e) => setForm({ ...form, address_line: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  maxLength={60}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="pin">Pincode</Label>
                <Input
                  id="pin"
                  value={form.pincode}
                  maxLength={6}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  value={form.landmark}
                  maxLength={120}
                  onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          ) : null}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              maxLength={500}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-2"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Booking…" : "Request appointment"}
          </Button>
        </form>
      </Section>
    </SiteLayout>
  );
}
