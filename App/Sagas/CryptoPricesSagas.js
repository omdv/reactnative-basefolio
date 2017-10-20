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
import { call, take, put, all, fork, race } from 'redux-saga/effects'
import CryptoPricesActions, { CryptoPricesTypes }  from '../Redux/CryptoPricesRedux'

// Fetch current prices                                           
function* getCurrentPriceData(api, action, millis) {
  const { coins } = action
  let prices = {}

  // delay
  yield call(delay, millis)

  let response = yield all(
    coins.map(coin => call(api.getCurrentPrices, coin))
  )

  // check for summary status
  let ok = response.map(a => a.ok).reduce((a,b) => a && b)
  
  // convert to object
  for (i in response) {
    prices[coins[i]] = response[i].data
  }

  if (ok) {
    yield put(CryptoPricesActions.currPricesSuccess(prices))
  }
}

export function * getDailyHistPrices (api, action, millis) {
  const { coins } = action
  let failure = false
  let prices = {}

  // delay
  yield call(delay, millis)

  let response = yield all(
    coins.map(coin => call(api.getDailyHistPrices, coin))
  )

  // check for summary status
  let ok = response.map(a => a.ok).reduce((a,b) => a && b)
  
  // convert to object
  for (i in response) {
    prices[coins[i]] = response[i].data.Data
  }
  
  // success?
  if (ok) {
    yield put(CryptoPricesActions.histPricesSuccess(prices))
  } else {
    yield put(CryptoPricesActions.histPricesFailure())
  }
}

// helper to define race
function* currentPricesPoll(api, action, millis) {
  while (true) {
    yield race([
      call(getCurrentPriceData, api, action, millis),
      take(CryptoPricesTypes.PRICE_POLL_STOP)
    ])
  }
}

// helper to define race
function* historyPricesPoll(api, action, millis) {
  while (true) {
    yield race([
      call(getDailyHistPrices, api, action, millis),
      take(CryptoPricesTypes.PRICE_POLL_STOP)
    ])
  }
}

// called on PRICE_POLL_START
export function* pricesPoller(api, action) {
  yield fork(currentPricesPoll, api, action, 5*1000)
  yield fork(historyPricesPoll, api, action, 20*1000)
}
