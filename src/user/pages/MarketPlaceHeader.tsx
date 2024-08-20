import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Logo from "../../assets/images/ML Logo Blue Inline.png";
import SearchIcon from "../../assets/images/search-icon.svg";
import WalletIcon from "../../assets/images/wallet.svg";
import { DropdownButton } from "react-bootstrap";
import { truncate } from "../../utils/helpers";
import { Breakpoint } from "../../constants";
import { useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useWeb3StateAction } from "../../redux/actions/useWeb3StateAction";
import { useModalContext } from "../../hooks/ModalContext";
import WalletConnect from "../../components/global/WalletConnect";

export default function MarketPlaceHeader() {
  const refContainer = useRef<HTMLDivElement>(null);
  // @ts-ignore
  const { web3State, utilState } = useSelector((state) => state);
  const { deactivate, account } = useWeb3React();
  const navigate = useNavigate();
  // @ts-ignore
  const { setModalChildren, setOpen } = useModalContext();
  const role = localStorage.getItem("role");
  const { updateAccount, updateProvider, updateChainId, updateWeb3Modal } =
    useWeb3StateAction();

  function handleMyCollectionsClick() {
    navigate("/collections/account");
  }
  async function handleLogoutClick() {
    localStorage.clear();
    await deactivate();

    updateAccount("");
    updateProvider(null);
    updateChainId(0);
    updateWeb3Modal(null);
    navigate("/");
  }

  async function openWalletModal() {
    setModalChildren(<WalletConnect onClose={() => setOpen(false)} />);
    setOpen(true);
  }

  useEffect(() => {
    if (refContainer.current) {
      if (utilState.removeHeaderBorder) {
        refContainer.current.style.borderBottom = "1px solid rgba(0,0,0,0)";
      } else {
        refContainer.current.style.borderBottom = "1px solid rgba(0,0,0,0.1)";
      }
    }
  }, [utilState.removeHeaderBorder]);

  return (
    <Container ref={refContainer}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <HeaderImage
          src={Logo}
          onClick={() =>
            navigate(
              `${
                role
                  ? role === "admin"
                    ? "/"
                    : "/collections/account"
                  : "/marketplace"
              }`,
            )
          }
        />
        <SearchInputWrap>
          <SearchInputImage src={SearchIcon} />
          <SearchInput placeholder="Search items, and accounts" />
        </SearchInputWrap>
        <DropdownButtonWrap>
          {account && (
            <NavLink
              to="/marketplace"
              style={({ isActive }) => ({
                fontFamily: "Poppins-SemiBold",
                textDecoration: "none",
                marginRight: "1.5rem",
                color: "#000000",
              })}
            >
              Marketplace
            </NavLink>
          )}
          {account ? (
            <DropdownButton
              id="ml-dropdown-basic-button"
              title={truncate(web3State.account || "")}
            >
              <DDItem
                onClick={handleMyCollectionsClick}
                style={{ fontFamily: "Poppins-SemiBold" }}
              >
                My Collections
              </DDItem>
              <DDItem onClick={handleLogoutClick}>Logout</DDItem>
            </DropdownButton>
          ) : (
            <WalletLoginButton src={WalletIcon} onClick={openWalletModal} />
          )}
        </DropdownButtonWrap>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 8vh;
  position: fixed;
  background: #ffffff;
  top: 0;
  z-index: 10;
  // border-bottom: 1px solid rgba(0,0,0,0.1);
  padding: 0 4%;
  @media (max-width: ${(props) => Breakpoint.md}) {
  }
`;
const HeaderImage = styled.img`
  height: 100%;
  margin-right: 3.3%;
  cursor: pointer;
`;
const SearchInputWrap = styled.div`
  width: 50%;
  height: 2.6rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.6rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  @media (max-width: ${(props) => Breakpoint.md}) {
    display: none;
  }
`;
const SearchInputImage = styled.img`
  height: 50%;
  padding: 0 1rem;
`;
const SearchInput = styled.input`
  outline: none;
  border: none;
  width: 100%;
  height: 100%;
`;
const DDItem = styled.div`
  width: 100%;
  background-color: transparent;
  color: #000000;
  font-family: Poppins-Light;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 24px;
  white-space: nowrap;
  &:hover {
    background-color: rgba(242, 242, 242, 0.5);
  }
`;
const DropdownButtonWrap = styled.div`
  position: absolute;
  right: 4%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
// const WalletLoginButton = styled.div`
//     background: #2D72A7;
//     color: #ffffff;
//     padding: 0.6rem 1rem;
//     border-radius: 0.4rem;
//     cursor: pointer;
// `
const WalletLoginButton = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
`;
const MarketPlaceLink = styled.div`
  font-family: Poppins-SemiBold;
  margin-right: 2rem;
`;
