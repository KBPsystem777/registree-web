import styled from "styled-components"

import { Breakpoint } from "../../../constants"

import CloseXIcon from "../../../assets/images/x-close.svg"
import CloseIcon from "../../../assets/images/close-x-icon.svg"

export const Container = styled.div`
  width: 100%;
  height: 94vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: auto;
  margin-top: 8vh;
`
export const Wrapper = styled("div")<{ isAdmin?: boolean }>`
  position: absolute;
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`
export const TabContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // background: #ffffff;
`
export const NotFound = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`
export const ContentBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: auto;
  padding-top: 1rem;
`
export const ContentBodyCol = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 1rem;
  // margin-bottom: 4rem;
`
export const ContentBodyJustify = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 1.3rem;
  // padding: 0 1rem;
  margin-bottom: 3rem;
  @media (max-width: ${(props) => Breakpoint.md}) {
    flex-direction: column;
  }
`
export const LeftContent = styled("div")<{ isflexible?: boolean }>`
  width: 28vw;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`
export const RightContent = styled.div`
  // width: 50rem;
  width: 45vw;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`
export const ImageBox = styled.div`
    width: inherit;
    border 1px solid rgba(0,0,0,0.1);
    border-radius: 0.8rem;
    overflow:hidden;
    margin-bottom: 1rem;
`
export const ImageHeader = styled.div`
  width: inherit;
  height: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.9rem;
`
export const Image = styled("div")<{ src?: string; hasImage?: boolean }>`
  width: inherit;
  height: 31rem;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: ${(props) => (props.hasImage ? "cover" : "30%")};
  background-position: center;
  cursor: pointer;
`
export const CurrentPriceBox = styled.div`
    border 1px solid rgba(0,0,0,0.1);
    border-radius: 0.8rem;
    overflow:hidden;
    margin-bottom: 1rem;
`
export const CurrentPrice = styled.div`
  width: inherit;
  background: #fbfdff;
  padding: 1rem;
`
export const CoinIcon = styled("img")<{ h?: number }>`
  height: ${(props) => props.h || 1}rem;
  margin-right: 0.4rem;
`
export const LoadingWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  background: #ffffff;
  position: absolute;
`
export const ButtonGroupJustified = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.5rem;
  @media (max-width: ${(props) => Breakpoint.sm}) {
    flex-direction: column;
  }
`
export const Button = styled("div")<{
  bg?: string
  color?: string
  borderColor?: string
  fontSize?: number
}>`
  width: 50%;
  height: 3.2rem;
  border-radius: 0.8rem;
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
  &:hover {
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
    opacity: 0.95;
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    width: 100%;
  }
`
export const MetadataFlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`
export const Metadata = styled.div`
  width: 10rem;
  height: 5.5rem;
  border-radius: 0.5rem;
  border: 1px solid #2a72a7;
  background-color: rgba(42, 114, 167, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`
export const Col = styled("div")<{ w?: number }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
`
export const Text = styled("span")<{
  font?: string
  bold?: boolean
  color?: string
  size?: number
}>`
  font-family: ${(props) =>
    props.font || (props.bold ? "Poppins-Medium" : "Poppins-Light")};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}rem;
`
export const DetailsWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
export const CellJustified = styled.div`
    width: 100%;
    display: flex;
    justify-content space-between;    
    margin: 0.2rem 0;
`
export const Row = styled("div")<{ marginTop?: number; marginBottom?: number }>`
  margin-top: ${(props) => props.marginTop}rem;
  margin-bottom: ${(props) => props.marginBottom}rem;
  display: flex;
  flex-direction: row;
`
export const ActionSection = styled.div`
  position: relative;
  width: 100%;
  height: 2.2rem;
  display: flex;
`
export const ActionGroup = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: row;
  border: 0.1rem solid lightgray;
  border-radius: 0.7rem;
`
export const ActionImage = styled("div")<{
  src?: string
  hasBorderLeft?: boolean
  hasBorderRight?: boolean
}>`
  width: 2.5rem;
  height: 2rem;
  border-left: ${(props) => (props.hasBorderLeft ? 0.07 : 0)}rem solid lightgray;
  border-right: ${(props) => (props.hasBorderRight ? 0.07 : 0)}rem solid
    lightgray;
  display: flex;
  justify-content: center;
  cursor: pointer;
  &:after {
    width: 2rem;
    height: 2rem;
    content: "";
    display: inline-block;
    background-image: url(${(props) => props.src});
    background-repeat: no-repeat;
    background-size: 50%;
    background-position: center;
  }
  &:hover {
    opacity: 0.6;
  }
`

export const FullImage = ({ imagePath, onClose }: any) => {
  return (
    <FullImageContainer>
      <FICloseButton onClick={onClose} />
      <img src={imagePath} style={{ height: "90%" }} />
    </FullImageContainer>
  )
}
export const FullImageContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const FICloseButton = styled.div`
  position: absolute;
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background-image: url(${(props) => CloseIcon});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  top: 5%;
  right: 4%;
  cursor: pointer;
`
export const HistorySection = styled.div`
  // width: 83rem;
  position: relative;
  left: 50%;
  transform: translateX(-50%);

  width: 74vw;
  margin-bottom: 3vh;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`

export const OwnedBySection = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  background: red;
`
export const AbsoluteWrap = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  right: 0;
`
export const OwnedByRow = styled.div`
  display: flex;
  display: flex;
  flex-direction: row;
  margin-left: 1rem;
`

export const IHSearchSection = styled.div`
  width: 100%;
  padding: 0.8rem;
`
export const IHSearchInput = styled.select`
  width: 100%;
  height: 2.5rem;
  outline: none;
  border-radius: 0.6rem;
  border: 2px solid lightgray;
  padding-left: 1rem;
  font-size: 0.9rem;
  color: gray;
`
export const IHHeaderSection = styled("div")<{ borderTop?: number }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-top: ${(props) => props.borderTop || 0}px solid lightgray;
  border-bottom: 1px solid lightgray;
  background: #fff;
  padding: 0.4rem 1rem;
  margin-bottom: 0.9rem;
`
export const IHHeaderLabel = styled("div")<{ w?: number }>`
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
  font-size: 0.8rem;
`
export const IHContentSection = styled("div")<{ activateH?: boolean }>`
  position: relative;
  width: 100%;
  // height: 20rem;
  height: ${(props) => (props.activateH ? "20rem" : "auto")};
  overflow: auto;
`
export const IHContentScrolling = styled.div`
  // position: absolute;
  width: 100%;
`
export const IHItemCol = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-top: 1px solid lightgray;
`
export const IHItemRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`
export const IHItemCell = styled("div")<{ w?: number }>`
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
  display: flex;
  align-items: center;
`
export const IHImage = styled.img`
  height: 0.8rem;
  margin-right: 0.2rem;
`

export const LockupContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 26rem;
  background: white;
  padding: 3rem;
  border-radius: 0.5rem;
`
export const PreferredDateWrap = styled.div`
  with: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 4rem;
  border: 0.1rem solid lightgray;
  border-radius: 0.5rem;
  margin-top: 1rem;
`

export const SubmitButton = styled("div")<{ locked?: boolean }>`
  margin-top: 2rem;
  padding: 0.7rem 1rem;
  background-color: #2c72a7;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: ${(props) => (props.locked ? "none" : "auto")};
  opacity: ${(props) => (props.locked ? 0.5 : 1)};
  &:after {
    content: "Set Lockup Date";
    color: #ffffff;
  }
  &:hover {
    background-color: #25608c;
  }
`

export const Close = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
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
