import { createStore, combineReducers } from 'redux'

import application from './application/reducer'
import swap from './swap/reducer'
import tx from './tx/reducer'
import token from './token/reducer'

export default function configureStore(initialState) {
  const reducer = combineReducers({
    application,
    swap,
    tx,
    token
  })
  const store = createStore(reducer, initialState)
  return store
}