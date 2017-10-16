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