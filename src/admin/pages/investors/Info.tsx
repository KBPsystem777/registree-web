import { useEffect, useRef, useState } from "react";
import { ADDRESS } from "../../../blockchain/abi/ManageLifeInvestorsNFT";
import styled from "styled-components";
import { Breakpoint } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { setName, setSymbol, setTotalSupply } from "../../../redux/web3Reducer";
import * as mlStyle from "../../../MLStyles";
import { format } from "../../../utils/helpers";
import {
  getTotalSupply,
  getNftName,
  getNftSymbol,
} from "../../../blockchain/actions/MLInvestorsNFTAction";

function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  });

  return isMounted;
}

export default function Info() {
  // @ts-ignore
  // const { totalSupply, name, symbol, transCount } = useSelector((state) => state.moralis);

  /* tslint:disable-next-line */
  const { totalSupply, name, symbol, account, transCount, chainId } =
    useSelector((state: any) => state.web3State ?? {});

  // const {Moralis, isAuthenticated} = useMoralis();
  const [loadingTotalSupply, setLoadingTotalSupply] = useState(false);
  const [loadingName, setLoadingName] = useState(false);
  const [loadingSymbol, setLoadingSymbol] = useState(false);
  // const {account} = useWeb3React();
  const dispatch = useDispatch();
  const isMountedRef = useIsMounted();

  async function fetchInfo() {
    try {
      const totalSupply_ = await getTotalSupply();
      if (isMountedRef.current) {
        dispatch(setTotalSupply(totalSupply_));
        setLoadingTotalSupply(false);
      }

      const name_ = await getNftName();
      if (isMountedRef.current) {
        dispatch(setName(name_));
        setLoadingName(false);
      }

      const symbol_ = await getNftSymbol();
      if (isMountedRef.current) {
        dispatch(setSymbol(symbol_));
        setLoadingSymbol(false);
      }
    } catch (e) {
      console.log(e);
      setLoadingTotalSupply(false);
      setLoadingName(false);
      setLoadingSymbol(false);
    }
  }

  useEffect(() => {
    (async () => {
      if (account) {
        setLoadingTotalSupply(true);
        setLoadingName(true);
        setLoadingSymbol(true);
        try {
          await fetchInfo();
        } catch (e) {
          setLoadingTotalSupply(false);
          setLoadingName(false);
          setLoadingSymbol(false);
        }
      }
    })();
  }, [transCount, isMountedRef, account, chainId]);

  return (
    <InfoSection>
      <Wrapper>
        <InfoHeader>Information</InfoHeader>
        <InfoInnerContent>
          <InfoCell rightBorder>
            <InfoRow borderBottom>
              <InfoLabel>Token Total Supply:</InfoLabel>
              <InfoValue>
                {loadingTotalSupply ? (
                  <i className="fa fa-circle-o-notch fa-spin"></i>
                ) : (
                  format(totalSupply)
                )}
              </InfoValue>
            </InfoRow>
            <InfoRow borderBottom>
              <InfoLabel>Token Name:</InfoLabel>
              <InfoValue>
                {loadingName ? (
                  <i className="fa fa-circle-o-notch fa-spin"></i>
                ) : (
                  name
                )}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Token Symbol:</InfoLabel>
              <InfoValue>
                {loadingSymbol ? (
                  <i className="fa fa-circle-o-notch fa-spin"></i>
                ) : (
                  symbol
                )}
              </InfoValue>
            </InfoRow>
          </InfoCell>
          <InfoCell>
            <InfoRow borderBottom>
              <InfoLabel>Token Wallet Address Owner:</InfoLabel>
              <InfoValue>
                {loadingSymbol ? (
                  <i className="fa fa-circle-o-notch fa-spin"></i>
                ) : (
                  <Blue>{account}</Blue>
                )}
              </InfoValue>
            </InfoRow>
            <InfoRow borderBottom>
              <InfoLabel>Contract Address of the Token:</InfoLabel>
              <InfoValue>
                {loadingSymbol ? (
                  <i className="fa fa-circle-o-notch fa-spin"></i>
                ) : (
                  <Blue>{ADDRESS}</Blue>
                )}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Number of Current Holders:</InfoLabel>
              <InfoValue>
                {loadingSymbol ? (
                  <i className="fa fa-circle-o-notch fa-spin"></i>
                ) : (
                  1
                )}
              </InfoValue>
            </InfoRow>
          </InfoCell>
        </InfoInnerContent>
      </Wrapper>
    </InfoSection>
  );
}

const InfoSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  padding: 0 4%;
`;
const Wrapper = styled.div`
  width: 100%;
  border-right: 1px solid rgb(0 0 0 / 0.1);
  border-left: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 0.3rem;
  overflow: hidden;
`;
const InfoCell = styled("div")<{ rightBorder?: boolean; widthInPct?: number }>`
  width: ${(props) => props.widthInPct || 100}%;
  flex-direction: column;
  ${(props) =>
    props.rightBorder ? "border-right: 1px solid rgb(0 0 0 / 0.1)" : ""};
  @media (max-width: ${(props) => Breakpoint.lg}) {
    border-right: 0;
  }
`;
const InfoHeader = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: #2a72a7;
  display: flex;
  align-items: center;
  color: #fff;
  font-family: ${(props) => mlStyle.HEADER_FONT};
  font-size: ${(props) => mlStyle.HEADER_FONT_SIZE};
  font-weight: 200;
  padding-left: 1vw;
`;
const InfoInnerContent = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    flex-direction: column;
  }
`;
const InfoRow = styled("div")<{ borderBottom?: boolean }>`
  width: 100%;
  height: 5vh;
  // ${(props) =>
    props.borderBottom ? "border-bottom: 1px solid rgb(0 0 0 / 0.1)" : ""};
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
  padding: 0 1vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${(props) => mlStyle.FONT_SIZE};
  font-weight: 300;
  @media (max-width: ${(props) => Breakpoint.sm}) {
    font-size: 0.6rem;
  }
`;
const InfoLabel = styled.div`
  width: 40%;
`;
const InfoValue = styled.div`
  width: 60%;
`;
const Blue = styled.span`
  color: #3498db;
`;
