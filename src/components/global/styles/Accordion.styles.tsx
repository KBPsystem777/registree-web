import styled from "styled-components"

export const Header = styled("div")<{ nogap?: boolean; lock?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: ${(props) => (props.lock ? "default" : "pointer")};
  font-family: Poppins-SemiBold;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: -moz-none;
  -o-user-select: none;
  user-select: none;
  ${(props) =>
    props.nogap
      ? "border-radius:0;border-bottom: 1px solid rgba(0,0,0,0.1);"
      : "border-radius: 0.8rem;border: 1px solid rgba(0,0,0,0.1);"};
`
export const ArrowImage = styled("div")<{
  isCollapsed?: boolean
  lock?: boolean
}>`
  width: 1.1rem;
  height: 1.1rem;
  display: inline-block;
  background-image: url(${(props) =>
    props.lock
      ? ""
      : require("../../../assets/images/arrow-up-icon.svg").default});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  transform: rotate(${(props) => (props.isCollapsed ? "180deg" : "0deg")});
`
export const Body = styled("div")<{ nogap?: boolean; nopadding?: boolean }>`
  width: 100%;
  display: none;

  border-bottom-left-radius: 0.8rem;
  border-bottom-right-radius: 0.8rem;
  background: #fbfdff;
  padding: ${(props) => (props.nopadding ? "0" : "1rem")};
  ${(props) =>
    props.nogap ? "border-radius:0;" : "border:1px solid rgba(0,0,0,0.1);"};
`
