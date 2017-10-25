import * as _ from 'lodash'

/**
 * Flip the order of the array
 * @param {date} date
 * @return {string} formatted string YYYY-MM-DD
 */
function dateToYMD(date) {
  date = new Date(date)
  var d = date.getDate()
  var m = date.getMonth() + 1
  var y = date.getFullYear()
  return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d)
}

/**
 * Flip the order of the array
 * @param {array} array to flip
 * @return {array} flipped array
 */
function flipArray (array) {
  let new_array = []
  for (i=array.length-1; i>=0; i--) {
    new_array.push(array[i])
  }
  return new_array
}

/**
 * convert spot_price from object of objects to object
 * @param {array} object of object of spot prices
 * @return {array} object of spot prices
 */
function convertSpotPrices(spot_prices) {
  let prices = {}  
  // get latest price
  for (coin in spot_prices) {
    price = spot_prices[coin]
    prices[coin] = price.USD
  }
  return prices
}

/**
 * convert spot_price from object of objects to object
 * @param {array} object of object of spot prices
 * @param {object} object of objects of historical prices
 * @return {array} object of spot prices
 */
function appendSpotPricesToHistorical(spot_prices, hist_prices) {
  let new_prices = {}
  let time = new Date().getTime()/1000
  if (hist_prices) {
    for (coin in spot_prices) {
      prices = hist_prices[coin]
      prices = prices.concat([{"close": spot_prices[coin], "time": time}])
      new_prices[coin] = prices
    }
  }
  return new_prices
}

/**
 * convert spot_price from object of objects to object
 * @param {array} array of historical prices
 * @param {array} number sparkline duration
 * @return {array} array of hist_prices - no object
 */
function pricesForSparkLine(prices, period) {
  return values = _.mapValues(prices, function (v) {
    return v.slice(v.length-period, v.length).map(d => d.close)
  })
}

/**
 * Calculate positions for assets and transactions
 * @param {array} array of assets
 * @param {array} array of array of transactions per wallet
 * @return {object} object by asset with buy/sell transactions 
 */
function processCoinbaseTransactions(assets, accounts, transactions) {
  let positions = []
  let cleaned_positions = {}

  transactions.map((w,i) => {
    //initialize a new
    positions[i] = []
    // move older records to top
    wallet = flipArray(w)
    
    wallet.map(o => {
      if (o.type === "buy" || o.type === "sell") {
        positions[i].push({
          'order_type': o.type,
          'amount': o.type === "buy" ? o.amount.amount : -o.amount.amount,
          'coin': o.amount.currency,
          'price':  o.native_amount.amount / o.amount.amount,
          'cost_basis': o.native_amount.amount,
          'time': Date.parse(o.created_at),
          'date': dateToYMD( Date.parse(o.created_at))
        })
      }
      positions[i].sort((a,b) => (a.date - b.date))
    })
  })

  // remove accounts with no positions
  assets.map(a => {
    let idx = accounts.findIndex(x => x.name === a + ' Wallet')
    let pos = positions[idx]
    cleaned_positions[a] = pos
  })

  return cleaned_positions
}

/**
 * Calculate positions for assets and transactions
 * @param {array} array of assets
 * @param {array} array of transactions
 * @param {array} object of spot prices by asset
 * @return {array} array of positions
 */
function getPositions(assets, transactions, current_prices, accounts) {
  let positions = []
  let cleaned_positions = {}

  transactions.map((w,i) => {
    //initialize a new
    positions[i] = []
    // move older records to top
    wallet = flipArray(w)
    
    wallet.map(o => {
      if (o.type === "buy") {
        let amount = o.amount.amount
        let coin = o.amount.currency
        let buy_price = o.native_amount.amount / o.amount.amount
        let gain = (current_prices[coin] - buy_price) * amount
        var position = {
          'type': 'Buy',
          'amount': amount,
          'coin': coin,
          'buy_price': buy_price,
          'cost': buy_price * amount,
          'value': current_prices[coin] * amount,
          'buy_date': Date.parse(o.created_at),
          'gain': gain,
          'return': gain / buy_price / amount,
          'sell_price': null,
          'sell_date': null
        }
        positions[i].push(position)
      }
      positions[i].sort((a,b) => (a.buy_date - b.buy_date))
    })
  })

  // remove accounts with no positions
  assets.map(a => {
    let idx = accounts.findIndex(x => x.name === a + ' Wallet')
    let pos = positions[idx]
    cleaned_positions[a] = pos
  })

  return cleaned_positions
}

