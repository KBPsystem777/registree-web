/***
 * Format a number as a USD currency string.
 *
 * @param {number} amount - The amount to format as USD.
 * @returns {string} The formatted USD currency string.
 */
export const formatToUsd = (amount: number | string): string => {
  let inputAmount = Number(amount)
  return inputAmount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })
}
