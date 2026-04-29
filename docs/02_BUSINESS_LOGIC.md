# 02. Lógica de Negocio y Módulos Core

La arquitectura de **Zaki Bit** se divide en flujos de dominio específicos para garantizar un acoplamiento bajo y una alta cohesión funcional. A continuación, se detalla la lógica de negocio de los tres módulos más críticos:

## 1. Motor de Trading y Riesgo (Trading Engine)

El corazón de Zaki Bit radica en su capacidad para procesar operaciones financieras con latencia mínima, garantizando la solvencia de la plataforma mediante cálculos de margen en tiempo real.

### 1.1 Ciclo de Vida de una Posición
1. **Solicitud (`OrderTicket`)**: El usuario solicita abrir una posición (Compra/Venta) con un volumen específico.
2. **Validación de Margen (Pre-Trade)**: El sistema verifica si `Margen Libre >= Margen Requerido`. Si no, la orden es rechazada por "Fondos Insuficientes".
3. **Ejecución Simulada (B-Book / A-Book)**: La posición se abre al `currentPrice` (bid para venta, ask para compra).
4. **Mark-to-Market (En Vivo)**: En cada tick del WebSocket, se actualiza el `Floating P&L`.
5. **Cierre (`Take Profit` / `Stop Loss` / Manual)**: Cuando el precio toca un límite, la posición se cierra, el P&L se suma/resta al Balance, y el Margen Retenido se libera.

### 1.2 Motor de Liquidación (Margin Call y Stop Out)
Como se detalla en `ARCHITECTURE.md`, Zaki Bit monitorea el **Margin Level** constantemente:
- **Nivel < 100% (Margin Call)**: Entra en zona de riesgo. Se bloquea la apertura de nuevas posiciones. Se alerta al cliente y a su Asesor asociado.
- **Nivel ≤ 50% (Stop Out)**: Ejecución forzada e inmediata. El sistema cierra automáticamente la posición con mayor pérdida latente para liberar margen y proteger la cuenta de saldo negativo.

## 2. Módulo de Capital: Web3 y Faucet Coinbase

Para integrar un enfoque moderno y facilitar entornos de prueba o cuentas "Demo" con dinámicas Web3:

### 2.1 Conexión con Coinbase Wallet SDK
Zaki Bit provee conectividad nativa a billeteras autocustodiadas, priorizando Coinbase Wallet para la rampa de criptomonedas.
- **Flujo**: El usuario firma un mensaje criptográfico para probar la propiedad de la billetera.
- **Uso**: Retiros de ganancias vía stablecoins (USDT/USDC) sobre redes de capa 2 (Polygon/Arbitrum) para minimizar fees.

### 2.2 Zaki Bit Faucet (Modo Demo/Pruebas)
- Para la fase de validación, los inversores pueden solicitar tokens de prueba interactuando con un Smart Contract de Faucet.
- Al confirmar la transacción Web3, el balance simulado del usuario en Zaki Bit se incrementa, activando el motor de trading instantáneamente.

## 3. Módulo "Zaki Legal" (Cumplimiento y Regulaciones)

Para operar a escala global, Zaki Bit incorpora un framework legal robusto inmerso en la experiencia de usuario.

### 3.1 Los 4 Pilares de Zaki Legal
1. **Términos y Condiciones (T&C)**: Contratos vinculantes dinámicos según el país de residencia del inversor. Deben ser aceptados explícitamente y tener control de versiones (si el T&C cambia, fuerza una nueva firma).
2. **Políticas de Privacidad y GDPR**: Panel de control donde el usuario gestiona el consentimiento de cookies, derecho al olvido y exportación de sus datos.
3. **Módulo KYC (Know Your Customer)**: 
   - *Nivel 1*: Email y Teléfono (Permite acceso a Faucet/Demo).
   - *Nivel 2*: Documento de Identidad y Prueba de Residencia (Desbloquea depósitos Fiat y retiros ilimitados).
   - *Gestión*: Los Asesores y Super Admins tienen un panel de revisión de documentos KYC.
4. **Regulación Internacional y AML (Anti-Money Laundering)**: Reglas estrictas de origen y destino de fondos. Los depósitos de terceros están prohibidos; la cuenta de origen debe coincidir con la identidad KYC del titular.

Este módulo asegura que Zaki Bit no solo es tecnológicamente avanzado, sino también auditable y seguro para instituciones y usuarios retail.
