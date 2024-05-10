/* global window */

const snapId = 'local:http://localhost:8080';

// eslint-disable-next-line
const P = window.ethereum;
P.request({
  method: 'wallet_getSnaps',
})
  .then((snaps) => {
    console.log({ snaps });
    const availSnaps = Object.keys(snaps)
      .filter(([snapId, snap]) => snap.enabled)
      .map(([snapId, snap]) => snapId);
    if (!availSnaps.includes(snapId)) {
      console.log(`Snap ${snapId} not found`);
      return P.request({
        method: 'wallet_requestSnaps',
        params: {
          [snapId]: {},
        },
      });
    }
  })

  .then(() =>
    P.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'getReplay',
        },
      },
    }),
  )
  .then((response) => {
    // filter for responses with transaction data
    if (response.modifiedTx) {
      // TODO: run the transaction
      console.log(
        'sending modified transaction to MetaMask',
        response.modifiedTx,
      );
      P.request({
        method: 'eth_sendTransaction',
        params: [response.modifiedTx],
      });
    }
  });
