import { put, select } from 'redux-saga/effects'
import GithubActions from '../Redux/GithubRedux'
import AppStateActions from '../Redux/AppStateRedux'
import { is } from 'ramda'
import AuthActions, { isAuthed } from '../Redux/AuthRedux'

// exported to make available for tests
export const selectAvatar = (state) => state.github.avatar
export const selectAuthedStatus = (state) => isAuthed(state.auth)

// process STARTUP actions
export function * startup (action) {
  const avatar = yield select(selectAvatar)
  // only get if we don't have it yet
  if (!is(String, avatar)) {
    yield put(GithubActions.userRequest('GantMan'))
  }
  yield put(AppStateActions.setRehydrationComplete())
  
  const isAuthed = yield select(selectAuthedStatus)
  if (isAuthed) {
    yield put(AuthActions.authRefreshRequest(state.auth.refresh_token))
  }
}