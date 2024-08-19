import axios from "axios"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import { USER_HOST_URI, AUTHORIZATION, HOST_URI, JWT_SECRET } from "../config"

export const clientAuthenticate = (username: string, password: string) => {
  return axios({
    method: "POST",
    url: `${USER_HOST_URI}/oauth/token?grant_type=password&access_type=web&username=${username}&password=${password}`,
    headers: {
      Authorization: AUTHORIZATION,
      "Content-Type": "application/json",
    },
  })
}

export const clientUserLookup = async (token: any) => {
  return axios({
    method: "GET",
    url: `${HOST_URI}/user/look-up/${token}`,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const clientUpdateWallet = (wallet: any, token: any) => {
  return axios({
    method: "PUT",
    url: `${HOST_URI}/user/wallet`,
    data: {
      walletAddress: wallet,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export const adminAuthenticate = async (wallet: any) => {
  const hash = await bcrypt.hash(wallet, "$2b$10$rmyNAGT/FCqSS660ptKPhu")

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/auth?hash=${hash}&walletAddress=${wallet}`,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export const getRole = async (token: any) => {
  return jwt.verify(token, JWT_SECRET?.toString())
}
