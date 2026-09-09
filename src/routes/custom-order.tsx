import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  CUSTOMIZATION_ADDONS,
  GARMENT_TYPES,
  OCCASIONS,
  NECK_DESIGNS,
  SLEEVE_DESIGNS,
  BACK_DESIGNS,
  MEASUREMENT_MODES,
  toInches,
  fromInches,
} from "@/lib/brand";
import { inr } from "@/lib/format";
import {
  useServices,
  useFabrics,
  useMeasurementFields,
  useAddresses,
  useMeasurementProfiles,
} from "@/lib/queries";
import { storage, validateFile } from "@/lib/storage";


export const Route = createFileRoute("/custom-order")({
  head: () => ({
    meta: [
      { title: "Start a Custom Order — Krishna Tailor's" },
      {
        name: "description",
        content:
          "Build your custom outfit step by step: garment, occasion, design, fabric, customization, reference images, measurements, delivery and payment.",
      },
      { property: "og:title", content: "Start a Custom Order — Krishna Tailor's" },
      {
        property: "og:description",
        content: "Design your garment and see the full INR breakdown before you confirm.",
      },
    ],
  }),
  component: CustomOrder,
});

function CustomOrder() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: services } = useServices();
  const { data: fabrics } = useFabrics();
  const { data: addresses } = useAddresses(user?.id);

  const [serviceId, setServiceId] = useState("");
  const [garment, setGarment] = useState("BLOUSE");
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0] ?? "Everyday");
  const [neck, setNeck] = useState<string>(NECK_DESIGNS[0] ?? "");
  const [sleeve, setSleeve] = useState<string>(SLEEVE_DESIGNS[0] ?? "");
  const [back, setBack] = useState<string>(BACK_DESIGNS[0] ?? "");
  const [fabricSource, setFabricSource] = useState("STUDIO");
  const [fabricId, setFabricId] = useState("");
  const [meters, setMeters] = useState(2);
  const [addons, setAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [unit, setUnit] = useState("in");
  const [mode, setMode] = useState<string>(MEASUREMENT_MODES[0]?.value ?? "KNOWN");
  const [values, setValues] = useState<Record<string, number>>({});
  const [deliveryMode, setDeliveryMode] = useState("DELIVERY");
  const [addressId, setAddressId] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [edited, setEdited] = useState(false);
  const [saveAsProfile, setSaveAsProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const { data: profiles, isLoading: profilesLoading, refetch: refetchProfiles } =
    useMeasurementProfiles(user?.id);

  useEffect(() => {
    if (addressId || !addresses?.length) return;
    const preferred = addresses.find((a) => a.is_default) ?? addresses[0];
    if (preferred) setAddressId(preferred.id);
  }, [addresses, addressId]);

  const { data: fields } = useMeasurementFields(garment);
  const service = (services ?? []).find((s) => s.id === serviceId);
  const fabric = (fabrics ?? []).find((f) => f.id === fabricId);

  const garmentProfiles = useMemo(
    () => (profiles ?? []).filter((p) => p.garment_type === garment),
    [profiles, garment],
  );
  const defaultProfile = garmentProfiles.find((p) => p.is_default);

  useEffect(() => {
    setSelectedProfileId("");
  }, [garment]);

  const applyProfile = (id: string) => {
    const profile = garmentProfiles.find((p) => p.id === id);
    if (!profile) return;
    const raw = (profile.values ?? {}) as Record<string, number>;
    const next: Record<string, number> = {};
    for (const [key, value] of Object.entries(raw)) {
      const num = Number(value);
      if (!Number.isFinite(num)) continue;
      next[key] =
        profile.unit === unit ? num : Math.round(fromInches(toInches(num, profile.unit), unit) * 100) / 100;
    }
    setValues(next);
    setEdited(false);
    toast.success(`Loaded measurements from “${profile.name}”. You can still edit any value.`);
  };

  const saveProfile = async () => {
    if (!user) return;
    const name = newProfileName.trim();
    if (!name) {
      toast.error("Please give the profile a name.");
      return;
    }
    if (!Object.keys(values).length) {
      toast.error("Please enter your measurements first.");
      return;
    }
    setSavingProfile(true);
    const existing = garmentProfiles.find(
      (p) => p.name.trim().toLowerCase() === name.toLowerCase(),
    );
    const payload = { name, garment_type: garment, unit, values };
    const { data, error } = existing
      ? await supabase
          .from("measurement_profiles")
          .update(payload)
          .eq("id", existing.id)
          .select("id")
          .single()
      : await supabase
          .from("measurement_profiles")
          .insert({ ...payload, user_id: user.id })
          .select("id")
          .single();
    setSavingProfile(false);
    if (error || !data) {
      toast.error("Could not save this measurement profile. Please try again.");
      return;
    }
    await refetchProfiles();
    setSelectedProfileId(data.id);
    setEdited(false);
    toast.success(existing ? `Updated profile “${name}”.` : `Saved profile “${name}”.`);
  };


  const totals = useMemo(() => {
    const stitching = service?.base_price ?? 0;
    const fabricCost = fabricSource === "STUDIO" && fabric ? fabric.price_per_meter * meters : 0;
    const addonCost = CUSTOMIZATION_ADDONS.filter((a) => addons.includes(a.key)).reduce(
      (sum, a) => sum + a.price,
      0,
    );
    const subtotal = stitching + fabricCost + addonCost;
    const delivery = deliveryMode === "DELIVERY" ? 120 : 0;
    const tax = Math.round(subtotal * 0.05);
    return { stitching, fabricCost, addonCost, subtotal, delivery, tax, total: subtotal + tax + delivery };
  }, [service, fabric, fabricSource, meters, addons, deliveryMode]);

  const placeOrder = async () => {
    if (!user) {
      toast.error("Please log in to place an order.");
      return;
    }
    if (!service) {
      toast.error("Please choose a service.");
      return;
    }
    setBusy(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: "",
        occasion,
        fabric_source: fabricSource,
        fabric_id: fabricSource === "STUDIO" && fabricId ? fabricId : null,
        fabric_meters: fabricSource === "STUDIO" ? meters : 0,
        measurement_mode: mode,
        measurement_profile_id:
          mode !== "APPOINTMENT" && selectedProfileId ? selectedProfileId : null,
        measurements_snapshot: { unit, values },

        delivery_mode: deliveryMode,
        address_id: deliveryMode === "DELIVERY" && addressId ? addressId : null,
        customer_notes: notes || null,
        subtotal: totals.subtotal,
        tax_amount: totals.tax,
        delivery_charge: totals.delivery,
        discount_amount: 0,
        discount_code: discountCode || null,
        total: totals.total,
      })
      .select("id, order_number")
      .single();

    if (error || !order) {
      setBusy(false);
      toast.error(error?.message ?? "Could not create the order.");
      return;
    }

    await supabase.from("order_items").insert({
      order_id: order.id,
      service_id: service.id,
      service_name: service.name,
      garment_type: garment,
      quantity: 1,
      unit_price: service.base_price,
      design_notes: `Neck: ${neck}; Sleeve: ${sleeve}; Back: ${back}`,
      customizations: { addons },
    });

    await supabase.from("payments").insert({
      order_id: order.id,
      user_id: user.id,
      amount: totals.total,
      method: "MOCK",
      provider: "mock",
      status: "PAID",
      paid_at: new Date().toISOString(),
      reference: `MOCK-${order.order_number}`,
    });

    await supabase.from("orders").update({ payment_status: "PAID" }).eq("id", order.id);

    for (const file of files.slice(0, 5)) {
      const invalid = validateFile(file);
      if (invalid) {
        toast.info(invalid);
        continue;
      }
      try {
        const stored = await storage.upload(user.id, file);
        const { error: uploadRowError } = await supabase.from("order_uploads").insert({
          order_id: order.id,
          user_id: user.id,
          file_url: stored.url,
          file_path: stored.path,
          file_name: stored.name,
          mime_type: stored.mime,
          file_size: stored.size,
        });
        if (uploadRowError) {
          await storage.remove(stored.path);
          toast.info(`Could not attach ${file.name} to your order.`);
        }
      } catch {
        toast.info(`Could not upload ${file.name}`);
      }
    }


    setBusy(false);
    toast.success(`Order ${order.order_number} placed. Test payment recorded.`);
    navigate({ to: "/dashboard" });
  };

  if (!loading && !user) {
    return (
      <SiteLayout>
        <Section className="text-center">
          <h1 className="text-3xl text-primary">Please log in to order</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your measurements and orders are private to your account.
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
        eyebrow="Custom order"
        title="Design your outfit"
        subtitle="Choose the garment, design details, fabric and finishing. Your quote updates as you go."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-10">
            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">1. Garment & occasion</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Service</Label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="mt-2 h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select a service</option>
                    {(services ?? []).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {inr(s.base_price)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Garment type</Label>
                  <select
                    value={garment}
                    onChange={(e) => setGarment(e.target.value)}
                    className="mt-2 h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
                  >
                    {GARMENT_TYPES.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Occasion</Label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="mt-2 h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
                  >
                    {OCCASIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">2. Design</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  ["Neckline", neck, setNeck, NECK_DESIGNS],
                  ["Sleeve", sleeve, setSleeve, SLEEVE_DESIGNS],
                  ["Back", back, setBack, BACK_DESIGNS],
                ].map(([label, value, setter, options]) => (
                  <div key={label as string}>
                    <Label>{label as string}</Label>
                    <select
                      value={value as string}
                      onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                      className="mt-2 h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
                    >
                      {(options as string[]).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">3. Fabric</h2>
              <div className="mt-4 flex gap-2">
                {([
                  ["STUDIO", "Studio fabric"],
                  ["CUSTOMER", "I'll provide fabric"],
                ] as const).map(([value, label]) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={fabricSource === value ? "default" : "outline"}
                    onClick={() => setFabricSource(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              {fabricSource === "STUDIO" ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Fabric</Label>
                    <select
                      value={fabricId}
                      onChange={(e) => setFabricId(e.target.value)}
                      className="mt-2 h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select fabric</option>
                      {(fabrics ?? []).map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} — {inr(f.price_per_meter)}/m
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="meters">Metres</Label>
                    <Input
                      id="meters"
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={meters}
                      onChange={(e) => setMeters(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">4. Customization</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {CUSTOMIZATION_ADDONS.map((a) => (
                  <label
                    key={a.key}
                    className="flex items-center justify-between gap-3 rounded-sm border border-border px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-3">
                      <Checkbox
                        checked={addons.includes(a.key)}
                        onCheckedChange={(checked) =>
                          setAddons((prev) =>
                            checked ? [...prev, a.key] : prev.filter((k) => k !== a.key),
                          )
                        }
                      />
                      {a.label}
                    </span>
                    <span className="text-muted-foreground">+{inr(a.price)}</span>
                  </label>
                ))}
              </div>
              <div className="mt-5">
                <Label htmlFor="notes">Custom notes</Label>
                <Textarea
                  id="notes"
                  rows={3}
                  maxLength={1000}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="mt-5">
                <Label htmlFor="refs">Reference images or PDFs</Label>
                <Input
                  id="refs"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                  className="mt-2"
                />
                {files.length ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {files.length} file(s) selected
                  </p>
                ) : null}
              </div>
            </div>

            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">5. Measurements</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {MEASUREMENT_MODES.map((m) => (
                  <Button
                    key={m.value}
                    size="sm"
                    variant={mode === m.value ? "default" : "outline"}
                    onClick={() => setMode(m.value)}
                  >
                    {m.label}
                  </Button>
                ))}
              </div>
              {mode === "APPOINTMENT" ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  Our staff will take your measurements.{" "}
                  <Link to="/book-measurement" className="text-primary underline">
                    Book an appointment
                  </Link>{" "}
                  after placing the order.
                </p>
              ) : (
                <>
                  <div className="mt-5 rounded-sm border border-border p-4">
                    <Label>Use a saved measurement profile</Label>
                    {profilesLoading ? (
                      <p className="mt-2 text-xs text-muted-foreground">Loading your saved profiles…</p>
                    ) : garmentProfiles.length ? (
                      <>
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                          <select
                            value={selectedProfileId}
                            onChange={(e) => setSelectedProfileId(e.target.value)}
                            className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
                          >
                            <option value="">No saved profile</option>
                            {garmentProfiles.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.unit === "cm" ? "cm" : "inches"})
                                {p.is_default ? " — default" : ""}
                              </option>
                            ))}
                          </select>
                          <Button
                            size="sm"
                            variant="outline"
                            className="sm:w-auto"
                            disabled={!selectedProfileId}
                            onClick={() => applyProfile(selectedProfileId)}
                          >
                            Load measurements
                          </Button>
                          {defaultProfile ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="sm:w-auto"
                              onClick={() => {
                                setSelectedProfileId(defaultProfile.id);
                                applyProfile(defaultProfile.id);
                              }}
                            >
                              Use default profile
                            </Button>
                          ) : null}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Loading a profile fills the fields below — you can still edit any value.
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">
                        You have no saved profiles for this garment yet. Enter your measurements
                        below and save them for next time.
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    {["in", "cm"].map((u) => (
                      <Button
                        key={u}
                        size="sm"
                        variant={unit === u ? "default" : "outline"}
                        onClick={() => setUnit(u)}
                      >
                        {u === "in" ? "Inches" : "Centimetres"}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(fields ?? []).map((f) => (
                      <div key={f.id}>
                        <Label htmlFor={f.field_key}>
                          {f.label}
                          {f.required ? " *" : ""}
                        </Label>
                        <Input
                          id={f.field_key}
                          type="number"
                          step={0.25}
                          value={values[f.field_key] ?? ""}
                          onChange={(e) => {
                            setValues({ ...values, [f.field_key]: Number(e.target.value) });
                            setEdited(true);
                          }}
                          className="mt-2"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">{f.instruction}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-sm border border-border p-4">
                    <label className="flex items-center gap-3 text-sm">
                      <Checkbox
                        checked={saveAsProfile}
                        onCheckedChange={(checked) => setSaveAsProfile(Boolean(checked))}
                      />
                      Save these measurements as a profile
                    </label>
                    {saveAsProfile ? (
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <Input
                          value={newProfileName}
                          onChange={(e) => setNewProfileName(e.target.value)}
                          maxLength={60}
                          placeholder="Profile name (e.g. Regular)"
                        />
                        <Button
                          variant="outline"
                          className="sm:w-auto"
                          disabled={savingProfile}
                          onClick={saveProfile}
                        >
                          {savingProfile ? "Saving…" : "Save profile"}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>


            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">6. Delivery</h2>
              <div className="mt-4 flex gap-2">
                {([
                  ["DELIVERY", "Home delivery"],
                  ["PICKUP", "Studio pickup"],
                ] as const).map(([value, label]) => (
                  <Button
                    key={value}
                    size="sm"
                    variant={deliveryMode === value ? "default" : "outline"}
                    onClick={() => setDeliveryMode(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              {deliveryMode === "DELIVERY" ? (
                <div className="mt-4">
                  <Label>Address</Label>
                  <select
                    value={addressId}
                    onChange={(e) => setAddressId(e.target.value)}
                    className="mt-2 h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Select a saved address</option>
                    {(addresses ?? []).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label} — {a.city} {a.pincode}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Need a new address?{" "}
                    <Link to="/addresses" className="text-primary underline">
                      Manage your addresses
                    </Link>
                    .
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">Order summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                {[
                  ["Stitching", totals.stitching],
                  ["Fabric", totals.fabricCost],
                  ["Customization", totals.addonCost],
                  ["GST (5%)", totals.tax],
                  ["Delivery", totals.delivery],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between">
                    <dt className="text-muted-foreground">{label as string}</dt>
                    <dd>{inr(value as number)}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 border-t border-border pt-4">
                <Label htmlFor="code">Discount code</Label>
                <Input
                  id="code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  className="mt-2"
                />
              </div>
              <div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-2xl text-primary">
                <span>Total</span>
                <span>{inr(totals.total)}</span>
              </div>
              <Button
                size="lg"
                className="mt-6 w-full"
                onClick={placeOrder}
                disabled={busy || !serviceId}
              >
                {busy ? "Placing order…" : "Pay (test) & confirm"}
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Test payment only — no real money is charged and no card details are stored.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </SiteLayout>
  );
}
