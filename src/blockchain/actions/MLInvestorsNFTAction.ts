import { ethers } from "ethers"

import { MLNFTIContract } from "../Web3Utils"

const contract = MLNFTIContract()

/**
 * Function to mint NFTIs.
 * @param {number} quantity number of NFTIs to be minted in 1 transaction
 * @returns {Promise<MintTransaction>} transaction output
 */
export const mintNft = async (quantity: number): Promise<any> => {
  if (quantity < 1) {
    throw new Error("Invalid quantity")
  }

  try {
    const mintTransaction = await contract?.mint(quantity.toString())
    return mintTransaction.wait()
  } catch (error) {
    console.error("Error minting NFT:", error)
    throw error
  }
}

/**
 * Function to issue an NFTi to an investor. Caller of this function should be the
 * current owner of the tokenId being sent here
 * @param {string} address address of the receiving investor
 * @param {number} tokenId tokenId of the NFTi to be issued
 * @param {number} tokenIssuanceRate token issuance rate of the NFT. Needs to be in uint256 form
 * @returns {any} transaction output
 */
export const issueNftToInvestor = async (
  address: string,
  tokenId: number,
  tokenIssuanceRate: number
) => {
  const tx = await contract?.issueNftToInvestor(
    address.toString(),
    tokenId.toString(),
    ethers.utils.parseEther(tokenIssuanceRate.toString())
  )

  return tx.wait()
}

/**
 * Function to transfer an NFTi.
 * @param {string} toWallet receiving wallet address
 * @param {number} tokenId tokenId to be transferred
 * @param {string} fromWallet wallet address who will be sending the NFTi
 * @returns {Promis<any>} transaction log
 */
export const transferNft = async (
  toWallet: string,
  tokenId: number,
  fromWallet: string
) => {
  const tx = await contract?.transferNft(
    toWallet.toString(),
    tokenId.toString(),
    { from: fromWallet }
  )
  return tx.wait()
}

/**
 * Function for investors or NFTi holders to withdraw their token rewards.
 * Can only be run by the actual NFTi holder.
 * @param {string} tokenId tokenId of the NFTi
 * @returns {Promise<any>} transaction log
 */
export const claimNFTiStakingRewards = async (
  tokenId: string
): Promise<any> => {
  const tx = await contract?.claimStakingRewards(tokenId, {})
  return tx.wait()
}

/**
 * Function to burn an NFTi token. This can only be executed by
 * the wallet admin or NFTi contract owner
 * @param {string} tokenId tokenId to be burned
 * @returns {Promise<any>} transaction confirmation
 */
export const burnNFTiTokens = async (tokenId: string): Promise<any> => {
  const tx = await contract?.burnNft(ethers.utils.parseEther(tokenId))
  return tx.wait()
}

/**
 * Function to lock an NFTi into a certain date
 * @param {string} tokenId tokenID target
 * @param {string} lockDate locked up period in UNIX timestamp
 * @returns {Promise <TransactionResult>} transaction status nad response
 */
export const setLockDate = async (
  tokenId: string,
  lockDate: string
): Promise<any> => {
  try {
    const lockDateAction = await contract?.setLockDate(tokenId, lockDate)
    const tx = await lockDateAction.wait()
    return tx
  } catch (error) {
    console.error(error)
    throw error
  }
}

/*** Read functions  */

/**
 * Get the total number of NFTIs. Returns the number of active NFTIs.
 * @returns {number} current number of active NFTIs
 */
export const getTotalSupply = async () => {
  const totalSupply = await contract?.totalSupply()
  // Will return whole number:
  return totalSupply.toString()
}

/**
 * Get the NFT name
 * @returns {string} name of the NFT
 */
export const getNftName = async () => {
  const tokenName = await contract?.name()
  return tokenName
}

/**
 * Get the NFT symbol of the NFTi contract
 * @returns {string} symbol of the NFT
 */
export const getNftSymbol = async () => {
  const symbol = await contract?.symbol()
  return symbol
}

/**
 * Function to query the claimable token staking rewards of an NFTi
 * @param {number} tokenId tokenId of the NFTi
 * @returns {number} number of claimable rewards in uint256 form
 */
export const queryRewards = async (tokenId: number) => {
  const rewards = await contract?.checkClaimableStakingRewards(tokenId)
  return rewards
}

/**
 * Get the current baseURI address of all the NFTIs
 * @returns {string} https or ipfs address of the baseURI
 */
export const getBaseURI = async () => {
  return await contract?.baseURI()
}

/**
 * Get how much NFTIs an address is currently owning
 * @param {string} address address to be checked
 * @returns {number|string} number of NFTIs held
 */
export const getBalanceOf = async (address: string) => {
  return await contract?.balanceOf(address)
}

/**
 * Get the current MLIFE token being used in the NFTi contract
 * @returns {string} address of the MLIFE token currently used
 */
export const getLifeToken = async () => {
  return await contract?.lifeToken()
}

/**
 * Query the current token issuance rate of an NFTi
 * @param {string} tokenId tokenId to be checked
 * @returns {number|string} the current issuance rate of an NFTi
 */
export const getTokenIssuanceRate = async (tokenId: string) => {
  return await contract?.lifeTokenIssuanceRate(tokenId)
}

/**
 * Get the address of the current NFTi contract owner.
 * @returns {string} address of the contract owner
 */
export const getOwner = async () => {
  return await contract?.owner()
}

/**
 * Get the start of staking of an NFTi
 *
 * @async
 * @param {string} tokenId
 * @returns {Promise<string|number>} String in Unix timestamp
 */
export const getStartOfStaking = async (tokenId: string) => {
  try {
    const start = contract?.startOfStaking(tokenId)
    return start
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Get the token URI of a specific NFTi
 *
 * @async
 * @param {string} tokenId tokenId to be checked
 * @returns {Promise<string>} https or ipfs address of the NFT metadata
 */
export const getTokenUri = async (tokenId: string) => {
  try {
    const tokenUri = await contract?.tokenURI(tokenId)
    return tokenUri
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Gets ths unlock date of an NFTi in UNIX timestamp format
 *
 * @async
 * @param {string} tokenId
 * @returns {Promise<number|null>}
 */
export const getUnlockDate = async (tokenId: string) => {
  try {
    const date = await contract?.unlockDate(tokenId)
    return date
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Gets the owner of the specified token ID from the contract?.
 *
 * @async
 * @param {string} tokenId - The ID of the token to get the owner of.
 * @returns {Promise<string|null>} - A Promise that resolves to the owner's address if successful, or null if an error occurs.
 */
export const getOwnerOf = async (tokenId: string) => {
  try {
    const owner = await contract?.ownerOf(tokenId)
    return owner
  } catch (error) {
    console.error(error)
    return null
  }
}

export const updateLifeTokenIssuanceRate = async (
  tokenId: any,
  newLifeTokenIssuanceRate: any
) => {
  const tx = await contract?.updateLifeTokenIssuanceRate(
    tokenId,
    ethers.utils.parseEther(newLifeTokenIssuanceRate.toString())
  )
  const result = tx.await()
  console.log("UPDATED TOKEN ISSUANCE RATE RESULT:", result)
}
