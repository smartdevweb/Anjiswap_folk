import React, { forwardRef, useImperativeHandle } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'

import { setCurrentToken, setToken } from '../state/swap/actions'
import { useGetToken, useCurrentKey, useEstimated } from '../state/swap/hooks'
import { formatValue } from '../utils/number'

const TokenAmount = styled.input`
  background: transparent;
  color: white;
  text-align: right;
  width: 200px;
  font-family: 'Roboto Mono', monospace;
  &:focus {
    outline: none;
  }
`

function TokenInput({ tokenKey, readOnly }, ref) {
  const dispatch = useDispatch()
  const currentKey = useCurrentKey()
  const token = useGetToken(tokenKey)
  const estimated = useEstimated()
  const inputRegex = new RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
  const updateTokenAmount = (amount) => {
    const nextUserInput = amount ? amount.toString().replace(/[,]/g, '') : ''
    if (!nextUserInput || inputRegex.test(nextUserInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
      token.amount = nextUserInput.toString()
     
      dispatch(setCurrentToken(tokenKey))
      dispatch(setToken(token))
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      setMax(amount) {
        updateTokenAmount(amount)
      }
    })
  )

  const value =(currentKey === tokenKey ? token?.amount : estimated)
  return (
    <TokenAmount
      placeholder="0.0"
      readOnly={ false }
      disabled={ !token }
      onChange={ (e) => updateTokenAmount(e.target.value) }
      value={ formatValue(value === undefined ? '' : value) }
      hidden={ !token }
    />
  )
}

export default forwardRef(TokenInput)