import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'

import { resetTokenInfo, setAllowance, setBalance, setPrice } from './actions'
import { useBlockNumber } from '../application/hooks'

import { PCS_ROUTER_V1, PCS_ROUTER_V2, BMBO_WOW_STAKE } from '../../constants/contracts'
import { TokenList, Tokens } from '../../constants/tokens'
import { toFloat } from '../../utils/number'
import { formatBalance, getAllowance, getBalance, getPrice, isRightNetwork } from '../../utils/web3'

export default function Updater() {
    const { library, chainId, account } = useWeb3React()
    const lastBlockNumber = useBlockNumber()
    const dispatch = useDispatch()
    
    useEffect(() => {
        const getTokenBalance = async (token, address, decimals) => {
            let newBalance = await getBalance(account, address, library)
            newBalance = toFloat(formatBalance(newBalance, decimals))
            dispatch(setBalance(token, newBalance))
        }
        const fetchBalances = async () => {
            try {
                for (const token of TokenList) {
                    getTokenBalance(token.symbol, token.address, token.decimals)
                }
            } catch(e) { console.log(e) }
        }

        const getTokenPrice = async (token, lp_address, decimals) => {
            let newPrice = await getPrice(lp_address, decimals, library)
            if (isNaN(newPrice)) {
                newPrice = 0
            }
            dispatch(setPrice(token, newPrice))
        }
        const fetchPrices = async () => {
            try {
                for (const token of TokenList) {
                    getTokenPrice(token.symbol, token.pair_address, token.decimals)
                }
            } catch(e) { console.log(e) }
        }

        const getTokenAllowance = async (token, address, decimals, spender) => {
            let newAllowance = await getAllowance(account, spender, address, library)
            newAllowance = toFloat(formatBalance(newAllowance, decimals))
            dispatch(setAllowance(token, spender, newAllowance))
        }
        const fetchAllowances = async () => {
            try {
                for (const token of TokenList) {
                    if(token.pcs) {
                        const router = token.pcs === 1 ? PCS_ROUTER_V1 : PCS_ROUTER_V2
                        getTokenAllowance(token.symbol, token.address, token.decimals, router)
                    }
                    if(token.stake) {
                        const staking = token.swap === 1 ? Tokens.BMBO.address : BMBO_WOW_STAKE
                        getTokenAllowance(token.symbol, token.address, token.decimals, staking)
                    }
                }
            } catch(e) { console.log(e) }
        }

        if(!library || !account || !isRightNetwork(chainId)) {
            dispatch(resetTokenInfo())
            return
        }

        fetchBalances()
        fetchPrices()
        fetchAllowances()
    }, [chainId, library, account, lastBlockNumber, dispatch])

    return null
}
