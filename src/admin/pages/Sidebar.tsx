import { useEffect, useRef } from "react"
import { NavLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { setOpenMobileNav } from "../../redux/utilReducer"
import { useUtilStateAction } from "../../redux/actions/useUtilStateAction"

import {
  NavContainer,
  LogoContainer,
  LogoImage,
  Icon,
  Border,
  UL,
  LI,
  TargetBlank,
} from "./styles/Sidebar.styles"

export default function Sidebar() {
  const elRefContainer = useRef(null)
  // @ts-ignore
  const { isOpenMobileNav } = useSelector((state) => state.utilState)
  const dispatch = useDispatch()
  const { updateActiveTab } = useUtilStateAction()
  const role = localStorage.getItem("role")

  function handleNavlinkClick(link: string) {
    updateActiveTab(link)
    dispatch(setOpenMobileNav(false))
  }

  function handleOpenNewTabClick(target: string) {
    window.open(target, "_blank")
  }

  useEffect(() => {
    if (elRefContainer.current) {
      if (isOpenMobileNav) {
        // @ts-ignore
        elRefContainer.current.style.minHeight = "auto"
      } else {
        // @ts-ignore
        elRefContainer.current.style.minHeight = "100vh"
      }
    }
  }, [isOpenMobileNav])

  return (
    <NavContainer className="ml-sidebar" ref={elRefContainer}>
      <LogoContainer>
        <LogoImage
          src={require("../../assets/images/ML Logo White.png").default}
        />
      </LogoContainer>
      <Border />
      <UL>
        {role && role === "admin" && (
          <>
            <LI>
              <NavLink
                to="/home/properties"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#1A4566" : "",
                  color: "#ffeaec",
                  display: "block",
                  fontWeight: "bold",
                  fontSize: "9pt",
                  padding: "8px 16px",
                  transition: "1000ms",
                })}
                onClick={() => handleNavlinkClick("/home/properties")}
              >
                <Icon className="fa fa-fw fa-home"></Icon>
                <div
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                >
                  MANAGE PROPERTIES
                </div>
              </NavLink>
            </LI>
            <LI>
              <NavLink
                to="/home/tokens"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#1A4566" : "",
                  color: "#ffeaec",
                  display: "block",
                  fontWeight: "bold",
                  fontSize: "9pt",
                  padding: "8px 16px",
                  transition: "1000ms",
                })}
                onClick={() => handleNavlinkClick("/home/tokens")}
              >
                <img
                  src={require("../../assets/images/tokens-white.png").default}
                  style={{
                    width: "35px",
                    height: "35px",
                    margin: "0 22px 0 0",
                  }}
                  alt="Manage Tokens"
                />
                <div
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                >
                  MANAGE TOKENS
                </div>
              </NavLink>
            </LI>
            <LI>
              <NavLink
                to="/home/nfts"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "#1A4566" : "",
                  color: "#ffeaec",
                  display: "block",
                  fontWeight: "bold",
                  fontSize: "9pt",
                  padding: "8px 16px",
                  transition: "1000ms",
                })}
                onClick={() => handleNavlinkClick("/home/nfts")}
              >
                <img
                  src={require("../../assets/images/nft-white.png").default}
                  style={{
                    width: "35px",
                    height: "35px",
                    margin: "0 22px 0 0",
                  }}
                  alt="Manage NFTs"
                />
                <div
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                >
                  MANAGE NFTs
                </div>
              </NavLink>
            </LI>
          </>
        )}
        <LI>
          <TargetBlank
            onClick={() => handleOpenNewTabClick("/marketplace")}
            // @note Create a page link for "/collections/account"
            //  onClick={() => handleOpenNewTabClick("/collections/account")}
          >
            <img
              src={require("../../assets/images/marketplace-white.png").default}
              style={{ width: "35px", height: "35px", margin: "0 22px 0 0" }}
              alt="Marketplace"
            />
            <div style={{ display: "inline-block", verticalAlign: "middle" }}>
              VIEW MARKETPLACE
            </div>
          </TargetBlank>
        </LI>
        {role && role === "admin" && (
          <LI>
            <NavLink
              to="/settings"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#1A4566" : "",
                color: "#ffeaec",
                display: "block",
                fontWeight: "bold",
                fontSize: "9pt",
                padding: "8px 16px",
                transition: "1000ms",
              })}
              onClick={() => handleNavlinkClick("/settings")}
            >
              <Icon className="fa fa-fw fa-cogs"></Icon>
              <div style={{ display: "inline-block", verticalAlign: "middle" }}>
                MANAGE SETTINGS
              </div>
            </NavLink>
            <NavLink
              to="/investors"
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#1A4566" : "",

                color: "#ffeaec",
                display: "block",
                fontWeight: "bold",
                fontSize: "9pt",
                padding: "8px 16px",
                transition: "1000ms",
              })}
              onClick={() => handleNavlinkClick("/investors")}
            >
              <Icon className="fa fa-fw fa-money"></Icon>
              <div style={{ display: "inline-block", verticalAlign: "middle" }}>
                INVESTORS
              </div>
            </NavLink>
          </LI>
        )}
      </UL>
    </NavContainer>
  )
}
