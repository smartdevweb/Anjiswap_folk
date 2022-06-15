import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import Modal from '../components/Modal'
import { ApplicationModal } from '../state/application/actions'
import { useModalOpen, useWrongNetworkModalOpen, useWrongNetworkModalClose } from '../state/application/hooks'
import { isRightNetwork } from '../utils/web3'

export default function WrongNetworkModal() {
  const { account, chainId } = useWeb3React()
  const wrongNetworkModalOpen = useModalOpen(ApplicationModal.WRONG_NETWORK)
  const openWrongNetworkModal = useWrongNetworkModalOpen()
  const closeWrongNetworkModal = useWrongNetworkModalClose()

  useEffect(() => {
    if (account) {
      if (!isRightNetwork(chainId)) {
        openWrongNetworkModal()
      } else {
        closeWrongNetworkModal()
      }
    } else {
      closeWrongNetworkModal()
    }
  }, [account, chainId, openWrongNetworkModal, closeWrongNetworkModal])

  return (
    <Modal
      title="Wrong Network"
      hasClose={true}
      onClose={closeWrongNetworkModal}
      show={wrongNetworkModalOpen}
    >
      <span className="text-white">Please connect to the Binance Smart Chain.</span>
    </Modal>
  )
}