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
    switch (coin) {
      case "BTC":
        data = {"Data": require('../Fixtures/pricesBTC.json')}
      case "ETH":
        data = {"Data": require('../Fixtures/pricesETH.json')}
      case "LTC":
        data = {"Data": require('../Fixtures/pricesLTC.json')}
    }
    return {
      ok: true,
      data: data
    }
  },
  getCurrentPrices: (coin) => {
    switch (coin) {
      case "BTC":
        data = {"Data": require('../Fixtures/pricesBTClatest.json')}
      case "ETH":
        data = {"Data": require('../Fixtures/pricesETHlatest.json')}
      case "LTC":
        data = {"Data": require('../Fixtures/pricesLTClatest.json')}
    }
    return {
      ok: true,
      data: data
    }
  }
}
