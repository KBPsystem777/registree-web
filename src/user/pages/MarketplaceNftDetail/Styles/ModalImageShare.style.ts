import styled from "styled-components"

export const Container = styled.div`
  display: none;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  z-index: 210;
`
export const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  margin-bottom: 2rem;
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
export const FieldCol = styled("div")<{
  w?: number
  marginTop?: number
  marginBottom?: number
}>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
  margin-top: ${(props) => props.marginTop}rem;
  margin-bottom: ${(props) => props.marginBottom}rem;
  row-gap: 0.3rem;
`
export const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  border-radius: 0.5rem;
  outline: none;
  border: 0.1rem solid lightgray;
  padding-left: 1rem;
`
export const TextArea = styled("textarea")<{}>`
  width: 100%;
  border-radius: 0.5rem;
  outline: none;
  border: 0.1rem solid lightgray;
  padding: 1rem;
`
export const Footer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
`
export const SendButton = styled("div")<{ locked?: boolean }>`
  padding: 0.7rem 1rem;
  background-color: #2c72a7;
  border-radius: 0.5rem;
  cursor: pointer;
  pointer-events: ${(props) => (props.locked ? "none" : "auto")};
  opacity: ${(props) => (props.locked ? 0.5 : 1)};
  &:after {
    content: "Send email";
    color: #ffffff;
  }
  &:hover {
    background-color: #25608c;
  }
`
export const LinkButton = styled.span`
  color: #2c72a7;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`
export const LinkCopiedMessage = styled.span`
  position: absolute;
  font-size: 0.9rem;
  right: 0;
  bottom: -10px;
  color: gray;
`
