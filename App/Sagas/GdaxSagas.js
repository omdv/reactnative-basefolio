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

import { call, put, select } from 'redux-saga/effects'
import GdaxActions from '../Redux/GdaxRedux'
import AuthActions, { AuthTypes } from '../Redux/AuthRedux'
import { TransformGDAXOrders } from '../Transforms/TransformTransactions'

const getTransactions = (state) => state.auth.transactions

export function * getGDAXOrders (api, action) {
  // const { data } = action
  // make the call to the api
  const response = yield call(api.getFills)

  // success?
  if (response.ok) {
    // transform orders
    orders = TransformGDAXOrders(response)
    
    // merge with other transactions
    transactions = yield select(getTransactions)

    transactions = transactions.concat(orders)
    let t = true
    
    yield put(AuthActions.saveTransactions(transactions))
  } else {
    yield put(GdaxActions.gdaxFailure())
  }
}
