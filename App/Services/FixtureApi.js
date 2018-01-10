export default {
  getDailyHistPrices: (coin) => {
    let data = {}
    switch (coin) {
      case "BTC":
        data = {"Data": require('../Fixtures/pricesBTC.json')}
        break
      case "ETH":
        data = {"Data": require('../Fixtures/pricesETH.json')}
        break
      case "LTC":
        data = {"Data": require('../Fixtures/pricesLTC.json')}
        break
    }
    return {
      ok: true,
      data: data
    }
  },
  getDailyHistPricesPeriod: (coin, period) => {
    let data = {}
    switch (coin) {
      case "BTC":
        json = require('../Fixtures/pricesBTCupdate.json')
        data = {"Data": json.slice(json.length-period)}
        break
      case "ETH":
        json = require('../Fixtures/pricesETHupdate.json')
        data = {"Data": json.slice(json.length-period)}
        break
      case "LTC":
        json = require('../Fixtures/pricesLTCupdate.json')
        data = {"Data": json.slice(json.length-period)}
        break
    }
    return {
      ok: true,
      data: data
    }
  },
  getCurrentPrices: (coin) => {
    switch (coin) {
      case "BTC":
        data = require('../Fixtures/pricesBTClatest.json')
        break
      case "ETH":
        data = require('../Fixtures/pricesETHlatest.json')
        break
      case "LTC":
        data = require('../Fixtures/pricesLTClatest.json')
        break
    }
    return {
      ok: true,
      data: data
    }
  },
  getAccounts: (token) => {
    data = require('../Fixtures/accounts.json')
    return {
      ok: true,
      data: data
    }
  },
  getTransactions: (token, account) => {
    switch(account) {
      case "5dc34281-071e-5215-a5f6-2d24ddd7f1b8":
        data = require('../Fixtures/transactions_BTC.json')
        break
      case "00dcb2a0-fbf3-53bf-94be-770deb091c19":
        data = require('../Fixtures/transactions_ETH.json')
        break
      case "0d8f8bf4-6eb1-53e3-9a31-8da1829ef552":
        data = require('../Fixtures/transactions_LTC.json')
        break
      case "caae6ec2-1bf9-5653-9edf-bb6694b11d2f":
        data = require('../Fixtures/transactions_BCH.json')
      default:
        data = {"data": [], "pagination": {"next_uri": null}}
        break
    }
    return {
      ok: true,
      data: data
    }
  },
  getFills: (pass, key, secret, after) => {
    data = require('../Fixtures/fillsGDAX.json')
    if (!after) {
      return {
        ok: true,
        data: data,
        headers: {'cb-after': false}
      }
    } else {
      return {
        ok: true,
        data: [],
        headers: {'cb-after': false}
      }
    }
  },
  getUser: (token) => {
    data = require('../Fixtures/userData.json')
    return {
      ok: true,
      data: data
    }
  }
}
