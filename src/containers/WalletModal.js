import React, { useEffect, useState } from 'react'
import { injected, walletconnect } from '../constants/web3'
import { useModalOpen, useWalletModalToggle } from '../state/application/hooks'


import { ApplicationModal } from '../state/application/actions'
import { BiRefresh } from 'react-icons/bi'
import Button from '../components/Button'
import MetamaskIcon from '../assets/wallet/metamask.png'
import Modal from '../components/Modal'
import TrustWalletIcon from '../assets/wallet/trustWallet.png'
import WalletConnectIcon from '../assets/wallet/walletConnectIcon.svg'
import { isIOS } from 'react-device-detect';
import styled from 'styled-components'
import usePrevious from '../hooks/usePrevious'
import { useWeb3React } from '@web3-react/core'

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

function Option({label, icon, optionConnector, addition, pending, setPending}) {
  const { account, connector, activate } = useWeb3React()
  const active = account && connector && connector === optionConnector && addition
  return (
    // optionConnector === pending.connector && addition === pending.addition ?
    //   <OptionContainer
    //     className="flex items-center justify-start text-red rounded-2xl px-5 py-1 my-4"
    //   >
    //     <BiRefresh width={23} height={234} color="#1FE3CC" className="mr-3" />
    //     <span>Connecting wallets...</span>
    //   </OptionContainer>
    // :
      <OptionContainer
        className={`flex items-center justify-between text-white rounded-2xl px-5 py-1 my-4 cursor-pointer
          
        `}
        onClick={() => {
          // if(pending.connector || active)
          //   return
          // setPending({
          //   connector: optionConnector,
          //   addition: addition
          // })
          
          activate(optionConnector, undefined).finally(() => {
            // setPending({
            //   connector: null,
            //   addition: true
            // })
            console.log('df')
            
          })
        }}
      >
        <span>{label}</span>
        <img src={icon} width={18} height={18} alt="" />
      </OptionContainer>
  )
}

export default function WalletModal() {
  const { account, connector, deactivate } = useWeb3React()
  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()
  const previousAccount = usePrevious(account)
  const [pending, setPending] = useState({
    connector: null,
    addition: true
  })

  // close on connection, when logged out before
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

  const logout = () => {
    deactivate()

    if (typeof connector.close === 'function') {
      connector.close()
    }
  }

  const Footer = () => {
    return (
      <div className="text-white" style={{fontSize: 14}}>
        Don&apos;t have a Wallet?
        <a href="https://metamask.io" target="_blank" rel="noreferrer" className="ml-1" style={{color: '#1FE3CC'}}>Download Here</a>
      </div>
    )
  }

  return (
    !account ?
      <Modal
        title="Please Connect Wallet"
        hasClose={true}
        onClose={toggleWalletModal}
        show={walletModalOpen}
        ModalFooter={Footer}
      >
        <Option
          label="Metamask"
          icon={MetamaskIcon}
          optionConnector={injected}
          addition={window.ethereum && window.ethereum.isMetaMask}
          pending={pending}
          setPending={setPending}
        />
        {
          !isIOS &&
            <Option
              label="TrustWallet"
              icon={TrustWalletIcon}
              optionConnector={injected}
              addition={window.ethereum && window.ethereum.isTrust}
              pending={pending}
              setPending={setPending}
            />
        }
        <Option
          label="WalletConnect"
          icon={WalletConnectIcon}
          optionConnector={walletconnect}
          addition={true}
          pending={pending}
          setPending={setPending}
        />
      </Modal>
    :
      <Modal
        title="Your wallet address"
        hasClose={true}
        onClose={toggleWalletModal}
        show={walletModalOpen}
      >
        <div className="text-white text-sm">
          {account.slice(0, -8)}...
        </div>
        <Button className="anji-green mt-3" onClick={logout}>Logout</Button>
      </Modal>
  )
}
