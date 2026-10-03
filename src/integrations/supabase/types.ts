export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          label: string
          landmark: string | null
          line1: string
          line2: string | null
          phone: string | null
          pincode: string
          state: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string
          landmark?: string | null
          line1: string
          line2?: string | null
          phone?: string | null
          pincode: string
          state: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string
          landmark?: string | null
          line1?: string
          line2?: string | null
          phone?: string | null
          pincode?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          address_line: string | null
          assigned_staff_id: string | null
          city: string | null
          contact_name: string
          contact_phone: string
          created_at: string
          id: string
          landmark: string | null
          mode: Database["public"]["Enums"]["appointment_mode"]
          notes: string | null
          order_id: string | null
          pincode: string | null
          scheduled_date: string
          slot: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line?: string | null
          assigned_staff_id?: string | null
          city?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string
          id?: string
          landmark?: string | null
          mode?: Database["public"]["Enums"]["appointment_mode"]
          notes?: string | null
          order_id?: string | null
          pincode?: string | null
          scheduled_date: string
          slot: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line?: string | null
          assigned_staff_id?: string | null
          city?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string
          id?: string
          landmark?: string | null
          mode?: Database["public"]["Enums"]["appointment_mode"]
          notes?: string | null
          order_id?: string | null
          pincode?: string | null
          scheduled_date?: string
          slot?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string
          discount_type: string
          expires_at: string | null
          id: string
          min_order: number
          value: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string
          discount_type?: string
          expires_at?: string | null
          id?: string
          min_order?: number
          value?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string
          discount_type?: string
          expires_at?: string | null
          id?: string
          min_order?: number
          value?: number
        }
        Relationships: []
      }
      fabrics: {
        Row: {
          color: string
          created_at: string
          fabric_type: string
          id: string
          image_url: string | null
          in_stock: boolean
          name: string
          price_per_meter: number
        }
        Insert: {
          color: string
          created_at?: string
          fabric_type: string
          id?: string
          image_url?: string | null
          in_stock?: boolean
          name: string
          price_per_meter?: number
        }
        Update: {
          color?: string
          created_at?: string
          fabric_type?: string
          id?: string
          image_url?: string | null
          in_stock?: boolean
          name?: string
          price_per_meter?: number
        }
        Relationships: []
      }
      faqs: {
        Row: {
          active: boolean
          answer: string
          category: string
          id: string
          question: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          answer: string
          category?: string
          id?: string
          question: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          answer?: string
          category?: string
          id?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: string
          created_at: string
          description: string | null
          featured: boolean
          id: string
          image_url: string
          sort_order: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url: string
          sort_order?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          id: string
          invoice_number: string
          issued_at: string
          order_id: string
          user_id: string
        }
        Insert: {
          amount?: number
          id?: string
          invoice_number: string
          issued_at?: string
          order_id: string
          user_id: string
        }
        Update: {
          amount?: number
          id?: string
          invoice_number?: string
          issued_at?: string
          order_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      measurement_fields: {
        Row: {
          field_key: string
          garment_type: string
          id: string
          instruction: string
          label: string
          max_inches: number
          min_inches: number
          required: boolean
          sort_order: number
        }
        Insert: {
          field_key: string
          garment_type: string
          id?: string
          instruction?: string
          label: string
          max_inches?: number
          min_inches?: number
          required?: boolean
          sort_order?: number
        }
        Update: {
          field_key?: string
          garment_type?: string
          id?: string
          instruction?: string
          label?: string
          max_inches?: number
          min_inches?: number
          required?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      measurement_profiles: {
        Row: {
          created_at: string
          garment_type: string
          id: string
          is_default: boolean
          name: string
          notes: string | null
          unit: string
          updated_at: string
          user_id: string
          values: Json
        }
        Insert: {
          created_at?: string
          garment_type: string
          id?: string
          is_default?: boolean
          name: string
          notes?: string | null
          unit?: string
          updated_at?: string
          user_id: string
          values?: Json
        }
        Update: {
          created_at?: string
          garment_type?: string
          id?: string
          is_default?: boolean
          name?: string
          notes?: string | null
          unit?: string
          updated_at?: string
          user_id?: string
          values?: Json
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          channel: string
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string
          channel?: string
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          customizations: Json
          design_notes: string | null
          garment_type: string
          id: string
          order_id: string
          quantity: number
          service_id: string | null
          service_name: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          customizations?: Json
          design_notes?: string | null
          garment_type: string
          id?: string
          order_id: string
          quantity?: number
          service_id?: string | null
          service_name: string
          unit_price?: number
        }
        Update: {
          created_at?: string
          customizations?: Json
          design_notes?: string | null
          garment_type?: string
          id?: string
          order_id?: string
          quantity?: number
          service_id?: string | null
          service_name?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_uploads: {
        Row: {
          created_at: string
          file_name: string
          file_path: string | null
          file_size: number
          file_url: string
          id: string
          mime_type: string
          order_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path?: string | null
          file_size?: number
          file_url: string
          id?: string
          mime_type: string
          order_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string | null
          file_size?: number
          file_url?: string
          id?: string
          mime_type?: string
          order_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_uploads_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          admin_notes: string | null
          assigned_staff_id: string | null
          created_at: string
          customer_notes: string | null
          delivery_charge: number
          delivery_mode: string
          discount_amount: number
          discount_code: string | null
          expected_date: string | null
          fabric_id: string | null
          fabric_meters: number
          fabric_source: string
          id: string
          measurement_mode: string
          measurement_profile_id: string | null
          measurements_snapshot: Json
          occasion: string | null
          order_number: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address_id?: string | null
          admin_notes?: string | null
          assigned_staff_id?: string | null
          created_at?: string
          customer_notes?: string | null
          delivery_charge?: number
          delivery_mode?: string
          discount_amount?: number
          discount_code?: string | null
          expected_date?: string | null
          fabric_id?: string | null
          fabric_meters?: number
          fabric_source?: string
          id?: string
          measurement_mode?: string
          measurement_profile_id?: string | null
          measurements_snapshot?: Json
          occasion?: string | null
          order_number: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address_id?: string | null
          admin_notes?: string | null
          assigned_staff_id?: string | null
          created_at?: string
          customer_notes?: string | null
          delivery_charge?: number
          delivery_mode?: string
          discount_amount?: number
          discount_code?: string | null
          expected_date?: string | null
          fabric_id?: string | null
          fabric_meters?: number
          fabric_source?: string
          id?: string
          measurement_mode?: string
          measurement_profile_id?: string | null
          measurements_snapshot?: Json
          occasion?: string | null
          order_number?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_assigned_staff_id_fkey"
            columns: ["assigned_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_fabric_id_fkey"
            columns: ["fabric_id"]
            isOneToOne: false
            referencedRelation: "fabrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_measurement_profile_id_fkey"
            columns: ["measurement_profile_id"]
            isOneToOne: false
            referencedRelation: "measurement_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string
          order_id: string
          paid_at: string | null
          provider: string
          reference: string | null
          status: Database["public"]["Enums"]["payment_status"]
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          order_id: string
          paid_at?: string | null
          provider?: string
          reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          order_id?: string
          paid_at?: string | null
          provider?: string
          reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          preferred_unit: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          preferred_unit?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          preferred_unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved: boolean
          city: string | null
          comment: string
          created_at: string
          customer_name: string
          garment: string | null
          id: string
          order_id: string | null
          rating: number
          user_id: string | null
        }
        Insert: {
          approved?: boolean
          city?: string | null
          comment?: string
          created_at?: string
          customer_name: string
          garment?: string | null
          id?: string
          order_id?: string | null
          rating?: number
          user_id?: string | null
        }
        Update: {
          approved?: boolean
          city?: string | null
          comment?: string
          created_at?: string
          customer_name?: string
          garment?: string | null
          id?: string
          order_id?: string | null
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_designs: {
        Row: {
          created_at: string
          gallery_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          gallery_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          gallery_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_designs_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "gallery"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          base_price: number
          category: string
          created_at: string
          featured: boolean
          garment_type: string
          id: string
          image_url: string | null
          long_description: string
          name: string
          short_description: string
          slug: string
          sort_order: number
          stitching_days: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          base_price?: number
          category: string
          created_at?: string
          featured?: boolean
          garment_type: string
          id?: string
          image_url?: string | null
          long_description?: string
          name: string
          short_description?: string
          slug: string
          sort_order?: number
          stitching_days?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          base_price?: number
          category?: string
          created_at?: string
          featured?: boolean
          garment_type?: string
          id?: string
          image_url?: string | null
          long_description?: string
          name?: string
          short_description?: string
          slug?: string
          sort_order?: number
          stitching_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      staff: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          specialization: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          role: Database["public"]["Enums"]["app_role"]
          specialization?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          specialization?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      booked_slots: {
        Args: { _date: string }
        Returns: {
          slot: string
        }[]
      }
      check_discount: {
        Args: { _code: string; _subtotal: number }
        Returns: {
          code: string
          discount_amount: number
          discount_type: string
          message: string
          valid: boolean
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "SUPER_ADMIN"
        | "ADMIN"
        | "MANAGER"
        | "MEASUREMENT_STAFF"
        | "TAILOR"
        | "QUALITY_CHECK"
        | "DELIVERY_STAFF"
      appointment_mode: "HOME" | "STORE"
      appointment_status:
        | "REQUESTED"
        | "CONFIRMED"
        | "COMPLETED"
        | "CANCELLED"
        | "RESCHEDULED"
      order_status:
        | "ORDER_PLACED"
        | "MEASUREMENT_CONFIRMED"
        | "DESIGN_CONFIRMED"
        | "FABRIC_CONFIRMED"
        | "CUTTING"
        | "STITCHING"
        | "FINISHING"
        | "QUALITY_CHECK"
        | "READY"
        | "OUT_FOR_DELIVERY"
        | "DELIVERED"
        | "CANCELLED"
      payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
        "MEASUREMENT_STAFF",
        "TAILOR",
        "QUALITY_CHECK",
        "DELIVERY_STAFF",
      ],
      appointment_mode: ["HOME", "STORE"],
      appointment_status: [
        "REQUESTED",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
        "RESCHEDULED",
      ],
      order_status: [
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
        "CANCELLED",
      ],
      payment_status: ["PENDING", "PAID", "FAILED", "REFUNDED"],
    },
  },
} as const
