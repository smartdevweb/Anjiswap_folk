import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { BsArrowLeft, BsExclamationCircle } from 'react-icons/bs'
import { IoLockClosedSharp } from 'react-icons/io5'
import { MdLockOpen } from 'react-icons/md'

import Button from '../../components/Button'
import TokenSelect from '../../components/TokenSelect'
import { useStakingContract } from '../../hooks/useContract'
import { useBlockNumber, useWalletModalToggle } from '../../state/application/hooks'
import { TokenKeys, resetToken, setCurrentToken, setToken } from '../../state/swap/actions'
import { useGetToken } from '../../state/swap/hooks'
import { setTx } from '../../state/tx/actions'
import { formatValue, noExponents, toFloat } from '../../utils/number'
import { formatBN, formatBalance, getAllowance, getBalance, getContract, getEarned, getShare, getStakable, getStaked, isRightNetwork } from '../../utils/web3'

import BEP20_ABI from '../../assets/contracts/bep20_abi.json'
import { BMBO_WOW_STAKE } from '../../constants/contracts'
import { Tokens } from '../../constants/tokens'

const StakeContainer = styled.div`
  background: linear-gradient(311.99deg, rgba(0, 0, 0, 0.3) -22.55%, rgba(255, 255, 255, 0.3) 131.34%), #4E555D;
  background-blend-mode: soft-light, normal;
  border-radius: 15px;
  position: relative;
`
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #FFFFFF44;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`
const TokenArea = styled.div`
  padding: 1rem 1rem 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
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
const TokenMax = styled.div`
  font-size: 11px;
  color: white;
  text-align: left;
  padding: 1rem 1rem 0 1rem;
`
const AddMax = styled.div`
  color: #90FFED;
  cursor: pointer;
