# InvestPRO — Sistema de diseño (Wise + conversión)

> Fuente de tokens: [`public/design/variables.css`](../public/design/variables.css), [`public/design/tokens.json`](../public/design/tokens.json)  
> Referencia UX: [`public/design/DESIGN (3).md`](../public/design/DESIGN%20(3).md)

**Tema:** light (canvas blanco)

## Paleta híbrida InvestPRO

| Rol | Token | Valor | Uso |
|-----|-------|-------|-----|
| Canvas | `background` / `canvas` | `#ffffff` | Página, shell |
| Marca / links | `brand` | `#163300` | Nav secundario, links, logo acento |
| **CTA conversión** | `primary` | `#006cff` | Abrir cuenta, Comprar, Depositar |
| Cuerpo | `foreground` | `#0e0f0c` | Títulos |
| Secundario | `muted` | `#454745` | Párrafos, labels |
| Superficie alt | `surface-alt` | `#e8ebe6` | Rail, franjas |
| Info | `surface-info` | `#ecf9f9` | Badges, triggers |
| Promo secundaria | `accent-lime` | `#9fe870` | No usar como CTA principal |
| Error | `danger` | `#cb272f` | Validación, riesgo |

## Checklist PR

- [ ] Fondo de página blanco o ash — **sin** `#050505`, `#04091a`
- [ ] Un CTA azul (`primary`) dominante por vista de conversión
- [ ] Links de navegación en `brand` (verde), no azul
- [ ] Inputs: fondo blanco, borde `--shadow-subtle`, focus `--shadow-subtle-2`
- [ ] Botones pill `9999px`; CTA azul + texto blanco
- [ ] Sin `amber-*` en CTAs globales
- [ ] Buy/sell rojo/verde solo en terminal trading

## Utilidades CSS

- `.ip-btn-primary` / `.bolt-btn-primary` — conversión azul
- `.ip-btn-ghost` / `.bolt-btn-ghost` — verde bosque
- `.ip-input` / `.bolt-input`
- `.ip-card-elevated` / `.bolt-card-elevated`

## Deprecado

- [`docs/BOLT_DESIGN_SYSTEM.md`](BOLT_DESIGN_SYSTEM.md)
- [`public/DESIGN (2).md`](../public/DESIGN%20(2).md)
- [`src/styles/bolt-tokens.css`](../src/styles/bolt-tokens.css)
