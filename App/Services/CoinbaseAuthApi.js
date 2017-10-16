// a library to wrap and simplify api calls
import apisauce from 'apisauce'

var credentials = require('../Config/OAuth');

// our "constructor"
const create = (baseURL = 'https://api.coinbase.com/oauth/token') => {

  const api = apisauce.create({
    baseURL,
    timeout: 10000,
    headers: {}
  })

  // const data = [
  //     'grant_type=authorization_code',
  //     '&code=',this.access_code,
  //     '&client_id=',credentials.coinbase.client_id,
  //     '&client_secret=',credentials.coinbase.client_secret,
  //     '&redirect_uri=',credentials.coinbase.redirect_uri].join('')
  //   let headers = {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   }
  //   let fetchUrl = {body: data, method: "POST", headers: headers}
  //   let url = 'https://api.coinbase.com/oauth/token'

  const authUser = (access_code) => {
    const data = [
      'grant_type=authorization_code',
      '&code=',access_code,
      '&client_id=',credentials.coinbase.client_id,
      '&client_secret=',credentials.coinbase.client_secret,
      '&redirect_uri=',credentials.coinbase.redirect_uri].join('')
    // const data = JSON.stringify({
    //   'grant_type': authorization_code,
    //   'code': access_code,
    //   'client_id': credentials.coinbase.client_id,
    //   'client_secret': credentials.coinbase.client_secret,
    //   'redirect_uri': credentials.coinbase.redirect_uri})
    api.post('', data,
      {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
  }

  return {
    authUser,
  }
}

// let's return back our create method as the default.
export default {
  create
}
