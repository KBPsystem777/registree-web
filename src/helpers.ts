export function numberFormat(n: any, decimalPoint: any, currency: any) {
  return (
    currency +
    n.toFixed(decimalPoint).replace(/./g, function (c: any, i: any, a: any) {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c
    })
  )
}

export function formatx(num: any) {
  const n = String(num),
    p = n.indexOf(".")
  return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
    p < 0 || i < p ? `${m},` : m
  )
}
