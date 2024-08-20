import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useNavigate } from "react-router-dom";

import { getMarketplaceItems } from "../../api/Marketplace";
import { useModalContext } from "../../hooks/ModalContext";

import {
  Container,
  SearchSection,
  SearchInput,
  SearchInputImage,
  SearchInputWrap,
  NftGrid,
  NftBox,
  NftImage,
  Attrs,
  PropertyName,
  PriceLabel,
  PropertyPriceWrap,
  CoinIcon,
  InfoIcon,
  PropertyPrice,
} from "./styles/PublicMarket.style";

import SearchIcon from "../../assets/images/search-icon.svg";
import WaveActivityIndicator from "../../components/global/WaveActivityIndicator";
import NoImageIcon from "../../assets/images/no-image.svg";
import NFTInfo from "../../admin/pages/nfts/NFTInfo";

import WalletConnect from "../../components/global/WalletConnect";

import * as MLNft from "../../blockchain/abi/MLNft";

import marketData from "./marketData.json";

export default function PublicMarket() {
  // const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false);
  const { account } = useWeb3React();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  // @ts-ignore
  const { setModalChildren, setOpen } = useModalContext();

  const items = marketData.data;
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const raw = await getMarketplaceItems();
        // if (raw?.data?.data) {
        //   setItems(raw.data.data)
        //   console.log("Items: ", raw.data.data)
        // }
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    })();
  }, [account, role]);

  function handleLoginMember(e: any) {
    e.stopPropagation();
    setModalChildren(<WalletConnect onClose={() => setOpen(false)} />);
    setOpen(true);
  }

  function handleInfoClick(tokenId: any, e: any) {
    e.stopPropagation();
    if (tokenId) {
      setModalChildren(
        <NFTInfo tokenId={tokenId} close={() => setOpen(false)} />,
      );
      setOpen(true);
    }
  }

  function handleShowDetailClick(item: any) {
    navigate(
      `/marketplace/${item?.token_address || MLNft.ADDRESS}/${
        item?.token_id || item?.id
      }`,
    );
  }

  const isMLMember = account && role;

  return (
    <Container>
      <SearchSection>
        <SearchInputWrap>
          <SearchInputImage src={SearchIcon} />
          <SearchInput placeholder="Search by name or attribute" />
        </SearchInputWrap>
      </SearchSection>
      <NftGrid>
        {loading ? (
          <WaveActivityIndicator bg="lightgray" />
        ) : (
          items.length > 0 &&
          items.map((item: any, i: any) => {
            return (
              <NftBox
                key={i}
                logged={account ? true : false}
                onClick={() => handleShowDetailClick(item)}
              >
                <NftImage
                  src={item?.nftData?.image || NoImageIcon}
                  hasImage={item?.nftData?.image}
                  isml={isMLMember ? true : false}
                />
                <Attrs isml={isMLMember ? true : false}>
                  <PropertyName>{item?.nftData?.name || item?.id}</PropertyName>

                  <>
                    <PriceLabel>Price</PriceLabel>
                    <PropertyPriceWrap>
                      <PropertyPrice>PHP {item.minSalePrice}</PropertyPrice>
                    </PropertyPriceWrap>
                  </>
                  <InfoIcon
                    src={require("../../assets/images/nft-info.svg").default}
                    onClick={(e) =>
                      isMLMember
                        ? handleInfoClick(item?.token_id || item?.id, e)
                        : null
                    }
                  />
                </Attrs>
              </NftBox>
            );
          })
        )}
      </NftGrid>
    </Container>
  );
}
