import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageHero, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyOrders, useMyAppointments, useNotifications } from "@/lib/queries";
import { inr, shortDate } from "@/lib/format";
import { ORDER_FLOW, STATUS_LABEL, PAYMENT_LABEL } from "@/lib/brand";
import { OrderReferenceFiles } from "@/components/site/OrderReferenceFiles";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — Krishna Tailor's" },
      {
        name: "description",
        content:
          "Track your tailoring orders, appointments and notifications in your Krishna Tailor's account.",
      },
      { property: "og:title", content: "My Dashboard — Krishna Tailor's" },
      { property: "og:description", content: "Your orders, appointments and updates." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, profile, loading } = useAuth();
  const { data: orders } = useMyOrders(user?.id);
  const { data: appointments } = useMyAppointments(user?.id);
  const { data: notifications } = useNotifications(user?.id);

  if (!loading && !user) {
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

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Your account"
        title={profile?.full_name ? `Welcome, ${profile.full_name}` : "My Dashboard"}
        subtitle="Your orders, appointments and studio updates in one place."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl text-primary">Orders</h2>
              <div className="mt-4 space-y-4">
                {(orders ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No orders yet.{" "}
                    <Link to="/custom-order" className="text-primary underline">
                      Start a custom order
                    </Link>
                    .
                  </p>
                ) : null}
                {(orders ?? []).map((order) => {
                  const step = ORDER_FLOW.indexOf(order.status) + 1;
                  return (
                    <Link
                      key={order.id}
                      to="/orders/$id"
                      params={{ id: order.id }}
                      className="card-luxe block rounded-sm p-6 transition hover:border-gold"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-display text-xl text-primary">
                          {order.order_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {shortDate(order.created_at)}
                        </p>
                      </div>
                      <p className="mt-2 text-sm">
                        {STATUS_LABEL[order.status]} · step {step} of {ORDER_FLOW.length}
                      </p>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-secondary">
                        <div
                          className="h-1.5 rounded-full bg-gold"
                          style={{ width: `${(step / ORDER_FLOW.length) * 100}%` }}
                        />
                      </div>
                      <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
                        <span className="text-muted-foreground">
                          Payment: {PAYMENT_LABEL[order.payment_status]}
                        </span>
                        <span className="font-display text-lg text-primary">
                          {inr(order.total)}
                        </span>
                      </div>
                      <OrderReferenceFiles orderId={order.id} />
                      <p className="mt-3 text-xs uppercase tracking-widest text-gold">
                        View details →
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-primary">Appointments</h2>
              <div className="mt-4 space-y-3">
                {(appointments ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No appointments.{" "}
                    <Link to="/book-measurement" className="text-primary underline">
                      Book a measurement
                    </Link>
                    .
                  </p>
                ) : null}
                {(appointments ?? []).map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-border bg-card px-4 py-3 text-sm"
                  >
                    <span className="text-primary">
                      {shortDate(a.scheduled_date)} · {a.slot}
                    </span>
                    <span className="text-muted-foreground">
                      {a.mode === "HOME" ? "Home visit" : "At studio"} · {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">Notifications</h2>
              <ul className="mt-4 space-y-3">
                {(notifications ?? []).length === 0 ? (
                  <li className="text-sm text-muted-foreground">Nothing new.</li>
                ) : null}
                {(notifications ?? []).slice(0, 8).map((n) => (
                  <li key={n.id} className="border-l border-gold/60 pl-3 text-sm">
                    <p className="text-primary">{n.title}</p>
                    <p className="text-muted-foreground">{n.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-luxe rounded-sm p-6">
              <h2 className="font-display text-xl text-primary">Quick actions</h2>
              <div className="mt-4 grid gap-2">
                <Button asChild variant="outline">
                  <Link to="/custom-order">New custom order</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/book-measurement">Book measurement</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/measurement-guide">Measurement guide</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/profile">Profile & settings</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </SiteLayout>
  );
}
