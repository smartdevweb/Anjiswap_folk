import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core'

import { useBlockNumber } from '../application/hooks'
import { usePancakeSwapVersion, useCurrentKey, useEstimated } from './hooks'
import { useContract } from '../../hooks/useContract'
import { setEstimated } from './actions'

import { PCS_ROUTER_V1, PCS_ROUTER_V2 } from '../../constants/contracts'
import PCS_ROUTER_V1_ABI from '../../assets/contracts/pcsv1_abi.json'
import PCS_ROUTER_V2_ABI from '../../assets/contracts/pcsv2_abi.json'
import { TokenKeys } from './actions'
import { formatBalance, formatBN, isRightNetwork } from '../../utils/web3'
import { toFloat, toSignificant } from '../../utils/number'

export default function Updater() {
    const { library, chainId, account } = useWeb3React()
    const lastBlockNumber = useBlockNumber()
    const pcsVersion = usePancakeSwapVersion()
    const currentKey = useCurrentKey()
    const dispatch = useDispatch()
    const swap = useSelector(state => state.swap)
    const routerV1 = useContract(PCS_ROUTER_V1, PCS_ROUTER_V1_ABI, false)
    const routerV2 = useContract(PCS_ROUTER_V2, PCS_ROUTER_V2_ABI, false)
    const oldEstimated = useEstimated()

    useEffect(() => {
        const fetchEstimated = async () => {
            try {
                let estimated = ''
                const router = pcsVersion === 1 ? routerV1 : routerV2
                if(currentKey === TokenKeys.TOKEN_A && toFloat(swap.inputToken[TokenKeys.TOKEN_A].amount) > 0) {
                    const input = formatBN(swap.inputToken[TokenKeys.TOKEN_A].amount, swap.inputToken[TokenKeys.TOKEN_A].decimals)
                    estimated = await router.getAmountsOut(
                        input,
                        [swap.inputToken[TokenKeys.TOKEN_A].address, swap.inputToken[TokenKeys.TOKEN_B].address]
                    )
                    estimated = formatBalance(estimated[1], swap.inputToken[TokenKeys.TOKEN_B].decimals)
                    estimated = toSignificant(estimated, 6)
                }
                if(currentKey === TokenKeys.TOKEN_B && toFloat(swap.inputToken[TokenKeys.TOKEN_B].amount) > 0) {
                    const output = formatBN(swap.inputToken[TokenKeys.TOKEN_B].amount, swap.inputToken[TokenKeys.TOKEN_B].decimals)
                    estimated = await router.getAmountsIn(
                        output,
                        [swap.inputToken[TokenKeys.TOKEN_A].address, swap.inputToken[TokenKeys.TOKEN_B].address]
                    )
                    estimated = formatBalance(estimated[0], swap.inputToken[TokenKeys.TOKEN_A].decimals)
                    estimated = toSignificant(estimated, 6)
                }
                if(oldEstimated !== estimated) {
                    dispatch(setEstimated(estimated))
                }
            } catch(e) { console.log(e) }
        }
        if (!chainId || !library || !account || !lastBlockNumber || !pcsVersion || !isRightNetwork(chainId)) {
             if(oldEstimated !== '')
                dispatch(setEstimated(''))
            return
        }
        fetchEstimated()
    }, [chainId, library, account, lastBlockNumber, dispatch, swap, pcsVersion, routerV1, routerV2, currentKey, oldEstimated])

    return null
}
