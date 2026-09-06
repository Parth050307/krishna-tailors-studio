CREATE OR REPLACE FUNCTION public.guard_order_customer_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_staff(auth.uid()) THEN
    RETURN NEW;
  END IF;

  NEW.status := OLD.status;
  NEW.assigned_staff_id := OLD.assigned_staff_id;
  NEW.order_number := OLD.order_number;
  NEW.subtotal := OLD.subtotal;
  NEW.tax_amount := OLD.tax_amount;
  NEW.discount_amount := OLD.discount_amount;
  NEW.delivery_charge := OLD.delivery_charge;
  NEW.total := OLD.total;
  NEW.admin_notes := OLD.admin_notes;

  IF NEW.payment_status <> OLD.payment_status
     AND NOT (OLD.payment_status = 'PENDING' AND NEW.payment_status = 'PAID') THEN
    NEW.payment_status := OLD.payment_status;
  END IF;

  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.guard_order_customer_update() FROM PUBLIC, anon, authenticated;