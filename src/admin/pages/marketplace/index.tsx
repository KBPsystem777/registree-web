import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled, { keyframes } from "styled-components";

import { Breakpoint, BreakpointInPx } from "../../../constants";
import { getAllMemberNFTs } from "../../../api/Nft";

import SearchIcon from "../../../assets/images/search-icon.svg";
import NoImageIcon from "../../../assets/images/no-image.svg";

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

function makeid() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export default function Marketplace() {
  const [boxWidth, setBoxWidth] = useState(0);
  const refTabContent = useRef<HTMLDivElement>(null);
  const isMountedRef = useIsMounted();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const refNftGridWrap = useRef<HTMLDivElement>(null);
  const refSearchWrap = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  function handleShowInfoClick(item: any) {
    navigate(`/marketplace/${item?.token_address}/${item.token_id}`, {
      state: {
        collectionName: item?.name,
        address: item?.token_address,
        tokenStandard: item?.contract_type,
        symbol: item?.symbol,
      },
    });
  }

  function handleBuyNowClick(e: any) {
    e.stopPropagation();
  }

  function responsePage() {
    if (refTabContent.current) {
      let bw;
      const xl = Number(BreakpointInPx.xl.slice(0, -2));
      const lg = Number(BreakpointInPx.lg.slice(0, -2));
      const md = Number(BreakpointInPx.md.slice(0, -2));
      const md2 = Number(BreakpointInPx.md2.slice(0, -2));
      const sm = Number(BreakpointInPx.sm.slice(0, -2));
      if (sm > window.innerWidth) {
        bw = (refTabContent.current.offsetWidth - 400) / 1;
      } else if (md2 > window.innerWidth) {
        bw = (refTabContent.current.offsetWidth - 400) / 1;
      } else if (md > window.innerWidth) {
        bw = (refTabContent.current.offsetWidth - 400) / 1;
      } else if (lg > window.innerWidth) {
        bw = (refTabContent.current.offsetWidth - 400) / 2;
      } else if (xl > window.innerWidth) {
        bw = (refTabContent.current.offsetWidth - 400) / 3;
      } else {
        bw = (refTabContent.current.offsetWidth - 400) / 4;
      }

      // setBoxWidth(bw * (100 / refTabContent.current.offsetWidth));
      setBoxWidth(18);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (isMountedRef.current) {
          // const raw = await getAllTokenIds();
          const raw = await getAllMemberNFTs();

          if (raw && raw.data && raw.data.data) {
            // const items:any = [];
            const items = await Promise.all(
              raw.data.data.map((n: any, i: number) => {
                if (n.metadata) {
                  return { ...n, ...{ metadata: JSON.parse(n.metadata) } };
                  // items.push({...n, ...{metadata:JSON.parse(n.metadata)}});
                } else {
                  return n;
                }
              }),
            );

            setList(items);
          }
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    })();
  }, [isMountedRef]);

  useEffect(() => {
    responsePage();
    window.onresize = () => {
      responsePage();
    };

    // @ts-ignore
    refNftGridWrap.current.onscroll = () => {
      if (refSearchWrap.current && refNftGridWrap.current) {
        if (refNftGridWrap.current.scrollTop > 0) {
          refSearchWrap.current.style.boxShadow =
            "0px 10px 10px rgba(0, 0, 0, 0.04), 0px 20px 25px rgba(0, 0, 0, 0.04)";
        } else {
          refSearchWrap.current.style.boxShadow = "0 0 0, 0 0 0";
        }
      }
    };
  }, [isMountedRef]);

  return (
    <Container>
      <Tab>
        <Nav>Marketplace</Nav>
      </Tab>
      <TabContent ref={refTabContent}>
        <SearchSection ref={refSearchWrap}>
          <SearchInputWrap>
            <SearchInputImage src={SearchIcon} />
            <SearchInput placeholder="Search by name or attributes" />
          </SearchInputWrap>
        </SearchSection>
        <NftGridWrap ref={refNftGridWrap}>
          <NftGrid>
            {loading ? (
              <i className="fa fa-circle-o-notch fa-spin"></i>
            ) : list.length > 0 ? (
              list.map((item, i) => {
                return (
                  <NftBox
                    key={i}
                    w={boxWidth}
                    h={boxWidth + 8}
                    onClick={() => handleShowInfoClick(item)}
                  >
                    {/*<BuyNowButton onClick={handleBuyNowClick}/>*/}
                    <NftImage
                      src={item?.metadata?.image || NoImageIcon}
                      hasImage={item?.metadata?.image}
                    />
                    <Attrs>
                      <PropertyName>
                        {item.name} - {item?.metadata?.name || item?.token_id}
                      </PropertyName>
                      <ContractType>{item?.contract_type}</ContractType>
                      {/*<PriceLabel>Price</PriceLabel>*/}
                      {/*<PropertyPriceWrap>*/}
                      {/*    <CoinIcon src={require('../../../assets/images/ethereum-icon.svg').default} />*/}
                      {/*    <PropertyPrice>0.25</PropertyPrice>*/}
                      {/*</PropertyPriceWrap>*/}
                    </Attrs>
                  </NftBox>
                );
              })
            ) : (
              <NotFound>
                <i className="fa fa-warning" style={{ fontSize: "60px" }}></i>
                <div>No NFTs found.</div>
              </NotFound>
            )}
          </NftGrid>
        </NftGridWrap>
      </TabContent>
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
const Nav = styled.div`
  background-color: #fff;
  font-family: Poppins-SemiBold;
  color: #000;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: inline-block;
  font-size: 10pt;
  padding: 8px 24px;
  margin: 0px 1px;
`;
const TabContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
`;
const SearchWrap = styled.div`
  // width:100%;
  // padding:1rem 4rem;
  // z-index: 10;

  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem 4rem;
  @media (max-width: ${(props) => Breakpoint.md}) {
    flex-direction: column;
  }
`;
const SearchInputWrapOrig = styled.div`
  width: 37rem;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`;
const NftGridWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  background: #fff;
  overflow: auto;
  padding-top: 1rem;
  margin-bottom: 2rem;
`;
const NftGrid = styled.div`
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
const NftBox = styled("div")<{ w?: number; h?: number }>`
  position: relative;
  background: #fff;
  border-radius: 0.8rem;
  box-shadow:
    0px 20px 25px rgba(0, 0, 0, 0.04),
    0px 10px 10px rgba(0, 0, 0, 0.04);
  width: ${(props) => props.w}rem;
  height: ${(props) => props.h}rem;
  overflow: hidden;
  animation: ${(props) => nftFadeIn} 500ms forwards;
  cursor: pointer;
  &:hover {
    ${(props) => BuyNowButton} {
      animation: ${(props) => slideUp} 0.1s forwards;
    }
  }
`;
const nftFadeIn = keyframes`
    0%{opacity:0;}
    100%{opacity:1;}
`;
const NftImage = styled("div")<{ src?: string; hasImage?: boolean }>`
  width: 100%;
  // height: 70%;
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
const Attrs = styled.div`
  width: 100%;
  // height: 30%;
  height: 20%;
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
`;
const PropertyName = styled.div`
  font-family: Poppins-SemiBold;
  font-size: 0.9rem;
  line-height: 1;
  margin-bottom: 1rem;
`;
const ContractType = styled.div`
  font-size: 0.8rem;
  line-height: 1;
`;
const PriceLabel = styled.div`
  font-family: Poppins-SemiBold;
  font-size: 0.7rem;
  margin-bottom: 0.3rem;
`;
const PropertyPriceWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const CoinIcon = styled.img`
  height: 1rem;
  margin-right: 0.4rem;
`;
const PropertyPrice = styled.div`
  font-family: Poppins-SemiBold;
  font-size: 1 rem;
  line-height: 1;
`;
const BuyNowButton = styled.div`
  position: absolute;
  width: 100%;
  height: 9%;
  background-color: #2a72a7;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  transform: translateY(100%);
  &:after {
    content: "Buy now";
    font-family: Poppins-SemiBold;
    color: #fff;
    line-height: 1;
  }
`;
const slideUp = keyframes`
    0%{transform: translateY(100%);}
    100%{transform: translateY(0);}
`;
const NotFound = styled.div`
  width: 100%;
  height: 100%;
  color: lightgray;
  display: flex;
  flex-direction: column;
  align-items: center;
  display: flex;
  margin-top: 20vh;
`;
const SearchSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem 4rem;
  z-index: 10;
  @media (max-width: ${(props) => Breakpoint.md}) {
    flex-direction: column;
  }
`;
const SearchInputWrap = styled.div`
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
const SearchInputImage = styled.img`
  height: 50%;
  padding: 0 1rem;
`;
const SearchInput = styled.input`
  outline: none;
  border: none;
  width: 100%;
  height: 100%;
`;
