import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  View,
  Text, 
  ActivityIndicator,
  Image,
  ScrollView } from 'react-native'

// components
import SummaryTable from '../Components/SummaryTable'
import SummarySheet from '../Components/SummarySheet'
import ReturnsGraph from '../Components/ReturnsGraph'

// react-native elements
import { Header, Icon } from 'react-native-elements'

// Redux
import TransactionsActions from '../Redux/TransactionsRedux'
import CryptoPricesActions from '../Redux/CryptoPricesRedux'
import PositionsActions from '../Redux/PositionsRedux'

// Styles
import styles from './Styles/AccountsScreenStyle'
import { Images, Metrics, Colors } from '../Themes'

// Calculation Functions
import { getAnalysis } from '../Transforms/FinancialFunctions'
import * as _ from 'lodash'

class AccountsScreen extends Component {
  static propTypes = {
    fetching: PropTypes.bool,
    accounts: PropTypes.array,
    transactions: PropTypes.array,
    hist_prices: PropTypes.object,
    current_prices: PropTypes.object,    
    getTransactions: PropTypes.func,
    getPrices: PropTypes.func,
    savePositions: PropTypes.func
  }
  
  constructor (props) {
    super(props)
    let { accounts, transactions, current_prices } = props
    // defaults for testing
    let default_current_prices = {
      'BTC': {'USD': 4800},
      'ETH': {'USD': 310},
      'LTC': {'USD': 65}
    }
    let default_accounts = require('../Fixtures/accounts.json')
    let default_transactions = require('../Fixtures/transactions.json')
    // initial state
    this.state = {
      assets: ['BTC', 'ETH', 'LTC'],
      accounts: accounts ? accounts : default_accounts,
      transactions: transactions ? transactions : default_transactions,
      current_prices: current_prices ? current_prices : default_current_prices,
      summary: {
        positions: [],
        portfolio: {
          gain: 0,
          value: 0,
          return: 0
        },
        summaries: [{
          coin:'None',
          gain:0,
          cost:0,
          value:0 ,
          amount:0,
          return:0
        }]
      },
      topLogo: {width: Metrics.screenWidth},
      visibleHeight: Metrics.screenHeight
    }
  }

  componentDidMount () {
    this.props.startPricePolling(this.state.assets)
    const { assets, current_prices, transactions, accounts } = this.state
    summary = getAnalysis(
      assets,
      transactions,
      accounts,
      current_prices)
    this.setState({summary: summary})
    this.props.savePositions(summary.positions)
  }

  componentWillUnmount () {
    this.props.stopPricePolling()
  }

  componentWillReceiveProps(nextProps) {
    // new props arrived - check and reassign
    // if (nextProps != this.props) {
    //   let { accounts, transactions, prices } = nextProps
    //   this.props.accounts = accounts ? accounts : this.props.accounts
    //   this.props.transactions = transactions ? transactions : this.props.transactions
    //   this.props.prices = prices ? prices : this.props.prices      
    // }
    
    // Re-assign hist_prices
    this.props.hist_prices = nextProps.hist_prices ? nextProps.hist_prices : this.props.hist_prices

    // Test mode
    let current_prices = nextProps.current_prices ? nextProps.current_prices : this.state.current_prices
    const { transactions, accounts } = this.state

    // get new summary
    const { assets } = this.state
    // const { prices, transactions, accounts } = this.props
    let summary = getAnalysis(
        assets,
        transactions,
        accounts,
        current_prices)
    this.setState({summary: summary})
    this.props.savePositions(summary.positions)
  }

  sparklineData (prices, period) {
    return _.mapValues(prices, function (v) {
      return v.slice(v.length-period, v.length)
    })
  }

  render () {
    const { summary } = this.state
    const { hist_prices } = this.props
    // Prices for graphs
    const sparkline_data = hist_prices ? this.sparklineData(hist_prices, 14) : null
    const returns = hist_prices ? hist_prices['BTC'] : null
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header} >
          <View style={{width: 50}}><Icon name='settings' color={Colors.navigation} /></View>
          <View style={{width: 50}}><Icon name='refresh' color={Colors.navigation} /></View> 
        </View>
        <View style={styles.content}>
          <SummarySheet summary={ summary.portfolio } />
          <ReturnsGraph datum={returns} xAccessor={d => new Date(d.time)} yAccessor={d => d.close} width={Metrics.screenWidth} height={100} />
          <View style={styles.divider} />
          <View style={styles.graphWrapper}></View>
          <View style={styles.divider} />
          <SummaryTable summary={ summary.summaries } yAccessor={d => d.close} prices={sparkline_data} navigation={this.props.navigation} />
        </View>
      </ScrollView>
    )
  }
}



const mapStateToProps = (state) => {
  return {
    fetching: state.auth.fetching,
    accounts: state.auth.accounts,
    transactions: state.auth.transactions,
    hist_prices: state.prices.hist_prices,
    current_prices: state.prices.current_prices
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTransactions: () => dispatch(TransactionsActions.transactionsRequest()),
    getPrices: (coins) => dispatch(CryptoPricesActions.histPricesRequest(coins)),
    startPricePolling: (coins) => dispatch(CryptoPricesActions.pricePollStart(coins)),
    stopPricePolling: () => dispatch(CryptoPricesActions.pricePollStop()),
    savePositions: (positions) =>dispatch(PositionsActions.positionsSave(positions))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsScreen)
