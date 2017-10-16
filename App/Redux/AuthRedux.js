import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  authRequest: ['access_token', 'refresh_token'],
  authSuccess: ['accounts'],
  authFailure: null,
  authRefreshRequest: ['refresh_token'],
  authRefreshSucess: ['access_token', 'refresh_token'],
  authRefreshFailure: null
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  access_token: null,
  refresh_token: null,
  fetching: null,
  accounts: null,
  error: null
})

/* ------------- Reducers ------------- */

export const requestAccounts = (state, { access_token, refresh_token }) =>
  state.merge({ fetching: true, access_token, refresh_token, accounts: null})

export const successAccounts = (state, action) => {
  const { accounts } = action
  return state.merge({ fetching: false, error: null, accounts })
}

export const failureAccounts = state =>
  state.merge({ fetching: false, error: true, accounts: null })


export const refreshAuthRequest = (state) => (state, { refresh_token }) =>
  state.merge({ fetching: true, refresh_token, access_token: null})

export const refreshAuthSuccess = (state, action) => {
  const { access_token, refresh_token } = action
  return state.merge({ fetching: false, error: null, access_token, refresh_token })
}

export const refreshAuthFailure  = state =>
  state.merge({ fetching: false, error: true, accounts: null, access_token: null, refresh_token: null })

export const logout = (state) => INITIAL_STATE


/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.AUTH_REQUEST]: requestAccounts,
  [Types.AUTH_SUCCESS]: successAccounts,
  [Types.AUTH_FAILURE]: failureAccounts,
  [Types.AUTH_REFRESH_REQUEST]: refreshAuthRequest,
  [Types.AUTH_REFRESH_SUCCESS]: refreshAuthSuccess,
  [Types.AUTH_REFRESH_FAILURE]: refreshAuthFailure,
  [Types.LOGOUT]: logout
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export const isAuthed = (authState) => authState.refresh_token !== null
