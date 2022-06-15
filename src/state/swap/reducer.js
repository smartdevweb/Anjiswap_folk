import { Tokens } from '../../constants/tokens'
import { Types, TokenKeys } from './actions'

const defaultState = {
  currentTokenKey: null,
  inputToken: { },
  estimated: ''
}

const reducer = (state = defaultState, action) => {
  let newState = { ...state }
  const curKey = newState.currentTokenKey
  const otherKey = curKey === TokenKeys.TOKEN_A ? TokenKeys.TOKEN_B : TokenKeys.TOKEN_A;
  let token, temp, tokenA, tokenB
  switch(action.type) {
    case Types.SET_TOKEN:
      token = { ...action.payload.token }
      if(curKey === TokenKeys.TOKEN_A || curKey === TokenKeys.TOKEN_B) {
        if(!newState.inputToken[otherKey]) {
          newState.inputToken[curKey] = token
          break
        }
        if(newState.inputToken[otherKey].name === token.name) {
          temp = {...newState.inputToken[otherKey]}
          newState.inputToken[otherKey] = newState.inputToken[curKey]
          newState.inputToken[curKey] = temp
          break
        }
        if(newState.inputToken[otherKey].name !== 'BNB' && token.name !== 'BNB') {
          break
        }
      }
      if(curKey === TokenKeys.TOKEN_C) {
        if(token.name === Tokens.SPND.name)
          newState.inputToken[TokenKeys.TOKEN_D] = Tokens.BMBO
        if(token.name === Tokens.BMBO.name)
          newState.inputToken[TokenKeys.TOKEN_D] = Tokens.WOW
      }
      if(curKey === TokenKeys.TOKEN_D) {
        if(token.name === Tokens.BMBO.name)
          newState.inputToken[TokenKeys.TOKEN_C] = Tokens.SPND
        if(token.name === Tokens.WOW.name)
          newState.inputToken[TokenKeys.TOKEN_C] = Tokens.BMBO
      }
      newState.inputToken[curKey] = token
      break
    case Types.SET_CURRENT_TOKEN:
      temp = action.payload.key
      newState.currentTokenKey = temp
      break
    case Types.SET_ESTIMATED:
      temp = action.payload.estimated
      newState.estimated = temp
      break
    case Types.SWAP_TOKENS:
      tokenA = newState.inputToken[TokenKeys.TOKEN_A]
      tokenB = newState.inputToken[TokenKeys.TOKEN_B]

      newState.inputToken[TokenKeys.TOKEN_A] = tokenB
      newState.inputToken[TokenKeys.TOKEN_B] = tokenA

      newState.currentTokenKey = newState.currentTokenKey === TokenKeys.TOKEN_A ? TokenKeys.TOKEN_B : TokenKeys.TOKEN_A
      break
    case Types.RESET_TOKEN:
      temp = action.payload.key
      newState.inputToken[temp] = null
      break
    default:
  }
  return newState
}

export default reducer