import { Types } from './actions'

const defaultState = {
  blockNumber: {},
  openModal: null,
  modalstate:null
}

const reducer = (state = defaultState, action) => {
  let newState = { ...state }
  if(!action.payload)
    return newState
  const { chainId, blockNumber, modal } = action.payload
  switch(action.type) {
    case Types.SET_OPEN_MODAL:
      newState.openModal = modal
      break
      case  Types.MODAL_OPEND:
        newState.modalstate = modal;
        break;
    case Types.UPDATE_BLOCK_NUMBER:
      if(newState.blockNumber[chainId])
        newState.blockNumber[chainId] = Math.max(blockNumber, newState.blockNumber[chainId])
      else
        newState.blockNumber[chainId] = blockNumber
      break
    default:
  }
  return newState
}

export default reducer