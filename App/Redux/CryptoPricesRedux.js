import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  pricePollStart: null,
  pricePollStop: null,
  allPricesRequest: null,
  allPricesSuccess: null,
  allPricesFailure: null,
  histPricesRequest: null,
  histPricesSuccess: ['hist_prices', 'hist_prices_end_date'],
  histPricesFailure: ['error'],
  currPricesRequest: null,
  currPricesSuccess: ['current_prices'],
  currPricesFailure: null 
})

export const CryptoPricesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: null,
  fetching_current: null,
  hist_prices: null,
  hist_prices_end_date: null,
  error: null,
  current_prices: null,
})

/* ------------- Reducers ------------- */

// Reducers for historical data
export const hist_request = state =>
  state.merge({ fetching: true, hist_prices: null })

export const hist_success = (state, action) => {
  const { hist_prices, hist_prices_end_date } = action
  return state.merge({ fetching: false, error: null, hist_prices, hist_prices_end_date })}

export const hist_failure = (state, action) => {
  const { error } = action
  return state.merge({ fetching: false, hist_prices: null, hist_prices_end_date: null, error })}

// Reducers for current prices
export const current_prices_request = state => {
  return state.merge({ fetching_current: true, error: null })}

export const current_prices_success = (state, action) => {
  const { current_prices } = action
  return state.merge({ current_prices, error: null, fetching_current: null })}

export const current_prices_failure = (state) => {
  return state.merge({ error: 'Failed to download current spot prices', fetching_current: null })}


// Reducers for refresh all
export const refresh_all_prices_request = state => {
  return state.merge({ fetching: true, error: null })
}

export const refresh_all_prices_success = (state, action) => {
  const { hist_prices, current_prices } = action
  return state.merge({ hist_prices, current_prices, error: null, fetching: null })
}

export const refresh_all_prices_failure = (state) => {
  return state.merge({ error: 'Failed to refresh prices', fetching: null })
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

// Helpers
export const hasHistPrices = (pricesState) => pricesState.hist_prices !== null
export const getHistPrices = (pricesState) => pricesState.hist_prices
export const getHistPricesEnd = (pricesState) => pricesState.hist_prices_end_date