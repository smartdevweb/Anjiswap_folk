import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'

import BMBO_ABI from '../assets/contracts/bamboo_abi.json'
import BAMBOO_STAKE_ABI from '../assets/contracts/bamboo_stake_abi.json'
import { BMBO_WOW_STAKE } from '../constants/contracts'
import { Tokens } from '../constants/tokens'
import { getContract } from '../utils/web3'

export function useContract(address, ABI, withSignerIfPossible) {
  const { library, account } = useWeb3React()

  return useMemo(() => {
      if (!address || !ABI || !library) return null
      try {
          return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
      } catch (error) {
          console.error('Failed to get contract', error)
          return null
      }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useStakingContract(tokenStake, tokenReward) {
    const newStaking = tokenStake && tokenStake.name === Tokens.BMBO.name
    return useContract(
        newStaking ? BMBO_WOW_STAKE : tokenReward ? tokenReward.address : null,
        newStaking ? BAMBOO_STAKE_ABI : BMBO_ABI,
        true
    )
}