import { useReducer, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { mintNft as mintNFTi } from "../../../../blockchain/actions/MLInvestorsNFTAction";
import { useModalContext } from "../../../../hooks/ModalContext";
import { logNftTransaction } from "../../../../api/Nft";
import { errorCatcher } from "../../../../utils/helpers";
import BG from "../../../../assets/images/wizard-background.png";

/***
 * @note This is the minting modal responsible for the minting functionality
 * in http://localhost:3000/investors/info/{propertyId}
 */
function NftMint({ onShow, onHide, onMessage, selectedNftData }: any) {
  // @ts-ignore
  const { web3State } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [lock, setLock] = useState(true);

  // Hardcoded implementation -- LOL :D
  // TODO: Need to clean this logic up

  // @ts-ignore
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    useModalContext();
  const currentUrl = window.location.href;
  const adminUrl = new URL(currentUrl);
  const pathName = adminUrl.pathname;
  const splitString = pathName.split("/");
  const tokenID = splitString[3];

  const [mintAttrValues, updateMintAttrValues] = useReducer(
    (state: any, updates: any) => ({ ...state, ...updates }),
    {
      uri: tokenID,
      propertyId: tokenID,
      issuanceRate: "",
    }
  );

  const hasExistingNfti: boolean = selectedNftData?.hasNft;

  function handleOnChange(e: any) {
    updateMintAttrValues({ [e.target.name]: e.target.value });
    if (e.target.name === "issuanceRate") {
      if (!mintAttrValues.propertyId) {
        setLock(true);
      } else {
        setLock(false);
      }
    } else {
      if (!e.target.value) {
        setLock(true);
      } else {
        setLock(false);
      }
    }
  }

  async function handleMintClick() {
    if (!web3State.account) {
      onMessage({
        type: "error",
        message: "Authentication expired! Please re-login.",
      });
      return;
    }

    try {
      setLoadingMessage("NFTi minting in process... transaction pending...");
      setLoading(true);
      const tx = await mintNFTi(1);
      if (tx) {
        await logNftTransaction(
          mintAttrValues.propertyId,
          "mint",
          "minted",
          tx.transactionHash,
          tx.from,
          tx.to,
          ethers.utils.formatUnits(tx.gasUsed),
          0,
          tx.events,
          tx.logs,
          "",
          "nft"
        );
      }

      setLoading(false);
      onHide();
      updateMintAttrValues({ ["issuanceRate"]: 0 });
      setSuccessMessage("NFTi property minted successful!");
    } catch (e) {
      setErrorMessage(errorCatcher(e));
      setLoading(false);
    }
  }

  return (
    <Modal show={onShow} onHide={onHide} backdrop="static" keyboard={false}>
      <NftModalHeader>
        <Modal.Title>Mint NFT</Modal.Title>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          style={{ outline: "none" }}
          onClick={onHide}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </NftModalHeader>
      <Modal.Body>
        <div></div>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Property ID</Form.Label>
            <Form.Control
              type="text"
              name="uri"
              autoFocus
              value={mintAttrValues.propertyId}
              onChange={handleOnChange}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            {hasExistingNfti ? (
              <p>Minting disabled. This property has NFTi already</p>
            ) : (
              <>
                <Form.Label>Quatity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={1}
                  onChange={handleOnChange}
                  disabled
                />
              </>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          style={{ minWidth: "120px", backgroundColor: "#2A72A7" }}
          onClick={handleMintClick}
          disabled={hasExistingNfti || loading}
        >
          {loading ? (
            <i className="fa fa-circle-o-notch fa-spin"></i>
          ) : (
            <span>MINT NFTi</span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NftMint;

const NftModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1rem;

  background-image: url(${(props) => BG});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top center;
`;
