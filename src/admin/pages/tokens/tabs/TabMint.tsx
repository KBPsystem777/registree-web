import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { useDispatch } from "react-redux"
import { ethers } from "ethers"

import styled from "styled-components"
import dateFormat from "dateformat"

import {
  getTokenMintRecords,
  getTokenMintTransactions,
} from "../../../../api/Token"
import {
  dateDiff,
  errorCatcher,
  truncate,
  truncateText,
} from "../../../../utils/helpers"
import { logNftTransaction } from "../../../../api/Nft"
import { Breakpoint } from "../../../../constants"
import { mint } from "../../../../blockchain/actions/MLTokenAction"
import { addTransCount } from "../../../../redux/web3Reducer"
import { useModalContext } from "../../../../hooks/ModalContext"

import { useTokenStore } from "../../../../stores/token/useTokenStore"

import * as mlStyle from "../../../../MLStyles"

export default function TabMint() {
  const { account } = useWeb3React()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(true)
  const [mintAmount, setMintAmount] = useState(0)
  const [tokenMintRecords, setTokenMintRecords] = useState<any[]>([])
  const dispatch = useDispatch()
  // @ts-ignore
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    useModalContext()

  const { tokenDataLoading, mintTransactions, getMintTransactions } =
    useTokenStore()

  const isTokenLoading = useTokenStore((state) => state.tokenDataLoading)

  async function fetchData() {
    setLoading(true)
    try {
      const raw = await getTokenMintTransactions()
      setTransactions(raw?.data?.data?.transactions)

      const rawTokenMintRecords = await getTokenMintRecords()
      if (
        rawTokenMintRecords?.data?.data &&
        Array.isArray(rawTokenMintRecords?.data?.data)
      ) {
        setTokenMintRecords(rawTokenMintRecords.data.data)
      }
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      await fetchData()
    })()
    getMintTransactions()
    console.log("Fetched mints: ", mintTransactions)
    console.log("isLoadng: ", tokenDataLoading)
    console.log("isTokenLoading: ", isTokenLoading)
  }, [])

  function handleInputChange(e: any) {
    setMintAmount(e.target.value)
    if (!e.target.value || (e.target.value && e.target.value < 0.01)) {
      setLocked(true)
    } else {
      setLocked(false)
    }
  }

  async function handleMintClick() {
    try {
      if (account) {
        setLoadingMessage("Minting token...transaction in process...")
        const tx = await mint(mintAmount)
        await logNftTransaction(
          0,
          "mint",
          "minted",
          tx.transactionHash,
          tx.from,
          tx.to,
          ethers.utils.formatUnits(tx.gasUsed),
          mintAmount,
          tx.events,
          tx.logs,
          "",
          "token"
        )
        setSuccessMessage("Mint token success!")
        await fetchData()

        //giving time to update the smart contract
        setTimeout(() => dispatch(addTransCount(1)), 5000)
      }
    } catch (e) {
      setErrorMessage(errorCatcher(e))
      setLoading(false)
    }
  }

  return (
    <Container>
      <Left>
        <Header>Mint Tokens</Header>
        <Content padding={1.5}>
          <Row>
            <Label>Amount:</Label>
            <Input
              type="number"
              name="mintAmount"
              value={mintAmount}
              onChange={handleInputChange}
            />
          </Row>
          <Row marginTop={1}>
            <Label>&nbsp;</Label>
            <MintButton
              islocked={locked || loading}
              onClick={() => (locked || loading ? null : handleMintClick())}
            >
              {loading ? (
                <i className="fa fa-circle-o-notch fa-spin"></i>
              ) : null}
              {loading ? null : <span>Mint</span>}
            </MintButton>
          </Row>
        </Content>
      </Left>

      <Right>
        <Header>Transactions</Header>
        <Content>
          <RowHeader>
            <Cell wPct={25}>Txn Hash</Cell>
            <Cell wPct={16}>Amount</Cell>
            <Cell wPct={22}>From</Cell>
            <Cell wPct={22}>To</Cell>
            <Cell wPct={15}>TimeStamp</Cell>
          </RowHeader>
          {loading ? (
            <LoadingWrap>
              <i className="fa fa-circle-o-notch fa-spin"></i>
            </LoadingWrap>
          ) : (
            (tokenMintRecords || []).map((tran, i) => {
              return (
                <RowData key={i}>
                  <Cell wPct={25}>
                    {truncateText(tran.transaction_hash, 15)}
                  </Cell>
                  <Cell wPct={16}>
                    {ethers.utils.formatEther(tran.value.toString())}
                  </Cell>
                  <Cell wPct={22}>{truncate(tran.contract_address)}</Cell>
                  <Cell wPct={22}>{truncate(tran.to_wallet)}</Cell>
                  <Cell wPct={15}>
                    {dateDiff(
                      new Date(),
                      new Date(dateFormat(tran.block_timestamp, "yyyy-mm-dd"))
                    )}{" "}
                    days ago
                  </Cell>
                </RowData>
              )
            })
          )}
        </Content>
      </Right>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  column-gap: 1rem;
  margin-top: 2rem;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    flex-direction: column;
  }
