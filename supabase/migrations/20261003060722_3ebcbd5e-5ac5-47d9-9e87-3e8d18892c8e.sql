CREATE OR REPLACE FUNCTION public.enforce_order_measurement_profile_owner()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.measurement_profile_id IS NULL THEN RETURN NEW; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.measurement_profiles mp
                 WHERE mp.id = NEW.measurement_profile_id AND mp.user_id = NEW.user_id) THEN
    RAISE EXCEPTION 'Measurement profile does not belong to this order''s customer'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.enforce_order_measurement_profile_owner() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER orders_measurement_profile_owner
BEFORE INSERT OR UPDATE OF measurement_profile_id, user_id ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_order_measurement_profile_owner();