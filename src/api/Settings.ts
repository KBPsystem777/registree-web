import axios from "axios"

import { HOST_URI } from "../config"

const SETTINGS_API_URL = `${HOST_URI}/settings`

const jwt = localStorage.getItem("admin_token")

export const getMarketplaceItems = async () => {
  const token = localStorage.getItem("token")

  return axios({
    method: "GET",
    url: `${HOST_URI}/settings`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const postMarketplaceItems = async () => {
  const token = localStorage.getItem("token")

  return axios({
    method: "POST",
    url: `${HOST_URI}/settings`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const updateNftContractAddress = async (data: any) => {
  return axios({
    method: "POST",
    url: SETTINGS_API_URL,
    data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
}

export const updateLifeTokenAddress = async (data: string) => {
  return axios({
    method: "POST",
    url: SETTINGS_API_URL,
    data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
}

export const updateMarketplaceContractAddress = async (data: string) => {
  return axios({
    method: "POST",
    url: SETTINGS_API_URL,
    data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  })
}

export const getSettingsData = async () => {
  return axios({
    method: "GET",
    url: SETTINGS_API_URL,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  })
}
