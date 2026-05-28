import type { AuthError } from '@supabase/supabase-js';

/** Mensaje legible para errores de Auth al cambiar contraseña */
export function mapPasswordUpdateError(error: AuthError | Error): string {
  const auth = error as AuthError;
  const msg = (auth.message ?? error.message ?? '').toLowerCase();
  const code = (auth as AuthError).code ?? '';

  if (msg.includes('same') || msg.includes('different') || code === 'same_password') {
    return 'La nueva contraseña debe ser distinta a la actual.';
  }
  if (msg.includes('pwned') || msg.includes('leaked') || msg.includes('compromised')) {
    return 'Esta contraseña aparece en filtraciones conocidas. Elige otra más única.';
  }
  if (msg.includes('weak') || msg.includes('strength') || msg.includes('characters')) {
    return 'Contraseña no cumple los requisitos: mín. 8 caracteres, mayúscula, minúscula, número y símbolo (!@#$%…).';
  }
  if (msg.includes('reauthentication') || msg.includes('nonce') || msg.includes('aal2')) {
    return 'Se requiere verificación adicional. Abre de nuevo el enlace del correo o desactiva MFA temporalmente en Supabase.';
  }
  if (msg.includes('current password') || msg.includes('current_password')) {
    return 'Debes ingresar tu contraseña actual (configurado en Supabase Auth → Password security).';
  }
  if (auth.status === 422) {
    return auth.message || 'Contraseña rechazada por las reglas de seguridad del proyecto.';
  }
  if (msg.includes('lock:') || msg.includes('lock "')) {
    return 'Conflicto de sesión. Espera un momento e intenta de nuevo.';
  }
  return auth.message || error.message || 'No se pudo actualizar la contraseña.';
}
