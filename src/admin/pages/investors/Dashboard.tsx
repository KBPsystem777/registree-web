import styled from "styled-components";

import Info from "./Info";
import Mint from "./Mint";
import TransferNft from "./TransferNft";
import IssueNftToInvestor from "./IssueNftToInvestor";

export default function Dashboard() {
  return (
    <Container>
      <Wrap>
        <h1>ManageLife Investor's NFT</h1>
        <Info />
        <Mint />
        <IssueNftToInvestor />
        <TransferNft />
      </Wrap>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  // background-color: #f2f2f2;
  background-color: #ffffff;
  overflow: auto;
`;
const Wrap = styled.div`
  position: absolute;
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 6vh;
`;
