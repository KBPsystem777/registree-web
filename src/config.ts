require("dotenv").config()

const env = process.env.REACT_APP_ENV?.toString() ?? ""

// API host endpoint
export const REACT_APP_API_HOST_PROD = "https://mlnft.managelifeapi.co/api/v1"
export const REACT_APP_API_HOST_STAGING =
  "https://mlnft.managelifeapi.co/api/v1"

export const SERVER_URL = "https://pznnvxkqusqe.usemoralis.com:2053/server"
export const APP_ID = process.env.REACT_APP_ID?.toString() ?? ""
export const MORALIS_API_URI = "https://deep-index.moralis.io/api/v2"
export const CHAIN = env === "staging" ? "goerli" : "eth"

export const API_KEY = process.env.REACT_APP_MORALIS_API_KEY?.toString() ?? ""

export const HOST_URI_PHOTO = "https://int.managelifeapi.co"
export const HOST_URI =
  env === "staging" ? REACT_APP_API_HOST_STAGING : REACT_APP_API_HOST_PROD
export const ADMIN_WALLET =
  env === "staging"
    ? process.env.REACT_APP_DEV_WALLET_ADDRESS
    : process.env.REACT_APP_ADMIN_WALLET_ADDRESS

export const WALLET_SECRET = process.env.REACT_APP_WALLET_SECRET
export const USER_HOST_URI = "https://int.managelifeapi.co"
export const AUTHORIZATION =
  process.env.REACT_APP_AUTHORIZATION?.toString() ?? ""

export const CLIENT_DIR = "/user"
export const JWT_SECRET = process.env.REACT_APP_JWT_SECRET?.toString() ?? ""
export const TEMP_SETTING_TOKEN = process.env.REACT_APP_TEMP_SETTING_TOKEN
export const IPFS_URI = "https://ipfs.moralis.io:2053/ipfs"
