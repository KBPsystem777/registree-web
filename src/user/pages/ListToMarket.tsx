import { useState } from "react"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"

import styled from "styled-components"

import { offerForSale } from "../../blockchain/actions/MLMarketplaceAction"
import { listToMarket } from "../../blockchain/actions/MLInvestorsMarketplace"
import { logNftTransaction } from "../../api/Nft"
import { useModalContext } from "../../hooks/ModalContext"
import { errorCatcher } from "../../utils/helpers"

import Base from "./TransactionModalBase"

export default function ListToMarket({ nft, closeModal, nftType }: any) {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { account } = useWeb3React()
  // @ts-ignore
  const { setErrorMessage, setSuccessMessage } = useModalContext()

  function handleAmountChange(e: any) {
    setAmount(e.target.value)

    if (isNaN(e.target.value)) {
      setError("Please enter a valid amount.")
    } else {
      setError("")
    }
  }

  async function handleNftiSaleClick() {
    try {
      if (account) {
        setLoading(true)
        const tx = await listToMarket(nft.property_id || nft.propertyId, amount)
        if (tx) {
          console.log(tx)
          const res = await logNftTransaction(
            nft.property_id || nft.propertyId,
            "sale",
            "listed",
            tx.transactionHash,
            tx.from,
            tx.to,
            ethers.utils.formatUnits(tx.gasUsed),
            amount,
            tx.events,
            tx.logs,
            "",
            "nft"
          )
          console.log(res)
          setSuccessMessage("Offer NFT success.")
        } else {
          setErrorMessage("Offer NFT failed.")
        }

        setLoading(false)
        closeModal()
      }
    } catch (e) {
      setErrorMessage(errorCatcher(e))
      setLoading(false)
    }
  }

  async function handleForSaleClick() {
    try {
      if (account) {
        setLoading(true)
        const tx = await offerForSale(
          nft.property_id || nft.propertyId,
          amount,
          account
        )
        if (tx) {
          console.log(tx)
          const res = await logNftTransaction(
            nft.property_id || nft.propertyId,
            "sale",
            "listed",
            tx.transactionHash,
            tx.from,
            tx.to,
            ethers.utils.formatUnits(tx.gasUsed),
            amount,
            tx.events,
            tx.logs,
            "",
            "nft"
          )
          console.log(res)
          setSuccessMessage("Offer NFT success.")
        } else {
          setErrorMessage("Offer NFT failed.")
        }

        setLoading(false)
        closeModal()
      }
    } catch (e) {
      setErrorMessage(errorCatcher(e))
      setLoading(false)
    }
  }

  const handleListingProcess = (type: string) => {
    if (nftType === type) {
      handleNftiSaleClick()
    } else {
      handleForSaleClick()
    }
  }

  const locked =
    isNaN(Number(amount)) ||
    (!isNaN(Number(amount)) && Number(amount) < 0.00000000000001) ||
    loading

  return (
    <Base
      title="List to Marketplace"
      inProcess={loading}
      close={() => (loading ? null : closeModal())}
    >
      <Col marginTop={2}>
        <Text font="Poppins-Regular">Amount(ETH)</Text>
      </Col>
      <Col marginTop={0.5}>
        <Input
          placeholder="Amount(ETH)"
          value={amount}
          onChange={handleAmountChange}
        />
      </Col>
      <Col>
        {error ? (
          <Text color="#ff0000" size={0.9}>
            {error}
          </Text>
        ) : (
          <Text color="transparent" size={0.9}>
            &nbsp;
          </Text>
        )}
      </Col>
      <Col marginTop={2}>
        <Button
          color="#ffffff"
          bg="#2A72A7"
          disabled={locked}
          onClick={() => handleListingProcess(nftType)}
        >
          {loading ? (
            <i className="fa fa-circle-o-notch fa-spin"></i>
          ) : (
            "List to marketplace"
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
const Input = styled.input`
  outline: none;
  border: none;
  width: 100%;
  height: 2.7rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.6rem;
  font-family: Poppins-Regular;
  padding-left: 2%;
`
