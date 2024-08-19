/*** Converts a Unix timestamp to a formatted date string.
 * @param timestamp - The Unix timestamp to convert.
 * @returns The formatted date string.
 */
export const unixToDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Converts a date string in the format 'YYYY-MM-DD' to a Unix timestamp.
 * 
 * @param {string} dateString - The date string to convert.
 * @returns {number} The Unix timestamp representing the given date.
 */
export const dateToUnix = (dateString: string): number => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date object
  return Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds for Unix timestamp
};
