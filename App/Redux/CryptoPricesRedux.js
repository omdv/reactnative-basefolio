import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  cryptoPricesRequest: ['coins'],
  cryptoPricesSuccess: ['prices'],
  cryptoPricesFailure: null
})

export const CryptoPricesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  coins: null,
  fetching: null,
  prices: null,
  error: null
})

/* ------------- Reducers ------------- */

// request the coin from an api
export const request = (state, { coins }) =>
  state.merge({ fetching: true, coins, prices: null })

// successful api lookup
export const success = (state, action) => {
  const { prices } = action
  return state.merge({ fetching: false, error: null, prices })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, prices: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CRYPTO_PRICES_REQUEST]: request,
  [Types.CRYPTO_PRICES_SUCCESS]: success,
  [Types.CRYPTO_PRICES_FAILURE]: failure
})
