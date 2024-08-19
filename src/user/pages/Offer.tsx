import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"

import styled from "styled-components"

import { useModalContext } from "../../hooks/ModalContext"
import { getListOfWallet, logNftTransaction } from "../../api/Nft"
import { offerForSaleToAddress } from "../../blockchain/actions/MLMarketplaceAction"
import { errorCatcher } from "../../utils/helpers"

import Base from "./TransactionModalBase"

export default function Offer({ nft, closeModal }: any) {
  const [loading, setLoading] = useState(false)
  const [wallets, setWallets] = useState<any[]>([])
  const [selectedWallet, setSelectedWallet] = useState("")
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")
  const { account } = useWeb3React()
  // @ts-ignore
  const { setErrorMessage, setSuccessMessage } = useModalContext()

  function handleWalletChange(e: any) {
    setSelectedWallet(e.target.value)
  }

  function handleAmountChange(e: any) {
    setAmount(e.target.value)

    if (isNaN(e.target.value)) {
      setError("Please enter a valid amount.")
    } else {
      setError("")
    }
  }

  async function handleOfferClick() {
    try {
      if (account && selectedWallet) {
        setLoading(true)
        const tx = await offerForSaleToAddress(
          nft.property_id || nft.propertyId,
          amount,
          selectedWallet,
          account
        )
        if (tx) {
          console.log(tx)
          const res = await logNftTransaction(
            nft.property_id || nft.propertyId,
            "offer",
            "offered",
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

  const locked =
    isNaN(Number(amount)) ||
    (!isNaN(Number(amount)) && Number(amount) < 0.00000000000001) ||
    wallets.length < 1 ||
    !selectedWallet ||
    loading

  return (
    <Base
      title="Offer"
      inProcess={loading}
      close={() => (loading ? null : closeModal())}
    >
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
            <option key={i} value={w.walletAddress}>
              {w.firstName}&nbsp;{w.lastName}&nbsp;-&nbsp;{w.walletAddress}
            </option>
          ))}
        </DDWallet>
      </Col>
      <Col marginTop={1}>
        <Text font="Poppins-Regular">Offer amount</Text>
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
          onClick={() => (locked ? null : handleOfferClick())}
        >
          {loading ? (
            <i className="fa fa-circle-o-notch fa-spin"></i>
          ) : (
            "Make Offer"
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
const DDWallet = styled.select`
  width: 100%;
  height: 2.5rem;
  border-radius: 0.7rem;
  outline: none;
  border: 0.1rem solid lightgray;
  padding-left: 1rem;
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
