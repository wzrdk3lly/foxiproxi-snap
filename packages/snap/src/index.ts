import type { OnTransactionHandler, OnSignatureHandler,  } from '@metamask/snaps-sdk';
import { panel,heading, text, copyable, SeverityLevel } from '@metamask/snaps-sdk';


export const onTransaction: OnTransactionHandler = async ({
  transaction,
  transactionOrigin,
}) => {

  const transactionString = JSON.stringify(transaction)
  return{
    content: panel([
      heading(` ${transactionOrigin}`),
      text(`The raw transaction details are:`),
      copyable(`{"method": "eth_sendTransaction", "params":[${transactionString}]}`) //formatted and made copyable for easier tx replay
    ])
  }
};


export const onSignature: OnSignatureHandler = async ({
  signature,
  signatureOrigin,
}) => {
  const signatureString = JSON.stringify(signature)
  
  return {
    content: panel([
      heading(`${signatureOrigin}`),
      text("The raw signature details are:"),
      copyable(signatureString),
    ]),
    severity: SeverityLevel.Critical,
  };
};



