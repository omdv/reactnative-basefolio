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

import { call, put } from 'redux-saga/effects'
import LoginActions from '../Redux/LoginRedux'

export function * getUser (api, action) {
  const { token } = action
  // make the call to the api
  const response = yield call(api.getUser, token)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(LoginActions.loginSuccess(response.data))
  } else {
    yield put(LoginActions.loginFailure())
  }
}

export function * getAllTransactions (api, action) {
  const { token } = action
  // make the call to the api
  const response = yield call(api.getTransactions, token)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.

    yield put(LoginActions.loginSuccess(response.data))
  } else {
    yield put(LoginActions.loginFailure())
  }
}

export function * getAccounts (api, action) {
  const { token } = action
  const response = yield call(api.getAccounts, token)

  if (response.ok) {
    const accounts = response.data.data
    // const accounts = response.data.data.map((x) => x.id)
    yield put(LoginActions.loginSuccess(accounts))
  } else {
    yield put(LoginActions.loginFailure())
  }
}