`
const Left = styled.div`
  width: 30rem;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgb(0 0 0 / 0.1);
  border-left: 1px solid rgb(0 0 0 / 0.1);
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 0.3rem;
  overflow: hidden;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    width: 100%;
    margin-bottom: 1rem;
  }
`
const Right = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgb(0 0 0 / 0.1);
  border-left: 1px solid rgb(0 0 0 / 0.1);
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 0.3rem;
  overflow: hidden;
`

const Content = styled("div")<{ padding?: number }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${(props) => props.padding}rem;
`

const Row = styled("div")<{ marginTop?: number; marginBottom?: number }>`
  width: 100%;
  display: flex;
  // justify-content: center;
  flex-direction: row;
  align-items: center;
  margin-top: ${(props) => props.marginTop}rem;
  margin-bottom: ${(props) => props.marginBottom}rem;
`
const Text = styled("span")<{
  font?: string
  bold?: boolean
  color?: string
  size?: number
}>`
  font-family: ${(props) => props.font || "Poppins-Light"};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}rem;
`
const Label = styled.div`
<<<<<<< Updated upstream
  font-size: 0.9rem;
  // width: calc(20% / 2);
  width: 30%;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    // font-size: 10pt;
  }
`

const Input = styled("input")<{ w?: number }>`
  width: 100%;
  height: 2.4rem;
  outline: none;
  font-size: 0.9rem;
  border-radius: 0.3rem;
  border: 1px solid rgb(0 0 0 / 0.1);
  padding: 1rem;
`
const Header = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: #2a72a7;
  display: flex;
  align-items: center;
  color: #fff;
  font-family: Poppins-Medium;
  font-size: 0.9rem;
  font-weight: 400;
  padding-left: 1rem;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    // font-size: 12pt;
  }
`
const MintButton = styled("div")<{ isloading?: boolean; islocked?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14pt;
  font-weight: 200;
  letter-spacing: 1pt;
  background-color: #2a72a7;
  width: 100%;
  height: 2.5rem;
  cursor: ${(props) => (props.isloading ? "not-allowed" : "pointer")};
  color: #ffffff;
  border-radius: 0.3rem;
  cursor: ${(props) => (props.islocked ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.islocked ? 0.5 : 1)};
`
const RowHeader = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: rgb(0 0 0 / 0.1);
  display: flex;
  justify-content: space-between;
`
const Cell = styled("div")<{ header?: boolean; wPct?: number }>`
  width: ${(props) => props.wPct || 100}%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  font-family: ${(props) =>
    props.header ? "Poppins-Medium" : "Poppins-Light"};
  font-size: 0.8rem;
  font-weight: ${(props) => (props.header ? 500 : 200)};
  display: flex;
  align-items: center;
  padding-left: 1rem;
`
const RowData = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgb(0 0 0 / 0.1);
`
const LoadingWrap = styled.div`
  width: 100%;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
`
