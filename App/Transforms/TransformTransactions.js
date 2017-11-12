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

    trans = trans.map(e => { return {
        coin: e.amount.currency,
        cost_basis: Number(e.native_amount.amount),
        price: Number(e.native_amount.amount) / Number(e.amount.amount),
        source: "Coinbase",
        time: Date.parse(e.created_at),
        date: dateToYMD(Date.parse(e.created_at)),
        type: e.type,
        amount: Number(e.amount.amount),
        id: e.id   
    }})

    return trans
}

export function TransformAllTransactions(trans) {
    // flatten transactions, filter only buy/sell
    trans = _.reduce(_.values(trans), (s,x) => _.concat(s,x), [])
    trans = _.filter(trans, v => (v.type === "buy") || (v.type === "sell"))
    
    // filter only supported coins
    trans = _.filter(trans, v => (coins.includes(v.coin)))

    return trans
}

export function UpdateTransaction(trans, transactions) {
    trans.time = new Date(trans.date).getTime()
    transactions = _.filter(transactions, v => (v.id !== trans.id))
    transactions.push(trans)
    return transactions
}