import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  positionsSave: ['positions'],
  positionsRequest: ['data'],
  positionsSuccess: ['payload'],
  positionsFailure: null
})

export const PositionsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  positions: null,
  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Reducers ------------- */

// successful api lookup
export const save = (state, action) => {
  const { positions } = action
  return state.merge({ positions })
}

// request the data from an api
export const request = (state, { data }) =>
  state.merge({ fetching: true, data, payload: null })

// successful api lookup
export const success = (state, action) => {
  const { payload } = action
  return state.merge({ fetching: false, error: null, payload })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, payload: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.POSITIONS_SAVE]: save,
  [Types.POSITIONS_REQUEST]: request,
  [Types.POSITIONS_SUCCESS]: success,
  [Types.POSITIONS_FAILURE]: failure
})
