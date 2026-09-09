import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useAddresses } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/addresses")({
  head: () => ({
    meta: [
      { title: "Saved Addresses — Krishna Tailor's" },
      {
        name: "description",
        content:
          "Manage your delivery addresses for Krishna Tailor's home pickup and delivery orders.",
      },
      { property: "og:title", content: "Saved Addresses — Krishna Tailor's" },
      { property: "og:description", content: "Add, edit and set your default delivery address." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AddressesPage,
});

const addressSchema = z.object({
  label: z.string().trim().min(1, "Please add a label like Home or Work.").max(40),
  full_name: z.string().trim().min(1, "Please enter the recipient name.").max(100),
  phone: z
    .string()
    .trim()
    .max(15, "Phone number is too long.")
    .regex(/^[0-9+\-\s]*$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  line1: z.string().trim().min(1, "Please enter the address.").max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1, "Please enter the city.").max(100),
  state: z.string().trim().min(1, "Please enter the state.").max(100),
  pincode: z.string().trim().regex(/^[0-9]{6}$/, "Please enter a 6-digit pincode."),
  landmark: z.string().trim().max(120).optional().or(z.literal("")),
  is_default: z.boolean(),
});

type FormState = z.input<typeof addressSchema>;

const emptyForm: FormState = {
  label: "",
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  is_default: false,
};

function AddressesPage() {
  const { user, profile, loading } = useAuth();
  const queryClient = useQueryClient();
  const { data: addresses, isLoading, isError, refetch } = useAddresses(user?.id);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["addresses"] });
  };

  const set = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, full_name: profile?.full_name ?? "", phone: profile?.phone ?? "" });
    setShowForm(true);
  };

  const openEdit = (a: NonNullable<typeof addresses>[number]) => {
    setEditingId(a.id);
    setForm({
      label: a.label ?? "",
      full_name: a.full_name ?? "",
      phone: a.phone ?? "",
      line1: a.line1 ?? "",
      line2: a.line2 ?? "",
      city: a.city ?? "",
      state: a.state ?? "",
      pincode: a.pincode ?? "",
      landmark: a.landmark ?? "",
      is_default: Boolean(a.is_default),
    });
    setShowForm(true);
  };

  const clearOtherDefaults = async (keepId?: string) => {
    if (!user) return;
    let q = supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);
    if (keepId) q = q.neq("id", keepId);
    await q;
  };

  const submit = async () => {
    if (!user) return;
    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the address details.");
      return;
    }
    const v = parsed.data;
    const payload = {
      label: v.label,
      full_name: v.full_name,
      phone: v.phone || null,
      line1: v.line1,
      line2: v.line2 || null,
      city: v.city,
      state: v.state,
      pincode: v.pincode,
      landmark: v.landmark || null,
      is_default: v.is_default,
    };

    setSaving(true);
    if (v.is_default) await clearOtherDefaults(editingId ?? undefined);

    const { error } = editingId
      ? await supabase.from("addresses").update(payload).eq("id", editingId)
      : await supabase.from("addresses").insert({ ...payload, user_id: user.id });
    setSaving(false);

    if (error) {
      toast.error("Could not save this address. Please try again.");
      return;
    }
    await invalidate();
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    toast.success(editingId ? "Address updated." : "Address saved.");
  };

  const makeDefault = async (id: string) => {
    setBusyId(id);
    await clearOtherDefaults(id);
    const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    setBusyId(null);
    if (error) {
      toast.error("Could not set the default address.");
      return;
    }
    await invalidate();
    toast.success("Default address updated.");
  };

  const remove = async (id: string, label: string) => {
    if (!window.confirm(`Delete the address "${label}"? This cannot be undone.`)) return;
    setBusyId(id);
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    setBusyId(null);
    if (error) {
      toast.error("Could not delete this address. It may be used by an existing order.");
      return;
    }
    await invalidate();
    toast.success("Address deleted.");
  };

  if (loading) {
    return (
      <SiteLayout>
        <Section>
          <p className="text-muted-foreground">Loading…</p>
        </Section>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <Section className="text-center">
          <h1 className="text-3xl text-primary">Please log in</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your saved addresses are private to your account.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/auth">Login or register</Link>
            </Button>
          </div>
        </Section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Your account"
        title="Saved addresses"
        subtitle="Manage where we pick up and deliver your garments."
      />
      <Section>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl text-primary">Your addresses</h2>
            <div className="flex flex-wrap gap-2">
              <Button onClick={openAdd}>Add new address</Button>
              <Button asChild variant="outline">
                <Link to="/dashboard">Back to dashboard</Link>
              </Button>
            </div>
          </div>

          {showForm ? (
            <div className="card-luxe mt-6 rounded-sm p-6">
              <h3 className="font-display text-lg text-primary">
                {editingId ? "Edit address" : "New address"}
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="ad-label">Label *</Label>
                  <Input
                    id="ad-label"
                    value={form.label}
                    onChange={(e) => set({ label: e.target.value })}
                    placeholder="Home"
                    maxLength={40}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ad-name">Recipient name *</Label>
                  <Input
                    id="ad-name"
                    value={form.full_name}
                    onChange={(e) => set({ full_name: e.target.value })}
                    maxLength={100}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ad-phone">Phone</Label>
                  <Input
                    id="ad-phone"
                    value={form.phone ?? ""}
                    onChange={(e) => set({ phone: e.target.value })}
                    inputMode="tel"
                    maxLength={15}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ad-line1">Address line 1 *</Label>
                  <Input
                    id="ad-line1"
                    value={form.line1}
                    onChange={(e) => set({ line1: e.target.value })}
                    maxLength={200}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ad-line2">Address line 2</Label>
                  <Input
                    id="ad-line2"
                    value={form.line2 ?? ""}
                    onChange={(e) => set({ line2: e.target.value })}
                    maxLength={200}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ad-landmark">Landmark</Label>
                  <Input
                    id="ad-landmark"
                    value={form.landmark ?? ""}
                    onChange={(e) => set({ landmark: e.target.value })}
                    maxLength={120}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ad-city">City *</Label>
                  <Input
                    id="ad-city"
                    value={form.city}
                    onChange={(e) => set({ city: e.target.value })}
                    maxLength={100}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ad-state">State *</Label>
                  <Input
                    id="ad-state"
                    value={form.state}
                    onChange={(e) => set({ state: e.target.value })}
                    maxLength={100}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ad-pin">Pincode *</Label>
                  <Input
                    id="ad-pin"
                    value={form.pincode}
                    onChange={(e) => set({ pincode: e.target.value })}
                    inputMode="numeric"
                    maxLength={6}
                  />
                </div>
              </div>
              <label className="mt-5 flex items-center gap-3 text-sm">
                <Checkbox
                  checked={form.is_default}
                  onCheckedChange={(checked) => set({ is_default: Boolean(checked) })}
                />
                Use this as my default delivery address
              </label>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={submit} disabled={saving}>
                  {saving ? "Saving…" : editingId ? "Save changes" : "Save address"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}

          <div className="mt-8">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading your addresses…</p>
            ) : isError ? (
              <div className="card-luxe rounded-sm p-6">
                <p className="text-sm text-muted-foreground">
                  We couldn't load your addresses right now.
                </p>
                <Button className="mt-4" variant="outline" onClick={() => refetch()}>
                  Try again
                </Button>
              </div>
            ) : (addresses ?? []).length === 0 ? (
              <div className="card-luxe rounded-sm p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Add your first delivery address to make home delivery faster.
                </p>
                <Button className="mt-5" onClick={openAdd}>
                  Add new address
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {(addresses ?? []).map((a) => (
                  <div key={a.id} className="card-luxe rounded-sm p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg text-primary">{a.label}</h3>
                      {a.is_default ? (
                        <span className="rounded-sm bg-primary/10 px-2 py-1 text-xs text-primary">
                          Default
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm">{a.full_name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}
                      <br />
                      {a.city}, {a.state} {a.pincode}
                      {a.landmark ? (
                        <>
                          <br />
                          Landmark: {a.landmark}
                        </>
                      ) : null}
                      {a.phone ? (
                        <>
                          <br />
                          Phone: {a.phone}
                        </>
                      ) : null}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(a)}>
                        Edit
                      </Button>
                      {!a.is_default ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => makeDefault(a.id)}
                          disabled={busyId === a.id}
                        >
                          Set as default
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => remove(a.id, a.label)}
                        disabled={busyId === a.id}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
