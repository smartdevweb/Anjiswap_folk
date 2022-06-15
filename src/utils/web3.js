import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { BigNumber, ethers } from 'ethers'

import BEP20_ABI from '../assets/contracts/bep20_abi.json'
import BAMBOO_STAKE_ABI from '../assets/contracts/bamboo_stake_abi.json'
import BMBO_ABI from '../assets/contracts/bamboo_abi.json'
import LP_ABI from '../assets/contracts/pcslp_abi.json'
import { BMBO_WOW_STAKE, WBNB } from '../constants/contracts'
import { SUPPORTED_CHAINIDS } from '../constants/web3'

import { toFloat } from './number'

export const isRightNetwork = (chainId) => {
  return SUPPORTED_CHAINIDS.includes(chainId)
}

export function isAddress(value) {
  try {
      return getAddress(value)
  } catch {
      return false
  }
}
export function isAddressString(value) {
  try {
      return getAddress(value)
  } catch {
      return ''
  }
}

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) {
      throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

export async function getBalance(address, token, library) {
  try {
    if(!isAddress(token) || token === WBNB) {
      return await library.getBalance(address)
    }
    const contract = getContract(token, BEP20_ABI, library)
    return await contract.balanceOf(address)
  } catch(e) { console.log(e) }
  return 0
}

export async function getPrice(lp, decimals, library) {
  try {
    const contract = getContract(lp, LP_ABI, library)
    const { _reserve0, _reserve1 } = await contract.getReserves()
    let firstToken = formatBalance(_reserve0, decimals)
    let secondToken = formatBalance(_reserve1)
    return toFloat(secondToken) / toFloat(firstToken)
  } catch(e) { console.log(e) }
  return 0
}

export async function getAllowance(address, spender, token, library, newStaking = false) {
  try {
    if(!isAddress(token) || token === AddressZero) {
      throw Error(`Invalid 'token' parameter '${token}'.`)
    }
    const contract = getContract(token, BEP20_ABI, library)
    return await contract.allowance(address, newStaking ? BMBO_WOW_STAKE : spender)
  } catch(e) { console.log(e) }
  return 0
}

export async function getStaked(address, token, library, newStaking = false) {
  try {
    if(!isAddress(token) || token === AddressZero) {
      throw Error(`Invalid 'token' parameter '${token}'.`)
    }
    const contract = getContract(newStaking ? BMBO_WOW_STAKE : token, newStaking ? BAMBOO_STAKE_ABI : BMBO_ABI, library)
    if(newStaking)
      return await contract.currentStake(address)
    return await contract._addressStakedSafePanda(address)
  } catch(e) { console.log(e) }
  return 0
}

export async function getEarned(address, token, library, newStaking = false) {
  try {
    if(!isAddress(token) || token === AddressZero) {
      throw Error(`Invalid 'token' parameter '${token}'.`)
    }
    const contract = getContract(newStaking ? BMBO_WOW_STAKE : token, newStaking ? BAMBOO_STAKE_ABI : BMBO_ABI, library, address)
    if(newStaking)
      return await contract.currentRewards(address)
    return await contract._currentRewards(address)
  } catch(e) { console.log(e) }
  return 0
}

export async function getStakable(address, token, library, newStaking = false) {
  try {
    if(!isAddress(token) || token === AddressZero) {
      throw Error(`Invalid 'token' parameter '${token}'.`)
    }
    const contract = getContract(newStaking ? BMBO_WOW_STAKE : token, newStaking ? BAMBOO_STAKE_ABI : BMBO_ABI, library, address)
    if(newStaking)
      return await contract.maxStakeAmount(address)
    return await contract._maxStakeAmount()
  } catch(e) { console.log(e) }
  return 0
}

export async function getShare(address, token, library, newStaking = false) {
  try {
    if(!isAddress(token) || token === AddressZero) {
      throw Error(`Invalid 'token' parameter '${token}'.`)
    }
    const contract = getContract(newStaking ? BMBO_WOW_STAKE : token, newStaking ? BAMBOO_STAKE_ABI : BMBO_ABI, library, address)
    if(newStaking)
      return await contract.percentageOfStakePool(address)
    return await contract._percentageOfStakePoolNewStake(0)
  } catch(e) { console.log(e) }
  return 0
}

export const formatBalance = (value, decimals = 18, maxFraction = 0) => {
  try {
    const formatted = ethers.utils.formatUnits(value, decimals)
    if (maxFraction > 0) {
        const split = formatted.split('.')
        if (split.length > 1) {
            return split[0] + '.' + split[1].substr(0, maxFraction)
        }
    }
    return formatted
  } catch(e) { console.log(e) }
  return 0
}

export const formatBN = (value, decimals = 18) => {
  try {
    const formatted = ethers.utils.parseUnits(value.toString(), decimals)
    return formatted
  } catch(e) { console.log(e) }
  return BigNumber.from(0)
}