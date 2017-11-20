import { put, select, call } from 'redux-saga/effects'
import AppStateActions from '../Redux/AppStateRedux'
import { is } from 'ramda'
import AuthActions, { isAuthed, hasTransactions, hasRefreshToken, getTokenExpiration } from '../Redux/AuthRedux'
import CryptoPricesActions, { hasHistPrices }  from '../Redux/CryptoPricesRedux'

// exported to make available for tests
const selectAuthedStatus = (state) => isAuthed(state.auth)
const selectTokenExpiration = (state) => getTokenExpiration(state.auth)
const selectHasTransactions = (state) => hasTransactions(state.auth)
const selectRefreshToken = (state) => hasRefreshToken(state.auth)
const selectHasPrices = (state) => hasHistPrices(state.prices)


// process STARTUP actions
export function * startup (action) {
  const hasRefreshToken = yield select(selectRefreshToken)
  // refresh token and get all accounts data
  if (hasRefreshToken) {
    // check if it has expired
    const tokenExpiration = yield select(selectTokenExpiration)
    // DEBUG:
    // yield put(AuthActions.authRefreshRequest())
    if ((tokenExpiration-600) < (new Date().getTime()/1000)) {
      yield put(AuthActions.authRefreshRequest())
    }
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