import React, { useState } from "react"
import styled from "styled-components"
import * as mlStyle from "../../../MLStyles"
import { Breakpoint } from "../../../constants"
import { useAlertContext } from "../../../hooks/AlertContext"
import { useDispatch, useSelector } from "react-redux"
import {
  setLoadingBurnToken,
  setLoadingBurnTokenFrom,
  addTransCount,
} from "../../../redux/web3Reducer"
import { burn, burnLifeTokens } from "../../../blockchain/actions/MLTokenAction"
import { useModalContext } from "../../../hooks/ModalContext"
import { errorCatcher } from "../../../utils/helpers"

export default function Burn() {
  // @ts-ignore
  const { web3State } = useSelector((state) => state)
  const dispatch = useDispatch()
  // const alertContext: any = useAlertContext();
  const [amount, setAmount] = useState(0)
  const [amountFrom, setAmountFrom] = useState(0)
  const [addressFrom, setAddressFrom] = useState("")
  const [locked, setLocked] = useState(true)
  const [lockedFrom, setLockedFrom] = useState(true)
  // @ts-ignore
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    useModalContext()

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
    if (!web3State.account) {
      setErrorMessage("Authentication expired! Please re-login.")
      return
    }

    try {
      setLoadingMessage("Burning... transaction in process...")
      dispatch(setLoadingBurnToken(true))
      const tx = await burn(amount)
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
    if (!web3State.account) {
      setErrorMessage("Authentication expired! Please re-login.")
      return
    }

    try {
      setLoadingMessage("Burning From... transaction in process...")
      dispatch(setLoadingBurnTokenFrom(true))
      await burnLifeTokens(addressFrom, amount)
      dispatch(setLoadingBurnTokenFrom(false))
      setSuccessMessage("Burn From token Successful!")

      //giving time to update the smart contract
      setTimeout(() => dispatch(addTransCount(1)), 5000)
    } catch (e) {
      setErrorMessage(errorCatcher(e))
      dispatch(setLoadingBurnTokenFrom(false))
    }
  }

  return (
    <Container>
      <Header>Burn Tokens</Header>
      <Content>
        <Cell rightBorder>
          <CellHeader>Burn</CellHeader>
          <CellContent>
            <Row>
              <Label>Amount:</Label>
              <Input
                type="number"
                name="amount"
                value={amount}
                onChange={handleInputChange}
                disabled={web3State.loadingBurnToken ? true : false}
              />
            </Row>
            <Row>
              <Label>&nbsp;</Label>
              <BurnButton
                islocked={locked || web3State.loadingBurnToken}
                onClick={() =>
                  locked || web3State.loadingBurnToken
                    ? null
                    : handleBurnClick()
                }
              >
                BURN
              </BurnButton>
            </Row>
          </CellContent>
        </Cell>
        <Cell>
          <CellHeader>Burn From</CellHeader>
          <CellContent>
            <Row>
              <Label>Address:</Label>
              <Input
                type="text"
                name="addressFrom"
                w={25}
                value={addressFrom}
                onChange={handleInputFromChange}
              />
            </Row>
            <Row marginBottom={2}>
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
                BURN FROM
              </BurnButton>
            </Row>
          </CellContent>
        </Cell>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgb(0 0 0 / 0.1);
  border-left: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 0.3rem;
  overflow: hidden;
  margin-bottom: 1rem;
`

const Header = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: #2a72a7;
  display: flex;
  align-items: center;
  color: #fff;
  font-family: ${(props) => mlStyle.HEADER_FONT};
  font-size: ${(props) => mlStyle.HEADER_FONT_SIZE};
  font-weight: 400;
  padding-left: 1vw;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: 12pt;
  }
`
const Content = styled.div`
  // display: flex;
  // flex-direction: row;
  // align-items: center;
  // padding: 2rem;

  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
  padding-bottom: 1vh;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    flex-direction: column;
  }
`
const Input = styled("input")<{ w?: number }>`
  width: ${(props) => props.w || 12}vw;
  height: 2.4rem;
  outline: none;
  font-size: ${(props) => mlStyle.FONT_SIZE};
  border-radius: 0.3rem;
  border: 1px solid rgb(0 0 0 / 0.1);
  padding: 1vw;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: 10pt;
  }
`
const BurnButton = styled("div")<{ isloading?: boolean; islocked?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14pt;
  font-weight: 200;
  letter-spacing: 1pt;
  background-color: #2a72a7;
  width: 12rem;
  height: 2.5rem;
  cursor: ${(props) => (props.isloading ? "not-allowed" : "pointer")};
  color: #ffffff;
  border-radius: 0.3rem;
  cursor: ${(props) => (props.islocked ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.islocked ? 0.5 : 1)};
  // margin-left: 1vw;
`
const Cell = styled("div")<{ rightBorder?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.rightBorder ? "border-right: 1px solid rgb(0 0 0 / 0.1)" : ""};
`
const CellHeader = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: rgb(0 0 0 / 0.1);
  display: flex;
  align-items: center;
  padding: 0 1vw;
  font-size: ${(props) => mlStyle.FONT_SIZE};
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: 10pt;
  }
`
const CellContent = styled("div")`
  display: flex;
  flex-direction: column;
  // align-items: center;
  // padding: 1vw;
  padding: 1vw 1vw 0 1vw;
`
const Row = styled("div")<{ marginBottom?: number }>`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  display: flex;
  align-items: center;
  // margin-bottom: ${(props) => props.marginBottom || 0}vh;
  margin: 0.1rem 0;
`
const Label = styled.div`
  font-size: ${(props) => mlStyle.FONT_SIZE};
  width: 20%;
  // padding: 0 1vw;
  // background: red;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: 10pt;
  }
`
