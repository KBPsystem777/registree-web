import { useState } from "react";
import styled from "styled-components";

import NFTiLists from "./NFTiLists";
import Infos from "./Infos";
import Dashboard from "./Dashboard";

/*** This page is where the Web3 Admin can change the contract addresses of NFT, Tokens and Marketplace addresses */
export default function Investors() {
  const TABS = [<Dashboard />, <Infos />, <NFTiLists />];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container>
      <Tab>
        <Nav isActive={activeTab === 0} onClick={() => setActiveTab(0)}>
          Dashboard
        </Nav>
        <Nav isActive={activeTab === 1} onClick={() => setActiveTab(1)}>
          Investor's Info
        </Nav>
        <Nav isActive={activeTab === 2} onClick={() => setActiveTab(2)}>
          Investor's NFTs
        </Nav>
      </Tab>
      <TabContent>{TABS[activeTab]}</TabContent>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
`;
const Tab = styled.div`
  padding-top: 16px;
  padding-left: 8px;
  padding-right: 8px;
`;
const Nav = styled("div")<{ isActive?: boolean }>`
  background-color: ${(props) => (props.isActive ? "#ffffff" : "#2A72A7")};
  font-family: ${(props) =>
    props.isActive ? "Poppins-SemiBold" : "Poppins-Light"};
  color: ${(props) => (props.isActive ? "#000000" : "#B1D3EC")};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: inline-block;
  font-size: 10pt;
  padding: 8px 24px;
  margin: 0px 1px;
  cursor: pointer;
`;
const TabContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
`;
