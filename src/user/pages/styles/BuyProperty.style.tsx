import styled from "styled-components"

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

export const Col = styled("div")<{
  w?: number
  marginTop?: number
  marginBottom?: number
}>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
  margin-top: ${(props) => props.marginTop}rem;
  margin-bottom: ${(props) => props.marginBottom}rem;
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
