import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  authRequest: ['auth_token', 'refresh_token'],
  authSuccess: ['accounts'],
  authFailure: null
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  auth_token: null,
  refresh_token: null,
  fetching: null,
  accounts: null,
  error: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { auth_token, refresh_token }) =>
  state.merge({ fetching: true, auth_token, refresh_token, accounts: null })

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
  [Types.AUTH_REQUEST]: request,
  [Types.AUTH_SUCCESS]: success,
  [Types.AUTH_FAILURE]: failure
})

/* ------------- Selectors ------------- */

// Is the current user authed in?
export const isLoggedIn = (loginState) => loginState.username !== null
