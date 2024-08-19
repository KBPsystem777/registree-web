import { useWeb3React } from "@web3-react/core"

import { connectors } from "../../blockchain/Web3Utils"

import {
  Container,
  Holder,
  CloseModal,
  Header,
  Text,
  WalletWrap,
  Wrapper,
  w as WIDTH,
} from "./styles/WalletConnect.styles"

export default function WalletConnect({ onClose }: any) {
  const { activate } = useWeb3React()

  async function handleWalletClick(wallet: string) {
    if (wallet === "metamask") {
      await activate(connectors.injected)
      window.localStorage.setItem("provider", "injected")
    } else if (wallet === "coinbase") {
      await activate(connectors.coinbaseWallet)
      window.localStorage.setItem("provider", "coinbaseWallet")
    }

    if (onClose) {
      onClose()
    }
  }

  return (
    <Container id="modal-wallet-container">
      <Holder>
        <Wrapper>
          <CloseModal onClick={onClose} />
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
