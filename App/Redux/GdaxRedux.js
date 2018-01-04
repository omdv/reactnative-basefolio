import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  gdaxRequest: ['passphrase', 'key', 'secret'],
  gdaxSuccess: null,
  gdaxFailure: null,
})

export const GdaxTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  has_keys: false,
  fetching: null,
  passphrase: null,
  key: null,
  secret: null,
  error: null,
  gdax_authed: false
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, action) => {
  const { passphrase, key, secret } = action
  return state.merge({ fetching: true, passphrase, key, secret, has_keys: true })
}

// successful api lookup
export const success = state => {
  return state.merge({ fetching: false, error: null, gdax_authed: true })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, orders: null, passphrase: null, key: null, secret: null, has_keys: false })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GDAX_REQUEST]: request,
  [Types.GDAX_SUCCESS]: success,
  [Types.GDAX_FAILURE]: failure
})
