const Types = {
  SET_TX: 'tx/setTx',
  CLOSE_TX_TOAST: 'tx/closeTxToast'
}

const setTx = (txId, txDescription, txStatus) => ({
  type: Types.SET_TX,
  payload: { txId, txDescription, txStatus }
})

const closeTxToast = () => ({
  type: Types.CLOSE_TX_TOAST,
  payload: { }
})

export {
  setTx,
  closeTxToast,
  Types
}