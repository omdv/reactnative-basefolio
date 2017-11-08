import * as _ from 'lodash'

// Supported coins
var coins = require('../Config/Coins')['coins']

function dateToYMD(date) {
    date = new Date(date)
    var d = date.getDate()
    var m = date.getMonth() + 1
    var y = date.getFullYear()
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d)
  }

export function TransformTransactionsForCoin(trans) {
    // flatten and convert to numeric
    trans = trans.data

    trans.map(e => {
        e.amount.amount = Number(e.amount.amount)
        e.native_amount.amount = Number(e.native_amount.amount)
        e.price = e.native_amount.amount / e.amount.amount
        e.coin = e.amount.currency
        e.transaction_source = "Coinbase"
        e.time = Date.parse(e.created_at),
        e.date = dateToYMD(Date.parse(e.created_at))
    })
    return trans
}

export function TransformAllTransactions(trans) {
    // flatten transactions, filter only buy/sell
    trans = _.reduce(_.values(trans), (s,x) => _.concat(s,x), [])
    trans = _.filter(trans, v => (v.type === "buy") || (v.type === "sell"))
    
    // filter only supported coins
    trans = _.filter(trans, v => (coins.includes(v.amount.currency)))

    return trans
}