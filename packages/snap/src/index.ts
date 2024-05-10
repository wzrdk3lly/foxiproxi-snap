import type { OnTransactionHandler, OnSignatureHandler,OnUserInputHandler, Transaction,OnRpcRequestHandler   } from '@metamask/snaps-sdk';
import { panel,heading, text, copyable, SeverityLevel, button , input, form, ButtonType, divider, UserInputEventType, ManageStateOperation} from '@metamask/snaps-sdk';
import { getInsightContent } from './ui';

let persistedTxData:Transaction
// All the on chain transactions - an eth_sendTransaction rpc request 
export const onTransaction: OnTransactionHandler = async ({
  transaction,
  transactionOrigin,
}) => {

  const transactionString = JSON.stringify(transaction)
  persistedTxData = transaction
  await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.UpdateState,
      newState: { transaction },
    },
  });

     // Form to populate updated transaction details
     const interfaceId = await snap.request({
      method: "snap_createInterface",
      params: {
        ui: await getInsightContent(),
      }
     });

// Returns the custom interface to the user - Includes original 
  return{
    id: interfaceId
  }
}


// // Sotre the modified transaction state when the the users click's modify
export const onUserInput: OnUserInputHandler = async ({ id, event }) => {

  
 if (event.type === UserInputEventType.FormSubmitEvent && event.name === "modify-rpc-request"){
 //TODO - modify the transaction value with the form input. Stuck figuring out how to grab an input from
  let modifiedTx:Transaction = {...persistedTxData }

  if(event.value["to-address-modification"]){
    modifiedTx.to = event.value["to-address-modification"]
  }
  if(event.value["value-modification"]){
    modifiedTx.value = event.value["value-modification"]
  }
  if(event.value["calldata-modification"]){
    modifiedTx.data = event.value["calldata-modification"]
  }
  // event.value["to-address-modification"] -> string
  // event.value["value-modification"] -> string 
  // event.value["calldata-modification"] -> string 

  await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.UpdateState,
      newState: { modifiedTx }, //Modified to follow api format
    },
  });

  
  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui: panel([
        heading('Interactive UI Example Snap'),
        text('The modified tx :'),
        text(`${JSON.stringify(modifiedTx)}`)
      ]),
    },
  });
 
 }
 

}



// // signedType_v4, signedType_v3, etc -- All the offchain signature request
// export const onSignature: OnSignatureHandler = async ({
//   signature,
//   signatureOrigin,
// }) => {
//   const signatureString = JSON.stringify(signature)

//   return {
//     content: panel([
//       heading(`${signatureOrigin}`),
//       text("The raw signature details are:"),
//       copyable(signatureString),
//     ]),
//     severity: SeverityLevel.Critical,
//   };
// };


async function getDataForReplay() {
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

