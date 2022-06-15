const Types = {
  SET_OPEN_MODAL: 'application/setOpenModal',
  UPDATE_BLOCK_NUMBER: 'application/updateBlockNumber',
  MODAL_OPEND:'modal_opend'
}

const setOpenModal = (modal) => ({
  type: Types.SET_OPEN_MODAL,
  payload: {modal}
})
const modalOpend = (modal) =>({
  type:Types.MODAL_OPEND,
  payload:{modal}
})
const updateBlockNumber = ({chainId, blockNumber}) => ({
  type: Types.UPDATE_BLOCK_NUMBER,
  payload: { chainId, blockNumber }
})

const ApplicationModal = {
  WALLET: 'application/wallet',
  WRONG_NETWORK: 'application/wrong_network',
  SELECT_TOKEN: 'application/select_token',
  WALLET_TEST:'application/wallet_test',
  MODAL:'application/modal'
}

export {
  setOpenModal,
  updateBlockNumber,
  modalOpend,
  Types,
  ApplicationModal
}