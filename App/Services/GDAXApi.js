// a library to wrap and simplify api calls
import apisauce from 'apisauce'

const CryptoJS = require('crypto-js')

// our "constructor"
const create = (baseURL = 'https://api.gdax.com') => {

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

// get gdax Fills
const getFills = (passphrase, key, secret, after) => {

  // Credentials
  CB_ACCESS_SECRET = secret ? secret : "empty"
  CB_ACCESS_PASSPHRASE =  passphrase ? passphrase : "empty"
  CB_ACCESS_KEY = key ? key : "empty"
  
  // form request
  var timestamp = Date.now() / 1000
  var requestPath = '/fills'  
  var method = 'GET'

  // Add pagination
  if (after) {
    requestPath = requestPath + '?after=' + after
  }

  // sign request
  var what = timestamp + method + requestPath

  var key = CryptoJS.enc.Base64.parse(CB_ACCESS_SECRET)
  var hash = CryptoJS.HmacSHA256(what, key)
  var CB_ACCESS_SIGN = CryptoJS.enc.Base64.stringify(hash)

  return api.get(requestPath, {},
    {headers: 
      {
        'CB-ACCESS-KEY': CB_ACCESS_KEY,
        'CB-ACCESS-SIGN': CB_ACCESS_SIGN,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-PASSPHRASE': CB_ACCESS_PASSPHRASE
      }
    })
}

return {
  getFills
}
}

// let's return back our create method as the default.
export default {
  create
}
