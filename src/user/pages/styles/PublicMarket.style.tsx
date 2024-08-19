import styled, { css, keyframes } from "styled-components"

import { Breakpoint } from "../../../constants"

let w = 14,
  h = 18

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const SearchSection = styled.div`
  width: 100%;
  display: flex;
  // justify-content: space-between;
  @media (max-width: ${(props) => Breakpoint.md}) {
    // flex-direction: column;
  }
  margin: 1rem 0 2rem 0;
`
export const SearchInputWrap = styled.div`
  width: 55%;
  height: 2.6rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.6rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`
export const SearchInputImage = styled.img`
  height: 50%;
  padding: 0 1rem;
`
export const SearchInput = styled.input`
  outline: none;
  border: none;
  width: 100%;
  height: 100%;
`
export const NftGrid = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: auto auto auto auto auto auto;
  justify-content: flex-start;
  padding-bottom: 2rem;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    grid-template-columns: auto auto auto auto auto;
    ${(props) => NftBox} {
      width: ${(props) => w * 1.2}vw;
      height: ${(props) => h * 1.2}vw;
    }
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    grid-template-columns: auto auto auto auto;
    ${(props) => NftBox} {
      width: ${(props) => w * 1.5}vw;
      height: ${(props) => h * 1.5}vw;
    }
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    grid-template-columns: auto auto auto;
    ${(props) => NftBox} {
      width: ${(props) => w * 2}vw;
      height: ${(props) => h * 2}vw;
    }
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    grid-template-columns: auto;
    ${(props) => NftBox} {
      width: ${(props) => w * 4}vw;
      height: ${(props) => h * 4}vw;
    }
    justify-content: center;
  }
`
export const NftBox = styled("div")<{
  w?: number
  h?: number
  logged?: boolean
}>`
  position: relative;
  background: #fff;
  border-radius: 0.8rem;
  box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.04),
    0px 10px 10px rgba(0, 0, 0, 0.04);
  width: ${(props) => w}vw;
  height: ${(props) => h}vw;
  overflow: hidden;
  animation: ${(props) => nftFadeIn} 500ms forwards;
  cursor: pointer;
  @media (max-width: ${(props) => Breakpoint.xl}) {
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
  }

  ${(props) =>
    !props.logged &&
    css`
      &:hover {
        ${MemberLogin} {
          animation: ${nftFadeIn} 0.4s forwards;
        }
      }
    `}
`
export const nftFadeIn = keyframes`
    0%{opacity:0;}
    100%{opacity:1;}
`

export const NftImage = styled("div")<{
  src?: string
  hasImage?: boolean
  isml?: boolean
}>`
  width: 100%;
  // height: ${(props) => (props.isml ? 75 : 85)}%;
  height: 75%;
  overflow: hidden;
  &:after {
    content: "";
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${(props) => props.src});
    background-repeat: no-repeat;
    background-size: ${(props) => (props.hasImage ? "cover" : "30%")};
    background-position: ${(props) => (props.hasImage ? "top" : "center")};
    transition: transform 0.4s ease-in-out;
  }
  &:hover {
    &:after {
      transform: scale(1.05);
    }
  }
`
export const Attrs = styled("div")<{ isml?: boolean }>`
  width: 100%;
  // height: ${(props) => (props.isml ? 25 : 15)}%;
  height: 25%;
  display: flex;
  flex-direction: column;
  padding: 0.7vw;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    padding: calc(0.7vw * 1.2);
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    padding: calc(0.7vw * 1.5);
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    padding: calc(0.7vw * 2);
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    padding: calc(0.7vw * 4);
  }
`
export const PropertyName = styled.div`
  font-family: Poppins-SemiBold;
  font-size: 0.8vw;
  line-height: 1;
  margin-bottom: 0.5vw;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    font-size: calc(0.8vw * 1.2);
    margin-bottom: calc(0.5vw * 1.2);
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: calc(0.8vw * 1.5);
    margin-bottom: calc(0.5vw * 1.5);
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    font-size: calc(0.8vw * 2);
    margin-bottom: calc(0.5vw * 2);
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    font-size: calc(0.8vw * 4);
    margin-bottom: calc(0.5vw * 4);
  }
`
export const PriceLabel = styled.div`
  font-family: Poppins-SemiBold;
  font-size: 0.6vw;
  margin-bottom: 0.1vw;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    font-size: calc(0.6vw * 1.2);
    margin-bottom: calc(0.1vw * 1.2);
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: calc(0.6vw * 1.5);
    margin-bottom: calc(0.1vw * 1.5);
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    font-size: calc(0.6vw * 2);
    margin-bottom: calc(0.1vw * 2);
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    font-size: calc(0.6vw * 4);
    margin-bottom: calc(0.1vw * 4);
  }
`
export const PropertyPriceWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
export const CoinIcon = styled.img`
  height: 1rem;
  margin-right: 0.3vw;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    margin-right: calc(0.3vw * 1.2);
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    margin-right: calc(0.3vw * 1.5);
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    margin-right: calc(0.3vw * 2);
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    margin-right: calc(0.3vw * 4);
  }
`
export const PropertyPrice = styled.div`
  font-family: Poppins-SemiBold;
  font-size: 0.9vw;
  line-height: 1;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    font-size: calc(0.9vw * 1.2);
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: calc(0.9vw * 1.5);
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    font-size: calc(0.9vw * 2);
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    font-size: calc(0.9vw * 4);
  }
`

export const InfoIcon = styled.img`
  position: absolute;
  bottom: 0.5vw;
  right: 0.5vw;
  width: 1vw;
  height: 1vw;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  cursor: pointer;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    bottom: calc(0.5vw * 1.2);
    right: calc(0.5vw * 1.2);
    width: calc(1vw * 1.2);
    height: calc(1vw * 1.2);
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    bottom: calc(0.5vw * 1.5);
    right: calc(0.5vw * 1.5);
    width: calc(1vw * 1.5);
    height: calc(1vw * 1.5);
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    bottom: calc(0.5vw * 2);
    right: calc(0.5vw * 2);
    width: calc(1vw * 2);
    height: calc(1vw * 2);
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    bottom: calc(0.5vw * 4);
    right: calc(0.5vw * 4);
    width: calc(1vw * 4);
    height: calc(1vw * 4);
  }
`
export const MemberLogin = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
  display: flex;
  flex-direction: column;
  opacity: 0;
  justify-content: center;
  align-items: center;
`
export const Text = styled("span")<{
  font?: string
  bold?: boolean
  color?: string
  size?: number
}>`
  font-family: ${(props) => props.font || "Poppins-Light"};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}rem;
`
