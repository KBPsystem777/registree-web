import { useState } from "react"
import styled from "styled-components"
import * as mlStyle from "../../../MLStyles"
import { Breakpoint } from "../../../constants"
import { useDispatch, useSelector } from "react-redux"
import { useAlertContext } from "../../../hooks/AlertContext"
import {
  addTransCount,
  setLoadingTransferToken,
} from "../../../redux/web3Reducer"
import { transfer } from "../../../blockchain/actions/MLTokenAction"
import {useModalContext} from "../../../hooks/ModalContext";
import {errorCatcher} from "../../../utils/helpers";

export default function Transfer() {
  // @ts-ignore
  const { web3State } = useSelector((state) => state)
  const dispatch = useDispatch()
  // const alertContext: any = useAlertContext()
  const [transferAddress, setTransferAddress] = useState("")
  const [transferAmount, setTransferAmount] = useState(0)
  const [locked, setLocked] = useState(true)
  // @ts-ignore
  const {setLoadingMessage, setErrorMessage, setSuccessMessage} = useModalContext();

  function handleInputChange(e: any) {
    switch (e.target.name) {
      case "transferAddress":
        setTransferAddress(e.target.value)
        if (!e.target.value || transferAmount < 1) {
          setLocked(true)
        } else {
          setLocked(false)
        }
        break
      case "transferAmount":
        setTransferAmount(e.target.value)
        if (e.target.value < 1 || !transferAddress) {
          setLocked(true)
        } else {
          setLocked(false)
        }
        break
    }
  }

  async function handleTransferClick() {
    if (!web3State.account) {
      setErrorMessage('Authentication expired! Please re-login.');
      return
    }

    try {
      dispatch(setLoadingTransferToken(true))

      // let options = {
      //     contractAddress: ADDRESS,
      //     functionName: "transfer",
      //     abi: ABI,
      //     params: {
      //         to: transferAddress,
      //         amount: Moralis.Units.ETH(transferAmount)
      //     }
      // }
      // const tx = await Moralis.executeFunction(options);
      setLoadingMessage('Transferring token... transaction in process...');
      await transfer(transferAddress, transferAmount)
      dispatch(setLoadingTransferToken(false))
      setSuccessMessage('Transfer Token Successful!');
      //giving time to update the smart contract
      setTimeout(() => dispatch(addTransCount(1)), 5000)
    } catch (e) {
      setErrorMessage(errorCatcher(e));
      dispatch(setLoadingTransferToken(false))
    }
  }

  return (
    <Container>
      <Header>Transfer Tokens</Header>
      <Content>
        <Cell>
          <CellContent>
            <Row>
              <Label>Address:</Label>
              <Input
                type="text"
                name="transferAddress"
                w={25}
                value={transferAddress}
                onChange={handleInputChange}
              />
            </Row>
            <Row marginBottom={2}>
              <Label>Amount:</Label>
              <Input
                type="number"
                name="transferAmount"
                value={transferAmount}
                onChange={handleInputChange}
                disabled={web3State.loadingTransferToken ? true : false}
              />
            </Row>
            <Row>
              <Label>&nbsp;</Label>
              <BurnButton
                islocked={locked || web3State.loadingTransferToken}
                onClick={() =>
                  locked || web3State.loadingTransferToken
                    ? null
                    : handleTransferClick()
                }
              >
                TRANSFER
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
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
  padding-bottom: 1vh;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    flex-direction: column;
  }
`
const Cell = styled("div")<{ rightBorder?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.rightBorder ? "border-right: 1px solid rgb(0 0 0 / 0.1)" : ""};
`
const CellContent = styled("div")`
  display: flex;
  flex-direction: column;
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
const Label = styled.div`
  font-size: ${(props) => mlStyle.FONT_SIZE};
  width: calc(20% / 2);
  // padding: 0 1vw;
  // background: red;
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
`
