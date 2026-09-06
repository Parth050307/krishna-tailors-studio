INSERT INTO public.user_roles (user_id, role)
SELECT id, 'SUPER_ADMIN'::app_role FROM auth.users WHERE email = 'jethwaparth05@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

CREATE POLICY "roles admin manage" ON public.user_roles
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;