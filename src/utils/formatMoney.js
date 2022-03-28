
// const formatter = Intl.NumberFormat('en-GB', {
//    style: 'currency',
//    currency: 'GBP',
// })

// export default function formatMoney(price) {
//    return formatter.format(price)
// }


export default function formatMoney(price, decimals = 0) {
   return Intl.NumberFormat('sfb', {                              // sfb - Belgian EUR code, it puts euro symbol before the Number
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: decimals,
      maksimumFractionDigits: decimals,
   }).format(price)
}