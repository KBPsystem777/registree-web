import styled from "styled-components"

export const NavContainer = styled.nav`
  background: #2a72a7;
  height: 100%;
  min-height: 100vh;
  width: 100%;
  font-family: "Poppins";
`
export const LogoContainer = styled.div`
  border-bottom: 1px solid darken(#2a72a7, 16);
  text-align: center;
  width: 100%;
`
export const LogoImage = styled.img`
  margin: 16px auto;
  width: 120px;
`
export const Icon = styled.i`
  font-size: 24pt;
  margin-right: 16px;
  vertical-align: middle;
`
export const Border = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 2px;
  &:before {
    content: "";
    width: 100%;
    height: 100%;
    background-color: #1a4566;
  }
  &:after {
    content: "";
    width: 100%;
    height: 100%;
    background-color: #509bd3;
  }
`
export const UL = styled.ul`
  // border-top: 1px solid lighten(#2a72a7, 16);
  list-style-type: none;
  padding: 16px 0px 0px 0px;
  margin: 0;
`
export const LI = styled.li`
  margin-bottom: 16px;
  vertical-align: middle;
`
export const TargetBlank = styled.div`
  color: #ffeaec;
  display: block;
  font-weight: bold;
  font-size: 9pt;
  padding: 8px 16px;
  cursor: pointer;
`
