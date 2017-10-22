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

import { call, put, all } from 'redux-saga/effects'
import AuthActions from '../Redux/AuthRedux'
import TransformTransactions from '../Transforms/TransformTransactions'

export function * getUserData (api, action) {
  const { access_token, refresh_token } = action
  const response = yield call(api.getUser, access_token)
  if (response.ok) {
    yield put(AuthActions.authSuccess(response.data))
  } else {
    yield put(AuthActions.authFailure())
  }
}

export function * getAccounts (api, action) {
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

export function * getTransactionsForAccount (api, account, access_token) {
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
    transactions = TransformTransactions(account_data)
  } else {
    ok = false
  }
  return {data: transactions, ok: ok}
}


export function * getAllData (api, action) {
	const { access_token, refresh_token } = action
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
    if (ok) {
      yield put(AuthActions.authSuccess(accounts, transactions))
    } else {
      yield put(AuthActions.authFailure())
    }
  } else {
    yield put(AuthActions.authFailure())
  }
}