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
 * Create unique IDs
 * @return {string} formatted string YYYY-MM-DD
 */
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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
 * @return {array} object of historical with latest spot prices
 */
function mergeSpotPricesWithHistorical(spot_prices, hist_prices) {
  let new_prices = {}
  let time = new Date().getTime()/1000
  if (hist_prices) {
    for (coin in spot_prices) {
      prices = hist_prices[coin]
      prices = prices.concat([{"close": spot_prices[coin], "time": time}])
      new_prices[coin] = _.map(prices, e => {
        return _.extend({}, e, {date: dateToYMD(e.time*1000)})
      })
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
          'amount': o.amount,
          'coin': o.amount.currency,
          'price':  o.cost_basis / o.amount,
          'cost_basis': o.cost_basis,
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
 * Initialize empty returns result
 * @return {object} Daily returns for portfolio
 */
function initReturnsResult() {
  return {
    portfolio: {
      gain: 0,
      current_value: 0,
      return: 0,
      open_gain: 0,
      closed_gain: 0,
      cost_basis: 0,
      gain_period: 0,
      return_period: 0
    },
    summaries: [{
      coin: "None",
      gain:0,
      cost:0,
      current_value:0 ,
      amount:0,
      return:0,
      gain_period: 0,
      return_period: 0
    }],
    returnsGraph: {
      data: [
        {gain: 0}
      ]
    },
    positions: {
      BTC: [],
      ETH: [],
      LTC: []
    }
  }
}

/**
 * Calculate returns
 * @param {array} assets - list of assets to operate with
 * @param {object} transactions - cleaned transactions for every asset with array of objects
 * @param {object} hist_prices - objects of arrays with key being asset
 * @return {object} Daily returns for portfolio
 */
function getReturnsByDate(assets, transactions, hist_prices) {
  let result = initReturnsResult()

  // check if hist_prices exist
  if (Object.keys(hist_prices).length > 0) {

    // flatten transactions, filter only buy/sell and group by date
    // transactions = _.reduce(_.values(transactions),(s,x) => _.concat(s,x), [])
    transactions = _.groupBy(transactions, 'date')
    
    // create a merged price object on dates
    let full_frame = _.merge(
      _.mapValues(_.keyBy(hist_prices['BTC'], 'date'), (o) => {return {'BTC': o}}),
      _.mapValues(_.keyBy(hist_prices['ETH'], 'date'), (o) => {return {'ETH': o}}),
      _.mapValues(_.keyBy(hist_prices['LTC'], 'date'), (o) => {return {'LTC': o}}),
      _.mapValues(transactions, (o) => {return {'orders': o}})
    )

    // change date keys to timeepoch for sorting, etc
    // full_frame = _.mapKeys(full_frame, (v,k) => new Date(k).getTime()/1000) // either as object of objects
    full_frame = _.sortBy(_.values(full_frame), (o) => o.BTC.time) // or as array of object
    var current_prices = full_frame[full_frame.length-1]

    // main loop
    let portfolio = [] // array of portfolio state objects by date
    let open_positions = [] // array of open positions
    let open_pos_idx = 0
    let closed_positions = [] // array of closed positions
    let closed_pos_idx = 0
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
          ptf = _.cloneDeep(portfolio[portfolio.length-1])
        }

        // update amounts with orders for this date
        // update positions
        if ("orders" in date) {
          // loop over all orders and update ptf for given date
          for (var order_idx=0; order_idx <date.orders.length; order_idx++ ) {
            order = date.orders[order_idx]
            
            // some commonly used variables
            let coin = order.coin
            let coin_price = date[coin].close

            // counter for sold closed gain
            let sold_closed_gain = 0

            // update amounts
            if (order.type === "buy") {
              // update positions for coin first
              ptf[coin].cost_basis += order.cost_basis
              ptf[coin].amount += order.amount

              // add position
              let current_value = current_prices[order.coin].close * order.amount
              let gain = current_value - order.cost_basis
              pos = {
                'type': 'buy',
                'amount': order.amount,
                'coin': order.coin,
                'price': order.price,
                'date': order.date,
                'cost_basis': order.cost_basis,
                'current_value': current_value,
                'gain': gain,
                'return': gain / order.cost_basis * 100,
                'idx': open_pos_idx,
                'id': order.id
              }
              // push to positions, increment index
              open_positions.push(_.cloneDeep(pos))
              open_pos_idx += 1

            } else if (order.type === "sell") {
              // Sell logic
              // update amounts and cost_basis
              // find what positions we are going to close - need to get a cost basis for those.
              // check if there are enough coins to sell - close cheapest first
              // if there is not enough - sell all available and raise the warning
              
              // init cost_basis which will be used later to update overall portfolio value
              let sold_cost_basis = 0
              
              // init overall order record
              let closed = {
                'type': 'sell',
                'amount': Math.abs(order.amount),
                'oversold': false,
                'coin': order.coin,
                'price': order.price,
                'date': order.date,
                'idx': closed_pos_idx,
                'closed_positions': [],
                'sell_value': Math.abs(order.amount) * order.price,
                'id': order.id              
              }

              if (Math.abs(order.amount) > ptf[coin].amount) {
                // if oversold - adjust the amount to be equal to what we got
                closed.oversold = true
                order.amount = -ptf[coin].amount
                order.sell_value = ptf[coin].amount*order.price
              }

              let amount_left_to_sell = Math.abs(order.amount)
              
              // find all positions for this coin and sort it
              coin_open_pos = _.filter(open_positions, o => {return o.coin === coin})
              coin_open_pos = _.sortBy(coin_open_pos, o => o.price)

              // loop until sold enough
              for (var pos_idx=0; pos_idx<coin_open_pos.length; pos_idx++) {
                if (amount_left_to_sell === 0) { break }
                
                // re-assign for simplicity
                open_pos = coin_open_pos[pos_idx]
                
                if (amount_left_to_sell >= open_pos.amount) {
                  // close current position completely, append to closed and delete from open
                  let current_value = open_pos.amount * order.price
                  let gain = current_value - open_pos.cost_basis
                  pos = {
                    'amount': open_pos.amount,
                    'price': open_pos.price,
                    'date': open_pos.date,
                    'cost_basis': open_pos.cost_basis,
                    'current_value': current_value,
                    'gain': gain,
                    'return': gain/open_pos.cost_basis * 100,
                  }
                  // update counters
                  sold_cost_basis -= open_pos.cost_basis
                  sold_closed_gain += gain
                  amount_left_to_sell -= open_pos.amount
                  closed.closed_positions.push(pos)
                  open_positions = _.remove(open_positions, o => o.idx !== open_pos.idx)
                } else {
                  // partial closure of the position
                  amount_sold = amount_left_to_sell
                  current_value = amount_sold*order.price
                  cost_basis = amount_sold*open_pos.price
                  gain = current_value - cost_basis
                  // create and add the closed position
                  pos = {
                    'amount': amount_sold,
                    'price': open_pos.price,
                    'date': open_pos.date,
                    'cost_basis': cost_basis,
                    'current_value': current_value,
                    'gain': gain,
                    'return': gain/cost_basis * 100,
                  }
                  // update current closed position and counters
                  sold_cost_basis -= cost_basis
                  sold_closed_gain += gain
                  amount_left_to_sell -= amount_sold
                  closed.closed_positions.push(pos)
                  
                  // create and add the new split open position
                  pos_amount = open_pos.amount - amount_sold
                  current_value = current_prices[open_pos.coin].close * pos_amount
                  cost_basis = pos_amount * open_pos.price
                  gain = current_value - cost_basis
                  pos = {
                    'type': 'buy',
                    'original_amount': open_pos.amount,
                    'amount': open_pos.amount - amount_sold,
                    'coin': open_pos.coin,
                    'price': open_pos.price,
                    'date': open_pos.date,
                    'cost_basis': cost_basis,
                    'current_value': current_value,
                    'gain': gain,
                    'return': gain / cost_basis * 100,
                    'idx': open_pos_idx,
                    'id': open_pos.id
                  }
                  open_positions.push(pos)
                  open_pos_idx += 1
                  open_positions = _.remove(open_positions, o => o.idx !== open_pos.idx)                    
                }
              }
              
              // update the current closed position and push it to array
              closed['cost_basis'] = Math.abs(sold_cost_basis)
              closed['gain'] = closed['sell_value'] - closed['cost_basis']
              closed['return'] = closed['gain'] / closed['cost_basis'] * 100
              closed_positions.push(closed)
              closed_pos_idx += 1
              
              // now update cumulative values
              ptf[coin].cost_basis += sold_cost_basis
              ptf[coin].amount += order.amount
              ptf[coin].closed_gain += sold_closed_gain

            }
          }
        }
        
        // Now update prices and gains for all assets
        _.forEach(assets, v => {
          ptf[v].current_value = ptf[v].amount * date[v].close
          ptf[v].open_gain = ptf[v].current_value - ptf[v].cost_basis
          ptf[v].gain = ptf[v].open_gain + ptf[v].closed_gain
          ptf[v].return = ptf[v].gain / ptf[v].cost_basis * 100
          ptf[v].price = date[v].close
        })

        // Run summary for portfolio and update
        ptf["portfolio"].current_value = _.reduce(ptf, (res, v, k) => {
          return k !== "portfolio" ? res+v.current_value : res }, 0)
        ptf["portfolio"].cost_basis = _.reduce(ptf, (res, v, k) => {
          return k !== "portfolio" ? res+v.cost_basis : res }, 0)
        ptf["portfolio"].closed_gain = _.reduce(ptf, (res, v, k) => {
          return k !== "portfolio" ? res+v.closed_gain : res }, 0)
        ptf["portfolio"].open_gain = ptf["portfolio"].current_value - ptf["portfolio"].cost_basis
        ptf["portfolio"].gain = ptf["portfolio"].open_gain + ptf["portfolio"].closed_gain
        ptf["portfolio"].return = ptf["portfolio"].gain / ptf["portfolio"].cost_basis * 100

        // add time and date
        ptf["portfolio"].time = date.BTC.time
        ptf["portfolio"].date = date.BTC.date

        // push
        portfolio.push(_.cloneDeep(ptf))
      }
    }

    // prepare data for graphs
    let latest = portfolio[portfolio.length-1]

    // get summaries
    let summaries = _.map(latest, (v,k) => _.assign(v,{coin: k}) )
    summaries = _.filter(summaries, o => o.amount ) // portfolio will have amount=0

    // process positions prior to returning
    open_positions = _.groupBy(open_positions, "coin")
    closed_positions = _.groupBy(closed_positions, "coin")    

    // prepare returning object
    result = {
      returnsdata: _.values(_.mapValues(portfolio, o => o.portfolio)),
      full_history: portfolio,
      portfolio: latest.portfolio,
      summaries: summaries,
      open_positions: open_positions,
      closed_positions: closed_positions
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
 * @param {string} period for calculation
 * @return {object} object with all combined values
 */
export function getAnalysis(assets, transactions, accounts, spot_prices, hist_prices, sparkline_duration, period) {
  // get sparkline data from raw historicals
  let sparkline_data = pricesForSparkLine(hist_prices, sparkline_duration)

  // get spot prices and append to historical
  let current_prices = convertSpotPrices(spot_prices)
  let prices = mergeSpotPricesWithHistorical(current_prices, hist_prices)

  // filter buy/sell transactions, parse dates, adjust amount for sell
  // let processed_transactions = processCoinbaseTransactions(assets, accounts, transactions)
  
  // get returns by positions and for the portfolio
  let returns = getReturnsByDate(assets, transactions, prices)

  // apply period
  switch(period) {
    case "week": {
      period_duration = 8
      break
    }
    case "month": {
      period_duration = 31
      break
    }
    case "quarter": {
      period_duration = 91
      break
    }
    case "year": {
      period_duration = 366
      break
    }
    default: {
      period_duration = -1
      break
    }
  }

  // try to do period application
  try {
    // get graph data
    returnsData = returns.returnsdata
    if (period_duration > 0) {
      returnsData = returnsData.slice(returnsData.length-period_duration)
    }
    returns.returnsdata = returnsData

    // get overall returns summary for given period
    fh = returns.full_history
    // TODO: use assets list
    // needed to add the zero baseline otherwise numbers start from 1st day
    fh.splice(0,0,{BTC: {gain: 0}, ETH: {gain: 0}, LTC: {gain: 0}, portfolio: {gain: 0}})
    
    if (period_duration > 0) {
      fh = fh.slice(fh.length-period_duration)
    }

    // calculate delta in returns over period
    processed = Object.keys(fh[0]).map(e => { return {gain: fh[fh.length-1][e].gain-fh[0][e].gain, cost_basis:fh[fh.length-1][e].cost_basis, coin:e}})
    
    // prepare for merging
    summaries = returns.summaries
    portfolio = returns.portfolio

    summaries = _.zipObject(summaries.map(a => a.coin), summaries)
    processed = _.zipObject(processed.map(a => a.coin), processed)
    
    // merge with summaries
    let d = true
    for (i in summaries) {
      summaries[i]['gain_period'] = processed[i].gain
      summaries[i]['return_period'] = processed[i].gain/processed[i].cost_basis*100
    }
    returns.summaries = _.values(summaries)

    // assign to portfolio
    portfolio.gain_period = processed["portfolio"].gain
    portfolio.return_period = processed["portfolio"].gain/processed["portfolio"].cost_basis*100
    returns.portfolio = portfolio

  } catch(err) {}

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
    positions: [returns.open_positions, returns.closed_positions]
  }
}