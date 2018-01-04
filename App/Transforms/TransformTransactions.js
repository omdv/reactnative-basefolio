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

    // // round amounts to minimum denomination
    // trans.forEach(function(t) {
    //     if (t.coin === "BCH" || t.coin === "BTC") {
            
    //     }
    //     t.tag = t.tag.toLowerCase()
    // })


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

export function TransformGDAXOrders(trans) {
    // flatten and convert to numeric
    trans = trans.map(e => { return {
        coin: e.product_id.split("-")[0],
        fiat: e.product_id.split("-")[1],
        cost_basis: Number(e.price) * Number(e.size) * (e.side === "sell" ? -1 : 1),
        price: Number(e.price),
        source: "GDAX",
        fee: e.fee,
        time: Date.parse(e.created_at),
        date: dateToYMD(Date.parse(e.created_at)),
        type: e.side,
        amount: Number(e.size) * (e.side === "sell" ? -1 : 1),
        id: e.trade_id,
        settled: e.settled
    }})

    // remove unsettled transactions
    trans = _.filter(trans, v => (v.settled))

    // filter only supported coins
    trans = _.filter(trans, v => (coins.includes(v.coin)))

    // filter only fiat purchases
    // TODO: add cross crypto exchanges
    trans = _.filter(trans, v => (v.fiat === "USD"))

    return trans
}

export function UpdateTransaction(trans, transactions) {
    trans.time = new Date(trans.date).getTime()
    transactions = _.filter(transactions, v => (v.id !== trans.id))
    transactions.push(trans)
    return transactions
}

export function UpdateTransactionsBySource(source, old_transactions, new_transactions) {
    old_transactions = _.filter(old_transactions, v => (v.source !== source))
    old_transactions = old_transactions.concat(new_transactions)
    return old_transactions
}