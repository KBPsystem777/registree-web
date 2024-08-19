import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ethers } from "ethers"
import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"

import * as mlStyle from "../../../../MLStyles"
import { Breakpoint } from "../../../../constants"

import { useModalContext } from "../../../../hooks/ModalContext"

import {
  addTransCount,
  setLoadingBurnToken,
  setLoadingBurnTokenFrom,
} from "../../../../redux/web3Reducer"
import {
  burn,
  burnLifeTokens,
} from "../../../../blockchain/actions/MLTokenAction"
import {
  dateDiff,
  errorCatcher,
  truncate,
  truncateText,
} from "../../../../utils/helpers"
import {getTokenBurnRecords, getTokenBurnTransactions} from "../../../../api/Token"
import dateFormat from "dateformat"
import { logNftTransaction } from "../../../../api/Nft"

export default function TabBurn() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState(0)
  const [amountFrom, setAmountFrom] = useState(0)
  const [addressFrom, setAddressFrom] = useState("")
  const [locked, setLocked] = useState(true)
  const [lockedFrom, setLockedFrom] = useState(true)
  const [tokenBurnRecords, setTokenBurnRecords] = useState<any[]>([]);
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  // @ts-ignore
  const { web3State } = useSelector((state) => state)
  // @ts-ignore
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    useModalContext()

  async function fetchData() {
    setLoading(true);
    try {
      const raw = await getTokenBurnTransactions()
      setTransactions(raw?.data?.data?.transactions)

      const rawTokenBurnRecords = await getTokenBurnRecords();
      if (rawTokenBurnRecords?.data?.data && Array.isArray(rawTokenBurnRecords?.data?.data)) {
        setTokenBurnRecords(rawTokenBurnRecords.data.data);
      }
    } catch (e) {}
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    ;(async () => {
      await fetchData()
    })()
  }, [])

  function handleInputChange(e: any) {
    setAmount(e.target.value)
    if (e.target.value >= 100) {
      setLocked(false)
    } else {
      setLocked(true)
    }
  }

  function handleInputFromChange(e: any) {
    switch (e.target.name) {
      case "addressFrom":
        setAddressFrom(e.target.value)
        if (!e.target.value || amountFrom < 100) {
          setLockedFrom(true)
        } else {
          setLockedFrom(false)
        }
        break
      case "amountFrom":
        setAmountFrom(e.target.value)
        if (e.target.value < 100 || !addressFrom) {
          setLockedFrom(true)
        } else {
          setLockedFrom(false)
        }
        break
    }
  }

  async function handleBurnClick() {
    try {
      setLoadingMessage("Burning token...transaction in process...")
      dispatch(setLoadingBurnToken(true))
      await burn(amount)
      dispatch(setLoadingBurnToken(false))
      setSuccessMessage("Burn Token Successful!")

      //giving time to update the smart contract
      setTimeout(() => dispatch(addTransCount(1)), 5000)
    } catch (e) {
      setErrorMessage(errorCatcher(e))
      dispatch(setLoadingBurnToken(false))
    }
  }

  async function handleBurnFromClick() {
    // if (!web3State.account) {
    //     alertContext({type:'error', message: 'Authentication expired! Please re-login.'});
    //     return;
    // }

    try {
      if (account) {
        setLoadingMessage("BurningFrom token...transaction in process...")
        dispatch(setLoadingBurnTokenFrom(true))
        const tx = await burnLifeTokens(addressFrom, amountFrom)
        await logNftTransaction(
          0,
          "burn",
          "burned",
          tx.transactionHash,
          tx.from,
          tx.to,
          ethers.utils.formatUnits(tx.gasUsed),
          amountFrom,
          tx.events,
          tx.logs,
          "",
          "token"
        )
        dispatch(setLoadingBurnTokenFrom(false))
        setSuccessMessage("Burn From token success!")
        await fetchData()

        //giving time to update the smart contract
        setTimeout(() => dispatch(addTransCount(1)), 5000)
      }
    } catch (e) {
      setErrorMessage(errorCatcher(e))
      dispatch(setLoadingBurnTokenFrom(false))
    }
  }

  return (
    <Container>
      <Left>
        <Header>Burn Tokens</Header>
        <Content padding={1.5}>
          <Row marginBottom={0.5}>
            <Label>Address:</Label>
            <Input
              type="text"
              name="addressFrom"
              w={25}
              value={addressFrom}
              onChange={handleInputFromChange}
            />
          </Row>
          <Row marginBottom={1}>
            <Label>Amount:</Label>
            <Input
              type="number"
              name="amountFrom"
              value={amountFrom}
              onChange={handleInputFromChange}
              disabled={web3State.loadingBurnTokenFrom ? true : false}
            />
          </Row>
          <Row>
            <Label>&nbsp;</Label>
            <BurnButton
              islocked={lockedFrom || web3State.loadingBurnTokenFrom}
              onClick={() =>
                lockedFrom || web3State.loadingBurnTokenFrom
                  ? null
                  : handleBurnFromClick()
              }
            >
              Burn From
            </BurnButton>
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
          {
            loading ? (
              <LoadingWrap>
                <i className="fa fa-circle-o-notch fa-spin"></i>
              </LoadingWrap>
            ) : (
              (tokenBurnRecords || []).map((tran, i) => {
                return (
                  <RowData key={i}>
                    <Cell wPct={25}>{truncateText(tran.transaction_hash, 15)}</Cell>
                    <Cell wPct={16}>{ethers.utils.formatEther(tran.value.toString())}</Cell>
                    <Cell wPct={22}>{truncate(tran.from_wallet)}</Cell>
                    <Cell wPct={22}>{truncate(tran.contract_address)}</Cell>
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
            )
          }
          {/*{(tokenBurnRecords || []).map((tran, i) => {*/}
          {/*  return (*/}
          {/*    <RowData key={i}>*/}
          {/*      <Cell wPct={25}>{truncateText(tran.transactionHash, 15)}</Cell>*/}
          {/*      <Cell wPct={16}>{tran.value}</Cell>*/}
          {/*      <Cell wPct={22}>{truncate(tran.from)}</Cell>*/}
          {/*      <Cell wPct={22}>{truncate(tran.to)}</Cell>*/}
          {/*      <Cell wPct={15}>*/}
          {/*        {dateDiff(*/}
          {/*          new Date(),*/}
          {/*          new Date(dateFormat(tran.createdAt, "yyyy-mm-dd"))*/}
          {/*        )}{" "}*/}
          {/*        days ago*/}
          {/*      </Cell>*/}
          {/*    </RowData>*/}
          {/*  )*/}
          {/*})}*/}
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
const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgb(0 0 0 / 0.1);
  border-left: 1px solid rgb(0 0 0 / 0.1);
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 0.3rem;
  overflow: hidden;
  margin-top: 1rem;
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
const Left = styled.div`
  width: 40rem;
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
const CellHeader = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: rgb(0 0 0 / 0.1);
  display: flex;
  align-items: center;
  padding: 0 1rem;
  font-size: 0.9rem;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: 10pt;
  }
`
const CellContent = styled("div")`
  display: flex;
  flex-direction: column;
  // align-items: center;
  // padding: 1rem 1rem 1rem 1rem;
  padding: 1rem;
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
const Label = styled.div`
  font-size: 0.9rem;
  width: 30%;
  padding-right: 5%;
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
const BurnButton = styled("div")<{ isloading?: boolean; islocked?: boolean }>`
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
const ContentColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const RowHeader = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: rgb(0 0 0 / 0.1);
  display: flex;
  justify-content: space-between;
`
const RowData = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgb(0 0 0 / 0.1);
`
const CellTransaction = styled("div")<{ header?: boolean; wPct?: number }>`
  width: ${(props) => props.wPct || 100}%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  font-family: ${(props) =>
    props.header ? "Poppins-Medium" : "Poppins-Light"};
  font-size: 0.9rem;
  font-weight: ${(props) => (props.header ? 500 : 200)};
  display: flex;
  align-items: center;
  padding-left: 1rem;
`

const LoadingWrap = styled.div`
  width: 100%;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
`
