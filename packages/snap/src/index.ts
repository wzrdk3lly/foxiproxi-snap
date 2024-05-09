import type { OnTransactionHandler, OnSignatureHandler, OnRpcRequestHandler } from '@metamask/snaps-sdk';
import { panel, heading, text, copyable, SeverityLevel, button, input, form, ButtonType, divider } from '@metamask/snaps-sdk';

// All the on chain transactions - an eth_sendTransaction rpc request 
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  transactionOrigin,
}) => {

  const transactionString = JSON.stringify(transaction)

  await snap.request({
    method: "snap_manageState",
    params: {
      operation: "update",
      newState: { data: transactionString, type: "transaction" },
    },
  });

  const interfaceId = await snap.request({
    method: "snap_createInterface",
    params: {
      ui: panel([
        text("Intercepted RPC Request"),
        copyable(`{"method": "eth_sendTransaction", "params":[${transactionString}]}`),
        divider(),
        text("Modify RPC Request"),
        // A top-level form...
        form({
          name: "modify-rpc-request",
          children: [
            // ...with a nested input.
            input({
              name: "to-address-modification",
              placeholder: "Modify `to` address ",
            }),
            input({
              name: "value-modification",
              placeholder: "Modify request value  ",
            }),
            input({
              name: "calldata-modification",
              placeholder: "Modify calldata",
            }),
            button("Modify", ButtonType.Submit, "modify"),
          ],
        }),
      ]),
    },
  });
  // I cant return both content and snap interface 
  return {
    id: interfaceId
    // content: panel([
    //   heading(` ${transactionOrigin}`),
    //   text(`The raw transaction details are:`),
    //   copyable(`{"method": "eth_sendTransaction", "params":[${transactionString}]}`) //formatted and made copyable for easier tx replay
    // ])
  }
};



// signedType_v4, signedType_v3, etc -- All the offchain signature request
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


async function getDataForReplay() {
  return {data:1, type: "transaction"}
  // TODO: handle the case when it's not there
  // TODO: figure out what permissions are needed for storage
  const persistedData = await snap.request({
    method: "snap_manageState",
    params: { operation: "get" },
  });
  return persistedData;
}


export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case "getReplay":
      return await getDataForReplay();

    default:
      throw new Error("Method not found.");
  }
};

