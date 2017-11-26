import { takeLatest } from 'redux-saga/effects'
import DebugConfig from '../Config/DebugConfig'

/* ------------- API ------------- */
import CoinbaseWalletAPI from '../Services/CoinbaseWalletApi'
import CoinbaseAuthAPI from '../Services/CoinbaseAuthApi'
import FixtureAPI from '../Services/FixtureApi'
import CryptoPricesAPI from '../Services/CryptoPricesApi'
import GdaxAPI from '../Services/GDAXApi'

/* ------------- Types ------------- */
import { StartupTypes } from '../Redux/StartupRedux'
import { AuthTypes } from '../Redux/AuthRedux'
import { CryptoPricesTypes } from '../Redux/CryptoPricesRedux'
import { PositionsTypes } from '../Redux/PositionsRedux'
import { GdaxTypes } from '../Redux/GdaxRedux'

/* ------------- Sagas ------------- */
import { startup } from './StartupSagas'
import { getAllTransactionsOnce, loginSaga, startTransactionsPoll, refreshTokenOnce } from './AuthSagas'
import { getAllPricesOnce, getCurrentPricesOnce, startPricePoll } from './CryptoPricesSagas'
import { updateTransaction, addTransaction } from './PositionsSagas'
import { getGDAXOrders } from './GdaxSagas'


/* ------------- API ------------- */
const coinWalletApi = false ? FixtureAPI : CoinbaseWalletAPI.create()
const coinAuthApi = false ? FixtureAPI : CoinbaseAuthAPI.create()
const pricesApi = false ? FixtureAPI : CryptoPricesAPI.create()
const gdaxApi = false ? FixtureAPI : GdaxAPI.create()


/* ------------- Connect Types To Sagas ------------- */
export default function * root () {
  yield [
    // Startup saga
    takeLatest(StartupTypes.STARTUP, startup),

    // meta saga to ensure all data is pulled before login
    takeLatest(StartupTypes.STARTUP, loginSaga),

    // Accounts and transactions on request and/or login
    takeLatest(AuthTypes.ACCOUNTS_REQUEST, getAllTransactionsOnce, coinWalletApi, gdaxApi),

    // Starting polls for access token and transactions
    takeLatest(AuthTypes.ACCOUNTS_POLL_START, startTransactionsPoll, coinAuthApi, coinWalletApi, gdaxApi),
    takeLatest(AuthTypes.AUTH_REFRESH_REQUEST, refreshTokenOnce, coinAuthApi, coinWalletApi),

    // Prices - poll, on request and/or login
    takeLatest(CryptoPricesTypes.CURR_PRICES_REQUEST, getCurrentPricesOnce, pricesApi),
    takeLatest(CryptoPricesTypes.ALL_PRICES_REQUEST, getAllPricesOnce, pricesApi),
    takeLatest(CryptoPricesTypes.PRICE_POLL_START, startPricePoll, pricesApi, pricesApi),

    // Transactions handling
    takeLatest(PositionsTypes.ONE_POSITION_UPDATE, updateTransaction),
    takeLatest(PositionsTypes.ONE_POSITION_ADD, addTransaction),
  ]
}
