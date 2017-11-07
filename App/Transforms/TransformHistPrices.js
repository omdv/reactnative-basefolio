import * as _ from 'lodash'

// transform historical prices
export function TransformHistPrices(response, coins) {
  // prepare object
  response = response.map(a => a.data.Data)
  hist_prices = _.zipObject(coins, response)

  let prices = {}
  let validation_periods = true
  let end_dates = {}
  for (coin in hist_prices) {
    prices[coin] = hist_prices[coin].map(e => {return {'close': e.close, 'open': e.open, 'time': e.time}})

    let start_date = hist_prices[coin][0].time
    let period = hist_prices[coin].length-1    
    end_dates[coin] = hist_prices[coin][period].time
    if ((end_dates[coin] - start_date)/86400 !== period) {
      validation_periods = false
    }
  }

  let validation_end_date = _.values(end_dates).map(a => a === end_dates['BTC']).reduce((a,b) => a && b)
  validation = validation_periods && validation_end_date

  return [ prices, end_dates, validation ]
}

export function MergeHistPrices(old_prices, new_prices) {
  let prices = _.mapValues(old_prices, (v, k, col) => v.concat(new_prices[k]))
  return prices
}