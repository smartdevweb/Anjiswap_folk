import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core'
import { BsGear } from 'react-icons/bs'
import { FiArrowDown } from 'react-icons/fi'

import Button from '../../components/Button'
import TokenInput from '../../components/TokenInput'
import TokenSelect from '../../components/TokenSelect'
import { useContract } from '../../hooks/useContract'
import usePrevious from '../../hooks/usePrevious'
import { TokenKeys, setCurrentToken, setToken } from '../../state/swap/actions'
import { useBlockNumber, useWalletModalToggle } from '../../state/application/hooks'
import { useCurrentKey, useEstimated, useGetOppositeToken, useGetToken, usePancakeSwapVersion, useSwapTokens } from '../../state/swap/hooks'
import { setTx } from '../../state/tx/actions'
import { formatValue, toFloat, toSignificant } from '../../utils/number'
import { formatBN, formatBalance, getAllowance, getBalance, getContract, isRightNetwork } from '../../utils/web3'

import { PCS_ROUTER_V1, PCS_ROUTER_V2 } from '../../constants/contracts'
import { TokenList, Tokens } from '../../constants/tokens'
import BEP20_ABI from '../../assets/contracts/bep20_abi.json'
import PCS_ROUTER_V1_ABI from '../../assets/contracts/pcsv1_abi.json'
import PCS_ROUTER_V2_ABI from '../../assets/contracts/pcsv2_abi.json'

const SwapContainer = styled.div`
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
const Settings = styled.div`
  background: linear-gradient(313.34deg, rgba(0, 0, 0, 0.3) -28.92%, rgba(255, 255, 255, 0.3) 130.82%), #4E555D;
  background-blend-mode: soft-light, normal;
  border-radius: 20px;
  position: absolute;
  top: 40px;
  right: 10px;
