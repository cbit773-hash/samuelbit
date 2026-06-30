-- Elimina overload duplicado que rompe depósitos crypto (NOWPayments)
-- Error: "Could not choose the best candidate function between..."

DROP FUNCTION IF EXISTS public.create_deposit_transaction(NUMERIC, TEXT, TEXT, TEXT);

-- service_role: notificaciones en Edge Functions (create-deposit, approve-transaction)
GRANT SELECT ON public.profiles TO service_role;
