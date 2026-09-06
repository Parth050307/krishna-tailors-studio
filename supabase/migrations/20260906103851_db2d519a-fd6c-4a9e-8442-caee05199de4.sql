-- Guard: customers may not edit workflow/pricing fields on their own orders
CREATE OR REPLACE FUNCTION public.guard_order_customer_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_staff(auth.uid()) OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- non-staff owner: freeze workflow, pricing and assignment fields
  NEW.status := OLD.status;
  NEW.assigned_staff_id := OLD.assigned_staff_id;
  NEW.order_number := OLD.order_number;
  NEW.subtotal := OLD.subtotal;
  NEW.tax_amount := OLD.tax_amount;
  NEW.discount_amount := OLD.discount_amount;
  NEW.delivery_charge := OLD.delivery_charge;
  NEW.total_amount := OLD.total_amount;

  -- mock checkout may only move payment from PENDING to PAID
  IF NEW.payment_status <> OLD.payment_status
     AND NOT (OLD.payment_status = 'PENDING' AND NEW.payment_status = 'PAID') THEN
    NEW.payment_status := OLD.payment_status;
  END IF;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS orders_guard_customer_update ON public.orders;
CREATE TRIGGER orders_guard_customer_update
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.guard_order_customer_update();

-- Order status history is staff-written only
DROP POLICY IF EXISTS "history insert" ON public.order_status_history;
CREATE POLICY "history staff insert" ON public.order_status_history
FOR INSERT TO authenticated
WITH CHECK (public.is_staff(auth.uid()));

-- Payments: customers may only create PENDING/PAID mock rows for their own orders
DROP POLICY IF EXISTS "pay own insert" ON public.payments;
CREATE POLICY "pay own insert" ON public.payments
FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND status IN ('PENDING','PAID')
  AND order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);

-- Order items: customers can add items to their own order but not edit after placement
DROP POLICY IF EXISTS "items via order" ON public.order_items;
CREATE POLICY "items read" ON public.order_items
FOR SELECT TO authenticated
USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR public.is_staff(auth.uid()));
CREATE POLICY "items insert own" ON public.order_items
FOR INSERT TO authenticated
WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR public.is_staff(auth.uid()));
CREATE POLICY "items staff write" ON public.order_items
FOR UPDATE TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "items admin delete" ON public.order_items
FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));