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
import TransformHistPrices from '../Transforms/TransformHistPrices'

// Supported coins
var coins = require('../Config/Coins')['coins']

// Fetch current prices                                      
function* pollCurrentPrices(api, action, millis) {
  let prices = {}

  let response = yield all(
    coins.map(coin => call(api.getCurrentPrices, coin))
  )
  let ok = response.map(a => a.ok).reduce((a,b) => a && b)
  for (i in response) {
    prices[coins[i]] = response[i].data
  }

  if (ok) {
    yield put(CryptoPricesActions.currPricesSuccess(prices))
  } else {
    yield put(CryptoPricesActions.currPricesFailure())
  }

  // delay
  yield call(delay, millis)
}

// helper to introduce delay between api calls to avoid ban
function * pollHistPriceForOneCoin(api, coin) {
  const response = yield call(api.getDailyHistPrices, coin)
  yield call(delay, 3000)
  return response
}

function* pollDailyHistPrices(api, action, millis) {
  let failure = false
  let prices = {}

  let response = yield all(
    coins.map(coin => call(pollHistPriceForOneCoin, api, coin))
  )

  // check for summary status
  let ok = response.map(a => a.ok).reduce((a,b) => a && b)
  
  // convert to object
  for (i in response) {
    prices[coins[i]] = response[i].data.Data
  }

  prices = TransformHistPrices(prices)
  
  // success?
  if (ok) {
    yield put(CryptoPricesActions.histPricesSuccess(prices))
  } else {
    yield put(CryptoPricesActions.histPricesFailure())
  }

  // delay
  yield call(delay, millis)
}

// helper to define race
function* spotPricesPoll(api, action, millis) {
  while (true) {
    yield race([
      call(pollCurrentPrices, api, action, millis),
      take(CryptoPricesTypes.PRICE_POLL_STOP)
    ])
  }
}

// helper to define race
function* historyPricesPoll(api, action, millis) {
  while (true) {
    yield race([
      call(pollDailyHistPrices, api, action, millis),
      take(CryptoPricesTypes.PRICE_POLL_STOP)
    ])
  }
}

// called on PRICE_POLL_START
export function* startPricePoll(api1, api2, action) {
  yield fork(spotPricesPoll, api1, action, 300*1000)
  yield fork(historyPricesPoll, api2, action, 6000*1000)
}

// one time refresh without delays
export function* getAllPricesOnce(api, action) {
  yield call(pollCurrentPrices, api, action, 0)
  yield call(pollDailyHistPrices, api, action, 0)
}

// one time refresh current without delays
export function* getCurrentPricesOnce(api, action) {
  yield call(pollCurrentPrices, api, action, 0)
}