-- ============================================================
-- InvestPRO Lite — Fix: STABLE + SET LOCAL en RPCs staff (0A000)
-- PostgreSQL no permite SET LOCAL en funciones STABLE/IMMUTABLE.
-- Afecta staff_get_client_bundle y otras RPCs de investpro_lite_core.
-- ============================================================

ALTER FUNCTION public.staff_list_leads(TEXT, UUID) VOLATILE;
ALTER FUNCTION public.staff_get_lead(UUID) VOLATILE;
ALTER FUNCTION public.staff_list_teams() VOLATILE;
ALTER FUNCTION public.staff_get_client_bundle(UUID) VOLATILE;
