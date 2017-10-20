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

// Fetch prices every 20 seconds                                           
function* getCurrentPriceData(api, action) {
  const { coins } = action
  let prices = {}

  // delay
  yield call(delay, 60*1000)

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
    yield put(CryptoPricesActions.pricePollSuccess(prices))
  }
}

// Called on PRICE_POLL_START
export function* currentPricesPoll(api, action) {
  while (true) {
    yield race([
      call(getCurrentPriceData, api, action),
      take(CryptoPricesTypes.PRICE_POLL_STOP)
    ])
  }
}

export function * getDailyHistPrices (api, action) {
  const { coins } = action
  let failure = false
  let prices = {}

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
