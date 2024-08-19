import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Route, Routes, useNavigate } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"

import { clientUpdateWallet } from "./api/Client"
import { setLookupStatus } from "./redux/utilReducer"

import LookupStatus from "./user/pages/LookupStatus"
import MLCCWalletConnect from "./user/pages/MLCCWalletConnect"
import TourConfirmationPage from "./user/pages/MarketplaceNftDetail/TourConfirmationPage"

export default function RouteLookup() {
  const { account } = useWeb3React()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [status, setStatus] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        if (account && localStorage.getItem("token")) {
          const _clientUpdateWalletResult = await clientUpdateWallet(
            account,
            localStorage.getItem("token")
          )
          console.log(_clientUpdateWalletResult)
          if (
            _clientUpdateWalletResult &&
            _clientUpdateWalletResult.status === 200
          ) {
            dispatch(setLookupStatus("success"))
            setStatus("success")
            navigate("/user/connect/status")
          } else {
            dispatch(setLookupStatus("failed"))
            setStatus("failed")
            navigate("/user/connect/status")
          }
        } else if (!account && localStorage.getItem("token")) {
          navigate("/marketplace")
        } else if (
          !account &&
          !localStorage.getItem("token") &&
          window.location.pathname.includes("/tour")
        ) {
          navigate("/tour/confirmed")
        }
      } catch (e) {
        dispatch(setLookupStatus("failed"))
        setStatus("failed")
        navigate("/user/connect/status")
      }
    })()
  }, [account])

  return (
    <>
      {account && status ? (
        <Routes>
          <Route path="/user/connect/status" element={<LookupStatus />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/user/connect/:tokenId"
            element={<MLCCWalletConnect />}
          />
        </Routes>
      )}

      {!account && (
        <Routes>
          <Route path="/tour/confirmed" element={<TourConfirmationPage />} />
        </Routes>
      )}
    </>
  )
}
