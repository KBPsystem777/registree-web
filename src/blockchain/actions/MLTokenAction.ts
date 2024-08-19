import { MLTokenContract } from "../Web3Utils"
import { ethers } from "ethers"

export const getTotalSupply = async () => {
  const totalSupply_ = await MLTokenContract().totalSupply()
  return ethers.utils.formatEther(totalSupply_.toString())
}

export const getName = async () => {
  return await MLTokenContract().name()
}

export const getSymbol = async () => {
  return await MLTokenContract().symbol()
}

export const mint = async (amount: number) => {
  const tx = await MLTokenContract().mint(
    ethers.utils.parseEther(amount.toString())
  )
  return await tx.wait()
}

export const burn = async (amount: number) => {
  const tx = await MLTokenContract().burn(
    ethers.utils.parseEther(amount.toString())
  )
  return await tx.wait()
}

export const transfer = async (wallet: string, amount: number) => {
  const tx = await MLTokenContract().transfer(
    wallet,
    ethers.utils.parseEther(amount.toString())
  )
  return await tx.wait()
}

export const claimStakingRewards = async (tokenId: any, owner: any) => {
  const tx = await MLTokenContract().claimStakingRewards(tokenId, {
    from: owner,
  })
  return await tx.wait()
}

export const burnLifeTokens = async (wallet: any, amount: any) => {
  const tx = await MLTokenContract().burnLifeTokens(ethers.utils.parseEther(amount.toString()), { from: wallet })
  return await tx.wait()
}

export const claimableStakingRewards = async (tokenId: any) => {
  return await MLTokenContract().claimableStakingRewards(tokenId)
}

export const setNftiToken = async (address: string) => {
  return await MLTokenContract().setNftiToken(address)
}
