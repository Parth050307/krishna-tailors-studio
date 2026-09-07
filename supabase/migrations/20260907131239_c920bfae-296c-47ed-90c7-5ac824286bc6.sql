CREATE UNIQUE INDEX IF NOT EXISTS appointments_active_slot_unique
  ON public.appointments (scheduled_date, slot)
  WHERE status IN ('REQUESTED','CONFIRMED','RESCHEDULED');