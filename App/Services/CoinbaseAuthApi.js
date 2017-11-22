// a library to wrap and simplify api calls
import apisauce from 'apisauce'

var credentials = require('../Config/OAuth')

// our "constructor"
const create = (baseURL = 'https://api.coinbase.com/oauth/token') => {

  const api = apisauce.create({
    baseURL,
    timeout: 10000
  })

  const authUser = (access_code) => {
    const data = [
      'grant_type=authorization_code',
      '&code=',access_code,
      '&client_id=',credentials.coinbase.client_id,
      '&client_secret=',credentials.coinbase.client_secret,
      '&redirect_uri=',credentials.coinbase.redirect_uri].join('')
    
    api.post('', data,
      {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'CB-VERSION': '2017-06-16'}})
  }

  const refreshToken = (refreshToken) => api.post(
      '', ['grant_type=refresh_token', '&refresh_token=',refreshToken, 
      '&client_id=',credentials.coinbase.client_id,
      '&client_secret=',credentials.coinbase.client_secret].join(''),
      {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'CB-VERSION': '2017-06-16'}})

  return {
    authUser,
    refreshToken
  }
}

// let's return back our create method as the default.
export default {
  create
}
