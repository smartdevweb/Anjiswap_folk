import { TokenKeys, swapTokens } from './actions'
import { useDispatch, useSelector } from 'react-redux'

import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'

export function useCurrentKey() {
  return useSelector(state => state.swap.currentTokenKey)
}

export function useGetToken(key) {
  return useSelector(state => state.swap.inputToken[key])
}

export function useGetOppositeToken() {
  const tokenA = useGetToken(TokenKeys.TOKEN_A)
  const tokenB = useGetToken(TokenKeys.TOKEN_B)
  if(tokenA && tokenA.symbol === 'BNB')
    return tokenB
  if(tokenB && tokenB.symbol === 'BNB')
    return tokenA
  return null
}

export function usePancakeSwapVersion() {
  const { library, chainId } = useWeb3React()
  const tokens = useSelector(state => state.swap.inputToken)
  const key = tokens[TokenKeys.TOKEN_A]?.symbol === 'BNB' ? TokenKeys.TOKEN_B : TokenKeys.TOKEN_A
  const otherKey = key === TokenKeys.TOKEN_A ? TokenKeys.TOKEN_B : TokenKeys.TOKEN_A
  if (!chainId || !library)
    return 0
  if(tokens[otherKey]?.symbol !== 'BNB')
    return 0
  if(tokens[key]?.pcs)
    return tokens[key]?.pcs
  return 0
}

export function useEstimated() {
  return useSelector(state => state.swap.estimated)
}

export function useSwapTokens() {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(swapTokens()), [dispatch])
}
