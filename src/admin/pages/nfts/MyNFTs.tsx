import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled, { keyframes } from "styled-components";

import { getAllMemberNFTs } from "../../../api/Nft";
import { useModalContext } from "../../../hooks/ModalContext";

import NoImageIcon from "../../../assets/images/no-image.svg";
import * as mlStyle from "../../../MLStyles";

import NFTInfo from "./NFTInfo";

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

/***
 * @note This component is responsible for the view in http://localhost:3000/home/nfts
 */

function MyNfTs() {
  const isMountedRef = useIsMounted();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  // @ts-ignore
  const { setOpen, setModalChildren } = useModalContext();
  const navigate = useNavigate();

  function handleInfoClick(tokenId: any, e: any) {
    e.stopPropagation();
    setModalChildren(
      <NFTInfo tokenId={tokenId} close={() => setOpen(false)} />
    );
    setOpen(true);
  }

  function handleShowDetailClick(item: any) {
    navigate(`/home/nfts/${item?.token_address}/${item.token_id}`, {
      state: {
        collectionName: item?.name,
        address: item?.token_address,
        tokenStandard: item?.contract_type,
        symbol: item?.symbol,
      },
    });
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (isMountedRef.current) {
          const raw = await getAllMemberNFTs();
          if (raw && raw.data && raw.data.data) {
            // const items:any = [];
            const items = await Promise.all(
              raw.data.data.map(async (n: any, i: number) => {
                if (n.metadata) {
                  // items.push({...n, ...{metadata: JSON.parse(n.metadata)}});
                  return { ...n, ...{ metadata: JSON.parse(n.metadata) } };
                } else {
                  return n;
                }
              })
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

  return (
    <Container>
      <Header>NFTs</Header>
      <Content>
        <NFTsWrap>
          {loading ? (
            <LoadingWrap>
              <i className="fa fa-circle-o-notch fa-spin"></i>
            </LoadingWrap>
          ) : list.length > 0 ? (
            list.map((item, i) => {
              return (
                <Nft key={i} onClick={() => handleShowDetailClick(item)}>
                  <Image
                    src={item?.metadata?.image || NoImageIcon}
                    hasImage={item?.metadata?.image}
                  />
                  <DescWrap>
                    <DescBig>
                      {item?.name} - {item?.metadata?.name || item?.token_id}
                    </DescBig>
                    <DescSmall>{item.contract_type}</DescSmall>
                  </DescWrap>
                  <InfoWrap>
                    <InfoIcon
                      src={
                        require("../../../assets/images/nft-info.svg").default
                      }
                      onClick={(e) => handleInfoClick(item.token_id, e)}
                    />
                  </InfoWrap>
                </Nft>
              );
            })
          ) : (
            <NotFound>
              <i className="fa fa-warning" style={{ fontSize: "60px" }}></i>
              <div>No NFTs found.</div>
            </NotFound>
          )}
        </NFTsWrap>
        <br />
      </Content>
      {/*<ModalNFTInfo isOpen={showModal} onClose={() => setShowModal(false)}/>*/}
    </Container>
  );
}

export default MyNfTs;

const Container = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgb(0 0 0 / 0.1);
  border-left: 1px solid rgb(0 0 0 / 0.1);
  border-bottom: 0.07rem solid rgb(0 0 0 / 0.1);
  border-radius: 0.3rem;
  overflow: hidden;
  margin-bottom: 1rem;
`;
const Header = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: #2a72a7;
  display: flex;
  align-items: center;
  color: #fff;
  font-family: ${(props) => mlStyle.HEADER_FONT};
  font-size: 1rem;
  font-weight: 200;
  padding-left: 1vw;
`;
const Content = styled.div`
  width: 100%;
  padding: 2rem;
`;
const NFTsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;
const Nft = styled.div`
  width: 14rem;
  height: 19rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  animation: ${(props) => nftFadeIn} 500ms forwards;
  box-shadow: 0.14rem 0.21rem 0.7rem rgb(0 0 0 / 0.2);
  overflow: hidden;
  cursor: pointer;
`;
const nftFadeIn = keyframes`
    0%{opacity:0;}
    100%{opacity:1;}
`;
const Image = styled("div")<{ src?: string; hasImage?: boolean }>`
  width: 100%;
  height: 65%;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: ${(props) => (props.hasImage ? "cover" : "30%")};
  background-position: ${(props) => (props.hasImage ? "top" : "center")};
`;
const DescWrap = styled.div`
  width: 100%;
  height: 23%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 0.5rem;
`;
const DescBig = styled.span`
  font-size: 9pt;
  font-family: Poppins-SemiBold;
`;
const DescSmall = styled.span`
  font-size: 8pt;
`;
const InfoWrap = styled.div`
  width: 100%;
  height: 12%;
  display: flex;
  justify-content: flex-end;
  border-top: 0.07rem solid rgb(0 0 0 / 0.1);
  padding: 0.6rem;
`;
const InfoIcon = styled.img`
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  cursor: pointer;
`;
const LoadingWrap = styled.div`
  width: 100%;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const NotFound = styled.div`
  width: 100%;
  height: 100%;
  color: lightgray;
  display: flex;
  flex-direction: column;
  align-items: center;
  display: flex;
`;
