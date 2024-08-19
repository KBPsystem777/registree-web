import { ethers } from "ethers"

import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { WalletLinkConnector } from "@web3-react/walletlink-connector"

import * as MLToken from "./abi/MLLifeToken"
import * as MLNft from "./abi/MLNft"
import * as MLMarketPlace from "./abi/MLMarketplace"
import * as MLNFTi from "./abi/ManageLifeInvestorsNFT"
import * as MLNFTiMarketplace from "./abi/MLInvestorsMarketplace"

let provider: any = null

declare let window: any

export const setContractProvider = (_provider: any) => {
  provider = _provider
}

export const MLTokenContract = () => {
  const signer = provider.getSigner()
  return new ethers.Contract(MLToken.ADDRESS, MLToken.ABI, signer)
}

export const MLNftContract = () => {
  const signer = provider.getSigner()
  return new ethers.Contract(MLNft.ADDRESS, MLNft.ABI, signer)
}

export const MLMarketplaceContract = () => {
  const signer = provider.getSigner()
  return new ethers.Contract(MLMarketPlace.ADDRESS, MLMarketPlace.ABI, signer)
}

export const MLInvestorsMarketplace = () => {
  // Check if window.ethereum object is available
  if (!window.ethereum) {
    console.log(
      "Web3 provider (MetaMask) is not available. Please install MetaMask or use a compatible Web3-enabled browser."
    )
  }

  try {
    const nftiMarketplaceProvider = new ethers.providers.Web3Provider(
      window.ethereum
    )
    const nftiMarketplacesSigner = nftiMarketplaceProvider.getSigner()
    return new ethers.Contract(
      MLNFTiMarketplace.ADDRESS,
      MLNFTiMarketplace.ABI,
      nftiMarketplacesSigner
    )
  } catch (error) {
    console.log(
      "Failed to create the NFTi Marketplace contract instance. Make sure you have a Web3 provider (MetaMask) with access to the MLNFTi Marketplace contract."
    )
  }
}
export const MLNFTIContract = () => {
  // Check if window.ethereum object is available
  if (!window.ethereum) {
    console.log(
      "Web3 provider (MetaMask) is not available. Please install MetaMask or use a compatible Web3-enabled browser."
    )
  }

  try {
    const nftiProvider = new ethers.providers.Web3Provider(window.ethereum)
    const nftiSigner = nftiProvider.getSigner()
    return new ethers.Contract(MLNFTi.ADDRESS, MLNFTi.ABI, nftiSigner)
  } catch (error) {
    console.log(
      "Failed to create the NFTi contract instance. Make sure you have a Web3 provider (MetaMask) with access to the MLNFTi contract."
    )
  }
}

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
})

const walletconnect = new WalletConnectConnector({
  // @ts-ignore
  rpcUrl: "https://mainnet.infura.io/v3/4eae9f49c31a4e01b1674dfcfe42d400",
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
})

const walletlink = new WalletLinkConnector({
  url: "https://mainnet.infura.io/v3/4eae9f49c31a4e01b1674dfcfe42d400",
  appName: "managelife-web3",
})

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink,
}
