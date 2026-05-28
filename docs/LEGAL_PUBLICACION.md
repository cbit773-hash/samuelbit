# Documentos legales publicados — InvestPRO

Referencia operativa de los documentos legales disponibles en la web.

## URLs públicas

| Documento | Ruta | Componente |
|-----------|------|------------|
| Términos y Condiciones | `/legal/terminos` | `src/features/legal/pages/TerminosPage.tsx` |
| Marco Regulatorio Internacional | `/legal/regulacion` | `src/features/legal/pages/RegulacionPage.tsx` |
| Política KYC / AML | `/legal/kyc-aml` | `src/features/legal/pages/KycAmlPage.tsx` |
| Política de Privacidad (Ley 29733 — Perú) | `/legal/privacidad` | `src/features/legal/pages/PrivacidadPage.tsx` |
| Advertencia de Riesgo de Inversión | `/legal/riesgos` | `src/features/legal/pages/RiesgosPage.tsx` |

Desde el dashboard (`/dashboard/legal`), cada tarjeta abre su documento en **pestaña nueva** (`target="_blank"`).

## Disclaimer en la UI

| Ubicación | Implementación |
|-----------|----------------|
| Landing captación `/registro` | Hero Fortrade (card centrada) + Banner `RiskDisclaimer` + footer card |
| Landing principal `/` | Banner + footer |
| Mercados `/mercados` | Banner + footer |
| Login `/auth/login` | Banner |
| Dashboards autenticados | Banner en `MainLayout` |
| Registro de cliente | Checkbox T&C + Privacidad en `RegisterView` |

Componente compartido: `src/shared/components/RiskDisclaimer.tsx`

## Revisión jurídica recomendada

Antes de campañas masivas de Google Ads, un abogado debe revisar:

- Razón social y RUC de la SAC en los T&C
- Datos de contacto corporativos reales
- Porcentaje estadístico de pérdidas (si aplica regulación local)
- Política AML/KYC como documento separado (pendiente en requisitos)

## Checklist de publicación

- [x] T&C publicados
- [x] Regulación internacional publicada
- [x] KYC/AML publicado
- [x] Privacidad publicada (Ley 29733 Perú)
- [x] Aviso SMV en página de riesgos
- [x] Checkbox riesgo plain-language en `/registro`
- [x] Página dedicada de riesgo
- [x] Banner sticky en páginas públicas y plataforma
- [ ] Revisión por abogado externo (recomendado)
