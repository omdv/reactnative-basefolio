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
import CryptoPricesActions from '../Redux/CryptoPricesRedux'

export function * getCryptoPrices (api, action) {
  const { coins } = action
  let failure = false
  let prices = {}

  for (coin in coins) {
    // make the call to the api
    var response = yield call(api.getPrices, coins)
    if (response.ok) {
      prices[coin] = response.data
    } else {
      failure = true
    }
  }

  // success?
  if (!failure) {
    yield put(CryptoPricesActions.cryptoPricesSuccess(prices))
  } else {
    yield put(CryptoPricesActions.cryptoPricesFailure())
  }
}
