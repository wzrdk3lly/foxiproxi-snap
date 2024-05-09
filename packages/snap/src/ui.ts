import {
    ButtonType,
    ManageStateOperation,
    address,
    button,
    copyable,
    form,
    heading,
    input,
    panel,
    row,
    text,
    assert,
    divider,
  } from '@metamask/snaps-sdk';
  import type { Component, Transaction } from '@metamask/snaps-sdk';


  export async function getInsightContent(): Promise<Component> {
    const snapState = await snap.request({
      method: 'snap_manageState',
      params: {
        operation: ManageStateOperation.GetState,
      },
    });
  
    assert(snapState?.transaction, 'No transaction found in Snap state.');
  
    const { from, to, value , data} = snapState.transaction as Transaction;
  
      return panel([
        text("Intercepted RPC Request"),
        copyable(`{"method": "eth_sendTransaction", "params":[${JSON.stringify(snapState.transaction)}]}`),
        divider(),
        text("Modify RPC Request - {to,value,data}"),
        // A top-level form...
        form({
          name: "modify-rpc-request",
          children: [
            // ...with a nested input.
            input({
              name: "to-address-modification",
              placeholder: "Modify `to` address",
              value: to,
              label: "Modify 'to' address"
            }),
            input({
              name: "value-modification",
              placeholder: "Modify request value  ",
              value: value,
              label: "Modify value"
            }),
            input({
              name: "calldata-modification",
              placeholder: "Modify calldata",
              value: data ?? "",
              label: "Modify calldata"
            }),
            button("Modify", ButtonType.Submit)
          ],
        }),
      ]);
    }