import { put, select } from 'redux-saga/effects'
import AppStateActions from '../Redux/AppStateRedux'
import { is } from 'ramda'
import AuthActions, { isAuthed, hasTransactions } from '../Redux/AuthRedux'
import CryptoPricesActions, { hasHistPrices }  from '../Redux/CryptoPricesRedux'

// exported to make available for tests
export const selectAuthedStatus = (state) => isAuthed(state.auth)
export const selectHasPrices = (state) => hasHistPrices(state.prices)
export const selectHasTransactions = (state) => hasTransactions(state.auth)

// process STARTUP actions
export function * startup (action) {
  const hasRefreshToken = yield select(selectAuthedStatus)
  // refresh token and get all accounts data
  if (hasRefreshToken) {
    yield put(AuthActions.authRefreshRequest())
  }

  const hasPrices = yield select(selectHasPrices)
  // refresh prices and spot prices
  // if (hasPrices) {
  //   yield put(CryptoPricesActions.histPricesRequest())
  //   yield put(CryptoPricesActions.currPricesRequest())
  // }

  const hasTransactions = yield select(selectHasTransactions)
  // if both exist wait until state is ready
  if (hasPrices && hasRefreshToken) {
    yield put(AppStateActions.setRehydrationComplete())
  } else {
    yield put(AppStateActions.setNoRehydration())
  }

}