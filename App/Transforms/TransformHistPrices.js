// transform historical prices
export default (hist_prices) => {
  let new_prices = {}
  for (coin in hist_prices) {
    new_prices[coin] = hist_prices[coin].map(e => {return {'close': e.close, 'open': e.open, 'time': e.time}})
  }
  return new_prices  
}