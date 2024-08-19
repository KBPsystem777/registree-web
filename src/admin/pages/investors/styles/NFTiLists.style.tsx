import styled, { keyframes } from "styled-components";

import { Breakpoint } from "../../../../constants";

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
`;
export const SearchSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem 4rem;
  z-index: 10;
  @media (max-width: ${(props) => Breakpoint.md}) {
    flex-direction: column;
  }
`;
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
`;
export const SearchInputImage = styled.img`
  height: 50%;
  padding: 0 1rem;
`;
export const SearchInput = styled.input`
  outline: none;
  border: none;
  width: 100%;
  height: 100%;
`;
export const NftGridWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  background: #fff;
  overflow: auto;
  padding-top: 1rem;
  margin-bottom: 2rem;
`;
export const NftGrid = styled.div`
  position: absolute;
  width: 100%;
  display: grid;
  justify-content: center;
  grid-gap: 1.5rem;
  grid-template-columns: auto auto auto auto;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    grid-template-columns: auto auto auto;
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    grid-template-columns: auto auto;
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    grid-template-columns: auto;
  }
  padding-bottom: 2rem;
`;
export const NftBox = styled("div")<{ w?: number; h?: number }>`
  position: relative;
  background: #fff;
  border-radius: 0.8rem;
  box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.04),
    0px 10px 10px rgba(0, 0, 0, 0.04);
  width: ${(props) => props.w}rem;
  height: ${(props) => props.h}rem;
  overflow: hidden;
  animation: ${(props) => nftFadeIn} 500ms forwards;
  cursor: pointer;
`;
export const nftFadeIn = keyframes`
    0%{opacity:0;}
    100%{opacity:1;}
`;
export const NftImage = styled("div")<{ src?: string; hasImage?: boolean }>`
  width: 100%;
  height: 80%;
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
`;
export const Attrs = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
`;
export const PropertyName = styled.div`
  font-family: Poppins-SemiBold;
  font-size: 0.9rem;
  line-height: 1;
  margin-bottom: 1rem;
`;
export const ContractType = styled.div`
  font-size: 0.8rem;
  line-height: 1;
`;
export const NotFound = styled.div`
  width: 100%;
  height: 100%;
  color: lightgray;
  display: flex;
  flex-direction: column;
  align-items: center;
  display: flex;
  margin-top: 20vh;
`;
