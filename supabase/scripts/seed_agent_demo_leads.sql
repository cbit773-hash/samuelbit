-- ============================================================
-- Post-seed: leads y depósitos demo para agent@investpro.com
-- Ejecutar después de: npm run seed:dev-users + seed_dev_role_users_post.sql
-- Idempotente: reasigna por email del agente (auth UUID real)
-- ============================================================

DO $$
DECLARE
  v_agent_id UUID;
  v_client_id UUID;
  v_tl_id UUID;
BEGIN
  SELECT id INTO v_agent_id FROM public.profiles WHERE email = 'agent@investpro.com' AND role = 'AGENT';
  IF v_agent_id IS NULL THEN
    RAISE EXCEPTION 'No existe perfil AGENT agent@investpro.com. Ejecuta npm run seed:dev-users primero.';
  END IF;

  SELECT id INTO v_client_id FROM public.profiles WHERE email = 'client@investpro.com' LIMIT 1;
  SELECT id INTO v_tl_id FROM public.profiles WHERE email = 'teamleader@investpro.com' LIMIT 1;

  -- Reasignar leads existentes del UUID demo al agente real (si quedaron del seed histórico)
  UPDATE public.leads
  SET assigned_to = v_agent_id
  WHERE assigned_to = 'f1111111-1111-1111-1111-111111111111'::uuid;

  -- Leads demo (insert si no existen por teléfono+agente)
  INSERT INTO public.leads (first_name, last_name, phone, email, country, status, interest, notes, assigned_to, created_by, source)
  SELECT v.first_name, v.last_name, v.phone, v.email, v.country, v.status::public.lead_status, v.interest, v.notes, v_agent_id, v_tl_id, 'manual'
  FROM (VALUES
    ('Valeria', 'Méndez', '+51 987 100 001', 'v.mendez.demo@gmail.com', 'Perú', 'Nuevo', 'Crypto', NULL::text),
    ('Luis', 'Ramos', '+51 987 100 002', 'l.ramos.demo@hotmail.com', 'Perú', 'Contactado', 'Forex', 'Callback mañana 16:00'),
    ('María', 'Flores', '+51 956 333 444', 'm.flores.demo@hotmail.com', 'Perú', 'En seguimiento', 'Índices', 'Interés S&P 500 CFD'),
    ('Ricardo', 'Fuentes', '+51 912 555 666', NULL::text, 'Perú', 'No contesta', 'Crypto', 'Marcado 3 veces'),
    ('Carmen', 'Solís', '+51 998 111 222', 'c.solis.demo@yahoo.com', 'Perú', 'Cerca de cierre', 'Acciones', 'Pidió link de pago'),
    ('Roberto', 'Sánchez', '+51 987 111 333', 'r.sanchez.demo@gmail.com', 'Perú', 'Nuevo', 'Crypto', 'Lead caliente campaña'),
    ('Ana', 'Torres', '+51 998 777 888', 'a.torres.demo@yahoo.com', 'Perú', 'Cerrado (FTD)', 'Crypto', 'FTD $250 confirmado'),
    ('Diego', 'Salazar', '+51 912 444 555', NULL::text, 'Perú', 'Descartado', 'Desconocido', 'Número inválido')
  ) AS v(first_name, last_name, phone, email, country, status, interest, notes)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.leads l WHERE l.phone = v.phone AND l.assigned_to = v_agent_id
  );

  -- Enlazar lead con cliente demo para cobro rápido
  IF v_client_id IS NOT NULL THEN
    UPDATE public.leads
    SET client_user_id = v_client_id, source = 'web'
    WHERE assigned_to = v_agent_id AND email = 'm.flores.demo@hotmail.com';
  END IF;

  -- Depósitos demo (solo si el cliente existe y no hay duplicado)
  IF v_client_id IS NOT NULL THEN
    INSERT INTO public.deposits (client_id, agent_id, amount, currency, type, status, notes)
    SELECT v_client_id, v_agent_id, 500.00, 'USD', 'FTD', 'Aprobado', 'Demo seed FTD'
    WHERE NOT EXISTS (
      SELECT 1 FROM public.deposits d
      WHERE d.agent_id = v_agent_id AND d.client_id = v_client_id AND d.notes = 'Demo seed FTD'
    );

    INSERT INTO public.deposits (client_id, agent_id, amount, currency, type, status, notes)
    SELECT v_client_id, v_agent_id, 200.00, 'USD', 'RETENCION', 'Verificando', 'Demo seed retención'
    WHERE NOT EXISTS (
      SELECT 1 FROM public.deposits d
      WHERE d.agent_id = v_agent_id AND d.client_id = v_client_id AND d.notes = 'Demo seed retención'
    );
  END IF;
END $$;

SELECT COUNT(*) AS leads_asignados
FROM public.leads
WHERE assigned_to = (SELECT id FROM public.profiles WHERE email = 'agent@investpro.com');
