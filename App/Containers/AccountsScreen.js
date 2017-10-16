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
import { Header } from 'react-native-elements'

// Redux
import TransactionsActions from '../Redux/TransactionsRedux'
import CryptoPricesActions from '../Redux/CryptoPricesRedux'

// Styles
import styles from './Styles/AccountsScreenStyle'
import { Images, Metrics } from '../Themes'


// Crossfilter
// var crossfilter = require('crossfilter')

class AccountsScreen extends Component {
  static propTypes = {
    fetching: PropTypes.bool,
    getTransactions: PropTypes.func,
    getPrices: PropTypes.func
  }
  
  constructor (props) {
    super(props)
    this.state = {
      assets: ['BTC', 'ETH', 'LTC'],
      accounts: require('../Fixtures/accounts.json'),
      transactions: require('../Fixtures/transactions.json'),
      last_prices: {'BTC': 4800, 'ETH': 310, 'LTC': 65},
      summaryCoins: null,
      summaryTotal: null,
      topLogo: {width: Metrics.screenWidth},
      visibleHeight: Metrics.screenHeight
    }
  }

  _flipArray (array) {
    let new_array = []
    for (i=array.length-1; i>=0; i--) {
      new_array.push(array[i])
    }
    return new_array
  }

  _getBalancesByAsset (accounts) {
    var result = {}
    let assets = ['BTC', 'ETH', 'LTC', 'USD']
    assets.map((coin) => {
      let val = 0
      let balances = accounts
        .filter(x => x.balance.currency === coin)
        .map(x => Number(x.balance.amount))
      result[coin] = balances.reduce((x,y) => x+y)
      })
    return result
  }

  _processTransactions () {
    // flatten and convert to numeric
    trans = trans.map(x => x.data)
    trans = trans.reduce((x,y) => x.concat(y))
    trans.map(e => {
      e.amount.amount = Number(e.amount.amount)
      e.native_amount.amount = Number(e.native_amount.amount)
    })
    return trans
  }

  // calculate positions using array of arrays
  _getPositions () {
    let assets = this.state.assets
    let trans = this.state.transactions
    let prices = this.state.last_prices
    let positions = []

    trans.map((w,i) => {
      //initialize a new
      positions[i] = []
      // move older records to top
      wallet = this._flipArray(w)
      
      wallet.map(o => {
        if (o.type === "buy") {
          let amount = o.amount.amount
          let coin = o.amount.currency
          let buy_price = o.native_amount.amount / o.amount.amount
          let gain = (prices[coin] - buy_price) * amount
          var position = {
            'amount': amount,
            'coin': coin,
            'buy_price': buy_price,
            'cost': buy_price * amount,
            'value': prices[coin] * amount,
            'date': Date.parse(o.updated_at),
            'gain': gain,
            'return': gain / buy_price / amount,
            'sell_price': null
          }
          positions[i].push(position)
        }

        // if (o.type === "sell") {
          
        //   // if first entry
        //   if (positions[i].length == 0) {
        //     let amount = order.amount.amount
        //     let coin = order.amount.currency
        //     let buy_price = order.native_amount.amount / order.amount.amount
        //     let gain = (buy_price - prices[coin]) * amount
        //     var position = {
        //       'amount': amount,
        //       'coin': coin,
        //       'buy_price': null,
        //       'value': buy_price * amount,
        //       'date': Date.parse(order.updated_at),
        //       'gain': gain,
        //       'return': gain / value,
        //       'sell_price'
        //     }

        //   }

        // }

      })
    })
    return positions
  }

  // calculate summary for component rendering
  _getSummaryByCoin () {
    let positions = this._getPositions()
    let assets = this.state.assets
    let accounts = this.state.accounts
    let result = []

    assets.map(a => {
      let idx = accounts.findIndex(x => x.name === a + ' Wallet')
      let pos = positions[idx]
      let gain = pos.map(x => x.gain).reduce((a,b) => a+b)
      let cost = pos.map(x => x.cost).reduce((a,b) => a+b)
      let value = pos.map(x => x.value).reduce((a,b) => a+b)
      let summary = {
        'coin': a,
        'gain': gain,
        'cost': cost,
        'value': value,
        'amount': pos.map(x => x.amount).reduce((a,b) => a+b),
        'return': gain/cost * 100
      }
      result.push(summary)
    })
    this.setState({summaryCoins: result})
    return result
  }

  _getFullSummary() {
    this._getSummaryByCoin()
    let summary = this.state.summaryCoins
    let gain = summary.map(x => x.gain).reduce((a,b) => a+b)
    let value = summary.map(x => x.value).reduce((a,b) => a+b)
    let returns = gain / value * 100
    let result = {
      'gain': gain,
      'value': value,
      'return': returns
    }
    return result
  }

  // // calculate positions
  // // uses flat transactions
  // _getPositionsFlat () {
  //   let assets = this.state.assets
  //   let trans = this.state.transactions
  //   let positions = {}

  //   assets.map(coin => {
  //     positions[coin] = []
      
  //     // first get long positions
  //     trans.map(order => {
  //       if (order.type === "buy" && order.amount.currency === coin && order.status === "completed") {
  //         var position = {
  //           'amount': order.amount.amount,
  //           'buy_price': order.native_amount.amount / order.amount.amount,
  //           'date': Date.parse(order.updated_at)
  //         }
  //         positions[coin].push(position)
  //       }
  //     })
  //     positions[coin].sort((a,b) => a.buy_price - b.buy_price)

  //   })
  //   return positions
  // }

  // _getBalanceByAssetAndType (trans) {
  //   cf = crossfilter(trans)

  //   var typeDimension = cf.dimension(function(d) {return d.type})
  //   var coinDimension = cf.dimension(function(d) {return d.amount.currency})

  //   // console.log(coinDimension.group().reduceSum(function(d) {d.amount.amount}).all())
  //   let res = coinDimension.group().reduce(
  //     (p,v) => {
  //       p.buyAmount += v.type === "buy" ? v.amount.amount : 0
  //       return p
  //     },
  //     (p,v) => {
  //       p.buyAmount -= v.type === "buy" ? v.amount.amount : 0
  //       return p
  //     },
  //     () => ({'buyAmount': 0})
  //   )
  //   console.log(res.all())
  //   // console.log(typeDimension.filter(function(d) {return d === "buy"}).size)
  // }

  componentDidMount () {
    const { assets } = this.state
    // this.props.getTransactions()
    this.props.getPrices(assets)
    this._getFullSummary()
    // this._getSummaryByCoin()
  }

  componentWillMount () {
    // console.log(this.state.transactions)
    // console.log(this._getPositions())
    // console.log(this._getSummaryByCoin())
  }

  render () {
    return (
      <ScrollView style={styles.container}>
      <View>
        <SummarySheet summary={this._getFullSummary()} />
        <View style={styles.divider} />
        <ReturnsGraph width={200} height={100} />
        <View style={styles.divider} />
        <View style={styles.graphWrapper}></View>
        <View style={styles.divider} />
        <SummaryTable summary={this.state.summaryCoins} />
      </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts.accounts,
    fetching: state.accounts.fetching,
    transactions: state.transactions.transactions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTransactions: () => dispatch(TransactionsActions.transactionsRequest()),
    getPrices: (coins) => dispatch(CryptoPricesActions.cryptoPricesReques(coins))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsScreen)
