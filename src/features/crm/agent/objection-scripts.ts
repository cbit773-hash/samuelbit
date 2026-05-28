export interface ObjectionScript {
  id: string;
  label: string;
  template: string;
}

export const OBJECTION_SCRIPTS: ObjectionScript[] = [
  {
    id: 'no_liquidez',
    label: 'No tengo liquidez',
    template:
      'Entiendo, {firstName}. Muchos clientes empiezan con el mínimo de $250 para probar la plataforma sin comprometer su flujo. ¿Te envío el link de activación ahora?',
  },
  {
    id: 'riesgo',
    label: 'Es muy riesgoso',
    template:
      '{firstName}, el riesgo se controla con tamaño de posición y stop loss. Nosotros te guiamos en la primera operación. ¿Activamos tu cuenta demo en vivo con $250?',
  },
  {
    id: 'pensarlo',
    label: 'Lo voy a pensar',
    template:
      'Perfecto. Para no perder el nivel de mercado de hoy, ¿agendamos un callback en 2 horas o prefieres el link de depósito ahora mientras seguimos en línea?',
  },
  {
    id: 'comisiones',
    label: 'Comisiones altas',
    template:
      'En {interest} nuestra estructura es transparente: sin comisiones ocultas en el depósito. El costo real es el spread, que te mostramos en el terminal antes de operar.',
  },
  {
    id: 'confianza',
    label: 'No confío / estafa',
    template:
      'Es normal, {firstName}. Te envío ahora los términos, política de privacidad y el flujo KYC regulado. ¿Revisamos juntos el primer paso de verificación?',
  },
];

export function renderScript(template: string, firstName: string, interest: string) {
  return template
    .replace(/\{firstName\}/g, firstName || 'cliente')
    .replace(/\{interest\}/g, interest || 'nuestros mercados');
}
