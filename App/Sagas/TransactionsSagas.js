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
import TransactionsActions from '../Redux/TransactionsRedux'
import TransformTransactions from '../Transforms/TransformTransactions'


const getAccessToken = (state) => state.auth.access_token
const getAccountsList = (state) => state.auth.accounts

export function * getTransactions (api, action) {
  const access_token = yield select(getAccessToken)
  const accounts_list = yield select(getAccountsList)

  let transactions = []
  let failure = false

  for (i = 0; i < accounts_list.length; i++) {
    account_Id = accounts_list[i].id
    var response = yield call(api.getTransactions, access_token, account_Id)
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
          failure = true
        }
      }
      
      // if finished - save into transactions
      transactions[i] = account_data
    } else {
      failure = true
    }
  }

  // apply transform
  transactions = TransformTransactions(transactions)

  if (!failure) {
    yield put(TransactionsActions.transactionsSuccess(transactions))
  } else {
    yield put(TransactionsActions.transactionsFailure())
  }
}
