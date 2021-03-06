// a library to wrap and simplify api calls
import apisauce from 'apisauce'

// our "constructor"
const create = (baseURL = 'https://min-api.cryptocompare.com/data/') => {

  const api = apisauce.create({
    baseURL,
    timeout: 10000
  })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //

  // https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&e=CCCAGG&allData=True
  const getDailyHistPrices = (coin) => api.get(
    'histoday?tsym=USD&e=CCCAGG&allData=true&fsym='+coin,
    {}, {})
  const getDailyHistPricesPeriod = (coin, period) => api.get(
    'histoday?tsym=USD&e=CCCAGG&limit='+period+'&fsym='+coin,
    {}, {})
  const getCurrentPrices = (coin) => api.get(
    'price?fsym='+coin+'&tsyms=USD',
    {}, {})

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    getDailyHistPrices,
    getDailyHistPricesPeriod,
    getCurrentPrices
  }
}

// let's return back our create method as the default.
export default {
  create
}
