import * as StellarSdk from '@stellar/stellar-sdk';

// Buscar las variables en .env
const CONTRACT_ID = import.meta.env.VITE_BDB_CONTRACT_ID;
const RPC_URL = import.meta.env.VITE_STELLAR_RPC_URL;

// Crear servidor para hablar con Stellar
const server = new StellarSdk.rpc.Server(RPC_URL);

// Función para ver el balance de una cuenta
export async function getBalance(userAddress: string): Promise<string> {
  try {
    // Crear referencia al contrato
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    
    // Buscar información de la cuenta del usuario
    const sourceAccount = await server.getAccount(userAddress);
    
    // Construir la transacción para llamar la función 'balance'
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        contract.call(
          'balance',
          StellarSdk.nativeToScVal(userAddress, { type: 'address' })
        )
      )
      .setTimeout(30)
      .build();

    // Simular (no gasta XLM, solo retorna el resultado)
    const simulationResponse = await server.simulateTransaction(transaction);
    
    // Si funcionó, obtener el resultado
    if (StellarSdk.rpc.Api.isSimulationSuccess(simulationResponse)) {
      const resultValue = simulationResponse.result?.retval;
      if (resultValue) {
        return StellarSdk.scValToNative(resultValue).toString();
      }
    }
    
    return '0';
  } catch (error) {
    console.error('Error al buscar balance:', error);
    return '0';
  }
}

// Función para transferir tokens
export async function transferTokens(
  fromAddress: string,
  toAddress: string,
  amount: string
): Promise<boolean> {
  try {
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    const sourceAccount = await server.getAccount(fromAddress);

    // Convertir amount de tokens a stroops (multiplicar por 10^7)
    const amountInStroops = Math.floor(parseFloat(amount) * 10000000);

    // Construir transacción para llamar 'transfer'
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        contract.call(
          'transfer',
          StellarSdk.nativeToScVal(fromAddress, { type: 'address' }),
          StellarSdk.nativeToScVal(toAddress, { type: 'address' }),
          StellarSdk.nativeToScVal(amountInStroops, { type: 'i128' })
        )
      )
      .setTimeout(30)
      .build();

    // Preparar transacción
    const preparedTransaction = await server.prepareTransaction(transaction);

    // Convertir a XDR para firmar con Freighter
    const xdr = preparedTransaction.toXDR();

    // Importar Freighter para firmar
    const freighter = await import('@stellar/freighter-api');
    const signedXDR = await freighter.signTransaction(xdr, {
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });

    // Crear transacción desde XDR firmado
    const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
      signedXDR,
      StellarSdk.Networks.TESTNET
    );

    // Enviar transacción a la red
    const result = await server.sendTransaction(signedTransaction as StellarSdk.Transaction);
    console.log('Transfer exitoso:', result);
    return true;

  } catch (error) {
    console.error('Error al transferir:', error);
    return false;
  }
}

export { CONTRACT_ID };
