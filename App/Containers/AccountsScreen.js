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
import PortfolioSummary from '../Components/PortfolioSummary'

// react-native elements
import { Icon } from 'react-native-elements'

// Redux
import AuthActions from '../Redux/AuthRedux'
import CryptoPricesActions from '../Redux/CryptoPricesRedux'
import PositionsActions from '../Redux/PositionsRedux'

// Styles
import styles from './Styles/AccountsScreenStyle'
import { Images, Metrics, Colors } from '../Themes'

// Calculation Functions
import { getAnalysis } from '../Transforms/FinancialFunctions'
import * as _ from 'lodash'

// Supported coins
var coins = require('../Config/Coins')['coins']

class AccountsScreen extends Component {
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
    let default_transactions = require('../Fixtures/transactions.json')
    let default_financial_summary = require('../Fixtures/default_summary.json')
    
    // initial state
    this.state = {
      assets: coins,
      sparklines_duration: 14,
      
      // use from props
      accounts: accounts ? accounts : default_accounts,
      transactions: transactions ? transactions : default_transactions,
      current_prices: current_prices ? current_prices : default_current_prices,
      hist_prices: hist_prices,
      financial_summary: default_financial_summary
    }
    this.callFinancialAnalysis = this.callFinancialAnalysis.bind(this)
  }

  callFinancialAnalysis() {
    const { assets, current_prices, transactions, accounts, sparklines_duration, hist_prices } = this.state
    financial_summary = getAnalysis(
      assets,
      transactions,
      accounts,
      current_prices,
      hist_prices,
      sparklines_duration
    )
    this.setState({financial_summary: financial_summary})
    this.props.savePositions(financial_summary.positions)
  }

  componentDidMount () {
    // this.props.startPricePolling()
    // this.props.startCoinbasePolling()
    this.callFinancialAnalysis()
  }

  componentWillUnmount () {
    this.props.stopPricePolling()
  }

  componentWillReceiveProps(nextProps) {
    // // Re-assign hist_prices
    // if (nextProps.hist_prices != this.props.hist_prices) {
    //   this.props.hist_prices = nextProps.hist_prices
    //   this.setState({
    //     hist_prices: nextProps.hist_prices
    //   })
    // }

    // // Re-assign current_prices
    // if (nextProps.current_prices != this.props.current_prices) {
    //   this.props.current_prices = nextProps.current_prices
    //   this.setState({
    //     current_prices: nextProps.current_prices
    //   })
    // }

    // TODO: enable all props
    this.setState({
      hist_prices: nextProps.hist_prices,
      current_prices: nextProps.current_prices,
      // transactions: nextProps.transactions, 
      // accounts: nextProps.accounts
    }, () => this.callFinancialAnalysis())

  }

  render () {
    const { financial_summary, assets } = this.state
    const { refreshCurrentPrices, refreshAllPrices, fetching_current } = this.props
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header} >
          <View style={{width: 50}}><Icon name='settings' color={Colors.navigation} onPress={() => this.props.navigation.navigate('ConfigScreen')}/></View>
          <View style={{width: 50}}>
            <Icon name='refresh'
              color={fetching_current ? Colors.navigation_inactive : Colors.navigation}
              onPress={!fetching_current ? () => refreshAllPrices(): () => null} />
          </View> 
        </View>
        <View style={styles.content}>
          <SummarySheet summary={financial_summary.portfolio} />
          <View style={styles.graphWrapper}>
            <ReturnsGraph
              datum={financial_summary.returngraph.data}
              yAccessor={d => d.gain}
              width={Metrics.screenWidth}
              height={Metrics.screenHeight/4} />
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
    current_prices: state.prices.current_prices
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    startCoinbasePolling: () => dispatch(AuthActions.accountsPollStart()),
    startPricePolling: () => dispatch(CryptoPricesActions.pricePollStart()),
    stopPricePolling: () => dispatch(CryptoPricesActions.pricePollStop()),
    refreshCurrentPrices: () => dispatch(CryptoPricesActions.currPricesRequest()),
    refreshAllPrices: () => dispatch(CryptoPricesActions.allPricesRequest()),
    savePositions: (positions) =>dispatch(PositionsActions.positionsSave(positions))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsScreen)
