import { useEffect, useState } from "react"
import styled from "styled-components"
import Base from "./TransactionModalBase"
import { getListOfWallet, logNftTransaction } from "../../api/Nft"
import { transfer } from "../../blockchain/actions/MLNftAction"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { useModalContext } from "../../hooks/ModalContext"
import { errorCatcher } from "../../utils/helpers"
import { issueNftToInvestor } from "../../blockchain/actions/MLInvestorsNFTAction"

export default function Transfer({ nft, closeModal, isNFTi }: any) {
  const [loading, setLoading] = useState(false)
  const [wallets, setWallets] = useState<any[]>([])
  const [selectedWallet, setSelectedWallet] = useState("")
  const [tokenIssuanceRate, setTokenIssuanceRate] = useState(0)
  const { account } = useWeb3React()
  // @ts-ignore
  const { setErrorMessage, setSuccessMessage } = useModalContext()

  function handleWalletChange(e: any) {
    setSelectedWallet(e.target.value)
  }

  function handleTokenIssuanceRateChange(e: any) {
    setTokenIssuanceRate(e.target.value)
  }

  async function handleTransferClick() {
    try {
      if (account && selectedWallet) {
        let tx
        setLoading(true)
        if (nft.symbol && nft?.symbol === "MLifeNFTi") {
          //investor nft
          tx = await issueNftToInvestor(
            selectedWallet,
            nft.token_id || nft.tokenId,
            tokenIssuanceRate
          )
          if (tx) {
            const res = await logNftTransaction(
              nft?.token_id || nft?.tokenId,
              "transfer",
              "transferred",
              tx.transactionHash,
              tx.from,
              selectedWallet,
              ethers.utils.formatUnits(tx.gasUsed),
              0,
              tx.events,
              tx.logs,
              "",
              "nfti",
              tokenIssuanceRate
            )
            console.log(res)
            setSuccessMessage("Transfer investor's NFT success.")
          } else {
            setErrorMessage("Transfer investor's NFT failed.")
          }
        } else {
          tx = await transfer(
            account,
            selectedWallet,
            nft.property_id || nft.propertyId
          )
          if (tx) {
            const res = await logNftTransaction(
              nft.property_id || nft.propertyId,
              "transfer",
              "transferred",
              tx.transactionHash,
              tx.from,
              selectedWallet,
              ethers.utils.formatUnits(tx.gasUsed),
              0,
              tx.events,
              tx.logs,
              "",
              "nft"
            )
            console.log(res)
            setSuccessMessage("Transfer NFT success.")
          } else {
            setErrorMessage("Transfer NFT failed.")
          }
        }

        setLoading(false)
        closeModal()
      }
    } catch (e) {
      setErrorMessage(errorCatcher(e))
      setLoading(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const raw = await getListOfWallet()
        if (raw?.data?.data) {
          setWallets(raw.data.data)
        }
      } catch (e) {}
    })()
  }, [])

  return (
    <Base
      title="Transfer NFT"
      inProcess={loading}
      close={() => (loading ? null : closeModal())}
    >
      {nft?.symbol === "MLifeNFTi" && (
        <Col>
          <Col marginTop={2}>
            <Text font="Poppins-Regular">Token ID</Text>
          </Col>
          <Col marginTop={0.5}>
            <Input readOnly type="text" value={nft?.token_id || nft?.tokenId} />
          </Col>
        </Col>
      )}
      <Col marginTop={2}>
        <Text font="Poppins-Regular">Wallet Address</Text>
      </Col>
      <Col marginTop={0.5}>
        <DDWallet
          disabled={loading}
          value={selectedWallet}
          onChange={(e) => (loading ? null : handleWalletChange(e))}
        >
          <option value="">Select Wallet</option>
          {wallets.map((w, i) => (
            <option key={i} value={w.walletAddress || 0x00}>
              {w.firstName}&nbsp;{w.lastName}&nbsp;-&nbsp;{w.walletAddress}
            </option>
          ))}
        </DDWallet>
      </Col>
      {nft?.symbol === "MLifeNFTi" && (
        <Col>
          <Col marginTop={2}>
            <Text font="Poppins-Regular">Token Issuance Rate</Text>
          </Col>
          <Col marginTop={0.5}>
            <Input
              readOnly={loading}
              type="number"
              value={tokenIssuanceRate}
              onChange={(e) =>
                loading ? null : handleTokenIssuanceRateChange(e)
              }
            />
          </Col>
        </Col>
      )}
      <Col marginTop={2}>
        <Button
          color="#ffffff"
          bg="#2A72A7"
          disabled={loading || !selectedWallet}
          onClick={() =>
            loading || !selectedWallet ? null : handleTransferClick()
          }
        >
          {loading ? (
            <i className="fa fa-circle-o-notch fa-spin"></i>
          ) : (
            "Transfer"
          )}
        </Button>
      </Col>
    </Base>
  )
}

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
const Col = styled("div")<{
  w?: number
  marginTop?: number
  marginBottom?: number
}>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
  margin-top: ${(props) => props.marginTop}rem;
  margin-bottom: ${(props) => props.marginBottom}rem;
`

const Row = styled("div")<{ marginTop?: number; marginBottom?: number }>`
  margin-top: ${(props) => props.marginTop}rem;
  margin-bottom: ${(props) => props.marginBottom}rem;
  display: flex;
  flex-direction: row;
`
const Button = styled("div")<{
  bg?: string
  color?: string
  borderColor?: string
  disabled?: boolean
}>`
  width: 100%;
  height: 3.2rem;
  border-radius: 0.7rem;
  font-family: Poppins-SemiBold;
  color: ${(props) => props.color};
  background: ${(props) => props.bg};
  ${(props) =>
    props.borderColor ? `border: 0.15rem solid ${props.borderColor}` : ""};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  ${(props) =>
    !props.disabled
      ? `
        &:hover {
            box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
            opacity: 0.95;    
        }    
    `
      : ""}
`

const DDWallet = styled.select`
  width: 100%;
  height: 2.5rem;
  border-radius: 0.7rem;
  outline: none;
  border: 0.1rem solid lightgray;
  padding-left: 1rem;
`
const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  border-radius: 0.7rem;
  outline: none;
  border: 0.1rem solid lightgray;
  padding-left: 1rem;
`