/**
 * Calculate summary for every coin
 * @param {array} array of assets
 * @param {array} array of positions
 * @param {object} object of current prices
 * @return {array} array of summaries per asset
 */
function getSummaryByAsset(assets, positions, prices) {
  let result = []

  assets.map(a => {
    let pos = positions[a]
    let gain = pos.map(x => x.gain).reduce((a,b) => a+b)
    let cost = pos.map(x => x.cost).reduce((a,b) => a+b)
    let value = pos.map(x => x.value).reduce((a,b) => a+b)
    let summary = {
      'coin': a,
      'gain': gain,
      'cost': cost,
      'value': value,
      'amount': pos.map(x => x.amount).reduce((a,b) => a+b),
      'return': gain/cost * 100,
      'price': prices[a]
    }
    result.push(summary)
  })
  return result
}

/**
 * Calculate total summary
 * @param {array} summary for every asset
 * @return {object} object with portfolio returns
 */
function getPortfolioSummary(summaries) {
  let gain = summaries.map(x => x.gain).reduce((a,b) => a+b)
  let value = summaries.map(x => x.value).reduce((a,b) => a+b)
  let returns = gain / value * 100
  let result = {
    'gain': gain,
    'value': value,
    'return': returns
  }
  return result
}

/**
 * Calculate returns
 * @param {array} assets - list of assets to operate with
 * @param {object} transactions - cleaned transactions for every asset with array of objects
 * @param {object} hist_prices - objects of arrays with key being asset
 * @return {object} Daily returns for portfolio
 */
