# Guía AML/KYC — InvestPRO Perú

> Checklist operativo para cumplimiento con la **UIF-Perú** (Ley N° 27693) y políticas internas. Revisión jurídica externa obligatoria antes del primer FTD masivo.

## 1. Marco normativo

| Norma | Aplicación |
|-------|------------|
| Ley N° 27693 | Prevención del lavado de activos y financiamiento del terrorismo |
| Reglamento UIF | Debida diligencia, reportes ROS, conservación de registros |
| Ley N° 29733 | Datos personales en verificación KYC |
| SMV | Advertencias sobre oferta pública de CFD/Forex — no confundir con valores en BVL |

## 2. Debida diligencia (cliente)

| Nivel | Cuándo | Documentos |
|-------|--------|------------|
| Simplificada | Depósito acumulado < umbral interno (definir con compliance) | DNI/CE, selfie, teléfono verificado |
| Estándar | FTD ≥ $250 USD o retiro | + comprobante domicilio (≤ 3 meses) |
| Reforzada | Montos altos, PEP, jurisdicción de riesgo | + origen de fondos, declaración jurada |

## 3. Señales de alerta (operación)

- Depósitos fragmentados el mismo día desde varios bancos.
- CCI de terceros sin relación con el titular de cuenta (revisar en CHIEF → Datos de retiro CCI).
- Retiro inmediato tras acreditación sin operaciones.
- Datos KYC inconsistentes con voucher bancario.

## 4. Flujo CHIEF

1. Cliente sube voucher en depósito manual.
2. CHIEF valida: titular, monto PEN/USD, banco, fecha.
3. Aprobar solo si coincide con `transactions.amount` (tolerancia definida).
4. Rechazar con motivo registrado en `notes`.

## 5. Retención de registros

| Tipo | Plazo sugerido |
|------|----------------|
| KYC documentos | 10 años desde cierre de relación |
| Transacciones / vouchers | 10 años |
| Logs de aprobación CHIEF | 10 años |

## 6. Reportes

- **ROS** a UIF cuando corresponda (plantilla interna — no automatizar sin abogado).
- Registro de PEP y lista de sanciones (proceso manual o proveedor externo).

## 7. Checklist pre-lanzamiento Perú

- [ ] Razón social SAC y RUC en T&C publicados
- [ ] Oficial de cumplimiento designado
- [ ] Política AML escrita y firmada
- [ ] Capacitación agentes (no prometer rentabilidad ni licencia SMV falsa)
- [ ] Procedimiento conciliación BCP/Interbank documentado en `GUIA_PERU_PAGOS.md`
