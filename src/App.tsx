import { useState } from 'react'
import * as freighter from '@stellar/freighter-api'
import { getBalance, transferTokens } from './contract'
import './App.css'

function App() {
  // Estados para guardar información
  const [publicKey, setPublicKey] = useState<string>('')
  const [connected, setConnected] = useState<boolean>(false)
  const [balance, setBalance] = useState<string>('0')
  const [loading, setLoading] = useState<boolean>(false)
  const [recipientAddress, setRecipientAddress] = useState<string>('')
  const [transferAmount, setTransferAmount] = useState<string>('')

  // Función: Conectar wallet
  const connectWallet = async () => {
    try {
      // Verificar si Freighter está instalado
      const isInstalled = await freighter.isConnected()

      if (!isInstalled) {
        alert('Por favor instala Freighter wallet: https://freighter.app')
        return
      }

      // Solicitar acceso
      const network = 'TESTNET'
      const publicKey = await freighter.requestAccess()

      if (publicKey) {
        setPublicKey(publicKey)
        setConnected(true)
        console.log('Wallet conectada:', publicKey)
      }

    } catch (error) {
      console.error('Error conectando wallet:', error)
      alert('Error al conectar la wallet. Asegúrate de aprobar la conexión en Freighter.')
    }
  }

  // Función: Desconectar wallet
  const disconnectWallet = () => {
    setPublicKey('')
    setConnected(false)
    setBalance('0')
    setRecipientAddress('')
    setTransferAmount('')
    console.log('Wallet desconectada')
  }

  // Función: Obtener balance
  const fetchBalance = async () => {
    if (!connected) {
      alert('Conecta tu wallet primero')
      return
    }

    setLoading(true)
    try {
      const bal = await getBalance(publicKey)
      setBalance(bal)
      console.log('Balance obtenido:', bal)
    } catch (error) {
      console.error('Error obteniendo balance:', error)
      alert('Error al obtener balance')
    } finally {
      setLoading(false)
    }
  }

  // Función: Transferir tokens
  const handleTransfer = async () => {
    // Validar que todos los campos estén llenos
    if (!connected || !recipientAddress || !transferAmount) {
      alert('Por favor, completa todos los campos')
      return
    }

    // Validar que la cantidad sea positiva
    if (parseFloat(transferAmount) <= 0) {
      alert('La cantidad debe ser mayor que cero')
      return
    }

    // Validar que la dirección empiece con G
    if (!recipientAddress.startsWith('G')) {
      alert('Dirección inválida. Debe empezar con G')
      return
    }

    // Validar que haya balance suficiente
    const balanceInTokens = parseInt(balance) / 10000000
    if (parseFloat(transferAmount) > balanceInTokens) {
      alert(`Balance insuficiente. Tienes ${balanceInTokens.toFixed(7)} BDB`)
      return
    }

    setLoading(true)
    try {
      console.log('Iniciando transferencia...')
      const success = await transferTokens(publicKey, recipientAddress, transferAmount)
      
      if (success) {
        alert(`✅ ¡Transferencia exitosa! ${transferAmount} BDB enviados a ${recipientAddress.substring(0, 8)}...`)
        
        // Actualizar balance
        const newBalance = await getBalance(publicKey)
        setBalance(newBalance)
        
        // Limpiar formulario
        setRecipientAddress('')
        setTransferAmount('')
      } else {
        alert('❌ Error en la transferencia. Verifica la consola.')
      }
    } catch (error) {
      console.error('Error al transferir:', error)
      alert('❌ Error al transferir tokens')
    } finally {
      setLoading(false)
    }
  }

  // Interfaz visual
  return (
    <div className="container">
      <h1>Token BDB🦈</h1>
      <h2>Solo para verdaderas Tiburonas</h2>

      {!connected ? (
        <div>
          <p>Conecta tu wallet para interactuar con el token BDB</p>
          <button onClick={connectWallet}>
            Conectar Wallet
          </button>
        </div>
      ) : (
        <div>
          <div className="info-box">
            <div className="wallet-info">
              <div>
                <p><strong>Conectado como:</strong></p>
                <code>
                  {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
                </code>
              </div>
              <button 
                onClick={disconnectWallet}
                className="btn-disconnect"
                title="Desconectar wallet"
              >
                🚪 Desconectar
              </button>
            </div>
          </div>

          <button
            onClick={fetchBalance}
            disabled={loading}
            className="balance-btn"
          >
            {loading ? 'Cargando...' : 'Ver mi Balance BDB'}
          </button>

          <div className="balance-display">
            <p>Balance actual:</p>
            <h2>
              {balance !== '0'
                ? (parseInt(balance) / 10000000).toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 7
                  })
                : '0'
              } BDB
            </h2>
          </div>

          {/* SECCIÓN DE TRANSFERENCIA */}
          <div className="transfer-section">
            <h3>💸 Transferir BDB</h3>
            <div className="transfer-form">
              <input
                type="text"
                placeholder="Dirección destino (G...)"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="input-address"
              />
              <input
                type="number"
                placeholder="Cantidad de tokens"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="input-amount"
                step="0.0000001"
                min="0"
              />
              <button 
                onClick={handleTransfer}
                disabled={loading}
                className="btn-transfer"
              >
                {loading ? 'Transfiriendo...' : '💰 Transferir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