function getReturnsByDate(assets, transactions, hist_prices) {
  // init empty one
  let result = {
    portfolio: {
      gain: 0,
      current_value: 0,
      return: 0
    },
    summaries: [{
      coin: "None",
      gain:0,
      cost:0,
      current_value:0 ,
      amount:0,
      return:0
    }]
  }
  // check if hist_prices exist
  if (Object.keys(hist_prices).length > 0) {
    // add date to prices
    let prices = {}
    for (coin in hist_prices) {
      prices[coin] = _.map(hist_prices[coin], e => {
        return _.extend({}, e, {date: dateToYMD(e.time*1000)})
      })
    }

    // flatten transactions, filter only buy/sell and group by date
    transactions = _.reduce(_.values(transactions),(s,x) => _.concat(s,x), [])
    transactions = _.groupBy(transactions, 'date')
    
    // create a merged price object on dates
    let full_frame = _.merge(
      _.mapValues(_.keyBy(prices['BTC'], 'date'), (o) => {return {'BTC': o}}),
      _.mapValues(_.keyBy(prices['ETH'], 'date'), (o) => {return {'ETH': o}}),
      _.mapValues(_.keyBy(prices['LTC'], 'date'), (o) => {return {'LTC': o}}),
      _.mapValues(transactions, (o) => {return {'orders': o}})
    )

    // change date keys to timeepoch for sorting, etc
    // full_frame = _.mapKeys(full_frame, (v,k) => new Date(k).getTime()/1000) // either as object of objects
    full_frame = _.sortBy(_.values(full_frame), (o) => o.BTC.time) // or as array of object

    // main loop
    let portfolio = []
    for (var i=0; i<full_frame.length; i++) {
      date = full_frame[i]
      // either initiate portfolio with first order or continue if portfolio exists
      if ("orders" in date || portfolio.length > 0 ) {
        // init portfolio or take previous one
        if (portfolio.length === 0) {
          ptf = _.mapValues({"BTC":{}, "ETH": {}, "LTC": {}, "portfolio": {}}, o => {return {
            "amount": 0,
            "cost_basis": 0,
            "current_value": 0,
            "gain": 0,
            "open_gain": 0,
            "closed_gain": 0,
            "return": 0
          }})
        } else {
          ptf = portfolio[portfolio.length-1]
        }

        // update portfolio with new values
        if ("orders" in date) {
          // loop over all orders and update ptf for given date
          for (var order_idx=0; order_idx <date.orders.length; order_idx++ ) {
            order = date.orders[order_idx]
            
            // some commonly used variables
            let coin = order.coin
            let coin_price = date[coin].close

            // update amounts
            if (order.order_type === "buy") {
              // update positions for coin first
              ptf[coin].cost_basis += order.cost_basis
              ptf[coin].amount += order.amount
            } else if (order.order_type === "sell") {
              // Sell logic
            }
          }
        }
          
        // Now update prices and gains for all positions
        _.forEach(assets, v => {
          ptf[v].current_value = ptf[v].amount * date[v].close
          ptf[v].open_gain = ptf[v].current_value - ptf[v].cost_basis
          ptf[v].gain = ptf[v].open_gain + ptf[v].closed_gain
          ptf[v].return = ptf[v].gain / ptf[v].cost_basis * 100
          ptf[v].price = date[v].close
        })

        // Run summary for portfolio and update
        ptf["portfolio"].current_value = _.reduce(ptf, (res, v, k) => {
          return k !== "portfolio" ? res+v.current_value : res
          // if (k !== "portfolio") {
          //   res += v.current_value
          // }
          // return res
        }, 0)
        ptf["portfolio"].cost_basis = _.reduce(ptf, (res, v, k) => {
          return k !== "portfolio" ? res+v.cost_basis : res
          // if (k !== "portfolio") {
          //   res += v.cost_basis
          // }
          // return res
        }, 0)
        ptf["portfolio"].open_gain = ptf["portfolio"].current_value - ptf["portfolio"].cost_basis
        ptf["portfolio"].gain = ptf["portfolio"].open_gain + ptf["portfolio"].closed_gain
        ptf["portfolio"].return = ptf["portfolio"].gain / ptf["portfolio"].cost_basis * 100

        // add time and date
        ptf["portfolio"].time = date.BTC.time
        ptf["portfolio"].date = date.BTC.date

        // push
        portfolio.push(ptf)
      }
    }

    // prepare data for graphs
    let latest = portfolio[portfolio.length-1]
    let summaries = assets.reduce((o,k) => { o[k] = latest[k]; return o }, {})
    summaries = _.map(summaries, (v,k) => _.assign(v,{coin: k}))
    result = {
      returnsdata: _.values(_.mapValues(portfolio, o => o.portfolio)),
      portfolio: latest.portfolio,
      summaries: summaries
    }
  }
  return result
}

/**
 * Calculate total summary
 * @param {array} array of assets
 * @param {array} array of transactions
 * @param {array} array of accounts
 * @param {array} array of spot prices
 * @param {array} array of current prices
 * @param {number} length of sparkline
 * @return {object} object with all combined values
 */
export function getAnalysis(assets, transactions, accounts, spot_prices, hist_prices, sparkline_duration) {
  // get sparkline data from raw historicals
  let sparkline_data = pricesForSparkLine(hist_prices, sparkline_duration)

  // get spot prices and append to historical
  let current_prices = convertSpotPrices(spot_prices)
  let prices = appendSpotPricesToHistorical(current_prices, hist_prices)

  // filter buy/sell transactions, parse dates, adjust amount for sell
  let processed_transactions = processCoinbaseTransactions(assets, accounts, transactions)
  
  // get returns by positions and for the portfolio
  let returns = getReturnsByDate(assets, processed_transactions, prices)
  

  // review this functions
  // TODO: merge positions with getReturnsByDate
  let positions = getPositions(assets, transactions, current_prices, accounts)
  // let summaries = getSummaryByAsset(assets, positions, current_prices)
  // let portfolio = getPortfolioSummary(summaries)

  return {
    sparkline: {
      data: sparkline_data
    },
    summaries: returns.summaries,
    portfolio: returns.portfolio,
    returngraph: {
      data: returns.returnsdata
    },
    current_prices: current_prices,
    positions: positions
  }
}