import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  View,
  Text, 
  ActivityIndicator,
  Image,
  ScrollView, 
  TouchableOpacity} from 'react-native'

// components
import SummaryTable from '../Components/SummaryTable'
import SummarySheet from '../Components/SummarySheet'
import ReturnsGraph from '../Components/ReturnsGraph'
import PortfolioSummary from '../Components/PortfolioSummary'

// react-native elements
import { Icon } from 'react-native-elements'

// Redux
import AuthActions from '../Redux/AuthRedux'
import CryptoPricesActions from '../Redux/CryptoPricesRedux'
import PositionsActions from '../Redux/PositionsRedux'

// Styles
import styles from './Styles/MainScreenStyle'
import { Images, Metrics, Colors } from '../Themes'

// Calculation Functions
import { getAnalysis } from '../Transforms/FinancialFunctions'
import * as _ from 'lodash'

// Supported coins
var coins = require('../Config/Coins')['coins']

export class MainScreen extends Component {
  static propTypes = {
    fetching: PropTypes.bool,
    accounts: PropTypes.array,
    transactions: PropTypes.array,
    hist_prices: PropTypes.object,
    current_prices: PropTypes.object,    
    getTransactions: PropTypes.func,
    savePositions: PropTypes.func,
    refreshAllPrices: PropTypes.func,
    refreshCurrentPrices: PropTypes.func,
    refreshTransactions: PropTypes.func
  }
  
  constructor (props) {
    super(props)
    let { accounts, transactions, current_prices, hist_prices } = props
    // defaults for testing
    let default_current_prices = {
      'BTC': {'USD': 4800},
      'ETH': {'USD': 310},
      'LTC': {'USD': 65}
    }
    let default_accounts = require('../Fixtures/accounts.json')
    let default_transactions = require('../Fixtures/transactions_testing.json')
    let default_financial_summary = require('../Fixtures/default_summary.json')
    
    // initial state
    this.state = {
      assets: coins,
      sparklines_duration: 30,
      period: "week",
      
      // use from props
      accounts: accounts ? accounts : default_accounts,
      transactions: transactions ? transactions : default_transactions,
      current_prices: current_prices ? current_prices : default_current_prices,
      hist_prices: hist_prices,
      financial_summary: default_financial_summary
    }
    this.callFinancialAnalysis = this.callFinancialAnalysis.bind(this)
    this.refreshAll = this.refreshAll.bind(this)
  }

  callFinancialAnalysis() {
    const { assets, current_prices, transactions, accounts, sparklines_duration, hist_prices, period } = this.state
    financial_summary = getAnalysis(
      assets,
      transactions,
      accounts,
      current_prices,
      hist_prices,
      sparklines_duration,
      period
    )
    this.setState({financial_summary: financial_summary})
    this.props.savePositions(financial_summary.positions, financial_summary.summaries, financial_summary.returngraph)
  }

  refreshAll() {
    this.props.refreshAllPrices()
    this.props.refreshTransactions()
  }

  componentDidMount () {
    // TODO: toggle polling prior to release
    this.props.startPricePolling()
    this.props.startCoinbasePolling()
    this.callFinancialAnalysis()
  }

  componentWillUnmount () {
    this.props.stopPricePolling()
  }

  componentWillReceiveProps(nextProps) {
    // TODO: toggle all props prior to release
    this.setState({
      hist_prices: nextProps.hist_prices,
      current_prices: nextProps.current_prices,
      transactions: nextProps.transactions,
      accounts: nextProps.accounts
    }, () => this.callFinancialAnalysis())
  }

  updateReturnsPlotPeriod(v) {
    this.setState({
      period: v
    }, () => this.callFinancialAnalysis())
  }

  render () {
    const { financial_summary, assets, period } = this.state
    const { refreshCurrentPrices, refreshAllPrices, fetching_current } = this.props
    const isPositive = financial_summary.portfolio.gain_period > 0 ? true : false
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header} >
          <View style={{width: 50}}>
            <Icon
              name='settings'
              color={Colors.navigation}
              backgroundColor={Colors.backgroundColor}
              onPress={() => this.props.navigation.navigate('ConfigScreen')}/></View>
          <View style={{width: 50}}>
            <Icon name='refresh'
              color={fetching_current ? Colors.navigation_inactive : Colors.navigation}
              onPress={!fetching_current ? () => this.refreshAll(): () => null}
              backgroundColor={Colors.backgroundColor} />
          </View> 
        </View>
        <View style={styles.content}>
          <SummarySheet summary={financial_summary.portfolio} />
          <View style={styles.graphWrapper}>
            <ReturnsGraph
              datum={financial_summary.returngraph.data}
              yAccessor={d => d.gain}
              width={Metrics.screenWidth}
              height={Metrics.screenHeight/4}
              isPositive={isPositive} />
          </View>
          <View style={styles.graphControl}>
            {['week', 'month', 'quarter', 'year', 'all time'].map((v,i) => (
              <TouchableOpacity style={{marginHorizontal: 10, padding: 5}} key={i} onPress={() => this.updateReturnsPlotPeriod(v)}>
                <Text style={v === period ? styles.graphControlTextActive : styles.graphControlText}>{v}</Text>
              </TouchableOpacity>
            ))
            }
          </View>
          <View style={styles.divider} />
          <SummaryTable
            summary={financial_summary.summaries}
            sparkline={financial_summary.sparkline}
            current_prices={financial_summary.current_prices}
            navigation={this.props.navigation} />
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.auth.fetching,
    fetching_current: state.auth.fetching_current,
    accounts: state.auth.accounts,
    transactions: state.auth.transactions,
    hist_prices: state.prices.hist_prices,
    current_prices: state.prices.current_prices,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startCoinbasePolling: () => dispatch(AuthActions.accountsPollStart()),
    startPricePolling: () => dispatch(CryptoPricesActions.pricePollStart()),
    stopPricePolling: () => dispatch(CryptoPricesActions.pricePollStop()),
    refreshCurrentPrices: () => dispatch(CryptoPricesActions.currPricesRequest()),
    refreshAllPrices: () => dispatch(CryptoPricesActions.allPricesRequest()),
    refreshTransactions: () => dispatch(AuthActions.accountsRequest()),
    savePositions: (positions, summaries) =>dispatch(PositionsActions.positionsSave(positions, summaries))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)