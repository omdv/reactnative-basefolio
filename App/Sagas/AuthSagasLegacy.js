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
import AuthActions from '../Redux/AuthRedux'

export function * authTransactions (api, action) {
  const { token } = action
  const accounts_response = yield call(api.getAccounts, token)

  if (accounts_response.ok) {
    const accounts_data = accounts_response.data.data
    const accounts_ids = accounts_data.map((x) => x.id)


    yield put(AuthActions.authSuccess(response.data.data))
  } else {
    yield put(AuthActions.authFailure())
  }
}

export function * authAccounts (api, action) {
  const { token } = action
  // make the call to the api
  const response = yield call(api.getAccounts, token)

  // success?
  if (response.ok) {
    console.log(response.data)
    // data = response.data.data.map((x) => {return {'name': x.name, 'id': x.id}})
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(AuthActions.authSuccess(response.data.data))
  } else {
    yield put(AuthActions.authFailure())
  }
}

export function * authUser (api, action) {
  const { token } = action
  // make the call to the api
  const response = yield call(api.getUser, token)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(AuthActions.authSuccess(response.data.data))
  } else {
    yield put(AuthActions.authFailure())
  }
}
