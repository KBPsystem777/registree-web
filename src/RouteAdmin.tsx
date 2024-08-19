import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { useDispatch, useSelector } from "react-redux"
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom"

import styled from "styled-components"

import { adminAuthenticate, getRole } from "./api/Client"
import {
  setAccount,
  setChainId,
  setProvider,
  setTokenExpired,
} from "./redux/web3Reducer"
import { connectors, setContractProvider } from "./blockchain/Web3Utils"
import { Breakpoint } from "./constants"
import {
  MobileNavbar,
  MobileNavMenu,
  Hamburger,
} from "./admin/pages/MobileNavbar"
import { NETWORK_NAME } from "./constants"

import Header from "./admin/pages/Header"
import Sidebar from "./admin/pages/Sidebar"
import Home from "./admin/pages/home/Home"
import Menu from "./admin/pages/home/Menu"
import Properties from "./admin/pages/home/Properties"
import Tokens from "./admin/pages/tokens"
import NFTs from "./admin/pages/nfts"
import TokenExpired from "./admin/pages/TokenExpired"
import SelectedProperty from "./admin/pages/properties/SelectedProperty"
import Settings from "./admin/pages/settings"
import Investors from "./admin/pages/investors"
import SelectedInvestorInfo from "./admin/pages/investors/Infos/SelectedProperty"
import ServiceRequest from "./admin/pages/ServiceRequest"
import MarketplaceInfo from "./admin/pages/marketplace/Info"
import ActivityLoader from "./components/global/ActivityLoader"
import Collection from "./user/pages/Collection"
import MarketPlaceHeader from "./user/pages/MarketPlaceHeader"
import NftDetail from "./user/pages/NftDetail"
import OwnedBy from "./user/pages/OwnedBy"
import UserInvestors from "./user/pages/UserInvestors"
import UserInvestorNftDetail from "./user/pages/UserInvestorNftDetail"
import MarketplaceNftDetail from "./user/pages/MarketplaceNftDetail"
import TourConfirmationPage from "./user/pages/MarketplaceNftDetail/TourConfirmationPage"

