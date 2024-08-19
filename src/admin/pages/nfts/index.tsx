import styled from "styled-components";
import MyNfTs from "./MyNFTs";

export default function NFTs() {
  return (
    <Container>
      <Wrap>
        <MyNfTs />
      </Wrap>
    </Container>
  );
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
  align-items: center;
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
