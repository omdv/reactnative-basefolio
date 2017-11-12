import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initAuth: ['access_token', 'refresh_token', 'token_expiration'],
  authSuccess: null,
  accountsPollStart: null,
  accountsPollStop: null,
  authRefreshRequest: null,
  authRefreshSuccess: ['access_token', 'refresh_token', 'token_expiration'],
  authRefreshFailure: null,
  accountsRequest: null,
  accountsSuccess: ['accounts', 'transactions'],
  accountsFailure: null,
  userDataSuccess: ['user_profile'],
  saveTransactions: ['transactions'],
  logout: null
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  access_token: null,
  refresh_token: null,
  token_expiration: null,
  init_fetching: false,
  accounts: null,
  transactions: null,
  error_refresh: false,
  error_accounts: false,
  user_profile: null
})

/* ------------- Reducers ------------- */

export const initialAuth = (state, { access_token, refresh_token, token_expiration }) =>
  state.merge({
    access_token, refresh_token, token_expiration,
    accounts: null,
    transactions: null,
    init_fetching: true
  })

export const initialAuthSuccess = state => state.merge({init_fetching: false})

// reducers to refresh access_token
export const authRefreshSuccess = (state, action) => {
  const { access_token, refresh_token, token_expiration } = action
  return state.merge({ access_token, refresh_token, token_expiration })
}

export const authRefreshFailure = state => {
  return state.merge({ error_refresh: true })
}

// reducers for transactions
export const accountsRequest = state => {
  return state.merge({ error_accounts: false, fetching: true })
}

export const accountsSuccess = (state, action) => {
  const { accounts, transactions } = action
  return state.merge({
    fetching: false,
    error_accounts: false,
    accounts,
    transactions
  })
}

export const accountsFailure = state =>
  state.merge({
    fetching: false, error_accounts: true,
  })

export const userDataSuccess = (state, action) => {
  const { user_profile } = action
  return state.merge({ user_profile: user_profile })}

export const saveTransactions = (state, action) => {
  const { transactions } = action
  return state.merge({ transactions: transactions })
}

export const logout = (state) => INITIAL_STATE


/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.INIT_AUTH]: initialAuth,
  [Types.AUTH_SUCCESS]: initialAuthSuccess,
  [Types.AUTH_REFRESH_SUCCESS]: authRefreshSuccess,
  [Types.AUTH_REFRESH_FAILURE]: authRefreshFailure,
  [Types.ACCOUNTS_REQUEST]: accountsRequest,
  [Types.ACCOUNTS_SUCCESS]: accountsSuccess,
  [Types.ACCOUNTS_FAILURE]: accountsFailure,
  [Types.USER_DATA_SUCCESS]: userDataSuccess,
  [Types.SAVE_TRANSACTIONS]: saveTransactions,
  [Types.LOGOUT]: logout
})

/* ------------- Selectors ------------- */

// Is the current user logged in?
export const isAuthed = (authState) => authState.refresh_token !== null
