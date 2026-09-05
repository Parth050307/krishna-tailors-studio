import type { Database } from "@/integrations/supabase/types";

export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
export type AppRole = Database["public"]["Enums"]["app_role"];
export type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];

export const BRAND = {
  name: "KRISHNA TAILOR'S",
  tagline: "Tailored to Perfection. Designed for You.",
  established: 2009,
} as const;

export const ORDER_FLOW: OrderStatus[] = [
  "ORDER_PLACED",
  "MEASUREMENT_CONFIRMED",
  "DESIGN_CONFIRMED",
  "FABRIC_CONFIRMED",
  "CUTTING",
  "STITCHING",
  "FINISHING",
  "QUALITY_CHECK",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  ORDER_PLACED: "Order Placed",
  MEASUREMENT_CONFIRMED: "Measurement Confirmed",
  DESIGN_CONFIRMED: "Design Confirmed",
  FABRIC_CONFIRMED: "Fabric Confirmed",
  CUTTING: "Cutting",
  STITCHING: "Stitching",
  FINISHING: "Finishing",
  QUALITY_CHECK: "Quality Check",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const ROLE_LABEL: Record<AppRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  MEASUREMENT_STAFF: "Measurement Staff",
  TAILOR: "Tailor",
  QUALITY_CHECK: "Quality Check",
  DELIVERY_STAFF: "Delivery Staff",
};

export const ADMIN_ROLES: AppRole[] = ["SUPER_ADMIN", "ADMIN", "MANAGER"];

export const OCCASIONS = [
  "Everyday",
  "Office",
  "Festive",
  "Party",
  "Engagement",
  "Haldi",
  "Mehendi",
  "Sangeet",
  "Wedding",
  "Reception",
  "Bridal",
] as const;

export const GARMENT_TYPES = [
  { value: "BLOUSE", label: "Blouse / Saree Blouse" },
  { value: "SUIT", label: "Suit / Kurti / Anarkali" },
  { value: "GOWN", label: "Gown / Dress" },
  { value: "LEHENGA", label: "Lehenga" },
  { value: "OTHER", label: "Other / Alteration" },
] as const;

export const NECK_DESIGNS = [
  "Round",
  "Deep Round",
  "V Neck",
  "Deep V",
  "Sweetheart",
  "Boat Neck",
  "Square",
  "Halter",
  "Collar",
  "Keyhole",
];

export const SLEEVE_DESIGNS = [
  "Sleeveless",
  "Cap Sleeve",
  "Short Sleeve",
  "Elbow Length",
  "Three Quarter",
  "Full Sleeve",
  "Bell Sleeve",
  "Puff Sleeve",
  "Bishop Sleeve",
  "Net Sleeve",
];

export const BACK_DESIGNS = [
  "Round Back",
  "Deep Round",
  "Deep V",
  "Keyhole",
  "Dori Back",
  "Tie-Up",
  "Sheer Panel",
  "Button Back",
  "Cut-Out",
];

export const CUSTOMIZATION_ADDONS = [
  { key: "padding", label: "Padding (cups)", price: 250 },
  { key: "lining", label: "Full lining", price: 300 },
  { key: "hooks", label: "Hook & eye closure", price: 80 },
  { key: "zipper", label: "Concealed zipper", price: 150 },
  { key: "lace", label: "Lace detailing", price: 400 },
  { key: "border", label: "Contrast border", price: 350 },
  { key: "embroidery", label: "Hand embroidery panel", price: 1800 },
  { key: "sequins", label: "Sequin work", price: 900 },
  { key: "buttons", label: "Decorative buttons", price: 200 },
  { key: "tassels", label: "Latkans / tassels", price: 220 },
] as const;

export const MEASUREMENT_MODES = [
  {
    value: "KNOWN",
    label: "I know my measurements",
    hint: "Enter them yourself using a saved profile or a new one.",
  },
  {
    value: "GUIDED",
    label: "Help me measure myself",
    hint: "Step-by-step instructions for every field as you go.",
  },
  {
    value: "APPOINTMENT",
    label: "Book professional measurement",
    hint: "Our staff measure you at home or at the studio.",
  },
] as const;

export const PROFILE_PRESETS = ["Regular", "Wedding", "Blouse"] as const;

export const CM_PER_INCH = 2.54;

export function toInches(value: number, unit: string) {
  return unit === "cm" ? value / CM_PER_INCH : value;
}

export function fromInches(value: number, unit: string) {
  return unit === "cm" ? value * CM_PER_INCH : value;
}
