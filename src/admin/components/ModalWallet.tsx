import { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"

import $ from "jquery"

import { connectors } from "../../blockchain/Web3Utils"

import {
  Container,
  Holder,
  Wrapper,
  Header,
  CloseModal,
  Text,
  WalletWrap,
  WIDTH,
} from "./styles/ModalWallet.styles"

export default function ModalWallet({ isOpen, onClose }: any) {
  const { activate } = useWeb3React()

  async function handleWalletClick(wallet: string) {
    if (wallet === "metamask") {
      activate(connectors.injected)
      window.localStorage.setItem("provider", "injected")
    } else if (wallet === "coinbase") {
      activate(connectors.coinbaseWallet)
      window.localStorage.setItem("provider", "coinbaseWallet")
    }

    if (onClose) {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      $("#modal-wallet-container").fadeIn("fast")
    } else {
      $("#modal-wallet-container").fadeOut("fast")
    }
  }, [isOpen])

  return (
    <Container id="modal-wallet-container">
      <Holder>
        <Wrapper>
          <CloseModal
            onClick={() => $("#modal-wallet-container").fadeOut("fast")}
          />
          <Header>
            <Text size={0.05} bold>
              Select Wallet
            </Text>
          </Header>
          <WalletWrap
            marginBottom={0.03}
            onClick={() => handleWalletClick("metamask")}
          >
            <img
              src={require("../../assets/images/metamask.png").default}
              width={WIDTH * 1.2}
              height={WIDTH * 1.2}
              style={{ marginRight: `${WIDTH * 0.05}rem` }}
            />
            <Text size={0.04} bold>
              MetaMask
            </Text>
          </WalletWrap>
          <WalletWrap
            marginBottom={0.03}
            onClick={() => handleWalletClick("coinbase")}
          >
            <img
              src={require("../../assets/images/coinbase.png").default}
              width={WIDTH * 1.2}
              height={WIDTH * 1.2}
              style={{
                borderRadius: `${WIDTH * 0.01}rem`,
                marginRight: `${WIDTH * 0.05}rem`,
              }}
            />
            <Text size={0.04} bold>
              Coinbase
            </Text>
          </WalletWrap>
        </Wrapper>
      </Holder>
    </Container>
  )
}
