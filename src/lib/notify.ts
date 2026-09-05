import { supabase } from "@/integrations/supabase/client";

export type NotifyChannel = "IN_APP" | "WHATSAPP" | "EMAIL";

/**
 * Notification provider abstraction. WhatsApp and email run in MOCK mode: the
 * message is recorded in-app with the target channel so templates and delivery
 * can be swapped for a real provider without touching call sites.
 */
export async function notify(input: {
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  channels?: NotifyChannel[];
}) {
  const channels = input.channels ?? ["IN_APP"];
  const rows = channels.map((channel) => ({
    user_id: input.userId,
    type: input.type,
    title: input.title,
    body: input.body ?? "",
    link: input.link ?? null,
    channel,
  }));
  const { error } = await supabase.from("notifications").insert(rows);
  if (error) console.error("notify failed", error.message);
}

export function renderTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, key: string) => vars[key] ?? "");
}
