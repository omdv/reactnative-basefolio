import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  gdaxRequest: ['passphrase', 'key', 'secret'],
  gdaxSuccess: ['orders'],
  gdaxFailure: null
})

export const GdaxTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: null,
  passphrase: null,
  key: null,
  secret: null,
  orders: null,
  error: null
})

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, action) => {
  const { passphrase, key, secret } = action
  return state.merge({ fetching: true, passphrase, key, secret })
}

// successful api lookup
export const success = (state, action) => {
  const { orders } = action
  return state.merge({ fetching: false, error: null, orders })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, orders: null, passphrase: null, key: null, secret: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GDAX_REQUEST]: request,
  [Types.GDAX_SUCCESS]: success,
  [Types.GDAX_FAILURE]: failure
})
