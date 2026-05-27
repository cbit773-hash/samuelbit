import { useWalletStore } from '../store/wallet.store';
import { Wallet, ArrowDownToLine, History, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export function WalletDashboard() {
  const { address, cryptoBalance, isConnecting, connectWallet, disconnectWallet } = useWalletStore();
  const [faucetLoading, setFaucetLoading] = useState(false);

  const handleFaucetDeposit = () => {
    setFaucetLoading(true);
    setTimeout(() => {
      // Lógica mockeada para depositar desde la wallet a la plataforma
      // Requeriría un método en el store de trading real, aquí lo simulamos visualmente
      alert('¡Depósito inteligente confirmado en la blockchain! +10,000 USDT añadidos a tu cuenta de InvestPRO.');
      setFaucetLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full gap-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Billetera Web3</h1>
        <p className="text-gray-400 mt-2">Conecta tu Coinbase Wallet u otra billetera autocustodiada para depositar fondos instantáneamente a través de contratos inteligentes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Panel de Conexión */}
        <div className="bg-white/5 border border-primary/20 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.05)]">
          <div className="absolute -top-10 -right-10 text-primary/10">
            <Wallet size={150} />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-6 relative z-10">Estado de Conexión</h2>
          
          {!address ? (
            <div className="relative z-10">
              <p className="text-gray-400 mb-8">No hay ninguna billetera conectada. Por tu seguridad, InvestPRO no custodia tus criptoactivos hasta que decidas transferirlos al contrato de margen.</p>
              <button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-amber-600 text-background font-bold text-lg px-8 py-4 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                <Wallet size={24} />
                {isConnecting ? 'Conectando Billetera...' : 'Conectar Coinbase Wallet'}
              </button>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-500 font-bold">Conectado a Ethereum Mainnet</span>
              </div>
              
              <div className="bg-[#050505] rounded-xl p-4 border border-white/10 mb-6">
                <p className="text-gray-500 text-sm font-semibold mb-1">Dirección de la Billetera</p>
                <p className="text-white font-mono">{address}</p>
              </div>

              <div className="bg-[#050505] rounded-xl p-4 border border-white/10 mb-8">
                <p className="text-gray-500 text-sm font-semibold mb-1">Balance Disponible (Web3)</p>
                <p className="text-3xl font-mono text-primary">{cryptoBalance} ETH</p>
              </div>

              <button 
                onClick={disconnectWallet}
                className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-3 rounded-xl transition-all border border-white/10"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>

        {/* Panel Faucet (Rampa a la Plataforma) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl flex flex-col opacity-100 transition-opacity">
          <h2 className="text-xl font-bold text-white mb-6">Depositar a InvestPRO</h2>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 flex gap-3 text-sm">
            <ShieldAlert className="text-blue-500 shrink-0 mt-1" size={18} />
            <p className="text-gray-300">
              Los fondos transferidos aquí se mueven a nuestra bóveda de contratos inteligentes para ser utilizados como margen en la terminal de trading.
            </p>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-2 block">Monto a depositar (USDT)</label>
              <div className="flex items-center bg-[#050505] border border-white/10 rounded-lg p-2">
                <input type="text" defaultValue="10000" className="bg-transparent w-full px-3 text-white font-mono font-bold outline-none" />
                <span className="text-gray-500 font-bold pr-3">USDT</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleFaucetDeposit}
            disabled={!address || faucetLoading}
            className={`w-full flex items-center justify-center gap-3 text-white font-bold px-8 py-4 rounded-xl transition-all active:scale-95 ${!address ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {faucetLoading ? 'Procesando en Blockchain...' : (
              <>
                <ArrowDownToLine size={20} />
                Aprobar Depósito Smart Contract
              </>
            )}
          </button>
        </div>
      </div>

      {/* Historial de Transacciones Web3 */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl mt-4">
        <div className="p-4 border-b border-white/10 flex gap-4 items-center">
          <History size={20} className="text-gray-400" />
          <h3 className="text-white font-bold">Historial de Transacciones Web3</h3>
        </div>
        <div className="p-8 text-center text-gray-500">
          No hay transacciones recientes en esta billetera.
        </div>
      </div>
    </div>
  );
}
