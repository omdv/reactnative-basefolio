import { takeLatest, fork } from 'redux-saga/effects'
import DebugConfig from '../Config/DebugConfig'

/* ------------- API ------------- */
import API from '../Services/Api'
import CoinbaseWalletAPI from '../Services/CoinbaseWalletApi'
import CoinbaseAuthAPI from '../Services/CoinbaseAuthApi'
import FixtureAPI from '../Services/FixtureApi'
import CryptoPricesAPI from '../Services/CryptoPricesApi'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { GithubTypes } from '../Redux/GithubRedux'
import { AuthTypes } from '../Redux/AuthRedux'
import { TransactionsTypes } from '../Redux/TransactionsRedux'
import { CryptoPricesTypes } from '../Redux/CryptoPricesRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getUserAvatar } from './GithubSagas'
import { getUserData, getAccounts, getAllData } from './AuthSagas'
import { getTransactions} from './TransactionsSagas'
import { refreshAllPrices, refreshCurrentPrices, pollPrices } from './CryptoPricesSagas'


/* ------------- API ------------- */

const api = DebugConfig.useFixtures ? FixtureAPI : API.create()
const coinWalletApi = CoinbaseWalletAPI.create()
const coinAuthApi = CoinbaseAuthAPI.create()
const pricesApi = DebugConfig.useFixtures ? FixtureAPI : CryptoPricesAPI.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    // some sagas receive extra parameters in addition to an action
    // takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),
    
    // Accounts and transactions on login
    takeLatest(AuthTypes.AUTH_REQUEST, getAllData, coinWalletApi),
    
    // Prices
    takeLatest(CryptoPricesTypes.PRICE_POLL_START, pollPrices, pricesApi, pricesApi),    
    takeLatest(CryptoPricesTypes.CURR_PRICES_REQUEST, refreshCurrentPrices, pricesApi),
    takeLatest(CryptoPricesTypes.PRICE_REFRESH_ALL_REQUEST, refreshAllPrices, pricesApi),    
  ]
}
