export type SettingsData = {
  percentageFee: string
  burningRate: string
  allowUserToTransact: boolean
  nft: {
    lifeTokenContractAddress: string
    marketplaceContractAddress: string
  }
  lifeToken: {
    nftContractAddress: string
  }
  marketplace: {
    nftContractAddress: string
  }
}
