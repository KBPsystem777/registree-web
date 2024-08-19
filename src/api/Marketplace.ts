import axios from "axios"

import { HOST_URI } from "../config"
import { generateToken } from "./Nft"

export const getMarketplaceItems = async () => {
  const wallet = localStorage.getItem("account")
  let token = localStorage.getItem("token")
  if (!token && wallet) {
    const tx = await generateToken(wallet)
    token = tx?.data?.data?.token?.key
  }

  if (token) {
    return axios({
      method: "GET",
      url: `${HOST_URI}/marketplace/items`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
  } else {
    return axios({
      method: "GET",
      url: `${HOST_URI}/marketplace/items`,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export const getMarketPlaceItemById = async (tokenId: any) => {
  return axios({
    method: "GET",
    url: `${HOST_URI}/marketplace/items/${tokenId}`,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const getMarketPlaceItemHistoryById = async (tokenId: any) => {
  const wallet = localStorage.getItem("account")
  let token = localStorage.getItem("token")
  if (!token && wallet) {
    const tx = await generateToken(wallet)
    token = tx?.data?.data?.token?.key
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/marketplace/items/${tokenId}/history`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const getMarketPlaceItemOffersById = async (tokenId: any) => {
  const wallet = localStorage.getItem("account")
  let token = localStorage.getItem("token")
  if (!token && wallet) {
    const tx = await generateToken(wallet)
    token = tx?.data?.data?.token?.key
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/marketplace/items/${tokenId}/offers`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const getMarketItemFullInfo = async (tokenId: string | number) => {
  const wallet = localStorage.getItem("account")
  let token = localStorage.getItem("token")
  if (!token && wallet) {
    const tx = await generateToken(wallet)
    token = tx?.data?.data?.token?.key
  }

  if (token) {
    return axios({
      method: "GET",
      url: `${HOST_URI}/marketplace/property/${tokenId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
  } else {
    return axios({
      method: "GET",
      url: `${HOST_URI}/marketplace/property/${tokenId}`,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
