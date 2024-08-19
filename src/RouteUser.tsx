import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Navigate, Route, Routes } from "react-router-dom"
import { useSelector } from "react-redux"

import { connectors, setContractProvider } from "./blockchain/Web3Utils"
import { clientUpdateWallet } from "./api/Client"
import { useWeb3StateAction } from "./redux/actions/useWeb3StateAction"
import { CLIENT_DIR } from "./config"
import { NETWORK_NAME } from "./constants"

import ActivityLoader from "./components/global/ActivityLoader"
import Collections from "./user/pages/Collections"
import Collection from "./user/pages/Collection"
import NftDetail from "./user/pages/NftDetail"
import Header from "./user/pages/Header"
import styled from "styled-components"

export default function RouteUser() {
  const [loading, setLoading] = useState(true)
  const [currentWallet, setCurrentWallet] = useState("")

  const { library, chainId, account, activate } = useWeb3React()

  const { updateAccount, updateProvider, updateChainId } = useWeb3StateAction()

  // @ts-ignore
  const { web3State } = useSelector((state) => state)

  useEffect(() => {
    ; (async () => {
      try {
        const provider = window.localStorage.getItem("provider")
        if (provider) {
          // @ts-ignore
          await activate(connectors[provider])
          updateAccount(account)
          updateProvider(library)
          updateChainId(chainId)
          setContractProvider(library)

          if (provider === "injected") {
            setCurrentWallet("MetaMask")
          } else if (provider === "coinbaseWallet") {
            setCurrentWallet("Coinbase")
          }
        }

        const token = localStorage.getItem("user_token")
        if (account && token) {
          const _clientUpdateWalletResult = await clientUpdateWallet(
            account,
            token
          )
          if (
            _clientUpdateWalletResult &&
            _clientUpdateWalletResult.status === 200
          ) {
            console.log("Success updating wallet")
          }
        }

        setLoading(false)
      } catch (e) {
        console.log(e)
        setLoading(false)
      }
    })()
  }, [account, chainId])

  return (
    <>
      {!loading && account ? (
        <>
          {chainId && !web3State.allowedNetworks.includes(chainId) && (
            <ModalContainer>
              <WalletErrorMessage>
                Your {currentWallet} wallet is not connected to the{" "}
                {NETWORK_NAME}. To transact, please switch to the {NETWORK_NAME}
                .
              </WalletErrorMessage>
            </ModalContainer>
          )}
          <Header />
          <Routes>
            <Route
              path={`${CLIENT_DIR}`}
              element={<Navigate to={`${CLIENT_DIR}/collections`} />}
            />
            <Route
              path={`${CLIENT_DIR}/collections`}
              element={<Collections />}
            />
            <Route
              path={`${CLIENT_DIR}/collection/:name`}
              element={<Collection />}
            />
            <Route path={`${CLIENT_DIR}/assets/:id`} element={<NftDetail />} />
          </Routes>
        </>
      ) : !loading && !account ? (
        <>
          <Header />
          <Routes>
            <Route
              path={`${CLIENT_DIR}`}
              element={<Navigate to={`${CLIENT_DIR}/collections`} />}
            />
            <Route
              path={`${CLIENT_DIR}/collections`}
              element={<Collections />}
            />
            <Route
              path={`${CLIENT_DIR}/collection/:name`}
              element={<Collection />}
            />
          </Routes>
        </>
      ) : (
        <ActivityLoader />
      )}
    </>
  )
}

const ModalContainer = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.9);
  width: 100vw;
  height: 100vh;
  z-index: 300;
  background-color: ${(props) =>
    /chrome/.test((navigator.userAgent || "").toLowerCase())
      ? "rgba(0,0,0, 0.8)"
      : "rgba(0,0,0, 0.9)"};
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
`
const WalletErrorMessage = styled.span`
  color: #ff0000;
  font-size: 1.3rem;
`
