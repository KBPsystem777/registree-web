import { useState } from "react"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"

import { buy } from "../../blockchain/actions/MLInvestorsMarketplace"
import { logNftTransaction } from "../../api/Nft"
import { useModalContext } from "../../hooks/ModalContext"
import { errorCatcher } from "../../utils/helpers"

import { Text, Col, Button, Input } from "./styles/BuyProperty.style"

import Base from "./TransactionModalBase"

export default function BuyProperty({ nft, closeModal, nftType }: any) {
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
        const tx = await buy(amount, nft?.property_id || nft?.propertyId)
        if (tx) {
          console.log(tx)
          const res = await logNftTransaction(
            nft.property_id || nft.propertyId,
            "sale",
            "sold",
            tx.transactionHash,
            tx.from,
            tx.to,
            ethers.utils.formatUnits(tx.gasUsed),
            amount,
            tx.events,
            tx.logs,
            "",
            "nfti"
          )
          console.log(res)
          setSuccessMessage("NFT has been purchased successfully.")
        } else {
          setErrorMessage("Transaction failed")
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
      //  handleForSaleClick()
    }
  }

  /***
   * This variable controls whether the Buy button is enabled or not.
   * The most important check it is doing is making sure that the user will
   * input the minimum sale price (ETH) on the amount field before the Buy button
   * gets enabled. This is a front-end way of checking the amount of ETH the
   * users will be sending
   */
  const locked =
    isNaN(Number(amount)) ||
    (!isNaN(Number(amount)) && Number(amount) < nft?.minSalePrice) ||
    loading

  return (
    <Base
      title={`Purchasing ${nft?.name}`}
      inProcess={loading}
      close={() => (loading ? null : closeModal())}
    >
      <Col marginTop={2}>
        <Text font="Poppins-Regular">Amount (ETH)</Text>
      </Col>
      <Col marginTop={0.5}>
        <Input
          placeholder={`${nft?.minSalePrice} ETH`}
          value={amount}
          onChange={handleAmountChange}
          min={nft?.minSalePrice}
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
          {loading ? <i className="fa fa-circle-o-notch fa-spin"></i> : "Buy"}
        </Button>
      </Col>
    </Base>
  )
}
