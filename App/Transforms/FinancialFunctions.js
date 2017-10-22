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
 * Calculate positions for assets and transactions
 * @param {array} array of assets
 * @param {array} array of transactions
 * @param {array} array of current prices
 * @return {array} array of positions
 */
function getPositions(assets, transactions, prices, accounts) {
  let positions = []
  let cleaned_positions = {}
  let current_price = {}

  // get latest price
  for (coin in prices) {
    price = prices[coin]
    current_price[coin] = price.USD
  }

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
        let gain = (current_price[coin] - buy_price) * amount
        var position = {
          'type': 'Buy',
          'amount': amount,
          'coin': coin,
          'buy_price': buy_price,
          'cost': buy_price * amount,
          'value': current_price[coin] * amount,
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
 * @param {array} array of accounts
 * @return {array} array of summaries per asset
 */
function getSummaryByAsset(assets, positions) {
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
      'return': gain/cost * 100
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
 * Calculate total summary
 * @param {array} array of assets
 * @param {array} array of transactions
 * @param {array} array of accounts
 * @param {array} array of prices
 * @return {object} object with all combined values
 */
export function getAnalysis(assets, transactions, accounts, prices) {
  let positions = getPositions(assets, transactions, prices, accounts)
  let summaries = getSummaryByAsset(assets, positions, accounts)
  let portfolio = getPortfolioSummary(summaries)

  return {
    positions: positions,
    summaries: summaries,
    portfolio: portfolio
  }
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

  // _getBalancesByAsset (accounts) {
  //   var result = {}
  //   let assets = ['BTC', 'ETH', 'LTC', 'USD']
  //   assets.map((coin) => {
  //     let val = 0
  //     let balances = accounts
  //       .filter(x => x.balance.currency === coin)
  //       .map(x => Number(x.balance.amount))
  //     result[coin] = balances.reduce((x,y) => x+y)
  //     })
  //   return result
  // }

  // _processTransactions () {
  //   // flatten and convert to numeric
  //   trans = trans.map(x => x.data)
  //   trans = trans.reduce((x,y) => x.concat(y))
  //   trans.map(e => {
  //     e.amount.amount = Number(e.amount.amount)
  //     e.native_amount.amount = Number(e.native_amount.amount)
  //   })
  //   return trans
  // }