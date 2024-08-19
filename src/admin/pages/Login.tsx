import { useEffect, useState } from "react"
import { Web3Provider } from "@ethersproject/providers"
import { useDispatch } from "react-redux"

import styled from "styled-components"

import { useWalletSignIn } from "../../hooks/useWalletSignIn"
import {
  setAccount,
  setProvider,
  setChainId,
  setWeb3Modal,
} from "../../redux/web3Reducer"
import { setContractProvider } from "../../blockchain/Web3Utils"
import { Breakpoint } from "../../constants"

import ImageBG from "../../assets/images/login-background.jpg"
import ImageLogo from "../../assets/images/ML Logo Blue Inline.png"
import ModalWallet from "../components/ModalWallet"

export default function Login() {
  const { signIn } = useWalletSignIn()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  async function setMetaMaskAccount(account: string) {
    if (account) {
      dispatch(setAccount(account))
    } else {
      await setMetaMaskChainId(0)
    }
  }

  async function setMetaMaskChainId(_chainId: number) {
    dispatch(setChainId(_chainId))
  }

  async function setMetaMaskProvider(_provider: Web3Provider | null) {
    dispatch(setProvider(_provider))
    setContractProvider(_provider)
  }

  async function setMetaMaskWeb3Modal(_web3Modal: any) {
    dispatch(setWeb3Modal(_web3Modal))
  }

  async function handleConnectClick() {
    await signIn(
      setMetaMaskAccount,
      setMetaMaskChainId,
      setMetaMaskProvider,
      setMetaMaskWeb3Modal
    )
  }

  async function openWalletModal() {
    setShowModal(true)
  }

  useEffect(() => {
    window.addEventListener("keydown", (e: any) => {
      if (e.key === "Escape") {
        setShowModal(false)
      }
    })
  }, [])

  return (
    <Container>
      <LoginPanel>
        <Logo src={ImageLogo} />
        <Slogan className="slogan text-center">Life Made Simple</Slogan>
        <br />
        <TextLine className="text-line text-left">
          Connect Wallet to enter the ManageLife Portal.
        </TextLine>
        <ConnectButton
          style={{ cursor: loading ? "not-allowed" : "pointer" }}
          onClick={openWalletModal}
        >
          {loading ? (
            <i className="fa fa-circle-o-notch fa-spin"></i>
          ) : (
            <span>CONNECT WALLET</span>
          )}
        </ConnectButton>
      </LoginPanel>
      <ModalWallet isOpen={showModal} onClose={() => setShowModal(false)} />
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${(props) => ImageBG});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top;
`
const LoginPanel = styled.div`
  background: white;
  border-radius: 8px;
  padding: 40px;
  width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 13vh;
  right: 15%;
  @media (max-width: ${(props) => Breakpoint.md}) {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -75%);
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    width: 94%;
  }
`
const Logo = styled.img`
  width: 280px;
`
const Slogan = styled.div`
  color: #2a72a7;
  font-size: 12pt;
  font-style: italic;
  font-weight: bold;
  margin-top: -16px;
`
const TextLine = styled.div`
  font-size: 14pt;
  vertical-align: bottom;
  font-weight: 200;
  letter-spacing: 1pt;
  margin-bottom: 5vh;
`
const ConnectButton = styled.div`
  font-size: 14pt;
  font-weight: 200;
  letter-spacing: 1pt;
  background-color: #2a72a7;
  color: #fff;
  padding: 1rem;
  border-radius: 0.3rem;
  width: 18rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`
