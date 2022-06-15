import { BsChevronDown } from 'react-icons/bs'
import React from 'react'
import { setCurrentToken } from '../state/swap/actions'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useGetToken } from '../state/swap/hooks'
import { useSelectTokenModalToggle } from '../state/application/hooks'

const TokenContainer = styled.div`
  background: linear-gradient(317.7deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 105.18%), #E7EBF0;
  background-blend-mode: soft-light, normal;
  border: 0.5px solid rgba(255, 255, 255, 0.4);
  box-sizing: border-box;
  border-radius: 50px;

  display: flex;
  align-items: center;
`
const SelectTokenContainer = styled.div`
  border: 0.5px solid rgba(255, 255, 255, 0.4);
  background-blend-mode: soft-light, normal;
  background: linear-gradient(317.7deg,rgba(0,0,0,0.4) 0%,rgba(255,255,255,0.4) 105.18%),#E7EBF0;
  box-sizing: border-box;
  border-radius: 50px;

  display: flex;
  align-items: center;
`

function TokenSelect({ tokenKey, readOnly, title }) {
  const dispatch = useDispatch()
  const token = useGetToken(tokenKey)
  const toggleSelectTokenModal = useSelectTokenModalToggle()
  const openSelectTokenModal = () => {
    dispatch(setCurrentToken(tokenKey))
    toggleSelectTokenModal()
  }
  return (
    <>
      {
        token ?
          <TokenContainer
            className="px-2 py-1 cursor-pointer box-shadow"
            onClick={!readOnly ? openSelectTokenModal : null}
          >
            <img src={token.logo} className="box-shadow rounded-full" alt="" width={20} height={20} />
            <span className="mx-1">{token.symbol}</span>
          </TokenContainer>
        :
          <SelectTokenContainer
            className="pl-3 pr-2 py-1 cursor-pointer box-shadow"
            onClick={!readOnly ? openSelectTokenModal : null}
          >
            <span>{ title || `Select a token` }</span>
            <BsChevronDown className="ml-3" />
          </SelectTokenContainer>
      }
    </>
  )
}

export default TokenSelect