function RouteAdmin() {
  const [loading, setLoading] = useState(true)
  const [currentWallet, setCurrentWallet] = useState("")
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  // @ts-ignore
  const { web3State } = useSelector((state) => state)
  const { library, chainId, account, activate } = useWeb3React()

  useEffect(() => {
    dispatch(setProvider(library))
  }, [])

  async function authenticate() {
    try {
      if (account) {
        if (
          !localStorage.getItem("account") ||
          (localStorage.getItem("account") &&
            localStorage.getItem("account") !== account)
        ) {
          localStorage.removeItem("role")
          localStorage.setItem("account", account)
          const auth = await adminAuthenticate(account)
          if (auth?.data?.data) {
            localStorage.setItem("token", auth.data.data.token.key)
            const userRole = await getRole(auth.data.data.token.key)
            // @ts-ignore
            if (userRole && userRole.enabled) {
              // @ts-ignore
              if (userRole.position) {
                // @ts-ignore
                localStorage.setItem("role", userRole.position)
                // @ts-ignore
                if (userRole.position === "admin") {
                  navigate("/")
                }
              } else {
                await navigate("/marketplace")
              }
            } else {
              localStorage.removeItem("role")
            }
          }
        } else {
          const userRole = await getRole(localStorage.getItem("token"))
          // @ts-ignore
          if (userRole && userRole.enabled) {
            // @ts-ignore
            localStorage.setItem("role", userRole.position)
            // @ts-ignore
            if (userRole.position === "admin") {
              navigate(location.pathname)
              // } else {
              //   navigate("/marketplace/account")
            }
          }
        }
      }
    } catch (e) {
      // @ts-ignore
      const res = e.response
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      await navigate("/marketplace")

      if (res && res.status === 401) {
        dispatch(setTokenExpired(true))
      }
    }
  }

  useEffect(() => {
    ; (async () => {
      if (location.pathname !== "/user") {
        const provider = localStorage.getItem("provider")
        if (provider) {
          // @ts-ignore
          await activate(connectors[provider])
          if (account) {
            dispatch(setAccount(account))
            dispatch(setProvider(library))
            dispatch(setChainId(chainId))
            setContractProvider(library)

            await authenticate()

            if (provider === "injected") {
              setCurrentWallet("MetaMask")
            } else if (provider === "coinbaseWallet") {
              setCurrentWallet("Coinbase")
            }
          }
        }
        setLoading(false)
      }
    })()
  }, [account, chainId])

  const role = localStorage.getItem("role")

  return (
    <>
      {account && (
        <>
          <MobileNavbar />
          <Hamburger />
          <MobileNavMenu />
        </>
      )}
      {loading && <ActivityLoader />}
      {!loading &&
        account &&
        (role && role === "admin" ? (
          location.pathname.includes("/marketplace") ? (
            <>
              <MarketPlaceHeader />
              <Routes>
                <Route path="/marketplace" element={<Collection />} />
                <Route path="/marketplace/account" element={<Collection />} />
                <Route
                  path="/marketplace/:contractAddress/:tokenId/*"
                  element={<MarketplaceNftDetail />}
                />
              </Routes>
            </>
          ) : location.pathname.includes("/collections") ? (
            <>
              <MarketPlaceHeader />
              <Routes>
                <Route path="/collections" element={<Collection />} />
                <Route path="/collections/account" element={<Collection />} />
                <Route
                  path="/collections/:contractAddress/:tokenId/*"
                  element={<NftDetail />}
                />
              </Routes>
            </>
          ) : (
            <Container>
              {web3State.tokenExpired && <TokenExpired />}
              {chainId && !web3State.allowedNetworks.includes(chainId) && (
                <ModalContainer>
                  <WalletErrorMessage>
                    Your {currentWallet} wallet is not connected to the{" "}
                    {NETWORK_NAME}. To transact, please switch to the{" "}
                    {NETWORK_NAME}.
                  </WalletErrorMessage>
                </ModalContainer>
              )}
              <Header />
              <LeftPanel>
                <Sidebar />
              </LeftPanel>
              <RightPanel>
                <Routes>
                  <Route path="/" element={<Menu />} />
                  <Route path="/home" element={<Home />}>
                    <Route path="properties" element={<Properties />} />
                    <Route
                      path="properties/:id"
                      element={<SelectedProperty />}
                    />
                    <Route path="tokens" element={<Tokens />} />
                    <Route path="tokens/:token" element={<Tokens />} />
                    <Route path="nfts" element={<NFTs />} />
                  </Route>
                  <Route
                    path="/home/nfts/:contractAddress/:tokenId"
                    element={<MarketplaceInfo />}
                  />
                  <Route
                    path="/service-requests"
                    element={<ServiceRequest />}
                  />
                  <Route path="/settings" element={<Settings />} />
                  {/*<Route path="/investors" element={<Investors />} />*/}
                  <Route path="/investors" element={<Investors />}>
                    <Route path="info/:id" element={<SelectedInvestorInfo />} />
                  </Route>
                  <Route
                    path="/investors/nfts/:contractAddress/:tokenId"
                    element={<UserInvestorNftDetail />}
                  />
                </Routes>
              </RightPanel>
            </Container>
          )
        ) : (
          <>
            <MarketPlaceHeader />
            {location.pathname.includes("/collections") ? (
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/collections/account" />}
                />
                <Route path="/collections" element={<Collection />} />
                <Route path="/collections/account" element={<Collection />} />
                <Route
                  path="/collections/:contractAddress/:tokenId"
                  element={<NftDetail />}
                />
                <Route
                  path="/collections/:contractAddress/:tokenId/*"
                  element={<NftDetail />}
                />
              </Routes>
            ) : location.pathname.includes("/marketplace") ? (
              <Routes>
                <Route path="/marketplace" element={<Collection />} />
                <Route
                  path="/marketplace/:contractAddress/:tokenId"
                  element={<MarketplaceNftDetail />}
                />
                <Route
                  path="/marketplace/:contractAddress/:tokenId/nfti"
                  element={<UserInvestorNftDetail />}
                />
              </Routes>
            ) : (
              <Routes>
                <Route path="/ownedby/:walletAddress" element={<OwnedBy />} />
                <Route path="/nft/investors" element={<UserInvestors />} />
                <Route
                  path="/nft/investors/:contractAddress/:tokenId"
                  element={<UserInvestorNftDetail />}
                />
              </Routes>
            )}
          </>
        ))}
      {!loading && !account && (
        <>
          <MarketPlaceHeader />
          <Routes>
            <Route path="*" element={<Navigate to="/marketplace" />} />
            <Route path="/marketplace" element={<Collection />} />
            <Route
              path="/marketplace/:contractAddress/:tokenId"
              element={<MarketplaceNftDetail />}
            />
            <Route path="/tour/confirmed" element={<TourConfirmationPage />} />
          </Routes>
        </>
      )}
    </>
  )
}

export default RouteAdmin

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  @media (max-width: ${(props) => Breakpoint.md}) {
    margin-top: 3.5rem;
  }
`
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
const LeftPanel = styled.div`
  width: 240px;
  min-width: 240px;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 0;
    min-width: 0;
  }
`
const RightPanel = styled.div`
  width: 100%;
`
