import { createSlice } from "@reduxjs/toolkit"

require("dotenv").config()

const NETWORK = [Number(process.env.REACT_APP_NETWORK_ID)]
const initialState = {
  allowedNetworks: NETWORK,
  isNetworkValid: false,
  account: "",
  chainId: 0,
  provider: null,
  web3Modal: null,
  totalSupply: 0,
  name: process.env.REACT_APP_NETWORK_NAME ?? "",
  symbol: process.env.REACT_APP_REACT_APP_SYMBOL ?? "",
  transCount: 0,
  loadingBurnToken: false,
  loadingBurnTokenFrom: false,
  loadingTransferToken: false,
  fromLogin: false,
  tokenExpired: false,
  triggerRefresh: false,
}

export const web3Slice = createSlice({
  name: "blockchain",
  initialState: initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload
    },
    setChainId: (state, action) => {
      state.chainId = action.payload
    },
    setProvider: (state, action) => {
      state.provider = action.payload
    },
    setNetworkValid: (state, action) => {
      state.isNetworkValid = action.payload
    },
    setWeb3Modal: (state, action) => {
      state.web3Modal = action.payload
    },
    setTotalSupply: (state, action) => {
      state.totalSupply = action.payload
    },
    setName: (state, action) => {
      state.name = action.payload
    },
    setSymbol: (state, action) => {
      state.symbol = action.payload
    },
    addTransCount: (state, action) => {
      state.transCount = state.transCount + action.payload
    },
    setLoadingBurnToken: (state, action) => {
      state.loadingBurnToken = action.payload
    },
    setLoadingBurnTokenFrom: (state, action) => {
      state.loadingBurnTokenFrom = action.payload
    },
    setLoadingTransferToken: (state, action) => {
      state.loadingTransferToken = action.payload
    },
    setFromLogin: (state, action) => {
      state.fromLogin = action.payload
    },
    setTokenExpired: (state, action) => {
      state.tokenExpired = action.payload
    },
    setTriggerRefresh: (state, action) => {
      state.triggerRefresh = action.payload
    },
  },
})

export const {
  setAccount,
  setChainId,
  setProvider,
  setWeb3Modal,
  setNetworkValid,
  setTotalSupply,
  setName,
  setSymbol,
  addTransCount,
  setLoadingBurnToken,
  setLoadingBurnTokenFrom,
  setLoadingTransferToken,
  setFromLogin,
  setTokenExpired,
  setTriggerRefresh,
} = web3Slice.actions

export default web3Slice.reducer