`

export default function StakePage() {
  const { chainId, account, library } = useWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const dispatch = useDispatch()

  const tokenStake = useGetToken(TokenKeys.TOKEN_C)
  const tokenReward = useGetToken(TokenKeys.TOKEN_D)
  const Staking_Contract = useStakingContract(tokenStake, tokenReward)
  const search = useLocation().search
  const history = useHistory()

  const STATUS = {
    READY: 0,
    PENDING: 1
  }
  const [status, setStatus] = useState(STATUS.READY)

  const blockNumber = useBlockNumber()
  const [balanceStake, setStakeBalance] = useState(0)
  const [balanceReward, setRewardBalance] = useState(0)
  const [staked, setStakedStake] = useState(0)
  const [stakable, setStakable] = useState(0)
  const [newStake, setNewStake] = useState('')
  const [earned, setEarnedReward] = useState(0)
  const [allowance, setStakeAllowance] = useState(0)
  const [stakeStep, setStakeStep] = useState(1)
  const [sharePercent, setSharePercent] = useState(0)

  const [fetchIndex, setFetchIndex] = useState(0)
  const tryFetch = () => {
    setFetchIndex(fetchIndex + 1)
  }

  useEffect(() => {
    let newStaking = false

    if (tokenStake) {
        const stakeParam = new URLSearchParams(search).get('token') || ''

        if (stakeParam.toLowerCase() !== tokenStake.symbol.toLowerCase()) {
            history.replace({ search: new URLSearchParams({ token: tokenStake.symbol }).toString() })
        }
    }

    async function fetchTokenBalance(tokenAddress, tokenDecimals, setTokenBalance) {
      try {
        let newBalance = await getBalance(account, tokenAddress, library)
        newBalance = formatBalance(newBalance, tokenDecimals)
        setTokenBalance(toFloat(newBalance))
      } catch(e) { console.log(e) }
    }
    async function fetchTokenAllowance() {
      try {
        let newAllowance = await getAllowance(account, tokenReward.address, tokenStake.address, library, newStaking)
        newAllowance = formatBalance(newAllowance, tokenReward.decimals)
        setStakeAllowance(toFloat(newAllowance))
      } catch(e) { console.log(e) }
    }
    async function fetchTokenStaked() {
      try {
        let newStaked = await getStaked(account, tokenReward.address, library, newStaking)
        newStaked = formatBalance(newStaked, tokenStake.decimals)
        setStakedStake(toFloat(newStaked))
      } catch(e) { console.log(e) }
    }
    async function fetchMaxStakable() {
      try {
        let newStakable = await getStakable(account, tokenReward.address, library, newStaking)
        newStakable = formatBalance(newStakable, tokenStake.decimals)
        setStakable(toFloat(newStakable))
      } catch(e) { console.log(e) }
    }
    async function fetchTokenEarned() {
      try {
        let newEarned = await getEarned(account, tokenReward.address, library, newStaking)
        newEarned = formatBalance(newEarned, tokenReward.decimals)
        setEarnedReward(noExponents(toFloat(newEarned)))
      } catch(e) { console.log(e) }
    }
    async function fetchStakeShare() {
      try {
        let newShare = await getShare(account, tokenReward.address, library, newStaking)
        newShare = formatBalance(newShare, 2, 2)
        setSharePercent(toFloat(newShare))
      } catch(e) { console.log(e) }
    }

    newStaking = tokenStake && tokenStake.name === Tokens.BMBO.name

    if(!library || !account || !isRightNetwork(chainId) || !tokenStake || !tokenReward) {
      setStakeBalance(0)
      setRewardBalance(0)
      setStakeAllowance(0)
      setStakedStake(0)
      setStakable(0)
      setEarnedReward(0)
      setNewStake('')
      return
    }

    fetchTokenBalance(tokenStake.address, tokenStake.decimals, setStakeBalance)
    fetchTokenBalance(tokenReward.address, tokenReward.decimals, setRewardBalance)
    fetchTokenAllowance()
    fetchTokenStaked()
    fetchMaxStakable()
    fetchTokenEarned()
    fetchStakeShare()

  }, [chainId, account, library, blockNumber, tokenStake, tokenReward, fetchIndex, history, search])

  useEffect(() => {
    const stakeParam = new URLSearchParams(search).get('token') || ''
    const loadStakeToken = Tokens[stakeParam.toUpperCase()]

    if (loadStakeToken && loadStakeToken.stake) {
        dispatch(setCurrentToken(TokenKeys.TOKEN_C))
        dispatch(setToken(loadStakeToken))
    } else {
        dispatch(resetToken(TokenKeys.TOKEN_C))
        dispatch(resetToken(TokenKeys.TOKEN_D))
    }
    setTimeout(() => {
      tryFetch()
    }, 100)
// eslint-disable-next-line
  }, [dispatch])

  const approveToken = async () => {
    try {
      if(!library || !account || !isRightNetwork(chainId) || !tokenStake) return
      const tokenContract = getContract(tokenStake.address, BEP20_ABI, library, account)
      if(!tokenContract) return
      setStatus(STATUS.PENDING)
      let tx = await tokenContract.approve(tokenStake.name === Tokens.SPND.name ? tokenReward.address : BMBO_WOW_STAKE, "1000000000000000000000000")
      tx = await tx.wait(1)
      dispatch(setTx(tx.transactionHash, `${tokenStake.symbol} Approved`, true))
      tryFetch()
    } catch(e) {
      dispatch(setTx('', (e.data && e.data.message) || e.message, false))
    }
    setStatus(STATUS.READY)
  }

  const inputRegex = new RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
  const checkAndUpdate = (amount, callback) => {
    const nextUserInput = amount ? amount.toString().replace(/[,]/g, '') : ''
    if (!nextUserInput || inputRegex.test(nextUserInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
      if(callback)
        callback(nextUserInput.toString())
    }
  }

  const calculatePercent = useCallback(() => {
    let percent = 0
    try {
      percent = (staked + toFloat(newStake)) * 50 / stakable
    } catch(e) { console.log(e) }
    if(!isFinite(percent))
      percent = 0
    return percent
  }, [staked, newStake, stakable])
  const percentComponent = useMemo(() => {
    const percent = calculatePercent()
    if(percent > 50) {
      return <span style={{color: '#FF4B33'}}>~More Than 50%</span>
    }
    return <span>~{percent.toFixed(2)}%</span>
  }, [calculatePercent])
  const shareComponent = () => {
    if(sharePercent < 0.01)
      return '<0.01'
    return sharePercent.toFixed(2)
  }

  const stake = async () => {
    try {
      if(!Staking_Contract) return
      if(toFloat(newStake) !== 0) return
      if(calculatePercent() > 50) return
      setStatus(STATUS.PENDING)
      let tx
      if(tokenStake.name === Tokens.SPND.name)
        tx = await Staking_Contract.stakeSafePanda(formatBN(newStake, tokenReward.decimals))
      else
        tx = await Staking_Contract.stake(formatBN(newStake, tokenReward.decimals))
      tx = await tx.wait(1)
      dispatch(setTx(tx.transactionHash, `${toFloat(newStake)} ${tokenStake.symbol} Staked`, true))
      setNewStake('')
      setStakeStep(1)
      tryFetch()
    } catch(e) {
      dispatch(setTx('', (e.data && e.data.message) || e.message, false))
    }
    setStatus(STATUS.READY)
  }
  const unstake = async () => {
    try {
      if(!Staking_Contract) return
      if(staked === 0) return
      setStatus(STATUS.PENDING)
      let tx
      if(tokenStake.name === Tokens.SPND.name)
        tx = await Staking_Contract._unstakeAll()
      else
        tx = await Staking_Contract.unstakeAll()
      tx = await tx.wait(1)
      dispatch(setTx(tx.transactionHash, `${tokenStake.name} Unstaked`, true))
      tryFetch()
    } catch(e) {
      dispatch(setTx('', (e.data && e.data.message) || e.message, false))
    }
    setStatus(STATUS.READY)
  }
  const harvest = async () => {
    try {
      if(!Staking_Contract) return
      if(earned === 0) return
      setStatus(STATUS.PENDING)
      let tx
      if(tokenStake.name === Tokens.SPND.name)
        tx = await Staking_Contract._claimAllBamboo()
      else
        tx = await Staking_Contract.harvest()
      tx = await tx.wait(1)
      dispatch(setTx(tx.transactionHash, `${tokenReward.symbol} Harvested`, true))
      tryFetch()
    } catch(e) {
      dispatch(setTx('', (e.data && e.data.message) || e.message, false))
    }
    setStatus(STATUS.READY)
  }

  return (
    <>
      <StakeContainer
        className="w-full max-w-2xl dark-box-shadow"
      >
        <div
          className="px-3 pt-3 text-white flex items-center justify-between"
        >
          <span>Stake</span>
          {
            account && isRightNetwork(chainId) ?
              <MdLockOpen width={20} height={20} className="cursor-pointer" style={{opacity: 0.6}} />
            :
              <IoLockClosedSharp width={20} height={20} className="cursor-pointer" style={{opacity: 0.6}} />
          }
        </div>
        <Divider />
        <TokenArea
        >
          <TokenSelect tokenKey={TokenKeys.TOKEN_C} title="Stake" />
          <TokenAmount
            placeholder="0.0"
            disabled={ !account || !isRightNetwork(chainId) }
            onChange={ (e) => checkAndUpdate(e.target.value, setNewStake) }
            value={ staked > 0 && stakeStep === 1 ?  formatValue(staked) : formatValue(newStake) }
           // readOnly={staked > 0 && stakeStep === 1}
           readOnly = {false}
          />
        </TokenArea>
        <TokenMax>
          <div className="flex flex-row justify-between number-font opacity-60">
            <span>{formatValue(balanceStake, '0.0')} {tokenStake && tokenStake.symbol}</span>
            {percentComponent}
          </div>
          {
            (account && isRightNetwork(chainId)) ?
              (
                stakable >= 0 ?
                  <AddMax
                    onClick={() => {
                      if(staked > 0 && stakeStep === 1) {
                        setStakeStep(2)
                      } else {
                        checkAndUpdate(Math.trunc(toFloat(stakable) - toFloat(staked)), setNewStake)
                      }
                    }}
                  >
                    {
                      staked > 0 && stakeStep === 1 ? 'Add To Stake (Max 50%)' : 'Stake MAX (50%)'
                    }
                  </AddMax>
                :
                  <div className="number-font opacity-60">
                    Max Staked (50%)
                  </div>
              )
            :
              null
          }
        </TokenMax>
        <div
          className="p-3 flex items-center justify-between flex-col"
        >
          {
            account && isRightNetwork(chainId) ?
              staked === 0 ?
                <Button
                  className="w-full anji-colorful"
                  // disabled={status === STATUS.PENDING || toFloat(newStake) <= 0 || calculatePercent() > 50 || allowance < toFloat(newStake)}
                  disabled={false}
                  onClick={stake}
                >
                  Stake
                </Button>
              : stakeStep === 1 ?
                <Button
                  className="w-full anji-green"
                  disabled={status === STATUS.PENDING}
                  onClick={unstake}
                >
                  Unstake
                </Button>
              :
                <div className="w-full">
                  <Button
                    className="w-full anji-colorful"
                    disabled={status === STATUS.PENDING || calculatePercent() > 50 || allowance < toFloat(newStake)}
                    onClick={stake}
                  >
                    Add To Stake
                  </Button>
                  <div style={{fontSize: 11, opacity: 0.6}} className="mt-3 text-white flex flex-row items-center justify-center cursor-pointer" onClick={() => {
                    setNewStake(0)
                    setStakeStep(1)
                  }}>
                    <BsArrowLeft className="mr-1" size={16} />
                    Back to Unstake
                  </div>
                </div>
            :
              <Button
                className="w-full anji-green"
                disabled={status === STATUS.PENDING}
                onClick={!account ? toggleWalletModal : null}
              >
                Connect Wallet
              </Button>
            }
        </div>
        <Divider />
        <TokenArea
        >
          <TokenSelect tokenKey={TokenKeys.TOKEN_D} title="Reward" />
          <TokenAmount
            placeholder="0.0"
            readOnly
            disabled={ !account || !isRightNetwork(chainId) }
            value={ formatValue(earned) }
          />
        </TokenArea>
        <TokenMax>
          <div style={{opacity: 0.6}} className="flex flex-row items-center justify-between">
            <span className="number-font opacity-60">{formatValue(balanceReward, '0.0')} {tokenReward && tokenReward.symbol}</span>
            <span className="number-font opacity-60">Amount Earned</span>
          </div>
        </TokenMax>
        <div
          className="p-3 flex items-center justify-between flex-col"
        >
          {
            account && isRightNetwork(chainId) && earned > 0 ?
              <Button
                className="w-full anji-colorful"
                disabled={status === STATUS.PENDING}
                onClick={harvest}
              >
                Harvest
              </Button>
            :
              null
            }
        </div>
        {
          account && isRightNetwork(chainId) && staked > 0 ?
            <>
              <Divider />
              <div style={{fontSize: 11}} className="text-white pt-3 pb-5 px-3 flex flex-row items-center justify-between number-font">
                <span>Percentage Of Pool = {shareComponent()}%</span>
                <BsExclamationCircle size={16} />
              </div>
            </>
          : null
        }
      </StakeContainer>
      {
        account && isRightNetwork(chainId) && allowance < newStake ?
          <div className="mt-5 text-white w-full">
            <div style={{ fontSize: 11 }}>
              Approve your wallet to allow AnjiSwap to stake.
            </div>
            <div
              className="anji-green rounded-3xl py-3 mt-3 cursor-pointer"
              onClick={status === STATUS.READY ? approveToken : null}
            >
              Approve
              {
                status === STATUS.PENDING &&
                  <div
                    className="absolute w-full h-full left-0 top-0 rounded-full"
                    style={{
                      background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))'
                    }}
                  />
              }
            </div>
          </div>
        :
          null
      }
    </>
  )
}
