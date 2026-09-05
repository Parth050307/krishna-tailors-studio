import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/* eslint-disable @typescript-eslint/no-explicit-any */
type SettingsMap = Record<string, any>;

export function useSettings() {
  return useQuery<SettingsMap>({
    queryKey: ["settings"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("key, value");
      if (error) throw error;
      const map: SettingsMap = {};
      for (const row of data ?? []) map[row.key] = row.value;
      return map;
    },
  });
}

export function useServices(category?: string) {
  return useQuery({
    queryKey: ["services", category ?? "all"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      let q = supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (category && category !== "All") q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useService(slug: string) {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useFabrics() {
  return useQuery({
    queryKey: ["fabrics"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabrics")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useGallery(category?: string) {
  return useQuery({
    queryKey: ["gallery", category ?? "all"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      let q = supabase.from("gallery").select("*").order("sort_order");
      if (category && category !== "All") q = q.eq("category", category);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useReviews(limit = 12) {
  return useQuery({
    queryKey: ["reviews", limit],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useMeasurementFields(garmentType: string | undefined) {
  return useQuery({
    queryKey: ["measurement-fields", garmentType],
    enabled: Boolean(garmentType),
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("measurement_fields")
        .select("*")
        .eq("garment_type", garmentType!)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useMeasurementProfiles(userId: string | undefined) {
  return useQuery({
    queryKey: ["measurement-profiles", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("measurement_profiles")
        .select("*")
        .order("is_default", { ascending: false })
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAddresses(userId: string | undefined) {
  return useQuery({
    queryKey: ["addresses", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .order("is_default", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useMyOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ["my-orders", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "*, order_items(*), order_status_history(*), payments(*), invoices(*), fabrics(name, fabric_type, color), addresses(*)",
        )
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useMyAppointments(userId: string | undefined) {
  return useQuery({
    queryKey: ["my-appointments", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("scheduled_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: ["notifications", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return data;
    },
  });
}

export function useSavedDesigns(userId: string | undefined) {
  return useQuery({
    queryKey: ["saved-designs", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_designs")
        .select("*, gallery(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useBookedSlots(date: string | undefined) {
  return useQuery({
    queryKey: ["booked-slots", date],
    enabled: Boolean(date),
    queryFn: async () => {
      const { data, error } = await supabase.rpc("booked_slots", { _date: date! });
      if (error) throw error;
      return (data ?? []) as string[];
    },
  });
}
