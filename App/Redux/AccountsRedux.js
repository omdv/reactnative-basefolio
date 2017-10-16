import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  accountsRequest: null,
  accountsSuccess: ['accounts'],
  accountsFailure: null
})

export const AccountsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: null,
  accounts: null,
  error: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = state =>
  state.merge({ fetching: true, accounts: null })

// successful api lookup
export const success = (state, action) => {
  const { accounts } = action
  return state.merge({ fetching: false, error: null, accounts })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, accounts: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ACCOUNTS_REQUEST]: request,
  [Types.ACCOUNTS_SUCCESS]: success,
  [Types.ACCOUNTS_FAILURE]: failure
})
