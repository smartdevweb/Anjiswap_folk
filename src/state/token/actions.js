const Types = {
  RESET_TOKEN_INFO: 'token/resetTokenInfo',
  SET_PRICE: 'token/setPrice',
  SET_BALANCE: 'token/setBalance',
  SET_ALLOWANCE: 'token/setAllowance'
}

const resetTokenInfo = () => ({
  type: Types.RESET_TOKEN_INFO,
  payload: { }
})
const setPrice = (token, price) => ({
  type: Types.SET_PRICE,
  payload: { token, price }
})
const setBalance = (token, balance) => ({
  type: Types.SET_BALANCE,
  payload: { token, balance }
})
const setAllowance = (token, spender, allowance) => ({
  type: Types.SET_ALLOWANCE,
  payload: { token, spender, allowance }
})

export {
  resetTokenInfo,
  setPrice,
  setBalance,
  setAllowance,
  Types
}