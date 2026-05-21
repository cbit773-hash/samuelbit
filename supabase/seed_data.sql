-- ============================================================
-- INVESPRO — DATOS SEMILLA COMPLETOS v2
-- Ejecutar en: Supabase → SQL Editor → New Query → Run
-- ============================================================
-- NOTA: Este script desactiva temporalmente la FK a auth.users
-- para poder insertar perfiles de demostración sin necesidad de
-- crear usuarios reales en Supabase Auth.
-- ============================================================

-- ============================================================
-- PASO 1: Limpiar datos existentes (en orden correcto por FK)
-- ============================================================
DELETE FROM public.positions;
DELETE FROM public.deposits;
DELETE FROM public.leads;
DELETE FROM public.profiles;
DELETE FROM public.teams;

-- ============================================================
-- PASO 2: Desactivar temporalmente la FK a auth.users
-- ============================================================
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey CASCADE;
ALTER TABLE public.profiles ADD PRIMARY KEY (id);

-- ============================================================
-- PASO 3: Crear Mesas de Trabajo
-- ============================================================
INSERT INTO public.teams (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Mesa Alpha'),
  ('22222222-2222-2222-2222-222222222222', 'Mesa Beta'),
  ('33333333-3333-3333-3333-333333333333', 'Mesa Gamma')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PASO 4: Crear Perfiles de Demo (sin restricción de auth.users)
-- ============================================================

-- HEAD
INSERT INTO public.profiles (id, email, full_name, phone, role, team_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'head@investpro.com', 'Samuel Director', '+52 55 1234 0001', 'HEAD', NULL)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- CHIEF
INSERT INTO public.profiles (id, email, full_name, phone, role, team_id) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'chief@investpro.com', 'Ana Ríos', '+52 55 1234 0002', 'CHIEF', NULL)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- MANAGER
INSERT INTO public.profiles (id, email, full_name, phone, role, team_id) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'manager@investpro.com', 'Roberto Mendoza', '+52 55 1234 0003', 'MANAGER', NULL)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- FLOOR_MANAGER
INSERT INTO public.profiles (id, email, full_name, phone, role, team_id) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'floormanager@investpro.com', 'Carlos Navarro', '+52 55 1234 0004', 'FLOOR_MANAGER', NULL)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- Asignar floor_manager a las mesas
UPDATE public.teams SET floor_manager_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE public.teams SET floor_manager_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd' WHERE id = '22222222-2222-2222-2222-222222222222';

-- TEAM_LEADER
INSERT INTO public.profiles (id, email, full_name, phone, role, team_id) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'teamleader@investpro.com', 'Laura Gómez', '+52 55 1234 0005', 'TEAM_LEADER', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- AGENTES (6)
INSERT INTO public.profiles (id, email, full_name, phone, role, team_id) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'agent@investpro.com', 'Pedro Ruiz', '+52 55 1234 0006', 'AGENT', '11111111-1111-1111-1111-111111111111'),
  ('f2222222-2222-2222-2222-222222222222', 'agent2@investpro.com', 'María López', '+52 55 1234 0007', 'AGENT', '11111111-1111-1111-1111-111111111111'),
  ('f3333333-3333-3333-3333-333333333333', 'agent3@investpro.com', 'Sara Castro', '+52 55 1234 0008', 'AGENT', '11111111-1111-1111-1111-111111111111'),
  ('f4444444-4444-4444-4444-444444444444', 'agent4@investpro.com', 'Diego Torres', '+52 55 1234 0009', 'AGENT', '22222222-2222-2222-2222-222222222222'),
  ('f5555555-5555-5555-5555-555555555555', 'agent5@investpro.com', 'Ana Martínez', '+52 55 1234 0010', 'AGENT', '22222222-2222-2222-2222-222222222222'),
  ('f6666666-6666-6666-6666-666666666666', 'agent6@investpro.com', 'Juan Pérez', '+52 55 1234 0011', 'AGENT', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, team_id = EXCLUDED.team_id;

-- CLIENTES (5)
INSERT INTO public.profiles (id, email, full_name, phone, role, team_id) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'client@investpro.com', 'Fernando Guzmán', '+52 55 9876 0001', 'CLIENT', NULL),
  ('c2222222-2222-2222-2222-222222222222', 'client2@investpro.com', 'Sofía Reyes', '+34 600 123 456', 'CLIENT', NULL),
  ('c3333333-3333-3333-3333-333333333333', 'client3@investpro.com', 'Carlos Mendoza', '+57 310 456 789', 'CLIENT', NULL),
  ('c4444444-4444-4444-4444-444444444444', 'client4@investpro.com', 'Elena Valdez', '+56 9 8765 4321', 'CLIENT', NULL),
  ('c5555555-5555-5555-5555-555555555555', 'client5@investpro.com', 'Marcos Torres', '+1 305 555 0199', 'CLIENT', NULL)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- ============================================================
