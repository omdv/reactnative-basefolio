// export default (trans) => {
//     // flatten and convert to numeric
//     trans = trans.map(x => x.data)

//     trans.map(t => {
//     	t.map(e => {
//     		e.amount.amount = Number(e.amount.amount)
//     		e.native_amount.amount = Number(e.native_amount.amount)
//     	})
//     })
//     return trans
// }


export default (trans) => {
    // flatten and convert to numeric
    trans = trans.data

    trans.map(e => {
        e.amount.amount = Number(e.amount.amount)
        e.native_amount.amount = Number(e.native_amount.amount)
    })
    return trans
}