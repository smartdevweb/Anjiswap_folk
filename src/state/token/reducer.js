import { Types } from './actions'

const defaultState = {
  prices: { },
  balances: { },
  allowances: { }
}

const reducer = (state = defaultState, action) => {
  let newState = { ...state }
  if(!action.payload)
    return newState
  const token = action.payload.token
  let value, obj

  switch(action.type) {
    case Types.RESET_TOKEN_INFO:
      newState = {
        prices: { },
        balances: { },
        allowances: { }
      }
      break
    case Types.SET_PRICE:
      value = action.payload.price
      newState.prices[token] = value
      break
    case Types.SET_BALANCE:
      value = action.payload.balance
      newState.balances[token] = value
      break
    case Types.SET_ALLOWANCE:
      obj = action.payload.spender
      value = action.payload.allowance
      if(!newState[token]) {
        newState[token] = { }
      }
      newState[token][obj] = value
      break
    default:
  }
  return newState
}

export default reducer