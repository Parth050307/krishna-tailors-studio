import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { notify } from "@/lib/notify";
import {
  ORDER_FLOW,
  STATUS_LABEL,
  PAYMENT_LABEL,
  ROLE_LABEL,
  type AppRole,
  type OrderStatus,
} from "@/lib/brand";
import { inr, shortDate } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Studio Admin — Krishna Tailor's" },
      { name: "description", content: "Internal studio dashboard for orders, appointments and team." },
      { property: "og:title", content: "Studio Admin — Krishna Tailor's" },
      { property: "og:description", content: "Staff-only order, appointment and team management." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const ALL_STATUSES: OrderStatus[] = [...ORDER_FLOW, "CANCELLED"];
const ROLES = Object.keys(ROLE_LABEL) as AppRole[];

function Admin() {
  const { user, isStaff, isAdmin, loading } = useAuth();
  const qc = useQueryClient();
  const staffEnabled = Boolean(user && isStaff);

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    enabled: staffEnabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_number, status, payment_status, total, created_at, user_id, assigned_staff_id",
        )
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const { data: appts } = useQuery({
    queryKey: ["admin-appointments"],
    enabled: staffEnabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("id, user_id, scheduled_date, slot, mode, status, contact_name, city")
        .order("scheduled_date", { ascending: true })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const { data: staff } = useQuery({
    queryKey: ["admin-staff"],
    enabled: staffEnabled,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff")
        .select("id, user_id, name, role, phone, specialization, active")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: people } = useQuery({
    queryKey: ["admin-people"],
    enabled: staffEnabled,
    queryFn: async () => {
      const [{ data: profiles, error: pe }, { data: roles, error: re }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, phone, city").order("full_name"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (pe) throw pe;
      if (re) throw re;
      return (profiles ?? []).map((p) => ({
        ...p,
        roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role as AppRole),
      }));
    },
  });

  const staffName = useMemo(() => {
    const map: Record<string, string> = {};
    for (const s of staff ?? []) map[s.id] = s.name;
    return map;
  }, [staff]);

  const setStatus = async (
    order: { id: string; order_number: string; user_id: string },
    status: OrderStatus,
  ) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", order.id);
    if (error) { toast.error(error.message); return; }
    await supabase.from("order_status_history").insert({
      order_id: order.id,
      status,
      note: "Updated by studio",
      created_by: user!.id,
    });
    await notify({
      userId: order.user_id,
      type: "ORDER_STATUS",
      title: `${order.order_number} — ${STATUS_LABEL[status]}`,
      body: `Your order is now at the ${STATUS_LABEL[status]} stage.`,
      link: `/dashboard?order=${order.id}`,
      channels: ["IN_APP", "WHATSAPP"],
    });
    toast.success(`Moved to ${STATUS_LABEL[status]}`);
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const assign = async (orderId: string, staffId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ assigned_staff_id: staffId === "none" ? null : staffId })
      .eq("id", orderId);
    if (error) { toast.error(error.message); return; }
    toast.success(staffId === "none" ? "Unassigned" : `Assigned to ${staffName[staffId]}`);
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const setPayment = async (orderId: string, payment_status: "PENDING" | "PAID" | "REFUNDED") => {
    const { error } = await supabase.from("orders").update({ payment_status }).eq("id", orderId);
    if (error) { toast.error(error.message); return; }
    toast.success(`Payment marked ${PAYMENT_LABEL[payment_status]}`);
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const setApptStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("appointments")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ status: status as any })
      .eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Appointment ${status.toLowerCase()}`);
    qc.invalidateQueries({ queryKey: ["admin-appointments"] });
  };

  const toggleRole = async (userId: string, role: AppRole, has: boolean) => {
    if (has) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) { toast.error(error.message); return; }
      toast.success(`Removed ${ROLE_LABEL[role]}`);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) { toast.error(error.message); return; }
      toast.success(`Granted ${ROLE_LABEL[role]}`);
    }
    qc.invalidateQueries({ queryKey: ["admin-people"] });
  };

  if (!loading && (!user || !isStaff)) {
    return (
      <SiteLayout>
        <Section className="text-center">
          <h1 className="text-3xl text-primary">Staff access only</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This area is restricted to studio staff.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/">Back to site</Link>
            </Button>
          </div>
        </Section>
      </SiteLayout>
    );
  }

  const revenue = (orders ?? []).reduce((sum, o) => sum + Number(o.total), 0);
  const paidRevenue = (orders ?? [])
    .filter((o) => o.payment_status === "PAID")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pendingPay = (orders ?? []).filter((o) => o.payment_status === "PENDING").length;
  const inProduction = (orders ?? []).filter((o) =>
    ["CUTTING", "STITCHING", "FINISHING", "QUALITY_CHECK"].includes(o.status),
  ).length;
  const ready = (orders ?? []).filter((o) => o.status === "READY").length;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Studio"
        title="Admin Dashboard"
        subtitle="Orders, payments, appointments and your team."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Orders", String((orders ?? []).length)],
            ["Total value", inr(revenue)],
            ["Collected", inr(paidRevenue)],
            ["Pending payments", String(pendingPay)],
            ["In production", String(inProduction)],
            ["Ready", String(ready)],
          ].map(([label, value]) => (
            <div key={label} className="card-luxe rounded-sm p-5">
              <p className="eyebrow">{label}</p>
              <p className="mt-2 font-display text-2xl text-primary">{value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="orders" className="mt-12">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="team">Team &amp; roles</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6 space-y-3">
            {(orders ?? []).map((o) => (
              <div key={o.id} className="rounded-sm border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="font-display text-lg text-primary">{o.order_number}</span>
                  <span className="text-muted-foreground">{shortDate(o.created_at)}</span>
                  <span>{inr(o.total)}</span>
                  <span className="text-muted-foreground">
                    Payment: {PAYMENT_LABEL[o.payment_status]}
                  </span>
                  <span className="text-muted-foreground">
                    {o.assigned_staff_id ? staffName[o.assigned_staff_id] ?? "Assigned" : "Unassigned"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Select value={o.status} onValueChange={(v) => setStatus(o, v as OrderStatus)}>
                    <SelectTrigger className="w-56">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={o.assigned_staff_id ?? "none"}
                    onValueChange={(v) => assign(o.id, v)}
                  >
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Assign staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {(staff ?? [])
                        .filter((s) => s.active)
                        .map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} · {ROLE_LABEL[s.role]}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {o.payment_status !== "PAID" ? (
                    <Button size="sm" variant="outline" onClick={() => setPayment(o.id, "PAID")}>
                      Mark paid
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPayment(o.id, "REFUNDED")}
                    >
                      Mark refunded
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {(orders ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            )}
          </TabsContent>

          <TabsContent value="appointments" className="mt-6 space-y-3">
            {(appts ?? []).map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border bg-card px-4 py-3 text-sm"
              >
                <span className="text-primary">{a.contact_name}</span>
                <span className="text-muted-foreground">
                  {shortDate(a.scheduled_date)} · {a.slot}
                </span>
                <span className="text-muted-foreground">
                  {a.mode} {a.city ? `· ${a.city}` : ""}
                </span>
                <span className="text-muted-foreground">{a.status}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setApptStatus(a.id, "CONFIRMED")}>
                    Confirm
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setApptStatus(a.id, "COMPLETED")}>
                    Complete
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setApptStatus(a.id, "CANCELLED")}>
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
            {(appts ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No appointments yet.</p>
            )}
          </TabsContent>

          <TabsContent value="team" className="mt-6 space-y-10">
            {isAdmin && (
              <AddStaffForm
                people={people ?? []}
                onDone={() => {
                  qc.invalidateQueries({ queryKey: ["admin-staff"] });
                  qc.invalidateQueries({ queryKey: ["admin-people"] });
                }}
              />
            )}


            <div>
              <h3 className="font-display text-xl text-primary">Studio team</h3>
              <div className="mt-4 space-y-2">
                {(staff ?? []).map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border bg-card px-4 py-3 text-sm"
                  >
                    <span className="text-primary">{s.name}</span>
                    <span className="text-muted-foreground">{ROLE_LABEL[s.role]}</span>
                    <span className="text-muted-foreground">{s.specialization ?? "—"}</span>
                    <span className="text-muted-foreground">{s.phone ?? "—"}</span>
                    <span className="text-muted-foreground">{s.active ? "Active" : "Inactive"}</span>
                  </div>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div>
                <h3 className="font-display text-xl text-primary">Account roles</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Grant a login the permissions it needs. Removing every role turns the account back
                  into a customer.
                </p>
                <div className="mt-4 space-y-3">
                  {(people ?? []).map((p) => (
                    <div key={p.id} className="rounded-sm border border-border bg-card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                        <span className="text-primary">{p.full_name || "Unnamed customer"}</span>
                        <span className="text-muted-foreground">
                          {p.city ?? "—"} {p.phone ? `· ${p.phone}` : ""}
                        </span>
                        <span className="text-muted-foreground">
                          {p.roles.length ? p.roles.map((r) => ROLE_LABEL[r]).join(", ") : "Customer"}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ROLES.map((role) => {
                          const has = p.roles.includes(role);
                          return (
                            <Button
                              key={role}
                              size="sm"
                              variant={has ? "default" : "outline"}
                              onClick={() => toggleRole(p.id, role, has)}
                            >
                              {ROLE_LABEL[role]}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Section>
    </SiteLayout>
  );
}

type PersonOption = { id: string; full_name: string | null; roles: AppRole[] };

function AddStaffForm({ people, onDone }: { people: PersonOption[]; onDone: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<AppRole>("TAILOR");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [accountId, setAccountId] = useState<string>("none");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim()) { toast.error("Add a name for the team member."); return; }
    setBusy(true);
    const linkedId = accountId === "none" ? null : accountId;
    const { error } = await supabase.from("staff").insert({
      name: name.trim(),
      role,
      phone: phone.trim() || null,
      specialization: specialization.trim() || null,
      user_id: linkedId,
      active: true,
    });
    if (!error && linkedId) {
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: linkedId, role });
      if (roleError && !roleError.message.includes("duplicate")) {
        toast.error(roleError.message);
      }
    }
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`${name.trim()} added to the team`);
    setName("");
    setPhone("");
    setSpecialization("");
    setAccountId("none");
    onDone();
  };


  return (
    <div className="card-luxe rounded-sm p-6">
      <h3 className="font-display text-xl text-primary">Add a team member</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="staff-name">Name</Label>
          <Input id="staff-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABEL[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="staff-phone">Phone</Label>
          <Input id="staff-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="staff-spec">Specialisation</Label>
          <Input
            id="staff-spec"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>
      </div>
      <Button className="mt-5" onClick={submit} disabled={busy}>
        {busy ? "Adding…" : "Add team member"}
      </Button>
    </div>
  );
}
