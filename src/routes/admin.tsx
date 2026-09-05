import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ORDER_FLOW, STATUS_LABEL, PAYMENT_LABEL, type OrderStatus } from "@/lib/brand";
import { inr, shortDate } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Studio Admin — Krishna Tailor's" },
      { name: "description", content: "Internal studio dashboard for orders and appointments." },
      { property: "og:title", content: "Studio Admin — Krishna Tailor's" },
      { property: "og:description", content: "Staff-only order and appointment management." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { user, isStaff, loading } = useAuth();
  const qc = useQueryClient();

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    enabled: Boolean(user && isStaff),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, payment_status, total, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: appts } = useQuery({
    queryKey: ["admin-appointments"],
    enabled: Boolean(user && isStaff),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("id, scheduled_date, slot, mode, status, contact_name, city")
        .order("scheduled_date", { ascending: true })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const advance = async (id: string, status: OrderStatus) => {
    const next = ORDER_FLOW[ORDER_FLOW.indexOf(status) + 1];
    if (!next) {
      toast.info("This order is already delivered.");
      return;
    }
    const { error } = await supabase.from("orders").update({ status: next }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Moved to ${STATUS_LABEL[next]}`);
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
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
  const pendingPay = (orders ?? []).filter((o) => o.payment_status === "PENDING").length;

  return (
    <SiteLayout>
      <PageHero eyebrow="Studio" title="Admin Dashboard" subtitle="Orders, payments and appointments." />
      <Section>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            ["Orders", String((orders ?? []).length)],
            ["Revenue", inr(revenue)],
            ["Pending payments", String(pendingPay)],
            ["Appointments", String((appts ?? []).length)],
          ].map(([label, value]) => (
            <div key={label} className="card-luxe rounded-sm p-5">
              <p className="eyebrow">{label}</p>
              <p className="mt-2 font-display text-2xl text-primary">{value}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl text-primary">Recent orders</h2>
        <div className="mt-4 space-y-3">
          {(orders ?? []).map((o) => (
            <div
              key={o.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-border bg-card px-4 py-3 text-sm"
            >
              <span className="text-primary">{o.order_number}</span>
              <span className="text-muted-foreground">{STATUS_LABEL[o.status]}</span>
              <span className="text-muted-foreground">{PAYMENT_LABEL[o.payment_status]}</span>
              <span>{inr(o.total)}</span>
              <span className="text-muted-foreground">{shortDate(o.created_at)}</span>
              <Button size="sm" variant="outline" onClick={() => advance(o.id, o.status)}>
                Advance stage
              </Button>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl text-primary">Appointments</h2>
        <div className="mt-4 space-y-3">
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
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
