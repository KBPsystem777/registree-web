/* eslint-disable no-useless-escape */

/***
 * Validates if the provided email address is valid.
 *
 * @param {string} email - The email address to be validated.
 * @returns {boolean} Returns true if the email is valid, otherwise false.
 * @author Web3 Team
 * @email web3fleet@gmail.com
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
  return !!email && emailRegex.test(email)
}
