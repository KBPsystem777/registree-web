import { ethers } from "ethers"

import { MLInvestorsMarketplace } from "../Web3Utils"

const contract = MLInvestorsMarketplace()

export const acceptBid = async (
  tokenId: string,
  minPrice: string
): Promise<any> => {
  const tx = await contract?.acceptBid(tokenId, minPrice)
  return tx.wait()
}

export const listToMarket = async (
  tokenId: string,
  minSalePrice: string
): Promise<any> => {
  const tx = await contract?.offerForSale(
    tokenId,
    ethers.utils.parseEther(minSalePrice.toString())
  )
  return tx.wait()
}

export const offerToAddress = async (
  tokenId: string,
  minSalePrice: string,
  toAddress: string
): Promise<any> => {
  const tx = await contract?.offerForSaleToAddress(
    tokenId,
    minSalePrice,
    toAddress
  )
  return tx.wait()
}

export const placeBid = async (
  bidAmount: string,
  tokenId: string
): Promise<any> => {
  const tx = await contract?.placeBid(tokenId, {
    value: ethers?.utils?.parseEther(bidAmount.toString()),
  })
  return tx.wait()
}

export const buy = async (amount: string, tokenId: string): Promise<any> => {
  const tx = await contract?.buy(tokenId, {
    value: ethers?.utils?.parseEther(amount.toString()),
  })
  return tx.wait()
}

export const cancelListing = async (tokenId: string): Promise<any> => {
  const tx = await contract?.cancelForSale(tokenId)
  return tx.wait()
}

export const setAdminPercent = async (percentage: string): Promise<any> => {
  const tx = await contract?.setAdminPercent(percentage)
  return tx.wait()
}

export const setNftiContract = async (newNftiAddress: string): Promise<any> => {
  const tx = await contract?.setNftiContract(newNftiAddress)
  return tx.wait()
}

export const setTrading = async (tradinStatus: boolean): Promise<any> => {
  const tx = await contract?.setTrading(tradinStatus)
  return tx.wait()
}

export const withdrawEarnings = async (): Promise<any> => {
  const tx = await contract?.withdraw()
  return tx.wait()
}

export const withdrawBid = async (tokenId: string): Promise<any> => {
  const tx = await contract?.withdrawBid(tokenId)
  return tx.wait()
}

export const transferOwnership = async (
  newOwnerAddress: string
): Promise<any> => {
  const tx = await contract?.transferOwnership(newOwnerAddress)
  return tx.wait()
}

export const unPause = async (): Promise<any> => {
  const tx = await contract?.unpause()
  return tx.wait()
}
