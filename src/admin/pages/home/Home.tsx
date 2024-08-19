import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

import styled from "styled-components";

import { HOME_TABS } from "./settings";
import { useUtilStateAction } from "../../../redux/actions/useUtilStateAction";

import Menu from "./Menu";
import Tokens from "../tokens";
import NFTs from "../nfts";
import Properties from "../properties";

function Home() {
  const [activeTab, setActiveTab] = useState<any>("/home/menu");
  const location = useLocation();
  const { updateActiveTab } = useUtilStateAction();
  // @ts-ignore
  const { utilState } = useSelector((state) => state);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    // setActiveTab(location.pathname);
    updateActiveTab(location.pathname);
  }, []);

  return (
    <Container>
      <Tab>
        {HOME_TABS.map((tab) => {
          return (
            <NavLink
              key={tab.index}
              to={`${tab.url}`}
              style={({ isActive }) => ({
                backgroundColor: isActive ? "#fff" : "#2A72A7",
                color: isActive ? "#000" : "#B1D3EC",
                fontFamily: isActive ? "Poppins-SemiBold" : "Poppins-Light",
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                display: "inline-block",
                fontSize: "10pt",
                padding: "8px 24px",
                margin: "0px 1px",
                textDecoration: "none",
              })}
              onClick={() => updateActiveTab(tab.url)}
            >
              {tab.label}
            </NavLink>
          );
        })}
      </Tab>
      <TabContent>
        {utilState.activeTab.includes("/home/menu") ? (
          <Menu
            url={(val: any) => {
              if (val.includes("/marketplace")) {
                window.open(val, "_blank");
              } else {
                updateActiveTab(val);
              }
            }}
          />
        ) : utilState.activeTab.includes("/home/properties") ? (
          <Properties />
        ) : utilState.activeTab.includes("/home/tokens") ? (
          <Tokens />
        ) : utilState.activeTab.includes("/home/nfts") ? (
          <NFTs />
        ) : null}
      </TabContent>
    </Container>
  );
}

export default Home;

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
const TabContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
`;
