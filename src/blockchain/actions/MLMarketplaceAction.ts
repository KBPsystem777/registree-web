import { MLMarketplaceContract } from "../Web3Utils"
import { ethers } from "ethers"

export const placeBid = async (tokenId: any, wallet: any, amount: number) => {
  const tx = await MLMarketplaceContract().placeBid(tokenId, {
    from: wallet,
    value: ethers.utils.parseEther(amount.toString()),
  })
  return await tx.wait()
}

export const acceptBid = async (
  tokenId: any,
  minPrice: number,
  seller: string
) => {
  const tx = await MLMarketplaceContract().acceptBid(
    tokenId,
    ethers.utils.parseEther(minPrice.toString()),
    { from: seller }
  )
  return await tx.wait()
}

export const offerForSaleToAddress = async (
  tokenId: any,
  minSalePriceETH: any,
  toAddress: any,
  seller: any
) => {
  const tx = await MLMarketplaceContract().offerForSaleToAddress(
    tokenId,
    ethers.utils.parseEther(minSalePriceETH.toString()),
    toAddress,
    { from: seller }
  )
  return await tx.wait()
}

export const offerForSale = async (
  tokenId: any,
  minSalePriceETH: any,
  seller: any
) => {
  const tx = await MLMarketplaceContract().offerForSale(
    tokenId,
    ethers.utils.parseEther(minSalePriceETH.toString()),
    { from: seller }
  )
  return await tx.wait()
}

export const cancelForSale = async (tokenId: any, ownerWallet: any) => {
  const tx = await MLMarketplaceContract().cancelForSale(tokenId, {
    from: ownerWallet,
  })
  return await tx.wait()
}

export const setNftAddress = async (nftAddress: string) => {
  const tx = await MLMarketplaceContract().setContract(nftAddress)
  const result = await tx.wait()
  console.log("UPDATED CONTRACT RESULT:", result)
}
