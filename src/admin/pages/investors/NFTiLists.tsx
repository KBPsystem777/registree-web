import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import { ADDRESS } from "../../../blockchain/abi/ManageLifeInvestorsNFT";

import { getAllNFTIs } from "../../../api/Nft";

import {
  SearchInputWrap,
  Container,
  SearchSection,
  SearchInputImage,
  SearchInput,
  NftGrid,
  NftGridWrap,
  NftBox,
  NftImage,
  PropertyName,
  Attrs,
  ContractType,
  NotFound,
} from "./styles/NFTiLists.style";

import SearchIcon from "../../../assets/images/search-icon.svg";

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
 * @note This is the component responsible for the view in http://localhost:3000/investors
 */
export default function NFTiLists() {
  const isMountedRef = useIsMounted();
  const refSearchWrap = useRef<HTMLDivElement>(null);
  const refNftGridWrap = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
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
    setBoxWidth(18);
  }, [isMountedRef]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (isMountedRef.current) {
          const raw = await getAllNFTIs();
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

  return (
    <Container>
      <SearchSection ref={refSearchWrap}>
        <SearchInputWrap>
          <SearchInputImage src={SearchIcon} />
          <SearchInput placeholder="Search by name or attribute" />
        </SearchInputWrap>
      </SearchSection>
      <NftGridWrap ref={refNftGridWrap}>
        <NftGrid>
          {loading ? (
            <i className="fa fa-circle-o-notch fa-spin"></i>
          ) : list.length > 0 ? (
            list.map((item, i) => {
              return (
                <NavLink
                  key={`investors-nft-${item?.token_id || item?.tokenId}`}
                  to={`/investors/nfts/${ADDRESS}/${
                    item?.token_id || item?.tokenId
                  }`}
                  style={({ isActive }) => ({
                    color: "#000000",
                    textDecoration: "none",
                  })}
                >
                  <NftBox key={i} w={boxWidth} h={boxWidth + 8}>
                    <NftImage
                      src={item?.metadata?.image} // Adding a temporary placeholder image for NFT while we are waiting for the nftArtImage to get sorted out in the API
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
                </NavLink>
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
    </Container>
  );
}
