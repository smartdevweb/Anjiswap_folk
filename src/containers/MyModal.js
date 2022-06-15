import React, { useEffect, useState } from 'react'
import { useSwitchModal,useModalClicked } from '../state/application/hooks'
import { ApplicationModal } from '../state/application/actions'
import Modal from '../components/Modal'
import { useWeb3React } from '@web3-react/core'
import usePrevious from '../hooks/usePrevious'

import styled from 'styled-components'
import TestBanner from './testbanner'
import { injected } from '../constants/web3'
const MyModalContainer = styled.div`
  background: linear-gradient(134.85deg, rgba(0, 0, 0, 0.4) -9.62%, rgba(255, 255, 255, 0.4) 136.92%), #4E555D;
  box-shadow: inset 2.5px 2.5px 5px #35373e;
  background-blend-mode: soft-light, normal;
  &.active {
    border: solid 1px #ED21FA;
  }
  border: 2px solid rgba(144, 239, 255, 0.1);
  &:hover {
    border: 2px solid rgba(144, 239, 255, 0.5);
  }
`
const OptionContainer = styled.div`
  background: linear-gradient(134.85deg, rgba(0, 0, 0, 0.4) -9.62%, rgba(255, 255, 255, 0.4) 136.92%), #4E555D;
  box-shadow: inset 2.5px 2.5px 5px #35373e;
  background-blend-mode: soft-light, normal;
  &.active {
    border: solid 1px #ED21FA;
  }
  border: 2px solid rgba(144, 239, 255, 0.1);
  &:hover {
    border: 2px solid rgba(144, 239, 255, 0.5);
  }
`
const OptionContainerClassname = 'flex items-center justify-between text-white rounded-2xl px-5 py-1 my-4 cursor-pointer'
function Option  (label,addition,optionConnector,pending,setPending)
{
    const { account, connector, activate } = useWeb3React()
    const active = account && connector && connector === optionConnector && addition

    return (
      // optionConnector === pending.connector && addition === pending.addition ?
      <OptionContainer  className= {OptionContainerClassname} onClick ={() =>{activate(injected,undefined).finally(()=> {})}} >
       MetaMask
              </OptionContainer>
    )
    
}
export default function MyModal() {
  const { account, connector, deactivate } = useWeb3React()
    const walletModalOpen = useModalClicked(ApplicationModal.MODAL)
    const toggleWalletModal = useSwitchModal()
    const previousAccount = usePrevious(account)
    
    const [pending, setPending] = useState({
        connector: null,
        addition: true
      })
      useEffect(() => {
        if (account !== previousAccount && walletModalOpen) {
            toggleWalletModal()
            
        }
      }, [account, previousAccount, toggleWalletModal, walletModalOpen])
    
      useEffect(() =>  {
        if(account || !walletModalOpen) {
          setPending({
            connector: null,
            addition: true
          })
        }
      }, [account, walletModalOpen])
 
    return (
        <>
        <Modal title="Please connect your wallet!" hasClose={true} onClose={toggleWalletModal} show={walletModalOpen}>
            <Option 
            label ='MetaMask' 
            optionConnector = {injected}
            addition ={window.ethereum && window.ethereum.isTrust} 
            pending = {pending} 
            setPending ={setPending}/>
            {/* <TestBanner title='Connect' btnwidth='8em' eventType= {joiner}></TestBanner>: */}
        </Modal>
        </>
    )
}