CREATE OR REPLACE FUNCTION public.booked_slots(_date DATE)
RETURNS TABLE (slot TEXT) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT a.slot FROM public.appointments a
  WHERE a.scheduled_date = _date
    AND a.status IN ('REQUESTED','CONFIRMED','RESCHEDULED');
$$;
REVOKE EXECUTE ON FUNCTION public.booked_slots(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.booked_slots(DATE) TO authenticated;