-- PASO 5: Leads del CRM (25 leads)
-- ============================================================
INSERT INTO public.leads (first_name, last_name, phone, email, country, status, interest, notes, assigned_to, created_by) VALUES
  ('Roberto', 'Sánchez', '+52 55 1234 5678', 'r.sanchez@gmail.com', 'México', 'En seguimiento', 'Crypto', 'Interesado en Bitcoin', 'f1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Valeria', 'Méndez', '+52 55 2345 6789', 'v.mendez@gmail.com', 'México', 'Nuevo', 'Forex', NULL, 'f1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Luis', 'Ramos', '+52 55 3456 7890', 'l.ramos@hotmail.com', 'México', 'Contactado', 'Crypto', 'Callback mañana 4pm', 'f1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Carmen', 'Solís', '+52 55 4567 8901', 'c.solis@yahoo.com', 'México', 'Cerrado (FTD)', 'Acciones', 'FTD $250 confirmado', 'f1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Ricardo', 'Fuentes', '+52 55 5678 9012', NULL, 'México', 'No contesta', 'Desconocido', 'Marcado 3 veces', 'f1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Andrea', 'García', '+34 612 345 678', 'a.garcia@gmail.com', 'España', 'Cerca de cierre', 'Crypto', 'Pidió link de pago', 'f2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Javier', 'Romero', '+34 623 456 789', 'j.romero@outlook.com', 'España', 'Contactado', 'Forex', 'Quiere ver resultados', 'f2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Patricia', 'Moreno', '+34 634 567 890', NULL, 'España', 'Nuevo', 'Acciones', NULL, 'f2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Daniel', 'Herrera', '+57 310 111 2222', 'd.herrera@gmail.com', 'Colombia', 'En seguimiento', 'Crypto', 'Quiere invertir $1,000', 'f3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Natalia', 'Correa', '+57 311 222 3333', 'n.correa@hotmail.com', 'Colombia', 'Cerrado (FTD)', 'Crypto', 'FTD $500', 'f3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Felipe', 'Muñoz', '+57 312 333 4444', NULL, 'Colombia', 'Contactado', 'Forex', 'Callback viernes', 'f3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Gabriela', 'Ortiz', '+57 313 444 5555', 'g.ortiz@yahoo.com', 'Colombia', 'Cerrado (FTD)', 'Acciones', 'FTD $250', 'f3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Alejandro', 'Vega', '+56 9 1111 2222', 'a.vega@gmail.com', 'Chile', 'Nuevo', 'Crypto', NULL, 'f4444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Camila', 'Rojas', '+56 9 2222 3333', NULL, 'Chile', 'Descartado', 'Desconocido', 'Número falso', 'f4444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Santiago', 'Delgado', '+1 305 111 0001', 's.delgado@gmail.com', 'USA', 'En seguimiento', 'Crypto', 'Capital alto', 'f5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Isabela', 'Cruz', '+1 786 222 0002', 'i.cruz@yahoo.com', 'USA', 'Cerca de cierre', 'Acciones', 'Quiere $2,500', 'f5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Martín', 'Gómez', '+1 954 333 0003', NULL, 'USA', 'Contactado', 'Forex', 'Pidió info spreads', 'f5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Rosa', 'Navarro', '+52 55 7777 8888', 'r.navarro@gmail.com', 'México', 'Nuevo', 'Crypto', NULL, 'f6666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Eduardo', 'Castillo', '+52 55 8888 9999', NULL, 'México', 'Contactado', 'Forex', 'Lo va a pensar', 'f6666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Lucía', 'Ríos', '+34 655 111 222', 'l.rios@outlook.com', 'España', 'Descartado', 'Desconocido', 'Muy agresivo', 'f6666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  -- Leads sin asignar (Pool libre)
  ('Miguel', 'Serrano', '+52 55 0001 1111', 'm.serrano@gmail.com', 'México', 'Nuevo', 'Crypto', NULL, NULL, NULL),
  ('Adriana', 'Peña', '+57 314 555 6666', 'a.pena@hotmail.com', 'Colombia', 'Nuevo', 'Forex', NULL, NULL, NULL),
  ('Diego', 'Salazar', '+56 9 3333 4444', NULL, 'Chile', 'Nuevo', 'Acciones', NULL, NULL, NULL),
  ('Valentina', 'Jiménez', '+34 666 777 888', 'v.jimenez@yahoo.com', 'España', 'Nuevo', 'Crypto', NULL, NULL, NULL),
  ('Pablo', 'Medina', '+1 786 444 0005', NULL, 'USA', 'Nuevo', 'Desconocido', NULL, NULL, NULL);

-- ============================================================
-- PASO 6: Depósitos (FTD y Retención)
-- ============================================================
INSERT INTO public.deposits (client_id, agent_id, amount, currency, type, status, notes) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 5000.00, 'USD', 'FTD', 'Aprobado', 'Tarjeta Visa'),
  ('c1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 5000.00, 'USD', 'RETENCION', 'Aprobado', 'Transferencia bancaria'),
  ('c2222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', 2500.00, 'USD', 'FTD', 'Aprobado', 'USDT TRC20'),
  ('c3333333-3333-3333-3333-333333333333', 'f3333333-3333-3333-3333-333333333333', 500.00, 'USD', 'FTD', 'Verificando', 'Pendiente comprobante'),
  ('c4444444-4444-4444-4444-444444444444', 'f5555555-5555-5555-5555-555555555555', 10000.00, 'USD', 'FTD', 'Aprobado', 'Wire transfer'),
  ('c5555555-5555-5555-5555-555555555555', 'f4444444-4444-4444-4444-444444444444', 250.00, 'USD', 'FTD', 'Verificando', 'Tarjeta Mastercard'),
  ('c2222222-2222-2222-2222-222222222222', 'f2222222-2222-2222-2222-222222222222', 3500.00, 'USD', 'RETENCION', 'Aprobado', 'Upsell exitoso'),
  ('c4444444-4444-4444-4444-444444444444', 'f5555555-5555-5555-5555-555555555555', 5000.00, 'USD', 'RETENCION', 'Aprobado', 'Retención post-ganancia'),
  ('c1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 2000.00, 'USD', 'RETENCION', 'Verificando', 'En proceso'),
  ('c5555555-5555-5555-5555-555555555555', 'f6666666-6666-6666-6666-666666666666', 100.00, 'USD', 'FTD', 'Rechazado', 'Comprobante ilegible');

-- ============================================================
-- PASO 7: Posiciones de Trading
-- ============================================================
INSERT INTO public.positions (client_id, symbol, type, volume, open_price, close_price, stop_loss, take_profit, pnl, status, opened_at, closed_at) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'BTC/USD', 'BUY', 0.1, 67200, NULL, 65000, 72000, NULL, 'OPEN', NOW() - INTERVAL '3 days', NULL),
  ('c1111111-1111-1111-1111-111111111111', 'EUR/USD', 'SELL', 0.5, 1.082, NULL, 1.09, 1.07, NULL, 'OPEN', NOW() - INTERVAL '2 days', NULL),
  ('c1111111-1111-1111-1111-111111111111', 'GOLD', 'BUY', 0.2, 2340, NULL, 2300, 2400, NULL, 'OPEN', NOW() - INTERVAL '1 day', NULL),
  ('c1111111-1111-1111-1111-111111111111', 'ETH/USD', 'BUY', 0.5, 3200, 3450, 3000, 3500, 125, 'CLOSED', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
  ('c2222222-2222-2222-2222-222222222222', 'BTC/USD', 'SELL', 0.05, 68500, NULL, 70000, 65000, NULL, 'OPEN', NOW() - INTERVAL '1 day', NULL),
  ('c2222222-2222-2222-2222-222222222222', 'GOLD', 'BUY', 0.3, 2350, NULL, 2320, 2420, NULL, 'OPEN', NOW() - INTERVAL '4 hours', NULL),
  ('c4444444-4444-4444-4444-444444444444', 'BTC/USD', 'BUY', 0.2, 66800, NULL, 64000, 72000, NULL, 'OPEN', NOW() - INTERVAL '5 days', NULL),
  ('c4444444-4444-4444-4444-444444444444', 'EUR/USD', 'BUY', 1.0, 1.078, 1.085, 1.07, 1.09, 700, 'CLOSED', NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 days');

-- ============================================================
-- FIN DEL SEED — Ejecutar completo en SQL Editor
-- ============================================================
