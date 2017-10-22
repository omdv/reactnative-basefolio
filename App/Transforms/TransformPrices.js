// transform historical prices
export default (prices_response) => {
  let ok = prices_response.map(a => a.ok).reduce((a,b) => a && b)
  
  // convert to object
  for (i in prices_response) {
    prices[coins[i]] = prices_response[i].data.Data
  }
  
}