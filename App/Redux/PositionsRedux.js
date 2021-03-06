import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  positionsSave: ['positions', 'summaries'],
  onePositionUpdate: ['transaction'],
  onePositionAdd: ['transaction'],
  positionsRequest: ['data'],
  positionsSuccess: ['payload'],
  positionsFailure: null
})

export const PositionsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  transaction: null,
  positions: null,
  summaries: null,
  data: null,
  fetching: null,
  payload: null,
  error: null
})

/* ------------- Reducers ------------- */

// successful api lookup
export const saveAll = (state, action) => {
  const { positions, summaries } = action
  return state.merge({ positions, summaries })
}

// oneposition reducer
export const onePositionSave = (state, action) => {
  const { transaction } = action
  return state.merge({ transaction })
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
  [Types.POSITIONS_SAVE]: saveAll,
  [Types.ONE_POSITION_UPDATE]: onePositionSave,
  [Types.ONE_POSITION_SAVE]: onePositionSave,

})
