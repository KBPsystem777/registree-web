import { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { useParams } from "react-router-dom"

import styled from "styled-components"

import { connectors } from "../../blockchain/Web3Utils"
import { clientUserLookup } from "../../api/Client"
import { useModalContext } from "../../hooks/ModalContext"

export default function MLCCWalletConnect() {
  const { tokenId } = useParams()
  const { activate } = useWeb3React()
  // @ts-ignore
  const { setLoadingMessage, setErrorMessageNoClose } = useModalContext()

  async function handleWalletClick(wallet: string) {
    if (wallet === "metamask") {
      await activate(connectors.injected)
      window.localStorage.setItem("provider", "injected")
    } else if (wallet === "coinbase") {
      await activate(connectors.coinbaseWallet)
      window.localStorage.setItem("provider", "coinbaseWallet")
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        if (!localStorage.getItem("token")) {
          if (tokenId) {
            setLoadingMessage("User lookup...")
            const _clientUserLookup = await clientUserLookup(tokenId)
            if (
              _clientUserLookup &&
              _clientUserLookup.data &&
              _clientUserLookup.data.data &&
              _clientUserLookup.data.data.token
            ) {
              localStorage.setItem("token", _clientUserLookup.data.data.token)
            }
          }
        }
      } catch (e) {
        console.error(e)
        setErrorMessageNoClose("User lookup failed")
      } finally {
        setLoadingMessage(null)
      }
    })()

    return () => {
      setLoadingMessage(null)
      setErrorMessageNoClose(null)
    }
  }, [])

  return (
    <Container>
      <Holder>
        <Wrapper>
          <Header>
            <Text size={0.05} bold>
              Connect Wallet
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
      </Holder>
    </Container>
  )
}

const w = 40
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
`
const Holder = styled.div`
  width: inherit;
  height: inherit;
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
`
const Header = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: calc(${(props) => w}rem * 0.05);
`
const WalletWrap = styled("div")<{ marginBottom?: number }>`
  width: 100%;
  height: calc(${(props) => w}rem * 0.13);
  border: 0.1rem solid rgb(0 0 0 / 0.2);
  border-radius: calc(${(props) => w}rem * 0.01);
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
const Text = styled("span")<{ bold?: boolean; color?: string; size?: number }>`
  font-family: ${(props) => (props.bold ? "Poppins-Medium" : "Poppins-Light")};
  color: ${(props) => props.color};
  font-size: calc(${(props) => w}rem * ${(props) => props.size});
`
