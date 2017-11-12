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
import PositionsActions from '../Redux/PositionsRedux'
import AuthActions from '../Redux/AuthRedux'
import { UpdateTransaction } from '../Transforms/TransformTransactions'

const getTransactions = (state) => state.auth.transactions

export function * updateTransaction (action) {
  const { transaction } = action
  const transactions = yield select(getTransactions)

  let merged = UpdateTransaction(transaction, transactions)
  yield put(AuthActions.saveTransactions(merged))
}

export function * addTransaction (action) {
  const { trans } = action
  const transactions = yield select(getTransactions)
}