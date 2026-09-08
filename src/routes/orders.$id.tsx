import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useOrder } from "@/lib/queries";
import { inr, shortDate, dateTime, titleCase } from "@/lib/format";
import { ORDER_FLOW, STATUS_LABEL, PAYMENT_LABEL } from "@/lib/brand";
import { OrderReferenceFiles } from "@/components/site/OrderReferenceFiles";
import { useMyAppointments } from "@/lib/queries";

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order Details — Krishna Tailor's" },
      { name: "description", content: "Track your custom tailoring order, status timeline, measurements, references and payment." },
      { property: "og:title", content: "Order Details — Krishna Tailor's" },
      { property: "og:description", content: "Track your order end to end." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = useParams({ from: "/orders/$id" });
  const { user, loading: authLoading } = useAuth();
  const { data: order, isLoading, error } = useOrder(id);
  const { data: appointments } = useMyAppointments(user?.id);

  if (authLoading || isLoading) {
    return (
      <SiteLayout>
        <Section className="text-center">
          <p className="text-muted-foreground">Loading order…</p>
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
            <Button asChild size="lg"><Link to="/auth">Login or register</Link></Button>
          </div>
        </Section>
      </SiteLayout>
    );
  }

  if (error || !order) {
    return (
      <SiteLayout>
        <Section className="text-center">
          <h1 className="text-3xl text-primary">Order not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This order does not exist or you don't have access to it.
          </p>
          <div className="mt-8">
            <Button asChild variant="outline"><Link to="/dashboard">Back to Orders</Link></Button>
          </div>
        </Section>
      </SiteLayout>
    );
  }

  const isCancelled = order.status === "CANCELLED";
  const stepIndex = ORDER_FLOW.indexOf(order.status);
  const step = stepIndex + 1;
  const history = [...(order.order_status_history ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const items = order.order_items ?? [];
  const payments = order.payments ?? [];
  const relatedAppointment = (appointments ?? []).find((a) => a.order_id === order.id);
  const address = order.addresses;
  const fabric = order.fabrics;

  return (
    <SiteLayout>
      <PageHero
        eyebrow={`Placed ${shortDate(order.created_at)}`}
        title={`Order ${order.order_number}`}
        subtitle={`${STATUS_LABEL[order.status]} · Payment ${PAYMENT_LABEL[order.payment_status]}`}
      />
      <Section>
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard">← Back to Orders</Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-8">
            {/* Progress */}
            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">Progress</h2>
              {isCancelled ? (
                <p className="mt-3 text-sm text-destructive">This order was cancelled.</p>
              ) : (
                <>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {STATUS_LABEL[order.status]} · step {step} of {ORDER_FLOW.length}
                  </p>
                  <div className="mt-3 h-1.5 w-full rounded-full bg-secondary">
                    <div
                      className="h-1.5 rounded-full bg-gold"
                      style={{ width: `${(Math.max(step, 0) / ORDER_FLOW.length) * 100}%` }}
                    />
                  </div>
                  <ol className="mt-5 grid gap-2 sm:grid-cols-2">
                    {ORDER_FLOW.map((s, i) => {
                      const done = i <= stepIndex;
                      return (
                        <li key={s} className="flex items-center gap-2 text-sm">
                          <span
                            className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] ${
                              done ? "bg-gold text-primary" : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span className={done ? "text-primary" : "text-muted-foreground"}>
                            {STATUS_LABEL[s]}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </>
              )}
            </div>

            {/* Timeline */}
            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">Status timeline</h2>
              {history.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No updates yet.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {history.map((h) => (
                    <li key={h.id} className="border-l-2 border-gold/60 pl-3">
                      <p className="text-sm text-primary">{STATUS_LABEL[h.status]}</p>
                      <p className="text-xs text-muted-foreground">{dateTime(h.created_at)}</p>
                      {h.note ? <p className="mt-1 text-sm">{h.note}</p> : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Items */}
            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">Garments</h2>
              {items.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No items on this order.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {items.map((it) => {
                    const c = (it.customizations ?? {}) as Record<string, unknown>;
                    return (
                      <li key={it.id} className="rounded-sm border border-border p-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="font-display text-lg text-primary">{it.service_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty {it.quantity} · {inr(it.unit_price)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {titleCase(it.garment_type)}
                        </p>
                        {Object.keys(c).length > 0 ? (
                          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                            {Object.entries(c).map(([k, v]) => (
                              <div key={k}>
                                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                                  {titleCase(k)}
                                </dt>
                                <dd className="text-primary">
                                  {Array.isArray(v) ? v.join(", ") : String(v)}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        ) : null}
                        {it.design_notes ? (
                          <p className="mt-3 text-sm">
                            <span className="text-muted-foreground">Notes: </span>
                            {it.design_notes}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Measurements */}
            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">Measurements</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Mode: {titleCase(order.measurement_mode)}
              </p>
              {(() => {
                const snap = (order.measurements_snapshot ?? {}) as Record<string, unknown>;
                const values = (snap.values ?? snap) as Record<string, unknown>;
                const unit = (snap.unit as string) ?? "in";
                const entries = Object.entries(values ?? {}).filter(
                  ([, v]) => typeof v === "number" || typeof v === "string",
                );
                if (entries.length === 0) {
                  return (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Measurements will be captured at your appointment.
                    </p>
                  );
                }
                return (
                  <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2 md:grid-cols-3">
                    {entries.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                          {titleCase(k)}
                        </dt>
                        <dd className="text-primary">
                          {String(v)} {unit}
                        </dd>
                      </div>
                    ))}
                  </dl>
                );
              })()}
            </div>

            {/* References */}
            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">Reference files</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Private to you and our studio team.
              </p>
              <OrderReferenceFiles orderId={order.id} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{inr(order.subtotal)}</dd>
                </div>
                {Number(order.discount_amount) > 0 ? (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      Discount{order.discount_code ? ` (${order.discount_code})` : ""}
                    </dt>
                    <dd>-{inr(order.discount_amount)}</dd>
                  </div>
                ) : null}
                {Number(order.tax_amount) > 0 ? (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tax</dt>
                    <dd>{inr(order.tax_amount)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd>{inr(order.delivery_charge)}</dd>
                </div>
                <div className="mt-2 flex justify-between border-t border-border pt-2">
                  <dt className="text-primary">Total</dt>
                  <dd className="font-display text-lg text-primary">{inr(order.total)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-sm">
                <span className="text-muted-foreground">Payment: </span>
                {PAYMENT_LABEL[order.payment_status]}
              </p>
              {payments.length > 0 ? (
                <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                  {payments.map((p) => (
                    <li key={p.id}>
                      {p.method} · {inr(p.amount)} · {PAYMENT_LABEL[p.status]}
                      {p.paid_at ? ` · ${shortDate(p.paid_at)}` : ""}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">Delivery</h2>
              <p className="mt-2 text-sm">
                {order.delivery_mode === "PICKUP" ? "Pickup at studio" : "Home delivery"}
              </p>
              {order.expected_date ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Expected {shortDate(order.expected_date)}
                </p>
              ) : null}
              {address ? (
                <address className="mt-3 not-italic text-sm text-muted-foreground">
                  {address.full_name}<br />
                  {address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />
                  {address.city}, {address.state} {address.pincode}
                  {address.phone ? <><br />{address.phone}</> : null}
                </address>
              ) : null}
              {fabric ? (
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Fabric: </span>
                  {fabric.name} · {fabric.fabric_type} · {fabric.color}
                </p>
              ) : null}
            </div>

            {relatedAppointment ? (
              <div className="card-luxe rounded-sm p-6">
                <h2 className="font-display text-xl text-primary">Appointment</h2>
                <p className="mt-2 text-sm text-primary">
                  {shortDate(relatedAppointment.scheduled_date)} · {relatedAppointment.slot}
                </p>
                <p className="text-sm text-muted-foreground">
                  {relatedAppointment.mode === "HOME" ? "Home visit" : "At studio"} ·{" "}
                  {relatedAppointment.status}
                </p>
              </div>
            ) : null}

            {order.customer_notes ? (
              <div className="card-luxe rounded-sm p-6">
                <h2 className="font-display text-xl text-primary">Your notes</h2>
                <p className="mt-2 text-sm">{order.customer_notes}</p>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>
    </SiteLayout>
  );
}
