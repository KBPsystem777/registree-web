import { create } from "zustand"

import { getTokenHolders, getTokenMintTransactions } from "../../api/Token"

type TokenStore = {
  tokenDataLoading: boolean
  tokenHoldersCount: number
  tokenHolderData: any
  mintTransactions: {}
  getTokenHoldersData: () => Promise<void>
  getMintTransactions: () => Promise<void>
}

export const useTokenStore = create<TokenStore>((set) => ({
  tokenDataLoading: false,
  tokenHoldersCount: 0,
  mintTransactions: [],
  tokenHolderData: {},
  getTokenHoldersData: async () => {
    set({ tokenDataLoading: true })
    try {
      const response = await getTokenHolders()
      set({
        tokenHolderData: response.data.records,
        tokenHoldersCount: response.data.records.count,
        tokenDataLoading: false,
      })
    } catch (error) {
      console.error(error)
    }
  },
  getMintTransactions: async () => {
    set({ tokenDataLoading: true })
    try {
      const response = await getTokenMintTransactions()
      set({
        mintTransactions: response.data?.data?.transactions,
        tokenDataLoading: false,
      })
    } catch (error) {
      console.error(error)
    }
  },
}))
