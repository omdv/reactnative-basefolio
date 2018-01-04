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
import GdaxActions from '../Redux/GdaxRedux'
import CryptoPricesActions, { CryptoPricesTypes }  from '../Redux/CryptoPricesRedux'
import {
  TransformTransactionsForCoin,
  TransformAllTransactions,
  UpdateTransactionsBySource,
  TransformGDAXOrders 
  } from '../Transforms/TransformTransactions'

const getRefreshToken = (state) => state.auth.refresh_token
const getAccessToken = (state) => state.auth.access_token
const getAllTransactions = (state) => state.auth.transactions

const getGDAXpass = (state) => state.gdax.passphrase
const getGDAXsecret = (state) => state.gdax.secret
const getGDAXkey = (state) => state.gdax.key
const getHasGDAXkeys = (state) => state.gdax.has_keys


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

    // replace coinbase transactions
    all_transactions = yield select(getAllTransactions)
    transactions = UpdateTransactionsBySource("Coinbase", all_transactions, transactions)

    if (ok) {
      yield put(AuthActions.accountsSuccess(accounts, transactions))
    } else {
      yield put(AuthActions.accountsFailure())
    }
  } else {
    yield put(AuthActions.accountsFailure())
  }
}

export function * getGDAXData (api, action, millis) {
  const hasGDAXkeys = yield select(getHasGDAXkeys)
  
  if (hasGDAXkeys) {
    // delay
    yield call(delay, millis)

    // parse API info
    const passphrase = yield select(getGDAXpass)
    const secret = yield select(getGDAXsecret)
    const key = yield select(getGDAXkey)

    // API call - initial
    var response = yield call(api.getFills, passphrase, key, secret, false)

    // success?
    if (response.ok) {
      var page_data = response['data']

      // check for pagination
      while (response['data'].length > 0) {
        after_cursor = response['headers']['cb-after']
        var response = yield call(api.getFills, passphrase, key, secret, after_cursor)
        new_page_data = response['data']
        var page_data = page_data.concat(new_page_data)
      }

      // transform orders
      new_transactions = TransformGDAXOrders(page_data)
      
      // update transactions
      old_transactions = yield select(getAllTransactions)
      old_transactions = UpdateTransactionsBySource("GDAX", old_transactions, new_transactions)
      let t = true
      
      yield put(AuthActions.saveTransactions(old_transactions))
      yield put(GdaxActions.gdaxSuccess())
    } else {
      yield put(GdaxActions.gdaxFailure())
    }
  }
}


// helper to define race
function* refreshTokenPoll(authApi, walletApi, action, millis) {
  try {
    while (true) {
      yield call(getNewToken, authApi, action, millis)
      yield call(getUserData, walletApi, action, millis)
    }
  } finally {}
}

// helper to define race
function* refreshTransactionsPoll(coinbaseAPI, gdaxAPI, action, millis) {
  try {
    while (true) {
      yield call(getCoinbaseData, coinbaseAPI, action, millis)
      yield call(getGDAXData, gdaxAPI, action, millis)
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

export function * refreshTokenOnce(authApi, walletApi, action) {
  yield call(getNewToken, authApi, 0)
  yield call(getUserData, walletApi, 0)
}

export function * startTransactionsPoll(authApi, coinbaseAPI, gdaxAPI, action) {
    const bgToken = yield fork(refreshTokenPoll, authApi, coinbaseAPI, action, 3949*1000)
    const bgTrans = yield fork(refreshTransactionsPoll, coinbaseAPI, gdaxAPI, action, 1800*1000)
    
    yield race([
      take(AuthTypes.ACCOUNTS_POLL_STOP),
      take(AuthTypes.LOGOUT)
    ])
    yield cancel(bgToken)
    yield cancel(bgTrans)
}

// called on accountsRequest
export function * getAllTransactionsOnce(coinbaseAPI, gdaxAPI, action) {
  yield call(getCoinbaseData, coinbaseAPI, action, 0)
  yield call(getGDAXData, gdaxAPI, action, 0)
  yield call(getUserData, coinbaseAPI, action, 0)
}