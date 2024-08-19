/***
 * Transforms a given input string into a descriptive format.
 * @param {string} inputString - The input string to be transformed.
 * @returns {string} The transformed string.
 *
 * @example
 * const inputString: string = "FOUR_BR_THREE_B"
 * const transformedString: string = transformString(inputString)
 * console.log(transformedString) // Output: "4 Bed rooms 3 Bathrooms"
 */

export const transformString = (inputString: string): string => {
  const codeMap: { [key: string]: string } = {
    ONE: "1",
    TWO: "2",
    THREE: "3",
    FOUR: "4",
    FIVE: "5",
    SIX: "6",
    SEVEN: "7",
    EIGHT: "8",
    NINE: "9",
    BR: "Bed rooms",
    B: "Bathrooms",
  }

  const parts: string[] = inputString.split("_")
  let result: string = ""

  for (let i = 0; i < parts.length; i++) {
    const part: string = parts[i]
    if (codeMap[part]) {
      result += codeMap[part]
      if (i < parts.length - 1) {
        result += " "
      }
    }
  }

  return result
}
