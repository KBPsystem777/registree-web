import styled from "styled-components"

import BuyNowImage from "../../../assets/images/lightning.svg"

export const Container = styled.div`
  width: 100%;
  height: 3.2rem;
  border-radius: 0.8rem;
  overflow: hidden;
  display: flex;
  position: relative;
`
export const ButtonSlide = styled("div")<{
  bg?: string
  color?: string
  borderColor?: string
  fontSize?: number
}>`
  position: absolute;
  transform: translateX(88%);
  border-left: 1px solid #fff;
  width: 100%;
  height: 3.2rem;
  font-family: Poppins-SemiBold;
  font-size: ${(props) => props.fontSize}pt;
  color: ${(props) => props.color};
  background: ${(props) => props.bg};
  ${(props) =>
    props.borderColor ? `border: 0.15rem solid ${props.borderColor}` : ""};
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
    opacity: 0.95;
  }
  transition: all 0.25s ease-in-out;
  &:hover {
    transform: translateX(0);
    justify-content: center;
    ${(props) => BuyNowButtonImage} {
      margin-left: 0;
      &:after {
        content: "Buy Now";
        margin-left: 1rem;
      }
    }
  }
  z-index: 1;
`

export const BuyNowButtonImage = styled.div`
  margin-left: 3%;
  display: flex;
  flex-direction: row;
  &:before {
    content: "";
    display: inline-block;
    width: 1.2rem;
    height: 1.2rem;
    background-image: url(${(props) => BuyNowImage});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
  }
`
export const Button = styled("div")<{
  bg?: string
  color?: string
  borderColor?: string
  fontSize?: number
}>`
  position: relative;
  width: 100%;
  height: 3.2rem;
  font-family: Poppins-SemiBold;
  font-size: ${(props) => props.fontSize}pt;
  color: ${(props) => props.color};
  background: ${(props) => props.bg};
  ${(props) =>
    props.borderColor ? `border: 0.15rem solid ${props.borderColor}` : ""};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  &:hover {
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
    opacity: 0.95;
  }
  ${(props) => ButtonSlide}:hover ~ & {
    transform: translateX(-100%);
  }
  z-index: 0;
`
