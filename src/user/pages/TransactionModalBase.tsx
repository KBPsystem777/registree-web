import styled from "styled-components"
import { Breakpoint } from "../../constants"
import CloseXIcon from "../../assets/images/x-close.svg"

export default function TransactionModalBase({
  children,
  w,
  center,
  title,
  close,
  inProcess,
}: any) {
  return (
    <Container w={w} isCenter={center}>
      <Header>
        <Text font={"Poppins-SemiBold"} size={1.2}>
          {title}
        </Text>
        {!inProcess && <Close onClick={close} />}
      </Header>
      <Content>{children}</Content>
    </Container>
  )
}

const Container = styled("div")<{ w?: number; isCenter?: boolean }>`
  position: relative;
  display: inline-block;
  background-color: #ffffff;
  ${(props) =>
    props.isCenter
      ? `
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);    
    `
      : `
      left: 50%;
      top: 10%;
      transform: translateX(-50%);    
    `}
  width: ${(props) => props.w || 40}rem;
  padding: 1.4rem;
  border-radius: 0.8rem;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 90%;
  }
`
const Header = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`

const Text = styled("span")<{
  font?: string
  bold?: boolean
  color?: string
  size?: number
}>`
  font-family: ${(props) => props.font || "Poppins-Light"};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}rem;
`
const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const Close = styled.div`
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
