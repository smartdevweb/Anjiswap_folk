import { Types } from './actions'

const defaultState = {
  txIndex: 0,
  txId: "",
  txDescription: "",
  txStatus: "",
  txToast: false
}

const reducer = (state = defaultState, action) => {
  let newState = { ...state }
  switch(action.type) {
    case Types.SET_TX:
      newState.txIndex ++
      newState.txId = action.payload.txId
      newState.txDescription = action.payload.txDescription
      newState.txStatus = action.payload.txStatus
      newState.txToast = true
      break
    case Types.CLOSE_TX_TOAST:
      newState.txToast = false
      break
    default:
  }
  return newState
}

export default reducer