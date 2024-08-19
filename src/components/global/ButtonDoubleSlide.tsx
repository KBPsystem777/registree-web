import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"

import { buy } from "../../blockchain/actions/MLInvestorsMarketplace"
import { logNftTransaction } from "../../api/Nft"

import { useState } from "react"
import { errorCatcher } from "../../utils/helpers"
import { useModalContext } from "../../hooks/ModalContext"

import {
  Container,
  ButtonSlide,
  BuyNowButtonImage,
  Button,
} from "./styles/ButtonDoubleSlides.styles"

/*** This component can be seen on this page:
 * http://localhost:3000/marketplace/{contractAddress}/{tokenId}
 *
 * @todo Create an Add to cart functionality
 */
export default function ButtonDoubleSlide({ nft, h, w }: any) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState("")

  // @ts-ignore
  const { setErrorMessage, setSuccessMessage } = useModalContext()

  const role = localStorage.getItem("role")
  const { account } = useWeb3React()

  function handleAmountChange(e: any) {
    setAmount(e?.target?.value)
    if (isNaN(e.target.value)) {
      setError("Please enter a valid amount")
    } else {
      setError("")
    }
  }

  async function handleBuyNow() {
    console.log("buy now")

    try {
      if (account) {
        setLoading(true)
        const tx = await buy(amount, nft?.property_id || nft?.propertyId)
        if (tx) {
          console.log(tx)
          const res = await logNftTransaction(
            nft?.property_id || nft?.propertyId,
            "purchase",
            "listed",
            tx?.transactionHash,
            tx?.from,
            tx?.to,
            ethers?.utils.formatUnits(tx?.gasUsed),
            amount,
            tx?.events,
            tx?.logs,
            "",
            "nfti"
          )
          console.log(res)
          setSuccessMessage("Purchase completed")
        } else {
          setErrorMessage("Purchase failed")
        }
        setLoading(false)
      }
    } catch (e) {
      setErrorMessage(errorCatcher(e))
      setLoading(false)
    }
  }

  return (
    <Container>
      <ButtonSlide
        color="#ffffff"
        bg="#2A72A7"
        fontSize={role ? 10 : 12}
        onClick={handleBuyNow}
      >
        <BuyNowButtonImage />
      </ButtonSlide>
      <Button
        color="#ffffff"
        bg="#2A72A7"
        fontSize={role ? 10 : 12}
        onClick={handleBuyNow}
      >
        Buy now!
      </Button>
    </Container>
  )
}
