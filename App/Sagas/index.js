import { takeLatest } from 'redux-saga/effects'
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
import { LoginTypes } from '../Redux/LoginRedux'
import { AuthTypes } from '../Redux/AuthRedux'
import { TransactionsTypes } from '../Redux/TransactionsRedux'
import { CryptoPricesTypes } from '../Redux/CryptoPricesRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { login } from './LoginSagas'
import { getUserAvatar } from './GithubSagas'
import { getUserData, getAccounts } from './AuthSagas'
import { getTransactions} from './TransactionsSagas'
import { getCryptoPrices } from './CryptoPricesSagas'


/* ------------- API ------------- */

const api = DebugConfig.useFixtures ? FixtureAPI : API.create()
const coinWalletApi = CoinbaseWalletAPI.create()
const coinAuthApi = CoinbaseAuthAPI.create()
const pricesApi = CryptoPricesAPI.create() 

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield [
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    // takeLatest(LoginTypes.LOGIN_REQUEST, login),

    // some sagas receive extra parameters in addition to an action
    // takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),
    takeLatest(AuthTypes.AUTH_REQUEST, getAccounts, coinWalletApi),
    takeLatest(TransactionsTypes.TRANSACTIONS_REQUEST, getTransactions, coinWalletApi),
    takeLatest(CryptoPricesTypes.CRYPTO_PRICES_REQUEST, getCryptoPrices, pricesApi)
  ]
}
