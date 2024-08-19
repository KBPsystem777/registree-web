import { useEffect, useState } from "react"

import styled from "styled-components"

import Info from "./Info"
import Holders from "./Holders"
import TabMint from "./tabs/TabMint"
import TabBurn from "./tabs/TabBurn"
import TabTransfer from "./tabs/TabTransfer"

export default function Tokens() {
  const TOKEN_TABS = [<TabMint />, <TabBurn />, <TabTransfer />]

  // @ts-ignore
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
      } catch (e) {
        console.log("ERROR", e)
      }
    })()
  }, [])

  return (
    <Container>
      <Wrap>
        <Info />
        <Holders />
        <TabSection>
          <Tabs>
            <Tab isActive={activeTab === 0} onClick={() => setActiveTab(0)}>
              Mint
            </Tab>
            <Tab isActive={activeTab === 1} onClick={() => setActiveTab(1)}>
              Burn
            </Tab>
            <Tab isActive={activeTab === 2} onClick={() => setActiveTab(2)}>
              Transfer
            </Tab>
          </Tabs>
          <TabContent>{TOKEN_TABS[activeTab]}</TabContent>
        </TabSection>
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

const TabSection = styled.div`
  width: 100%;
  padding: 2rem 4%;
`
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
`
const Tab = styled("div")<{ isActive?: boolean }>`
  background-color: ${(props) => (props.isActive ? "#ffffff" : "#2A72A7")};
  color: ${(props) => (props.isActive ? "#000000" : "#B1D3EC")};
  font-family: ${(props) =>
    props.isActive ? "Poppins-SemiBold" : "Poppins-Light"};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: inline-block;
  font-size: 10pt;
  padding: 8px 24px;
  margin: 0 1px;
  // box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  // box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.04), 0px 10px 10px rgba(0, 0, 0, 0.04);
  box-shadow: 0px -10px 10px rgba(0, 0, 0, 0.04);
  cursor: pointer;
`
const TabContent = styled.div`
  width: 100%;
`
