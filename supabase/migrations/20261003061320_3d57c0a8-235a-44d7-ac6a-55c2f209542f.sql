CREATE OR REPLACE FUNCTION public.check_discount(_code text, _subtotal numeric)
RETURNS TABLE(valid boolean, code text, discount_type text, discount_amount numeric, message text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE d public.discounts%ROWTYPE; amt numeric;
BEGIN
  SELECT * INTO d FROM public.discounts WHERE upper(discounts.code) = upper(trim(_code)) LIMIT 1;
  IF NOT FOUND THEN RETURN QUERY SELECT false, NULL::text, NULL::text, 0::numeric, 'This discount code does not exist.'; RETURN; END IF;
  IF NOT d.active THEN RETURN QUERY SELECT false, d.code, d.discount_type, 0::numeric, 'This discount code is no longer active.'; RETURN; END IF;
  IF d.expires_at IS NOT NULL AND d.expires_at < now() THEN RETURN QUERY SELECT false, d.code, d.discount_type, 0::numeric, 'This discount code has expired.'; RETURN; END IF;
  IF COALESCE(_subtotal,0) < COALESCE(d.min_order,0) THEN RETURN QUERY SELECT false, d.code, d.discount_type, 0::numeric, 'Minimum order of ₹' || trim(to_char(d.min_order,'FM999999990')) || ' required for this code.'; RETURN; END IF;
  IF d.discount_type = 'PERCENT' THEN amt := round(_subtotal * d.value / 100);
  ELSIF d.discount_type = 'FLAT' THEN amt := d.value;
  ELSE RETURN QUERY SELECT false, d.code, d.discount_type, 0::numeric, 'This discount code cannot be applied.'; RETURN; END IF;
  amt := LEAST(GREATEST(amt,0), GREATEST(_subtotal,0));
  RETURN QUERY SELECT true, d.code, d.discount_type, amt, 'Discount applied.';
END; $$;
REVOKE EXECUTE ON FUNCTION public.check_discount(text, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_discount(text, numeric) TO authenticated;

CREATE OR REPLACE FUNCTION public.enforce_order_discount()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record;
BEGIN
  IF auth.uid() IS NULL OR public.is_staff(auth.uid()) THEN RETURN NEW; END IF;
  IF NEW.discount_code IS NULL OR trim(NEW.discount_code) = '' THEN
    NEW.discount_code := NULL; NEW.discount_amount := 0;
  ELSE
    SELECT * INTO r FROM public.check_discount(NEW.discount_code, NEW.subtotal);
    IF NOT r.valid THEN RAISE EXCEPTION '%', r.message USING ERRCODE = '22023'; END IF;
    NEW.discount_code := r.code; NEW.discount_amount := r.discount_amount;
  END IF;
  NEW.total := GREATEST(NEW.subtotal - NEW.discount_amount + NEW.tax_amount + NEW.delivery_charge, 0);
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.enforce_order_discount() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER orders_enforce_discount BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_order_discount();