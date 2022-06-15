import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { closeTxToast } from './actions'

export function useTx() {
  return useSelector(state => state.tx)
}

export function useTxToast() {
  return useSelector(state => state.tx.txToast)
}

export function useCloseTxToast() {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(closeTxToast()), [dispatch])
}