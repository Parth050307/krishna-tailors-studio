import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { SiteLayout, Section } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Register — Krishna Tailor's" },
      {
        name: "description",
        content:
          "Sign in to track your tailoring orders, saved measurement profiles, appointments and saved designs at Krishna Tailor's.",
      },
      { property: "og:title", content: "Login or Register — Krishna Tailor's" },
      {
        property: "og:description",
        content: "Access your orders, measurements and appointments.",
      },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

function AuthPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({ name: "", phone: "", email: "", password: "" });

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailSchema.safeParse(login.email);
    const pass = passwordSchema.safeParse(login.password);
    if (!email.success || !pass.success) {
      toast.error(email.success ? pass.error!.issues[0]!.message : email.error.issues[0]!.message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.data,
      password: pass.data,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back.");
    navigate({ to: "/dashboard" });
  };

  const doSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailSchema.safeParse(signup.email);
    const pass = passwordSchema.safeParse(signup.password);
    if (!signup.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.success || !pass.success) {
      toast.error(email.success ? pass.error!.issues[0]!.message : email.error.issues[0]!.message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email.data,
      password: pass.data,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: signup.name.trim(), phone: signup.phone.trim() },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created. You can start your first order.");
    navigate({ to: "/dashboard" });
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try email instead.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  const doReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailSchema.safeParse(resetEmail);
    if (!email.success) {
      toast.error(email.error.issues[0]!.message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setResetSent(true);
    toast.success("Password reset link sent. Check your inbox.");
  };

  return (
    <SiteLayout>
      <Section className="max-w-lg">
        <h1 className="text-center text-4xl text-primary">Your Account</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Track orders, keep measurement profiles and manage appointments.
        </p>
        <div className="gold-rule mx-auto mt-6 max-w-24" aria-hidden />

        <Tabs defaultValue="login" className="mt-10">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={doLogin} className="card-luxe space-y-5 rounded-sm p-6">
              <div>
                <Label htmlFor="l-email">Email</Label>
                <Input
                  id="l-email"
                  type="email"
                  value={login.email}
                  onChange={(e) => setLogin({ ...login, email: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="l-pass">Password</Label>
                <Input
                  id="l-pass"
                  type="password"
                  value={login.password}
                  onChange={(e) => setLogin({ ...login, password: e.target.value })}
                  className="mt-2"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setResetOpen(true);
                  setResetEmail(login.email);
                  setResetSent(false);
                }}
                className="self-start text-sm text-primary underline-offset-2 hover:underline"
              >
                Forgot password?
              </button>
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={doSignup} className="card-luxe space-y-5 rounded-sm p-6">
              <div>
                <Label htmlFor="s-name">Full name</Label>
                <Input
                  id="s-name"
                  value={signup.name}
                  maxLength={100}
                  onChange={(e) => setSignup({ ...signup, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="s-phone">Phone</Label>
                <Input
                  id="s-phone"
                  value={signup.phone}
                  maxLength={15}
                  onChange={(e) => setSignup({ ...signup, phone: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="s-email">Email</Label>
                <Input
                  id="s-email"
                  type="email"
                  value={signup.email}
                  onChange={(e) => setSignup({ ...signup, email: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="s-pass">Password</Label>
                <Input
                  id="s-pass"
                  type="password"
                  value={signup.password}
                  onChange={(e) => setSignup({ ...signup, password: e.target.value })}
                  className="mt-2"
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button variant="outline" size="lg" className="w-full" onClick={google}>
            Continue with Google
          </Button>
        </div>
      </Section>
    </SiteLayout>
  );
}
