import { Link, NavLink } from "react-router-dom"

import styled from "styled-components"
import dateFormat from "dateformat"

import { Breakpoint } from "../../../constants"
import { HOME_TILE_MENU } from "./settings"

import BG from "../../../assets/images/home-background.png"

export default function Menu(props: any) {
  return (
    <Container>
      <WrapperScrolling>
        <ThisHeader>
          <WelcomeMessage>Welcome to ManageLife</WelcomeMessage>
          <DateLabel>
            {dateFormat(new Date(), "mmmm d, yyyy")}
            <br />
            <br />
            What do you want to do today?
          </DateLabel>
        </ThisHeader>
        <BoxWrap>
          {HOME_TILE_MENU.map((item: any, i: number) => {
            return (
              !item.hidden &&
              (item.url.includes("/marketplace") ? (
                <Box key={i}>
                  <BoxTop>
                    <TargetBlank
                      onClick={() => window.open("/marketplace", "_blank")}
                    >
                      {item.className ? (
                        <Icon className={item.className}></Icon>
                      ) : (
                        <img
                          src={item.image}
                          style={{
                            width: `${item.size || 72}px`,
                            height: `${item.size || 72}px`,
                          }}
                          alt={item.linkText}
                        />
                      )}
                      <Desc marginTop={"16px"}>{item.unoDesc}</Desc>
                      <Desc marginTop={"-4px"}>{item.dosDesc}</Desc>
                    </TargetBlank>
                  </BoxTop>
                  {item.disabled ? null : (
                    <BoxBottom>
                      <Link
                        style={{
                          fontFamily: "Poppins-Light",
                          textDecoration: "none",
                        }}
                        to={`${item.urlAdd}`}
                        onClick={() => props.url(item.urlAdd)}
                      >
                        {item.linkText}
                      </Link>
                    </BoxBottom>
                  )}
                </Box>
              ) : (
                <Box key={i}>
                  <BoxTop>
                    <NavLink
                      to={item.url}
                      style={({ isActive }) => ({
                        width: "100%",
                        height: "80%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                      })}
                      onClick={() => {
                        if (props.url) {
                          props.url(item.url)
                        }
                      }}
                    >
                      {item.className ? (
                        <Icon className={item.className}></Icon>
                      ) : (
                        <img
                          src={item.image}
                          style={{
                            width: `${item.size || 72}px`,
                            height: `${item.size || 72}px`,
                          }}
                          alt={item.linkText}
                        />
                      )}
                      <Desc marginTop={"16px"}>{item.unoDesc}</Desc>
                      <Desc marginTop={"-4px"}>{item.dosDesc}</Desc>
                    </NavLink>
                  </BoxTop>
                  {item.disabled ? null : (
                    <BoxBottom>
                      <Link
                        style={{
                          fontFamily: "Poppins-Light",
                          textDecoration: "none",
                        }}
                        to={`${item.urlAdd}`}
                        onClick={() => props.url(item.urlAdd)}
                      >
                        {item.linkText}
                      </Link>
                    </BoxBottom>
                  )}
                </Box>
              ))
            )
          })}
        </BoxWrap>
      </WrapperScrolling>
    </Container>
  )
}

const w = "calc(4 * 242px)"
const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: url(${(props) => BG});
  background-repeat: no-repeat;
  background-size: 110%;
  background-position: top left;
  justify-content: center;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    background-size: cover;
  }
  overflow: auto;
`
const WrapperScrolling = styled.div`
  position: absolute;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
`
const ThisHeader = styled.div`
  width: ${(props) => w};
  display: flex;
  flex-direction: column;
  align-self: center;
  margin-bottom: 1.5rem;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    width: 100%;
  }
`
const WelcomeMessage = styled.span`
  color: white;
  font-size: 18pt;
  font-weight: bold;
  letter-spacing: 0.5pt;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    text-align: center;
  }
`
const DateLabel = styled.span`
  color: #fff;
  font-weight: 200;
  letter-spacing: 0.5pt;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    text-align: center;
  }
`
const BoxWrap = styled.div`
  width: ${(props) => w};
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  align-self: center;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    width: 100%;
    height: 80vh;
  }
`
const Box = styled.div`
  position: relative;
  background: white;
  display: inline-block;
  height: 240px;
  margin: 12px;
  text-align: center;
  vertical-align: top;
  width: 216px;
`
const BoxTop = styled("div")<{ src?: string; text?: string }>`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Desc = styled("span")<{ marginTop?: string }>`
  color: black;
  font-family: Poppins-Medium;
  font-size: 16pt;
  font-weight: 700;
  letter-spacing: 0.01rem;
  margin-top: ${(props) => props.marginTop};
`
const BoxBottom = styled.div`
  width: 100%;
  height: 20%;
  border-top: 1px solid #eee;
  color: #2a72a7;
  font-size: 11pt;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Icon = styled.i`
  font-size: 5rem;
  vertical-align: middle;
  color: #2c72a7;
`
const TargetBlank = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
`
