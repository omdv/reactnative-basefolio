import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  pricePollStart: ['coins'],
  pricePollStop: null,  
  histPricesRequest: ['coins'],
  histPricesSuccess: ['hist_prices'],
  histPricesFailure: null,
  currPricesSuccess: ['current_prices'],
})

export const CryptoPricesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  coins: null,
  fetching: null,
  hist_prices: null,
  error: null,
  current_prices: null
})

/* ------------- Reducers ------------- */

// Reducers for historical data
export const hist_request = (state, { coins }) =>
  state.merge({ fetching: true, coins, hist_prices: null })

export const hist_success = (state, action) => {
  const { hist_prices } = action
  return state.merge({ fetching: false, error: null, hist_prices })}

  export const hist_failure = state =>
  state.merge({ fetching: false, error: true, hist_prices: null })


// Reducers for current price fetching
export const price_poll_start = (state, { coins }) => {
  return state.merge({ coins })
}

export const current_prices_success = (state, action) => {
  const { current_prices } = action
  return state.merge({ current_prices })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.PRICE_POLL_START]: price_poll_start,
  [Types.HIST_PRICES_REQUEST]: hist_request,
  [Types.HIST_PRICES_SUCCESS]: hist_success,
  [Types.HIST_PRICES_FAILURE]: hist_failure,
  [Types.CURR_PRICES_SUCCESS]: current_prices_success
})
