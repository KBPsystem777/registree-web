import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"

import {
  updateNftContractAddress,
  getSettingsData,
} from "../../../api/Settings"
import * as mlStyle from "../../../MLStyles"
import { Breakpoint } from "../../../constants"
import { useAlertContext } from "../../../hooks/AlertContext"
import { addTransCount } from "../../../redux/web3Reducer"
import { setNftiToken } from "../../../blockchain/actions/MLTokenAction"
import { SettingsData } from "./SettingsData.types"
import { useModalContext } from "../../../hooks/ModalContext"
import { errorCatcher } from "../../../utils/helpers"

export default function LifeContract() {
  // @ts-ignore
  const { web3State } = useSelector((state) => state)
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)
  const [settingsData, setSettingsData] = useState<SettingsData>()

  const [nftAddress, setNftAddress] = useState("")
  // @ts-ignore
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    useModalContext()

  const dispatch = useDispatch()
  // const alertContext: any = useAlertContext()

  const getAdminSettingsData = () => {
    getSettingsData().then((response) =>
      setSettingsData(response?.data?.data[0]?.setting)
    )
  }

  const updateNftContractSettings = async () => {
    const data = JSON.stringify({
      name: "admin-settings",
      setting: {
        percentageFee: settingsData?.percentageFee ?? "",
        burningRate: settingsData?.burningRate ?? "",
        allowUserToTransact: settingsData?.allowUserToTransact ?? false,
        lifeToken: {
          nftContractAddress: nftAddress,
        },
        marketplace: {
          nftContractAddress:
            settingsData?.marketplace?.nftContractAddress ?? "",
        },
        nft: {
          lifeTokenContractAddress:
            settingsData?.nft?.lifeTokenContractAddress ?? "",
          marketplaceContractAddress:
            settingsData?.nft?.marketplaceContractAddress,
        },
      },
    })

    updateNftContractAddress(data)
      .then((data) => console.log("Success!: ", data))
      .then(() => window.location.reload())
      .catch((error) => console.log("Error: ", error))
  }

  useEffect(() => {
    getAdminSettingsData()
  }, [])
  const updateNftAddress = async () => {
    if (!web3State.account) {
      setErrorMessage("Authentication expired! Please re-login.")
      return
    }

    try {
      setLoadingMessage("Contract updating... transaction in process...")
      setLoading(true)
      setLocked(true)
      await setNftiToken(nftAddress)
        .then(() => {
          updateNftContractSettings()
          setSuccessMessage("Contract Update has been Successful!")
          setLoading(false)
          setLocked(false)
        })
        .catch((error) => console.log("Error: ", error))

      // Giving time to update the smart contract
      setTimeout(() => dispatch(addTransCount(1)), 5000)
    } catch (e) {
      setErrorMessage(errorCatcher(e))
      setLoading(false)
    }
  }

  return (
    <Container>
      <Header>$LIFE Token Address</Header>
      <Content>
        <Cell>
          <CellContent>
            <Row>
              <Label>New NFT Address:</Label>
              <Input
                type="text"
                w={25}
                value={nftAddress}
                onChange={(e) => setNftAddress(e.target.value)}
                placeholder="Updated NFT contract address"
                required
              />
            </Row>
            <Row>
              <Label>&nbsp;</Label>
              <Button
                islocked={locked || loading}
                onClick={() => updateNftAddress()}
              >
                Update
              </Button>
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

const Button = styled("div")<{ isloading?: boolean; islocked?: boolean }>`
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
