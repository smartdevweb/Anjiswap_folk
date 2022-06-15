import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'

import { TokenList } from '../constants/tokens'
import Modal from '../components/Modal'
import { ApplicationModal } from '../state/application/actions'
import { useModalOpen, useSelectTokenModalToggle } from '../state/application/hooks'
import { useCurrentKey} from '../state/swap/hooks'
import { setToken, TokenKeys } from '../state/swap/actions'

const Option = styled.div`
  background: linear-gradient(134.85deg, rgba(0, 0, 0, 0.4) -9.62%, rgba(255, 255, 255, 0.4) 136.92%), #4E555D;
  background-blend-mode: soft-light, normal;
  box-shadow: inset 2.5px 2.5px 5px #35373E;
  border-radius: 20px;
  border: 2px solid rgba(144, 239, 255, 0.1);
  &:hover {
    border: 2px solid rgba(144, 239, 255, 0.5);
  }

  display: flex;
  align-items: center;
  padding: 0.25rem 0.55em;
  margin: 5px;
  min-width: 90px;

  cursor: pointer;
`

export default function SelectTokenModal() {
  const selectTokenModalOpen = useModalOpen(ApplicationModal.SELECT_TOKEN)
  const toggleSelectTokenModal = useSelectTokenModalToggle()
  const dispatch = useDispatch()
  const curKey = useCurrentKey()

  return (
    <Modal
      title="Select a token"
      hasClose={true}
      onClose={toggleSelectTokenModal}
      show={selectTokenModalOpen}
    >
      <div className="flex flex-wrap items-center text-white">
        {
          TokenList
            .map((token, index) => {
              if(curKey === TokenKeys.TOKEN_C && !token.stake)
                return null
              if(curKey === TokenKeys.TOKEN_D && !token.reward)
                return null
              return (
                <Option
                  key={index}
                  onClick={() => {
                    dispatch(setToken(token))
                    toggleSelectTokenModal()
                  }}
                >
                  <img src={token.logo} className="box-shadow rounded-full" alt="" width={20} height={20} />
                  <span className="ml-1">{token.symbol}</span>
                </Option>
              )
            })
        }
      </div>
    </Modal>
  )
}
