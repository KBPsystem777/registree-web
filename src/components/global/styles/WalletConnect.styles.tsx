import styled from "styled-components"

export const w = 40
export const Container = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.9);
  top: 20%;
  left: 50%;
  transform: translateX(-50%);

  /* Add any other styles specific to your content inside the container */
  /* Example: text-align, background-color, etc. */

  /* Media query for small screens (e.g., mobile devices) */
  @media screen and (max-width: 768px) {
    padding: 10px;
    /* Add any other styles specific to mobile layout */
  }

  max-width: 100%;
  box-sizing: border-box;
`
export const Holder = styled.div`
  width: inherit;
  height: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const Wrapper = styled.div`
  width: ${(props) => w}rem;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: calc(${(props) => w}rem * 0.05);
  border-radius: calc(${(props) => w}rem * 0.01);
`
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: calc(${(props) => w}rem * 0.05);
`

export const CloseModal = styled.div`
  position: absolute;
  width: 2.2rem;
  height: 2.2rem;
  background-image: url(${(props) =>
    require("../../../assets/images/x-close.svg").default});
  background-repeat: no-repeat;
  background-size: 70%;
  background-position: center;
  top: 4%;
  right: 4%;
  cursor: pointer;
  border-radius: calc(${(props) => w}rem * 0.01);
  &:hover {
    background-color: #f0f0f0;
  }
`
export const Text = styled("span")<{
  bold?: boolean
  color?: string
  size?: number
}>`
  font-family: ${(props) => (props.bold ? "Poppins-Medium" : "Poppins-Light")};
  color: ${(props) => props.color};
  // font-size: ${(props) => props.size}rem;
  font-size: calc(${(props) => w}rem * ${(props) => props.size});
`

export const WalletWrap = styled("div")<{ marginBottom?: number }>`
  width: 100%;
  height: calc(${(props) => w}rem * 0.13);
  border: 0.1rem solid rgb(0 0 0 / 0.2);
  border-radius: calc(${(props) => w}rem * 0.01);
  // margin-bottom: ${(props) => props.marginBottom || 0}rem;
  margin-bottom: calc(${(props) => w}rem * ${(props) => props.marginBottom});
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #edf2f6;
  }
`
