import styled from "styled-components"

import { Breakpoint } from "../../../constants"

import EthereumIcon from "../../../assets/images/ethereum-icon.svg"
import CloseXIcon from "../../../assets/images/x-close.svg"

export const Container = styled.div`
  position: relative;
  display: inline-block;
  background-color: #ffffff;
  left: 50%;
  top: 10%;
  transform: translateX(-50%);
  width: 40rem;
  padding: 1.4rem;
  border-radius: 0.8rem;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 90%;
  }
`
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
export const Header = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
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
export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
export const OfferReady = styled("div")<{ marginTop?: number }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: ${(props) => props.marginTop}rem;
`
export const Input = styled.input`
  outline: none;
  border: none;
  width: 100%;
  height: 2.7rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.6rem;
  font-family: Poppins-Regular;
  padding-left: 2%;
`
export const RowJustified = styled("div")<{ marginTop?: number }>`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: ${(props) => props.marginTop}rem;
`
export const Row = styled("div")<{ marginTop?: number; marginLeft?: number }>`
  display: flex;
  flex-direction: row;
  margin-top: ${(props) => props.marginTop}rem;
  margin-left: ${(props) => props.marginLeft}rem;
`
export const TokenStandard = styled.div`
  width: 30%;
  height: 2.7rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  &:before {
    content: "";
    display: inline-block;
    width: 2.7rem;
    height: 2.7rem;
    background-image: url(${(props) => EthereumIcon});
    background-repeat: no-repeat;
    background-size: 30%;
    background-position: center;
  }
  &:after {
    content: "ETH";
    font-family: Poppins-Regular;
  }
`
export const Button = styled("div")<{
  bg?: string
  color?: string
  borderColor?: string
  disabled?: boolean
}>`
  width: 100%;
  height: 3.2rem;
  border-radius: 0.7rem;
  font-family: Poppins-SemiBold;
  color: ${(props) => props.color};
  background: ${(props) => props.bg};
  ${(props) =>
    props.borderColor ? `border: 0.15rem solid ${props.borderColor}` : ""};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  ${(props) =>
    !props.disabled
      ? `
        &:hover {
            box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
            opacity: 0.95;    
        }    
    `
      : ""}
`
export const WaitingForApproval = styled.div`
  padding: 1rem 1.5rem;
  background: lightgray;
  border-radius: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: "Waiting for approval...";
    font-family: Poppins-SemiBold;
  }
`
export const Close = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  &:after {
    content: "";
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${(props) => CloseXIcon});
    background-repeat: no-repeat;
    background-size: 60%;
    background-position: center;
  }
  &:hover {
    opacity: 0.6;
  }
`
