import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch, useSelector } from 'react-redux'

import { setOpenModal, ApplicationModal,modalOpend } from './actions'

export function useBlockNumber() {
  const { chainId } = useWeb3React()
  return useSelector(state => state.application.blockNumber[chainId ?? -1])
}

export function useModalOpen(modal) {
  const openModal = useSelector(state => state.application.openModal)
  return openModal === modal
}
export function useModalClicked(modal)
{
  const openModal = useSelector(state => state.application.modalstate)
  return openModal === modal
}
export function useToggleModal(modal) {
  const open = useModalOpen(modal)
  const dispatch = useDispatch()
  return useCallback(() => dispatch(setOpenModal(open ? null : modal)), [dispatch, modal, open])
}
export function useSwitchModal(modal){
  const open = useModalClicked(modal)
  const dispatch =useDispatch()
  return useCallback(() => dispatch(modalOpend(open?null:modal)),[dispatch,modal,open] )
}
export function useOpenModal(modal) {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(setOpenModal(modal)), [dispatch, modal])
}

export function useCloseModal() {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch])
}

export function useWalletModalToggle() {
  return useToggleModal(ApplicationModal.WALLET)
}

export function useWrongNetworkModalToggle() {
  return useToggleModal(ApplicationModal.WRONG_NETWORK)
}
export function useWalletSwitchModal()
{
  return useSwitchModal(ApplicationModal.MODAL)
}
export function useWrongNetworkModalOpen() {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(setOpenModal(ApplicationModal.WRONG_NETWORK)), [dispatch])
}

export function useWrongNetworkModalClose() {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(setOpenModal(null)), [dispatch])
}

export function useSelectTokenModalToggle() {
  return useToggleModal(ApplicationModal.SELECT_TOKEN)
}