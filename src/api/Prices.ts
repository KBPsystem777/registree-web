import axios from "axios"

export const fetchETHPrice = async () => {
  return axios({
    method: "GET",
    url: "https://min-api.cryptocompare.com/data/price",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      fsym: "ETH",
      tsyms: "USD",
    },
  })
}
