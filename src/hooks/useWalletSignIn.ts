import { Web3Provider } from "@ethersproject/providers"
import { ethers } from "ethers"

import CoinbaseWalletProvider from "@coinbase/wallet-sdk"
import Web3Modal from "web3modal"

const modalProvider = {
  cacheProvider: true,
  providerOptions: {
    coinbasewallet: {
      package: CoinbaseWalletProvider,
      options: {
        rpc: {
          1: "https://mainnet.infura.io/v3/4eae9f49c31a4e01b1674dfcfe42d400",
        },
      },
    },
  },
}

export const useWalletSignIn = () => {
  async function signIn(
    setMetaMaskAccount: ((arg0: string) => void) | undefined,
    setMetaMaskChainId: ((arg0: number) => void) | undefined,
    setMetaMaskProvider: ((arg0: Web3Provider) => void) | any,
    setMetaMaskWeb3Modal: ((arg0: any) => void) | undefined
  ) {
    try {
      const newWeb3Modal = new Web3Modal(modalProvider)

      const connection = await newWeb3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)

      if (provider) {
        if (setMetaMaskChainId) {
          const network = await provider.getNetwork()
          // @ts-ignore
          setMetaMaskChainId(network.chainId)
          console.log("Network Initial", network.chainId)
        }

        if (setMetaMaskProvider) {
          setMetaMaskProvider(provider)
        }
        if (setMetaMaskWeb3Modal) {
          // setMetaMaskWeb3Modal(connection);
          setMetaMaskWeb3Modal(newWeb3Modal)
        }
      }

      const accs = await provider.listAccounts()
      if (setMetaMaskAccount) {
        setMetaMaskAccount(accs[0])
      }
      console.log("Account Initial:", accs[0])

      connection.on("accountsChanged", async (accounts: string[]) => {
        if (setMetaMaskAccount) {
          setMetaMaskAccount(accounts[0])
        }
        console.log("Account:", accounts[0])
      })

      connection.on("networkChanged", async (netId: number) => {
        if (setMetaMaskChainId) {
          setMetaMaskChainId(netId)
        }
        console.log("Network", netId)
      })

      connection.on("chainChanged", async (netId: number) => {
        if (setMetaMaskChainId) {
          setMetaMaskChainId(netId)
        }
        console.log("Network", netId)
      })
    } catch (e) {}
  }

  return { signIn }
}