`
const SettingInput = styled.input`
  background: linear-gradient(134.85deg, rgba(0, 0, 0, 0.4) -9.62%, rgba(255, 255, 255, 0.4) 136.92%), #4E555D;
  background-blend-mode: soft-light, normal;
  box-shadow: inset 2.5px 2.5px 5px #35373E;
  border-radius: 20px;
  text-align: right;
  padding: 3px 8px;
  width: ${props => props.width};
  outline: none;
  font-family: 'Roboto Mono', monospace;
  &.active {
    background: linear-gradient(314.61deg, rgba(0, 0, 0, 0.3) -31.16%, rgba(255, 255, 255, 0.3) 136.93%), #1FE3CC;
    color: white;
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

export default function SwapPage() {
  const { chainId, account, library } = useWeb3React()//Connect MEtamask or other wallets.
  const toggleWalletModal = useWalletModalToggle()
  const version = usePancakeSwapVersion()//API.get PanCakeSwap Version //Here v2.0
  const estimated = useEstimated()//estimate the selected tokens with other tokens through the Internet.
  const currentKey = useCurrentKey()
  const tokenA = useGetToken(TokenKeys.TOKEN_A)
  const tokenB = useGetToken(TokenKeys.TOKEN_B)
  const swapTokens = useSwapTokens()
  const dispatch = useDispatch()
  const search = useLocation().search;
  const history = useHistory()

  const routerV1 = useContract(PCS_ROUTER_V1, PCS_ROUTER_V1_ABI, true)
  const routerV2 = useContract(PCS_ROUTER_V2, PCS_ROUTER_V2_ABI, true)

  const STATUS = {
    READY: 0,
    PENDING: 1
  }
  const [status, setStatus] = useState(STATUS.READY)

  const [settingsOpen, toggleSettings] = useState(false)
  const [slippage, setSlipPage] = useState(-1)
  const [defaultSlippage, setDefaultSlipPage] = useState(1)
  const [deadline, setDeadline] = useState(30)
  const prevDeadline = usePrevious(deadline)

  useEffect(() => {
    dispatch(setCurrentToken(TokenKeys.TOKEN_A))
    dispatch(setToken(TokenList[0]))

    // Retrieve token from query param
    const stakeParam = new URLSearchParams(search).get('token') || ''
    const token = Tokens[stakeParam.toUpperCase()]
    if (token && token.symbol !== 'BNB') {
      dispatch(setCurrentToken(TokenKeys.TOKEN_B))
      dispatch(setToken(token))
    }
  }, [dispatch, search])

  useEffect(() => {
    const slippage = tokenA?.slippage || tokenB?.slippage || 11;
    setDefaultSlipPage(slippage)

    if (tokenA && tokenB) {
        const token = tokenA.symbol !== Tokens.BNB.symbol ? tokenA : tokenB
        const stakeParam = new URLSearchParams(search).get('token') || ''
        if(stakeParam.toLowerCase() !== token.symbol.toLowerCase()) {
            history.replace({ search: new URLSearchParams({ token: token.symbol }).toString() })
        }
    }
  }, [tokenA, tokenB, setDefaultSlipPage, search, history])

  const [price, setPrice] = useState()
  useEffect(() => {
    if(!estimated || !currentKey || !tokenA || !tokenB) return

    const input = currentKey === TokenKeys.TOKEN_A ? tokenA.amount : estimated
    const output = currentKey === TokenKeys.TOKEN_B ? tokenB.amount : estimated

    let newPrice = 0
    if(tokenA.symbol === 'BNB')
      newPrice = toSignificant(toFloat(output) / toFloat(input), 6)
    else
      newPrice = toSignificant(toFloat(input) / toFloat(output), 6)
    setPrice(newPrice)
  }, [estimated, currentKey, tokenA, tokenB, setPrice])

  const [fetchIndex, setFetchIndex] = useState(0)
  const tryFetch = () => {
    setFetchIndex(fetchIndex + 1)
  }
//**********************************swap tokens..main engine*******************
  const swap = async () => {
    try {
      if(!account || !estimated || !currentKey || !tokenA || !tokenB || !routerV1 || !routerV2) return
      
      const router = version === 1 ? routerV1 : routerV2//swap router set
      const path = [tokenA.address, tokenB.address]
      const timestamp = Math.floor(Date.now() / 1000) + 60 * toFloat(deadline)
      //Set input output
      let input = currentKey === TokenKeys.TOKEN_A ? tokenA.amount : estimated
      input = formatBN(input, tokenA.decimals)
      let output = currentKey === TokenKeys.TOKEN_B ? tokenB.amount : estimated
      output = formatBN(output, tokenB.decimals)
    
      setStatus(STATUS.PENDING)
      let tx = null
      const overrides = {
        value: input
      }
      if(currentKey === TokenKeys.TOKEN_A) {
        // Swap Exact Sth For Sth
        if(tokenA.symbol === 'BNB') {
          console.log(path,account,timestamp,overrides)
          tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(0, path, account, timestamp, overrides)
          
        }
        if(tokenB.symbol === 'BNB') {
          tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(input, 0, path, account, timestamp)
        }
      }
      if(currentKey === TokenKeys.TOKEN_B) {
        // Swap Sth for Exact Sth
        if(tokenA.symbol === 'BNB') {
          tx = await router.swapETHForExactTokens(output, path, account, timestamp, overrides)
        }
        if(tokenB.symbol === 'BNB') {
          tx = await router.swapTokensForExactETH(output, 0, path, account, timestamp)
        }
      }

      if(tx) {
        tx = await tx.wait(1)
        dispatch(setTx(tx.transactionHash, `Swaped`, true))

        let newToken = currentKey === TokenKeys.TOKEN_A ? tokenA : tokenB
        newToken.amount = ''
        dispatch(setToken(newToken))
        tryFetch()
      }
    } catch(e) {
      dispatch(setTx('', (e.data && e.data.message) || e.message, false))
    }
    setStatus(STATUS.READY)
  }

  const blockNumber = useBlockNumber()
  const tokenOther = useGetOppositeToken()
  const [balance, setBalance] = useState(0)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [tokenAllowance, setTokenAllowance] = useState(0)

  useEffect(() => {
    async function fetchBalance() {
      try {
        let newBalance = await getBalance(account, null, library)
        newBalance = formatBalance(newBalance)
        setBalance(Math.trunc(toFloat(newBalance) * 100) / 100)
      } catch(e) { console.log(e) }
    }
    async function fetchTokenBalance() {
      try {
        let newBalance = await getBalance(account, tokenOther.address, library)
        newBalance = formatBalance(newBalance, tokenOther.decimals)
        setTokenBalance(toFloat(newBalance))
      } catch(e) { console.log(e) }
    }
    async function fetchTokenAllowance() {
      try {
        const router = version === 1 ? routerV1 : routerV2
        let newAllowance = await getAllowance(account, router.address, tokenOther.address, library)
        newAllowance = formatBalance(newAllowance, tokenOther.decimals)
        setTokenAllowance(toFloat(newAllowance))
      } catch(e) { console.log(e) }
    }
    if(!library || !account || !isRightNetwork(chainId)) return
    fetchBalance()

    if(!tokenOther) return
    fetchTokenBalance()

    if(!version || !routerV1 || !routerV2) return
    fetchTokenAllowance()
  }, [chainId, account, library, blockNumber, tokenOther, version, routerV1, routerV2, fetchIndex])
  const approveToken = async () => {
    try {
      if(!library || !account) return
      if(!version || !routerV1 || !routerV2) return
      const router = version === 1 ? routerV1 : routerV2
      const tokenContract = getContract(tokenA.address, BEP20_ABI, library, account)
      if(!tokenContract) return
      setStatus(STATUS.PENDING)
      let tx = await tokenContract.approve(router.address, "1000000000000000000000000")
      tx = await tx.wait(1)
      dispatch(setTx(tx.transactionHash, `${tokenA.symbol} Approved`, true))
      tryFetch()
    } catch(e) {
      dispatch(setTx('', (e.data && e.data.message) || e.message, false))
    }
    setStatus(STATUS.READY)
  }

  const checkBalances = () => {
    if(!account || !estimated || !currentKey || !tokenA) return 'Error'

    let input = currentKey === TokenKeys.TOKEN_A ? tokenA.amount : estimated

    if(tokenA.symbol === 'BNB' && input > balance) return 'Insufficient BNB balance'
    if(tokenA.symbol !== 'BNB' && input > tokenBalance) return `Insufficient ${tokenA.symbol} balance`

    return ''
  }

  const tokenAInput = useRef()
  const tokenBInput = useRef()

  const inputRegex = new RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
  const checkAndUpdate = (amount, callback) => {
    const nextUserInput = amount ? amount.toString().replace(/[,]/g, '') : ''
    if (!nextUserInput || inputRegex.test(nextUserInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
      if(callback)
        callback(nextUserInput.toString())
    }
  }

  return (
    <>
      <SwapContainer
        className="w-full max-w-2xl dark-box-shadow"
      >
        <div
          className="px-3 pt-3 text-white flex items-center justify-between"
        >
          <span>Swap</span>
          <BsGear width={20} height={20} className="cursor-pointer icon-btn" onClick={() => toggleSettings(true)} />
        </div>
        <Divider />
        <TokenArea
        >
          <TokenSelect tokenKey={TokenKeys.TOKEN_A} />
          <TokenInput tokenKey={TokenKeys.TOKEN_A} ref={tokenAInput} />
        </TokenArea>
        {
          tokenA &&
            <TokenMax>
              <div className="number-font opacity-60">
                {formatValue(tokenA.symbol === 'BNB' ? balance : tokenBalance, '0.0')} {tokenA.symbol}
              </div>
              <AddMax
                onClick={() => tokenAInput.current.setMax(tokenA.symbol === 'BNB' ? balance : tokenBalance)}
              >
                Add MAX
              </AddMax>
            </TokenMax>
        }
        <Divider>
          <div
            style={{
              background: 'linear-gradient(317.7deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 105.18%), #E7EBF0',
              backgroundBlendMode: 'soft-light, normal',
              borderRadius: '4px',
              width: 33,
              height: 26
            }}
            className="box-shadow flex items-center justify-center"
            onClick={swapTokens}
          >
            <FiArrowDown size={12} className="m-1" />
          </div>
        </Divider>
        <TokenArea
        >
          <TokenSelect tokenKey={TokenKeys.TOKEN_B} />
          <TokenInput tokenKey={TokenKeys.TOKEN_B} ref={tokenBInput} />
        </TokenArea>
        {
          tokenB &&
            <TokenMax>
              <div className="number-font opacity-60">
                {formatValue(tokenB.symbol === 'BNB' ? balance : tokenBalance, '0.0')} {tokenB.symbol}
              </div>
              {/* <AddMax
                onClick={() => tokenBInput.current.setMax(tokenB.symbol === 'BNB' ? balance : tokenBalance)}
              >
                Add MAX
              </AddMax> */}
            </TokenMax>
        }
        <Divider />
        <div
          className="p-3 flex items-center justify-between flex-col"
        >
          {
            version > 0 && estimated ?
              <div className="flex items-center justify-between mb-5 px-2 w-full text-white text-sm number-font" style={{fontSize: 18}}>
                <span>PCS V{version}</span>
                <span>1 BNB = {formatValue(price)} {tokenA.symbol === 'BNB' ? tokenB?.symbol : tokenA?.symbol}</span>
              </div>
            :
              null
          }
          {
            account && isRightNetwork(chainId) && estimated && checkBalances() ?
              <Button
                className="w-full anji-colorful"
                disabled={status === STATUS.PENDING || (tokenA && tokenA.symbol !== 'BNB' && tokenAllowance < tokenBalance)}
                onClick={swap}
              >
                Swap
              </Button>
            :
              <Button
                className="w-full anji-green"
                disabled={account && isRightNetwork(chainId)}
                onClick={toggleWalletModal}
              >
                {
                  (!account || !isRightNetwork(chainId)) ? 'Connect Wallet'
                  : !estimated ? 'Enter an amount'
                  : checkBalances()
                }
              </Button>
            }
        </div>
        {
          settingsOpen &&
            <>
              <div
                className="fixed left-0 top-0 w-full h-full"
                onClick={() => toggleSettings(false)}
              >

              </div>
              <Settings
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 pt-4 text-white text-left">
                  Transaction Settings
                </div>
                <Divider />
                <div className="p-3 text-white flex items-center justify-start flex-col">
                  <div className="w-full flex items-center justify-start flex-col mb-3">
                    <span className="w-full text-left text-gray-400">Slippage tolerance</span>
                    <div className="w-full flex items-center justify-between mt-1">
                      <Button
                        activeBg="linear-gradient(134.85deg, rgba(0, 0, 0, 0.4) -9.62%, rgba(255, 255, 255, 0.4) 136.92%), #4E555D"
                        radius="20px"
                        className={`
                          px-3 py-1 anji-green
                          ${slippage < 0 ? '' : 'active'}
                        `}
                        padding="0.25rem 0.75rem"
                        onClick={() => setSlipPage(-1)}
                      >
                        Auto
                      </Button>
                      <div>
                        <SettingInput
                          placeholder="1"
                          width="100px"
                          className={`mx-3 ${slippage < 0 ? '' : 'active'}`}
                          value={slippage < 0 ? defaultSlippage : slippage}
                          onChange={(e) => checkAndUpdate(e.target.value, setSlipPage)}
                          onFocus={() => {
                            if(slippage < 0)
                              setSlipPage(defaultSlippage)
                          }}
                        />
                        %
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-start flex-col mb-3">
                    <span className="w-full text-left text-gray-400">Transaction deadline</span>
                    <div className="w-full flex items-center justify-start mt-1">
                      <SettingInput
                        placeholder="30"
                        width="59px"
                        className={`mx-3 ${deadline !== prevDeadline ? 'active' : ''}`}
                        value={deadline}
                        onChange={(e) => checkAndUpdate(e.target.value, setDeadline)}
                      />
                      minutes
                    </div>
                  </div>
                </div>
              </Settings>
            </>
        }
      </SwapContainer>
      {
        account && isRightNetwork(chainId) && tokenA && tokenA.symbol !== 'BNB' && tokenAllowance < tokenBalance ?
          <div className="mt-5 text-white w-full">
            <div style={{ fontSize: 11 }}>
              Approve your wallet to allow AnjiSwap to swap.
            </div>
            <div
              className="anji-green rounded-3xl py-3 mt-3 cursor-pointer"
              onClick={status === STATUS.READY ? approveToken : null}
            >
              Approve {tokenA.symbol}
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
      {
        checkBalances() === 'Insufficient BNB balance' &&
          <SwapContainer
            className="w-full max-w-2xl mt-3 dark-box-shadow"
          >
            <div
              className="px-3 pt-3 text-white flex items-center justify-between"
            >
              <span>Buy BNB for your wallet</span>
            </div>
            <Divider />
            <div
              className="p-3 text-white text-justify"
            >
              Easily and securely buy BNB with your preferred payment method. BNB is required to buy ANJI tokens.
              <Button
                className="w-full mt-3 anji-green"
                onClick={() => window.open('https://app.transak.com/')}
              >
                Buy through Transak
              </Button>
            </div>
          </SwapContainer>
      }
    </>
  )
}
