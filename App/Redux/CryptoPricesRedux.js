import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  pricePollStart: null,
  pricePollStop: null,
  allPricesRequest: null,
  allPricesSuccess: ['hist_prices', 'current_prices'],
  allPricesFailure: null,
  histPricesRequest: null,
  histPricesSuccess: ['hist_prices'],
  histPricesFailure: null,
  currPricesRequest: null,
  currPricesSuccess: ['current_prices'],
  currPricesFailure: null 
})

export const CryptoPricesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: null,
  hist_prices: null,
  error: null,
  current_prices: null
})

/* ------------- Reducers ------------- */

// Reducers for historical data
export const hist_request = state =>
  state.merge({ fetching: true, hist_prices: null })

export const hist_success = (state, action) => {
  const { hist_prices } = action
  return state.merge({ fetching: false, error: null, hist_prices })}

  export const hist_failure = state =>
  state.merge({ fetching: false, error: true, hist_prices: null })

// Reducers for current prices
export const current_prices_request = state => {
  return state.merge({ fetching: true, error: null })
}

export const current_prices_success = (state, action) => {
  const { current_prices } = action
  return state.merge({ current_prices, error: null })
}

export const current_prices_failure = (state) => {
  return state.merge({ error: true })
}

// Reducers for refresh all
export const refresh_all_prices_request = state => {
  return state.merge({ fetching: true, error: null })
}

export const refresh_all_prices_success = (state, action) => {
  const { hist_prices, current_prices } = action
  return state.merge({ hist_prices, current_prices, error: null })
}

export const refresh_all_prices_failure = (state) => {
  return state.merge({ error: true })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.HIST_PRICES_REQUEST]: hist_request,
  [Types.HIST_PRICES_SUCCESS]: hist_success,
  [Types.HIST_PRICES_FAILURE]: hist_failure,
  [Types.CURR_PRICES_REQUEST]: current_prices_request,
  [Types.CURR_PRICES_SUCCESS]: current_prices_success,
  [Types.CURR_PRICES_FAILURE]: current_prices_failure,
  [Types.ALL_PRICES_REQUEST]: refresh_all_prices_request,
  [Types.ALL_PRICES_SUCCESS]: refresh_all_prices_success,
  [Types.ALL_PRICES_FAILURE]: refresh_all_prices_failure
})
