import { put, select } from 'redux-saga/effects'
import AppStateActions from '../Redux/AppStateRedux'
import { is } from 'ramda'
import AuthActions, { isAuthed } from '../Redux/AuthRedux'
import CryptoPricesActions, { hasHistPrices }  from '../Redux/CryptoPricesRedux'


// exported to make available for tests
export const selectAuthedStatus = (state) => isAuthed(state.auth)
export const selectHasPrices = (state) => hasHistPrices(state.prices)

// process STARTUP actions
export function * startup (action) {
  const hasRefreshToken = yield select(selectAuthedStatus)
  // refresh token and get all accounts data
  if (hasRefreshToken) {
    yield put(AuthActions.authRefreshRequest())
    // yield put(AuthActions.accountsRequest())
  }

  const hasPrices = yield select(selectHasPrices)
  // refresh prices and spot prices
  if (hasPrices) {
    yield put(CryptoPricesActions.histPricesRequest())
    yield put(CryptoPricesActions.currPricesRequest())
  }

  // if both exist set the rehydration complete
  if (hasPrices && hasRefreshToken) {
    yield put(AppStateActions.setRehydrationComplete())
  } else {
    yield put(AppStateActions.setNoRehydration())
  }

  // const avatar = yield select(selectAvatar)
  // // only get if we don't have it yet
  // if (!is(String, avatar)) {
  //   yield put(GithubActions.userRequest('GantMan'))
  // }
  // yield put(AppStateActions.setRehydrationComplete())
  
  // Refresh auth token here
  // const isAuthed = yield select(selectAuthedStatus)
  // if (!isAuthed) {
  //   yield put(AuthActions.authRefreshRequest(state.auth.refresh_token))
  // }

  // Refresh historical prices here

  // Refresh spot prices here

}