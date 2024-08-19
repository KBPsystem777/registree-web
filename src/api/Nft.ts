import axios from "axios";
import { ethers } from "ethers";

import { ADDRESS } from "../blockchain/abi/MLNft";
import {
  API_KEY,
  CHAIN,
  HOST_URI,
  WALLET_SECRET,
  MORALIS_API_URI,
} from "../config";

const ADMIN_WALLET_ADDRESS = "0x81178579113da63EfA5C22f6CC21dFD3C2388735";

export const getAllMemberNFTs = async () => {
  const wallet = localStorage.getItem("account");
  let token = localStorage.getItem("token");
  if (!token) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/nfts`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getAllNFTIs = async () => {
  const wallet = localStorage.getItem("account");
  let token = localStorage.getItem("token");
  if (!token) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/nfts/nfti`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getNftInfo = async (tokenId: any) => {
  const wallet = localStorage.getItem("account");
  let token = localStorage.getItem("token");
  if (!token) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/nfts/info/${tokenId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getNftOffers = async (tokenId: any) => {
  const token = localStorage.getItem("token");

  return axios({
    method: "GET",
    url: `${HOST_URI}/nfts/offers/${tokenId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getNftTransactionsById = async (wallet: any, tokenId: any) => {
  let token = localStorage.getItem("token");
  // if (!token) {
  //     const tx = await generateToken(wallet);
  //     token = tx?.data?.data?.token?.key;
  // }

  return axios({
    method: "GET",
    url: `${HOST_URI}/nfts/transactions/${tokenId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const logNftTransaction = async (
  tokenId: any,
  type: string,
  status: string,
  transactionHash: string,
  from: any,
  to: any,
  transactionFee: any,
  minSalePrice: any,
  events: any,
  logs: any,
  bidId: any,
  category: any,
  lifeTokenIssuanceRate?: any
) => {
  const wallet = localStorage.getItem("account");
  let token = localStorage.getItem("token");
  if (!token) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  const params = {
    id: tokenId,
    type: type, //"offer" "bid",
    status: status, //"offered" "bidEntered",
    transactionHash: transactionHash,
    transactionStatus: "success",
    from: from,
    to: to,
    transactionFee: transactionFee,
    transactionFeeSymbol: "ETH",
    minSalePrice: minSalePrice,
    events: events,
    logs: logs,
    bidId: bidId,
    category: category,
    lifeTokenIssuanceRate: lifeTokenIssuanceRate || 0,
  };

  console.log(params);

  return axios({
    method: "POST",
    url: `${HOST_URI}/transactions`,
    data: params,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getListOfWallet = () => {
  let token = localStorage.getItem("token");

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/list`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getAllTokenIds = (contractAddress?: any) => {
  const addr = contractAddress || ADDRESS;
  return axios({
    method: "GET",
    url: `${MORALIS_API_URI}/nft/${addr}?chain=${CHAIN}&format=decimal`,
    headers: {
      Accept: "application/json",
      "X-API-Key": API_KEY,
    },
  });
};

export const getMoralisNftsByWallet = (wallet: any) => {
  return axios({
    method: "GET",
    url: `${MORALIS_API_URI}/${wallet}/nft`,
    params: { chain: CHAIN, format: "decimal" },
    headers: {
      Accept: "application/json",
      "X-API-Key": API_KEY,
    },
  });
};

export const getMoralisNftMetadata = (contractAddress: any, tokenId: any) => {
  return axios({
    method: "GET",
    url: `${MORALIS_API_URI}/nft/${contractAddress}/${tokenId}`,
    params: { chain: CHAIN, format: "decimal" },
    headers: {
      Accept: "application/json",
      "X-API-Key": API_KEY,
    },
  });
};

export const getNFTMetadata = async (contractAddress: any, tokenId: any) => {
  const addr = contractAddress || ADDRESS;

  const wallet = localStorage.getItem("account");

  let token = localStorage.getItem("token");
  if (!token) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  let raw = await axios({
    method: "GET",
    url: `${HOST_URI}/properties/${tokenId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return raw?.data?.data;

  // raw = await axios({
  //     method: 'GET',
  //     url: `${MORALIS_API_URI}/nft/${addr}/${tokenId}?chain=${CHAIN}&format=decimal`,
  //     headers: {
  //         'Accept': 'application/json',
  //         'X-API-Key': API_KEY
  //     }
  // });
};

export const generateToken = async (wallet: any) => {
  return axios({
    method: "GET",
    url: `${HOST_URI}/user/auth?hash=${WALLET_SECRET}&walletAddress=${wallet}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getAdminNftCollections = async () => {
  const tx = await generateToken(ADMIN_WALLET_ADDRESS);
  const token = tx?.data?.data?.token?.key;

  const rawCollections = await axios({
    method: "GET",
    url: `${HOST_URI}/nfts/collections/${ADMIN_WALLET_ADDRESS}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const collections = [];

  if (rawCollections?.data.data) {
    for (let i = 0; i < rawCollections.data.data.length; i++) {
      const c = rawCollections.data.data[i];
      const nfts = await getAllTokenIds(c.token_address);
      if (
        nfts &&
        nfts?.data?.result &&
        Array.isArray(nfts?.data?.result) &&
        nfts?.data?.result.length > 0
      ) {
        const nft = nfts.data.result[0];
        const metadata = JSON.parse(nft?.metadata || "{}");
        if (metadata) {
          const _image = metadata.image.includes("ipfs://")
            ? `https://ipfs.io/ipfs/${metadata.image.replace("ipfs://", "")}`
            : metadata.image;
          collections.push({
            name: nft.name,
            image: _image,
            address: c.token_address,
          });
        }
      }
    }
  }

  return collections;
};

export const placeBidApi = async (
  tokenId: any,
  wallet: string,
  price: number,
  txHash: string
) => {
  const tx = await generateToken(wallet);
  const token = tx?.data?.data?.token?.key;

  return axios({
    method: "POST",
    url: `${HOST_URI}/transactions`,
    data: {
      id: tokenId,
      fromWallet: wallet,
      type: "bid",
      minSalePrice: price,
      status: "bidEntered",
      transactionHash: txHash,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const acceptBidApi = async (
  tokenId: any,
  fromWallet: string,
  toWallet: string,
  gasFee: any,
  txHash: string
) => {
  const token = localStorage.getItem("token");
  const transFee = ethers.utils.formatUnits(gasFee);

  return axios({
    method: "PUT",
    url: `${HOST_URI}/transactions`,
    data: {
      id: tokenId,
      type: "bid",
      status: "bidAwarded",
      hasNFT: true,
      transactionHash: txHash,
      transactionStatus: "Success",
      fromWallet: fromWallet,
      toWallet: toWallet,
      transactionFee: transFee,
      transactionFeeSymbol: "ETH",
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getAllRequests = async () => {
  const token = localStorage.getItem("token");

  return axios({
    method: "GET",
    url: `${HOST_URI}/marketplace/requests`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getAllMarketPlaceItems = async () => {
  const token = localStorage.getItem("token");

  return axios({
    method: "GET",
    url: `${HOST_URI}/marketplace/items`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getMarketPlaceItemById = async (tokenId: any) => {
  const token = localStorage.getItem("token");

  return axios({
    method: "GET",
    url: `${HOST_URI}/marketplace/items/${tokenId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getUserNftOffered = async (wallet: string) => {
  const tx = await generateToken(wallet);
  const token = tx?.data?.data?.token?.key;

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/nfts/offered`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getUserNftFavorited = async (wallet: string) => {
  const tx = await generateToken(wallet);
  const token = tx?.data?.data?.token?.key;

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/nfts/favorited`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getUserActivities = async (wallet: string) => {
  const tx = await generateToken(wallet);
  const token = tx?.data?.data?.token?.key;

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/activites`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getUserNftStaking = async (wallet: string) => {
  const tx = await generateToken(wallet);
  const token = tx?.data?.data?.token?.key;

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/rewards`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const logUserTransaction = async (wallet: string) => {
  const tx = await generateToken(wallet);
  const token = tx?.data?.data?.token?.key;

  return axios({
    method: "POST",
    url: `${HOST_URI}/transactions`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getAllApproved = async () => {
  const token = localStorage.getItem("token");

  return axios({
    method: "GET",
    url: `${HOST_URI}/marketplace/items`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getAllDenied = async () => {
  const token = localStorage.getItem("token");

  return axios({
    method: "GET",
    url: `https://ml-api-dev.herokuapp.com/api/v1/marketplace/denied`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getUserNft = async (wallet: any) => {};

export const getNftByWallet = async (_wallet?: any) => {
  const wallet = _wallet || localStorage.getItem("account");
  let token = localStorage.getItem("token");
  if (!token && wallet) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/nfts/wallet/${wallet}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getNftInfoById = async (tokenId: any, _wallet?: any) => {
  const wallet = localStorage.getItem("account") || _wallet;
  let token = localStorage.getItem("token");
  if (!token && wallet) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/nfts/info/${tokenId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getNftFavorited = async () => {
  const wallet = localStorage.getItem("account");
  let token = localStorage.getItem("token");
  if (!token && wallet) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/nfts/favorites`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const saveNftFavorited = async (params: any) => {
  const wallet = localStorage.getItem("account");
  let token = localStorage.getItem("token");
  if (!token && wallet) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  return axios({
    method: "PUT",
    data: params,
    url: `${HOST_URI}/user/nfts/favorites`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getUserNftOffersFromAdmin = async () => {
  const wallet = localStorage.getItem("account");
  let token = localStorage.getItem("token");
  if (!token && wallet) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/nfts/offers`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
export const getNftOffered = async () => {
  const wallet = localStorage.getItem("account");
  let token = localStorage.getItem("token");
  if (!token && wallet) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/nfts/offered`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getNftBids = async () => {
  const wallet = localStorage.getItem("account");
  let token = localStorage.getItem("token");
  if (!token && wallet) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/user/nfts/bids`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const staking = async () => {
  const wallet = localStorage.getItem("account");
  let token = localStorage.getItem("token");
  if (!token && wallet) {
    const tx = await generateToken(wallet);
    token = tx?.data?.data?.token?.key;
  }

  return axios({
    method: "GET",
    url: `${HOST_URI}/staking`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getRewardsHistory = (wallet: any) => {
  const token = localStorage.getItem("token");

  return axios({
    method: "GET",
    url: `${HOST_URI}/tokens/rewards?${wallet}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
