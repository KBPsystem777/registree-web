import styled from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { Dropdown, DropdownButton } from "react-bootstrap"
import { useMoralis } from "react-moralis"
import { useSelector, useDispatch } from "react-redux"

import { truncate } from "../../utils/helpers"
import {
  setProvider,
  setWeb3Modal,
  setChainId,
  setAccount,
} from "../../redux/web3Reducer"

import { Breakpoint } from "../../constants"
import { setRole } from "../../redux/utilReducer"

const notificationCount = 30

export default function Header() {
  const { logout, user } = useMoralis()
  // @ts-ignore
  const { web3State } = useSelector((state) => state)
  const dispatch = useDispatch()
  const { deactivate } = useWeb3React()

  async function handleLogoutClick() {
    // await logout();

    window.localStorage.clear()
    await deactivate()

    dispatch(setProvider(null))
    dispatch(setWeb3Modal(null))
    dispatch(setChainId(0))
    dispatch(setAccount(""))
    dispatch(setRole(null))
  }

  return (
    <Container>
      <HeaderRow>
        {notificationCount > 0 && (
          <NotificationBadgeWrap>
            <Dropdown>
              <Dropdown.Toggle variant="success" id="ml-badge-dropdown-basic">
                <i style={{ fontSize: "22px" }} className="fa fa-bell"></i>
                <NotificationBadge>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </NotificationBadge>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {notificationCount < 1 ? (
                  <div style={{ maxHeight: "38rem", overflow: "auto" }}>
                    {[...new Array(notificationCount)].map((item, i) => {
                      return (
                        <MockNotificationItem key={i}>{i}</MockNotificationItem>
                      )
                    })}
                  </div>
                ) : (
                  <NoNotificationItem>
                    No notification for now
                  </NoNotificationItem>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </NotificationBadgeWrap>
        )}

        <DropdownButton
          id="ml-dropdown-basic-button"
          title={truncate(web3State.account || "")}
        >
          <DDItem onClick={handleLogoutClick}>Logout</DDItem>
        </DropdownButton>
      </HeaderRow>
    </Container>
  )
}

const DDItem = styled.div`
  width: 100%;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.5);
  font-family: Poppins-Light;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 24px;
  white-space: nowrap;
  &:hover {
    background-color: rgba(242, 242, 242, 0.5);
  }
`

const Container = styled.div`
  position: absolute;
  display: fixed;
  right: 0;
  margin: 0.3% 0.3% 0 0;
  z-index: 50;
  @media (max-width: ${() => Breakpoint.md}) {
    display: none;
  }
`
const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const NotificationBadgeWrap = styled.div`
  position: relative;
  display: flex;
  margin-right: 1rem;
  cursor: pointer;
`
const NotificationBadge = styled.div`
  background: red;
  border: 2px solid white;
  border-radius: 8px;
  color: white;
  font-size: 5pt;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10%;
  right: 34%;
`
const MockNotificationItem = styled.div`
  width: 22rem;
  height: 13rem;
  border-bottom: 0.03rem solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  font-family: Poppins-Thin;
  cursor: default;
  &:hover {
    background-color: rgba(242, 242, 242, 0.5); //#f2f2f2;
  }
`
const NoNotificationItem = styled.div`
  width: 10rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-family: Poppins-Thin;
  cursor: default;
  font-weight: bolder;
  &:hover {
    background-color: rgba(242, 242, 242, 0.5); //#f2f2f2;
  }
`
