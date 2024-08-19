import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"

import dateFormat from "dateformat"
import styled from "styled-components"

import { staking } from "../../../api/Nft"
import {
  burnNFTiTokens,
  claimNFTiStakingRewards,
  queryRewards,
} from "../../../blockchain/actions/MLInvestorsNFTAction"
import {
  claimableStakingRewards,
  claimStakingRewards,
  burnLifeTokens,
} from "../../../blockchain/actions/MLTokenAction"
import { useModalContext } from "../../../hooks/ModalContext"
import { errorCatcher } from "../../../utils/helpers"
import { logTransaction } from "../../../api/Token"

import WaveActivityIndicator from "../../../components/global/WaveActivityIndicator"
import LockedIcon from "../../../assets/images/locked.svg"

export default function TabRewards() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { account } = useWeb3React()
  // @ts-ignore
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    useModalContext()

  async function handleClaimClick(item: any) {
    if (account && item?.token_id) {
      try {
        setLoadingMessage("Claiming reward... transaction in process...")
        let txClaim, txBurn
        if (item.symbol.toLowerCase() === "nfti") {
          txClaim = await claimNFTiStakingRewards(item.token_id)
        } else {
          txClaim = await claimStakingRewards(item.token_id, account)
        }
        console.log(txClaim)
        const mintLog = {
          method: "mint",
          value: item.claimableStakingReward,
          transactionHash: txClaim.transactionHash,
          transactionIndex: txClaim.transactionIndex,
          confirmations: txClaim.confirmations,
          blockHash: txClaim.blockHash,
          blockNumber: txClaim.blockNumber,
          from: txClaim.from,
          to: txClaim.to,
          transactionStatus: txClaim.status,
          status: "minted",
          type: txClaim.type,
          events: txClaim.events,
          logs: txClaim.logs,
          category: item.symbol.toLowerCase(),
          claimInfo: {
            name: item.name,
            id: item.token_id,
            tokenIssuanceRate: item.lifeTokenIssuanceRate,
            dateStakedMs: (new Date().getTime() / 1000).toFixed(0),
            dateStaked: dateFormat(new Date(), "mmm d yyyy H:MM:ss"),
          },
        }

        await new Promise((resolve) => setTimeout(resolve, 3000))

        setLoadingMessage("Burning... transaction in process...")
        if (item.symbol.toLowerCase() === "nfti") {
          txBurn = await burnNFTiTokens(item?.token_id)
        } else {
          txBurn = await burnLifeTokens(
            item.claimableStakingReward * 0.06,
            item.token_id
          )
        }
        console.log(txBurn)
        const burnLog = {
          method: "burn",
          value: (item.claimableStakingReward * 6) / 100,
          transactionHash: txBurn.transactionHash,
          transactionIndex: txBurn.transactionIndex,
          confirmations: txBurn.confirmations,
          blockHash: txBurn.blockHash,
          blockNumber: txBurn.blockNumber,
          from: txBurn.from,
          to: txBurn.to,
          transactionStatus: txBurn.status,
          status: "burned",
          type: txBurn.type,
          events: txBurn.events,
          logs: txBurn.logs,
          category: item.symbol.toLowerCase(),
          claimInfo: {
            name: item.name,
            id: item.token_id,
            tokenIssuanceRate: item.lifeTokenIssuanceRate,
            dateStakedMs: (new Date().getTime() / 1000).toFixed(0),
            dateStaked: dateFormat(new Date(), "mmm d yyyy H:MM:ss"),
          },
        }

        await logTransaction(
          mintLog.method,
          mintLog.value,
          mintLog.transactionHash,
          mintLog.transactionIndex,
          mintLog.confirmations,
          mintLog.blockHash,
          mintLog.blockNumber,
          mintLog.from,
          mintLog.to,
          mintLog.transactionStatus,
          mintLog.status,
          mintLog.type,
          mintLog.events,
          mintLog.logs,
          mintLog.category,
          mintLog.claimInfo
        )

        await logTransaction(
          burnLog.method,
          burnLog.value,
          burnLog.transactionHash,
          burnLog.transactionIndex,
          burnLog.confirmations,
          burnLog.blockHash,
          burnLog.blockNumber,
          burnLog.from,
          burnLog.to,
          burnLog.transactionStatus,
          burnLog.status,
          burnLog.type,
          burnLog.events,
          burnLog.logs,
          burnLog.category,
          burnLog.claimInfo
        )

        await fetchData()
        setSuccessMessage(item.symbol + " rewards claimed!")
      } catch (e) {
        setErrorMessage(errorCatcher(e))
      }
    }
  }

  async function fetchData() {
    try {
      const raw = await staking()
      if (raw?.data?.data) {
        console.log(raw.data.data)
        const formattedItems = await Promise.all(
          raw.data.data.map(async (stake: any) => {
            let _claimable
            if (stake.symbol.toLowerCase() === "nfti") {
              _claimable = await queryRewards(stake.token_id)
            } else {
              _claimable = await claimableStakingRewards(stake.token_id)
            }
            if (_claimable) {
              return {
                ...stake,
                ...{
                  claimableStakingReward: ethers.utils.formatEther(
                    _claimable.toString()
                  ),
                },
              }
            }
          })
        )
        console.log(formattedItems)
        setItems(formattedItems)
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  useEffect(() => {
    setItems([])
    setLoading(true)
    setTimeout(async () => {
      await fetchData()
    }, 1000)
  }, [account])

  return (
    <Container>
      <Header>
        <HeaderCell w={15} paddingLeft={2}>
          {items && items.length > 0
            ? items[0].symbol.toLowerCase() === "nfti"
              ? "NFTi"
              : "MLife NFT"
            : "NFTi"}
        </HeaderCell>
        <HeaderCell w={15} center>
          Amount
        </HeaderCell>
        <HeaderCell w={20} center>
          Token Issuance Rate
        </HeaderCell>
        <HeaderCell w={15} center>
          Date Staked
        </HeaderCell>
        <HeaderCell w={20} center>
          Unlocks In
        </HeaderCell>
        <HeaderCell w={15}>&nbsp;</HeaderCell>
      </Header>
      <Content>
        {loading && <WaveActivityIndicator bg="lightgray" />}
        {items.map((item, i) => {
          return (
            <ClaimItem key={`rewards-item-${i}`}>
              <ClaimCell w={15}>
                {item?.name} - {item?.token_id}
              </ClaimCell>
              <ClaimCell w={15} center>
                {!isNaN(item?.claimableStakingReward)
                  ? Number(item?.claimableStakingReward).toLocaleString()
                  : 0}
              </ClaimCell>
              <ClaimCell w={20} center>
                {ethers.utils.formatEther(
                  (item?.lifeTokenIssuanceRate || "0").toString()
                )}
                %
              </ClaimCell>
              <ClaimCell w={15} center>
                {dateFormat(new Date(item?.last_metadata_sync), "mmm dd, yyyy")}
              </ClaimCell>
              <ClaimCell w={20} center>
                {dateFormat(
                  new Date(item?.last_token_uri_sync),
                  "mmm dd, yyyy"
                )}
              </ClaimCell>
              <ClaimCell w={15} flexEnd>
                <ButtonClaim onClick={() => handleClaimClick(item)} />
              </ClaimCell>
            </ClaimItem>
          )
        })}
      </Content>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 3vh;
`
const Header = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  background-color: #2d72a7;
  border-radius: 0.7rem;
`
const HeaderCell = styled("div") <{
  w?: number
  center?: boolean
  paddingLeft?: number
}>`
  width: ${(props) => props.w || 100}%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.center ? "center" : "flex-start")};
  padding-left: ${(props) => props.paddingLeft || 0}%;
  margin-right: 1px;
  font-family: Poppins-SemiBold;
  font-size: 0.9rem;
`
const Content = styled.div`
  width: 100%;
  margin-top: 1rem;
`
const ClaimItem = styled.div`
  width: 100%;
  height: 3.3rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 0.4rem;
  background: #fcfdff;
  display: flex;
  justify-content: center;
  padding: 0 1%;
`
const ClaimCell = styled("div") <{
  w?: number
  center?: boolean
  paddingLeft?: number
  flexStart?: boolean
  flexEnd?: boolean
}>`
  width: ${(props) => props.w || 100}%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.center
      ? "center"
      : props.flexStart
        ? "flex-start"
        : props.flexEnd
          ? "flex-end"
          : "flex-start"};
  padding-left: ${(props) => props.paddingLeft || 0}%;
  font-size: 0.9rem;
`
const ButtonClaim = styled.div`
  width: 8rem;
  height: 2.2rem;
  background-color: #2d72a7;
  border-radius: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:after {
    content: "Claim";
    color: #ffffff;
  }
  &:hover {
    opacity: 0.9;
  }
`
const ButtonLocked = styled.div`
  width: 8rem;
  height: 2.3rem;
  background-color: #2d72a7;
  border-radius: 0.3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  &:before {
    content: "";
    width: 2.3rem;
    height: 2.3rem;
    display: inline-block;
    background-image: url(${(props) => LockedIcon});
    background-repeat: no-repeat;
    background-size: 50%;
    background-position: center;
  }
  &:after {
    content: "Locked";
    color: #ffffff;
    width: 50%;
  }
`
