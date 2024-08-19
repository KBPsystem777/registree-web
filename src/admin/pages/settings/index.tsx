import styled from "styled-components"

import LifeContract from "./LifeContract"
import MarketplaceContract from "./MarketplaceContract"
import NftContract from "./NftContract"
import AdminSettings from "./AdminSettings";
/*** This page is where the Web3 Admin can change the contract addresses of NFT, Tokens and Marketplace addresses */
export default function Settings() {
  return (
    <Container>
      <Wrap>
        <LifeContract />
        <MarketplaceContract />
        <NftContract />
        <AdminSettings/>
        <br />
      </Wrap>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 94vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: auto;
  font-family: Poppins-Light;
`
const Wrap = styled.div`
  position: absolute;
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 6vh;
`
