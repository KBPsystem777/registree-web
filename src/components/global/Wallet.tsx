import styled from "styled-components"

import { useWeb3React } from "@web3-react/core"

import { connectors } from "../../blockchain/Web3Utils"

export default function Wallet({ close }: any) {
  const { activate } = useWeb3React()

  async function handleWalletClick(wallet: string) {
    if (wallet === "metamask") {
      await activate(connectors.injected)
      window.localStorage.setItem("provider", "injected")
    } else if (wallet === "coinbase") {
      await activate(connectors.coinbaseWallet)
      window.localStorage.setItem("provider", "coinbaseWallet")
    }

    if (close) {
      close()
    }
  }

  return (
    <Container>
      <Wrapper>
        <CloseModal onClick={close} />
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
            width={w * 1.2}
            height={w * 1.2}
            style={{ marginRight: `${w * 0.05}rem` }}
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
            width={w * 1.2}
            height={w * 1.2}
            style={{
              borderRadius: `${w * 0.01}rem`,
              marginRight: `${w * 0.05}rem`,
            }}
          />
          <Text size={0.04} bold>
            Coinbase
          </Text>
        </WalletWrap>
      </Wrapper>
    </Container>
  )
}

const w = 40
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Wrapper = styled.div`
  width: ${(props) => w}rem;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: calc(${(props) => w}rem * 0.05);
  border-radius: calc(${(props) => w}rem * 0.01);
  position: relative;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: calc(${(props) => w}rem * 0.05);
`

const CloseModal = styled.div`
  position: absolute;
  width: 2.2rem;
  height: 2.2rem;
  background-image: url(${(props) =>
    require("../../assets/images/x-close.svg").default});
  background-repeat: no-repeat;
  background-size: 70%;
  background-position: center;
  top: 4%;
  right: 4%;
  cursor: pointer;
  border-radius: calc(${(props) => w}rem * 0.01);
  &:hover {
    background-color: #f0f0f0;
  }
`
const Text = styled("span") <{ bold?: boolean; color?: string; size?: number }>`
  font-family: ${(props) => (props.bold ? "Poppins-Medium" : "Poppins-Light")};
  color: ${(props) => props.color};
  // font-size: ${(props) => props.size}rem;
  font-size: calc(${(props) => w}rem * ${(props) => props.size});
`

const WalletWrap = styled("div") <{ marginBottom?: number }>`
  width: 100%;
  height: calc(${(props) => w}rem * 0.13);
  border: 0.1rem solid rgb(0 0 0 / 0.2);
  border-radius: calc(${(props) => w}rem * 0.01);
  // margin-bottom: ${(props) => props.marginBottom || 0}rem;
  margin-bottom: calc(${(props) => w}rem * ${(props) => props.marginBottom});
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #edf2f6;
  }
`
