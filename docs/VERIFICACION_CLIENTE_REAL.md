# Verificación E2E — Primer cliente real

## 1. Registro en la app

1. `http://localhost:5173/registro`
2. Correo **nuevo** (ej. `cliente.prueba+1@gmail.com`)
3. Completar pasos 1–2 y **Crear cuenta**
4. Copiar contraseña de la pantalla final

## 2. SQL en Supabase (reemplazar EMAIL)

```sql
SELECT u.id, u.email, p.role, p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'EMAIL';

SELECT w.id, w.balance, w.user_id
FROM public.wallets w
JOIN public.profiles p ON p.id = w.user_id
WHERE p.email = 'EMAIL';

SELECT l.id, l.source, l.client_user_id, l.email, l.first_name
FROM public.leads l
WHERE l.email = 'EMAIL'
   OR l.client_user_id IN (SELECT id FROM public.profiles WHERE email = 'EMAIL');
```

Esperado:

- `profiles.role` = `CLIENT`
- Al menos una fila en `wallets`
- Lead con `source` = `web` y `client_user_id` enlazado

## 3. Login

- `/auth/login` con EMAIL + contraseña
- Sin mensaje de "Modo simulación" en consola
- Redirección a `/dashboard/trade` (home) o `/dashboard/account?tab=resumen`
- `user.id` en DevTools debe ser UUID (no `demo-CLIENT`)

## 4. Smoke test funcional

| Acción | Resultado esperado |
|--------|-------------------|
| Ver balance en barra superior | Número desde `wallets` (puede ser 0) |
| Wallet → depósito manual Perú | Crear solicitud en `transactions` |
| Terminal → abrir posición | Fila en `positions` |
| Seguridad → subir KYC | Archivos en Storage + `kyc_documents` |

## 5. Si falla el registro

| Error | Acción |
|-------|--------|
| RPC no existe | `npx supabase db push` |
| permission denied | Revisar migraciones RLS 300001–320001 |
| Email not confirmed | Desactivar Confirm email en Dashboard |
| User already registered | Usar otro correo o login |
