import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  transactionsRequest: null,
  transactionsSuccess: ['transactions'],
  transactionsFailure: null
})

export const TransactionsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: null,
  transactions: null,
  error: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = state =>
  state.merge({ fetching: true, transactions: null })

// successful api lookup
export const success = (state, action) => {
  const { transactions } = action
  return state.merge({ fetching: false, error: null, transactions })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, transactions: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TRANSACTIONS_REQUEST]: request,
  [Types.TRANSACTIONS_SUCCESS]: success,
  [Types.TRANSACTIONS_FAILURE]: failure
})
