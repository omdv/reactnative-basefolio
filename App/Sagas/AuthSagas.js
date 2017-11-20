/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { delay } from 'redux-saga'
import { call, put, all, select, fork, race, take, cancel, cancelled } from 'redux-saga/effects'
import AuthActions, { AuthTypes } from '../Redux/AuthRedux'
import CryptoPricesActions, { CryptoPricesTypes }  from '../Redux/CryptoPricesRedux'
import { TransformTransactionsForCoin, TransformAllTransactions } from '../Transforms/TransformTransactions'

const getRefreshToken = (state) => state.auth.refresh_token
const getAccessToken = (state) => state.auth.access_token

function * getUserData (api, action) {
  const access_token = yield select(getAccessToken)
  const response = yield call(api.getUser, access_token)
  if (response.ok) {
    yield put(AuthActions.userDataSuccess(response.data.data))
  } else {
    yield put(AuthActions.accountsFailure())
  }
}

function * getAccounts (api, action) {
	const { access_token, refresh_token } = action
	const response = yield call(api.getAccounts, access_token)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(AuthActions.authSuccess(response.data.data))
  } else {
    yield put(AuthActions.authFailure())
  }
}

function * getTransactionsForAccount (api, account, access_token) {
  let transactions = []
  let ok = true

  var response = yield call(api.getTransactions, access_token, account.id)
  if (response.ok) {
    var account_data = response.data

    // get next_uri
    while (response.data.pagination.next_uri) {
      let next_uri = response.data.pagination.next_uri
      response = yield call(api.getTransactionsNextPage, access_token, next_uri)
      if (response.ok) {
        let new_array = account_data.data.concat(response.data.data)
        account_data.data = new_array
      } else {
        ok = false
      }
    }
    transactions = TransformTransactionsForCoin(account_data)
  } else {
    ok = false
  }
  return {data: transactions, ok: ok}
}

function * getNewToken (api, action, millis) {
  // delay
  yield call(delay, millis)

  const refresh_token = yield select(getRefreshToken)
  const response = yield call(api.refreshToken, refresh_token)

  if (response.ok) {
    let access_token = response.data.access_token
    let refresh_token = response.data.refresh_token
    let token_expiration = new Date().getTime() / 1000 + response.data.expires_in
    yield put(AuthActions.authRefreshSuccess(access_token, refresh_token, token_expiration))
  } else {
    yield put(AuthActions.authRefreshFailure())
  }
}


function * getCoinbaseData (api, action, millis) {
  // delay
  yield call(delay, millis)
  
  // get current token
  const access_token = yield select(getAccessToken)

  // API call
	const response = yield call(api.getAccounts, access_token)

  // success?
  if (response.ok) {
    let accounts = response.data.data
    let trans_response = yield all(
      accounts.map(a => call(getTransactionsForAccount, api, a, access_token))
    )
    // validate all OK's
    let ok = trans_response.map(a => a.ok).reduce((a,b) => a && b)
    let transactions = trans_response.map(a => a.data)

    // transform all transactions
    transactions = TransformAllTransactions(transactions)

    if (ok) {
      yield put(AuthActions.accountsSuccess(accounts, transactions))
    } else {
      yield put(AuthActions.accountsFailure())
    }
  } else {
    yield put(AuthActions.accountsFailure())
  }
}

// helper to define race
function* refreshTokenPoll(api, action, millis) {
  try {
    while (true) {
      yield call(getNewToken, api, action, millis)
    }
  } finally {}
}

// helper to define race
function* refreshTransactionsPoll(api, action, millis) {
  try {
    while (true) {
      yield call(getCoinbaseData, api, action, millis)
    }
  } finally {}
}

// saga to make sure we get all information prior to successful auth
export function * loginSaga(action) {
  while (true) {
    yield all([
      take(AuthTypes.ACCOUNTS_SUCCESS),
      take(CryptoPricesTypes.HIST_PRICES_SUCCESS),
      take(CryptoPricesTypes.CURR_PRICES_SUCCESS)
    ])
    yield put(AuthActions.authSuccess())
  }
}

export function * refreshTokenOnce(authApi, action) {
  yield call(getNewToken, authApi, 0)
}

export function * startCoinbasePoll(authApi, transactionsApi, action) {
  while (true) {
    const bgToken = yield fork(refreshTokenPoll, authApi, action, 3949*1000)
    const bgTrans = yield fork(refreshTransactionsPoll, transactionsApi, action, 1800*1000)
    
    yield race([
      take(AuthTypes.ACCOUNTS_POLL_STOP),
      take(AuthTypes.LOGOUT)
    ])
    yield cancel(bgToken)
    yield cancel(bgTrans)
  }
}

// called on accountsRequest
export function * getCoinbaseDataOnce(transactionsApi, action) {
  yield call(getUserData, transactionsApi, action)
  yield call(getCoinbaseData, transactionsApi, action, 0)
}