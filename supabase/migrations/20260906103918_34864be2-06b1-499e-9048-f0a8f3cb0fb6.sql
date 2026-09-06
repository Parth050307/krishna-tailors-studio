REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_order_customer_update() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.booked_slots(date) FROM anon;