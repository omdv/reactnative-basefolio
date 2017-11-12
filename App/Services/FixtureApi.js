export default {
  // Functions return fixtures
  getRoot: () => {
    return {
      ok: true,
      data: require('../Fixtures/root.json')
    }
  },
  getRate: () => {
    return {
      ok: true,
      data: require('../Fixtures/rateLimit.json')
    }
  },
  getUser: (username) => {
    // This fixture only supports gantman or else returns skellock
    const gantmanData = require('../Fixtures/gantman.json')
    const skellockData = require('../Fixtures/skellock.json')
    return {
      ok: true,
      data: username.toLowerCase() === 'gantman' ? gantmanData : skellockData
    }
  },
  getAccounts: (username) => {
    // This fixture only supports gantman or else returns skellock
    const gantmanData = require('../Fixtures/gantman.json')
    const skellockData = require('../Fixtures/skellock.json')
    return {
      ok: true,
      data: username.toLowerCase() === 'gantman' ? gantmanData : skellockData
    }
  },
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
    
  }
}
