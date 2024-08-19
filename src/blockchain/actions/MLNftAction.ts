import { ethers } from "ethers"

import { MLNftContract } from "../Web3Utils"

export const mint = async (propertyId: number, issuanceRate: number) => {
  const tx = await MLNftContract().mint(
    propertyId,
    ethers.utils.parseEther(issuanceRate.toString())
  )
  return await tx.wait()
}

export const transfer = async (
  fromWallet: any,
  toWallet: any,
  tokenId: any
) => {
  const tx = await MLNftContract()["safeTransferFrom(address,address,uint256)"](
    fromWallet,
    toWallet,
    tokenId
  )
  return await tx.wait()
}

export const burn = async (tokenId: any, ownerWallet: any) => {
  const tx = await MLNftContract().burn(tokenId, { from: ownerWallet })
  return await tx.wait()
}

export const markFullyPayed = async (tokenId: any, ownerWallet: any) => {
  const tx = await MLNftContract().markFullyPayed(tokenId, {
    from: ownerWallet,
  })
  return await tx.wait()
}

export const updateTokenAddressAction = async (newAddress: string) => {
  const tx = await MLNftContract().setLifeToken(newAddress)
  const result = await tx.wait()
  console.log("UPDATED CONTRACT RESULT:", result)
}
export const updateMarketplaceAddressAction = async (newAddress: string) => {
  const tx = await MLNftContract().setMarketplace(newAddress)
  const result = await tx.wait()
  console.log("UPDATED CONTRACT RESULT:", result)
}

export const updateLifeTokenIssuanceRate = async (
  tokenId: any,
  newLifeTokenIssuanceRate: any
) => {
  const tx = await MLNftContract().updateLifeTokenIssuanceRate(
    tokenId,
    ethers.utils.parseEther(newLifeTokenIssuanceRate.toString())
  )
  const result = await tx.wait()
  console.log("UPDATED TOKEN ISSUANCE RATE RESULT:", result)
}

export const retractNft = async (tokenId: number | string) => {
  const tx = await MLNftContract().retract(tokenId)
  return await tx.wait()
}
