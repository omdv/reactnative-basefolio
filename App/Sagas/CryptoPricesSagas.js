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
import { call, take, put, all, fork, race, select, cancel, cancelled } from 'redux-saga/effects'
import CryptoPricesActions, { CryptoPricesTypes, hasHistPrices, getHistPricesEnd, getHistPrices }  from '../Redux/CryptoPricesRedux'
import { TransformHistPrices, MergeHistPrices} from '../Transforms/TransformHistPrices'
import AuthActions, { AuthTypes } from '../Redux/AuthRedux'

// Supported coins
var coins = require('../Config/Coins')['coins']

// Other states
const selectHasHistPrices = (state) => hasHistPrices(state.prices)
const selectHistPrices = (state) => getHistPrices(state.prices)
const selectHistPricesEnd = (state) => getHistPricesEnd(state.prices)

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
function * pollHistPriceForOneCoin(api, coin, period) {
  let response = {}
  if (period === -1) {
    response = yield call(api.getDailyHistPrices, coin)
  } else {
    response = yield call(api.getDailyHistPricesPeriod, coin, period) 
  }
  let deb = true
  // TODO: return delay before production
  yield call(delay, 3)
  return response
}

function* pollDailyHistPrices(api, action, millis) {
  // get the end of the current hist prices and check if need to call API
  const hasPrices = yield select(selectHasHistPrices)
  const old_hist_prices = yield select(selectHistPrices)
  const prices_end = yield select(selectHistPricesEnd)
  const now = new Date().getTime()/1000

  // call API only if no prices or in a new day
  if (!hasPrices || !prices_end) {
    let response = yield all(
      coins.map(coin => call(pollHistPriceForOneCoin, api, coin, -1))
    )

    // get summary status
    let ok = response.map(a => a.ok).reduce((a,b) => a && b)
    
    // transform prices and get derived variables
    var [ prices, end_dates, validation ] = TransformHistPrices(response, coins)
    
    // success?
    if (ok & validation) {
      yield put(CryptoPricesActions.histPricesSuccess(prices, end_dates['BTC']))
    } else {
      if (!ok) {
        yield put(CryptoPricesActions.histPricesFailure('Failed to download historical prices'))
      } else if (!validation) {
        yield put(CryptoPricesActions.histPricesFailure('Historical prices are invalid'))
      }
    }
  } else if (hasPrices && (now > (prices_end + 86400))) {
    // get new data and merge

    // estimate how many days passed since last update
    let time_since_update = Math.ceil((now-prices_end)/86400)-1
    
    response = yield all(
      coins.map(coin => call(pollHistPriceForOneCoin, api, coin, time_since_update))
    )

    // get summary status
    let ok = response.map(a => a.ok).reduce((a,b) => a && b)
    
    // transform prices and get derived variables
    var [ prices, end_dates, validation ] = TransformHistPrices(response, coins)

    // merge prices
    var new_prices = MergeHistPrices(old_hist_prices, prices)

    if (ok & validation) {
      // concat two arrays
      yield put(CryptoPricesActions.histPricesSuccess(new_prices, end_dates['BTC']))
    } else {
      if (!ok) {
        yield put(CryptoPricesActions.histPricesFailure('Failed to download new historical prices'))
      } else if (!validation) {
        yield put(CryptoPricesActions.histPricesFailure('New historical prices are invalid'))
      }
    }
  } else {
    // just post success
    yield put(CryptoPricesActions.histPricesSuccess(old_hist_prices, prices_end))
  }

  // delay
  yield call(delay, millis)
}

// helper to define race
function* spotPricesPoll(api, action, millis) {
  while (true) {
    yield race([
      call(pollCurrentPrices, api, action, millis),
      take(CryptoPricesTypes.PRICE_POLL_STOP),
      take(AuthTypes.LOGOUT)
    ])
  }
}

// helper to define race
function* historyPricesPoll(api, action, millis) {
  try {
    while (true) {
      yield call(pollDailyHistPrices, api, action, millis)
      // yield race([
      //   call(pollDailyHistPrices, api, action, millis),
      //   take(CryptoPricesTypes.PRICE_POLL_STOP),
      //   take(AuthTypes.LOGOUT)
      // ])
    }
  } finally {
  }
}

// called on PRICE_POLL_START
export function* startPricePoll(api1, api2, action) {
  while (true) {
    const bgSpotPrice = yield fork(spotPricesPoll, api1, action, 30*1000)
    const bgHistPrice = yield fork(historyPricesPoll, api2, action, 60*1000)
    
    yield race([
      take(CryptoPricesTypes.PRICE_POLL_STOP),
      take(AuthTypes.LOGOUT)
    ])
    yield cancel(bgSpotPrice)
    yield cancel(bgHistPrice)
  }
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