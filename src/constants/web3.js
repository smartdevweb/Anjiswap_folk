import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const SUPPORTED_CHAINIDS = [
  56
]

export const injected = new InjectedConnector()

export const walletconnect = new WalletConnectConnector({
  rpc: {
      56: 'https://bsc-dataseed.binance.org/'
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})