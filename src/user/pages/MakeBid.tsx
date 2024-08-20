import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { errorCatcher } from "../../utils/helpers";

import { logNftTransaction } from "../../api/Nft";
import { useModalContext } from "../../hooks/ModalContext";
import { placeBid } from "../../blockchain/actions/MLInvestorsMarketplace";

import {
  Text,
  OfferReady,
  Input,
  RowJustified,
  Row,
  TokenStandard,
  WaitingForApproval,
  Button,
} from "./styles/MakeBid.style";

import Base from "./TransactionModalBase";

/*** @note @todo Make this bidding form a reusable one
 * for both NFTi and MLRE biddings.
 */
export default function MakeBid({ nft, closeModal }: any) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [makingOffer, setMakingOffer] = useState(false);
  // @ts-ignore
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    useModalContext();
  const { account } = useWeb3React();

  const handleChange = (e: any) => {
    setAmount(e.target.value);

    if (isNaN(e.target.value)) {
      setError("Please enter a valid amount.");
    } else {
      setError("");
    }
  };

  async function handleMakeOfferClick() {
    setLoading(true);
    setMakingOffer(true);

    setTimeout(() => {
      setSuccessMessage("Pledge submitted!");
      setMakingOffer(false);
      closeModal();
    }, 5000);
  }

  const minimumBidAmount = Number(nft?.minSalePrice * 0.5).toFixed(1);

  /***
   * This variable controls whether the Make an Offer button is enabled or not.
   * The most important check it is doing is making sure that the user will
   * input the minimum sale price (ETH) on the amount field before the Buy button
   * gets enabled. This is a front-end way of checking the amount of ETH the
   * users will be sending
   */
  const locked =
    isNaN(Number(amount)) ||
    (!isNaN(Number(amount)) && Number(amount) < Number(minimumBidAmount)) ||
    loading;

  return (
    <Base
      title={`Pledging for Mindoro lot`}
      inProcess={makingOffer}
      close={() => (makingOffer ? null : closeModal())}
    >
      {makingOffer ? (
        <OfferReady marginTop={2}>
          <Row>
            <div style={{ marginRight: "1rem" }}>
              <i className="fa fa-circle-o-notch fa-spin"></i>
            </div>
            <Text font="Poppins-SemiBold">Confirming your pledge</Text>
          </Row>
          <Row marginTop={1} marginLeft={2}>
            <Text font="Poppins-Regular">
              You'll be asked to review and confirm this bid from your wallet.
            </Text>
          </Row>
          <Row marginTop={1} marginLeft={2}>
            <WaitingForApproval />
          </Row>
        </OfferReady>
      ) : (
        <OfferReady marginTop={3}>
          <RowJustified>
            PHP
            <Input
              placeholder={`Minimum bid amount: PHP 2,000`}
              value={amount}
              onChange={handleChange}
              min={2000}
            />
          </RowJustified>
          <RowJustified>
            {error ? (
              <Text color="#ff0000" size={0.9}>
                {error}
              </Text>
            ) : (
              <Text color="transparent" size={0.9}>
                &nbsp;
              </Text>
            )}
          </RowJustified>
          <RowJustified marginTop={4}>
            <Button
              color="#ffffff"
              bg="#2A72A7"
              disabled={locked}
              onClick={() => handleMakeOfferClick()}
            >
              Submit pledge
            </Button>
          </RowJustified>
        </OfferReady>
      )}
    </Base>
  );
}
