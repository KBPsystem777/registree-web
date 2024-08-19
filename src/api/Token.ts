import axios from "axios"

import { ADDRESS } from "../blockchain/abi/MLLifeToken"
import { API_KEY, CHAIN, HOST_URI } from "../config"
import { generateToken } from "./Nft"

export const getERC20ContractTransfers = () => {
  return axios({
    method: "GET",
    url: `https://deep-index.moralis.io/api/v2/erc20/${ADDRESS}/transfers?chain=${CHAIN}`,
    headers: {
      Accept: "application/json",
      "X-API-Key": API_KEY,
    },
  })
}

export const logTokenTransactions = async (params: any) => {
  const token = localStorage.getItem("token")

  return axios({
    method: "POST",
    url: `${HOST_URI}/tokens/transactions`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const getAllTokenTransactions = async () => {
  const token = localStorage.getItem("token")

  return axios({
    method: "GET",
    url: `${HOST_URI}/tokens/transactions/10/0`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const getTokenMintTransactions = async () => {
  const token = localStorage.getItem("token")

  return axios({
    method: "GET",
    url: `${HOST_URI}/transactions/token/0/0/0?type=mint`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const getTokenBurnTransactions = async () => {
  const token = localStorage.getItem("token")

  return axios({
    method: "GET",
    url: `${HOST_URI}/transactions/token/0/0/0?type=burn`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const getTokenTransferTransactions = async () => {
  const token = localStorage.getItem("token")

  return axios({
    method: "GET",
    url: `${HOST_URI}/transactions/token/0/0/0?type=transfer`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const logTransaction = async (
  method: string,
  value: any,
  transactionHash: string,
  transactionIndex: any,
  confirmations: any,
  blockHash: any,
  blockNumber: any,
  from: any,
  to: any,
  transactionStatus: any,
  status: string,
  type: string,
  events: any,
  logs: any,
  category: string,
  claimInfo: any
) => {
  const wallet = localStorage.getItem("account")
  let token = localStorage.getItem("token")
  if (!token) {
    const tx = await generateToken(wallet)
    token = tx?.data?.data?.token?.key
  }

  const params = {
    method: method,
    value: Number(value),
    transactionHash: transactionHash,
    transactionIndex: transactionIndex,
    confirmations: confirmations,
    blockHash: blockHash,
    blockNumber: blockNumber,
    from: from,
    to: to,
    transactionStatus: transactionStatus,
    status: status,
    type: type,
    events: events,
    logs: logs,
    category: category,
    claimInfo: claimInfo,
  }
  console.log(params)

  return axios({
    method: "POST",
    url: `${HOST_URI}/transactions/token`,
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const getTokenHolders = () => {
  const token = localStorage.getItem("token")

  return axios({
    method: "GET",
    url: `${HOST_URI}/tokens/holders`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const getTokenBurnRecords = () => {
  const token = localStorage.getItem("token")

  return axios({
    method: "GET",
    url: `${HOST_URI}/tokens/burns`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const getTokenMintRecords = () => {
  const token = localStorage.getItem("token")

  return axios({
    method: "GET",
    url: `${HOST_URI}/tokens/mints`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const getTokenTransfers = () => {
  const token = localStorage.getItem("token")

  return axios({
    method: "GET",
    url: `${HOST_URI}/tokens/transfers`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}