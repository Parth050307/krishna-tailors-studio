import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Krishna Tailor's" },
      {
        name: "description",
        content: "Set a new password for your Krishna Tailor's account.",
      },
      { property: "og:title", content: "Reset Password — Krishna Tailor's" },
      {
        property: "og:description",
        content: "Set a new password for your Krishna Tailor's account.",
      },
    ],
  }),
  component: ResetPasswordPage,
});

const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery") || hash.includes("access_token")) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pass = passwordSchema.safeParse(password);
    if (!pass.success) {
      toast.error(pass.error.issues[0]!.message);
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. Redirecting you to the dashboard…");
    setTimeout(() => navigate({ to: "/dashboard" }), 1200);
  };

  if (!valid) {
    return (
      <SiteLayout>
        <Section className="max-w-lg text-center">
          <h1 className="text-3xl text-primary">Link expired or invalid</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Please request a new password reset link from the login page.
          </p>
          <Button className="mt-6" asChild>
            <a href="/auth">Back to login</a>
          </Button>
        </Section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <Section className="max-w-lg">
        <h1 className="text-center text-3xl text-primary">Set new password</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Choose a strong password for your account.
        </p>
        <div className="gold-rule mx-auto mt-6 max-w-24" aria-hidden />

        <form onSubmit={submit} className="card-luxe mt-8 space-y-5 rounded-sm p-6">
          <div>
            <Label htmlFor="new-pass">New password</Label>
            <Input
              id="new-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="confirm-pass">Confirm new password</Label>
            <Input
              id="confirm-pass"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            Update password
          </Button>
        </form>
      </Section>
    </SiteLayout>
  );
}
