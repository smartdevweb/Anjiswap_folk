const Types = {
  SET_TOKEN: 'swap/setToken',
  SET_CURRENT_TOKEN: 'swap/setCurrentToken',
  SET_ESTIMATED: 'swap/setEstimated',
  SWAP_TOKENS: 'swap/swapTokens',
  RESET_TOKEN: 'token/resetToken'
}

const setToken = (token) => ({
  type: Types.SET_TOKEN,
  payload: { token }
})
const setCurrentToken = (key) => ({
  type: Types.SET_CURRENT_TOKEN,
  payload: { key }
})
const setEstimated = (estimated) => ({
  type: Types.SET_ESTIMATED,
  payload: { estimated }
})
const swapTokens = () => ({
  type: Types.SWAP_TOKENS,
  payload: { }
})
const resetToken = (key) => ({
  type: Types.RESET_TOKEN,
  payload: { key }
})

const TokenKeys = {
  TOKEN_A: 'swap/tokenA',
  TOKEN_B: 'swap/tokenB',
  TOKEN_C: 'stake/tokenC',
  TOKEN_D: 'stake/tokenD'
}

export {
  setToken,
  setCurrentToken,
  setEstimated,
  swapTokens,
  resetToken,
  Types,
  TokenKeys
}