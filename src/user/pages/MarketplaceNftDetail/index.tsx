/***
 * @todo: Refactor this file to a more modular piece.
 */

import { useEffect, useRef, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useParams, NavLink } from "react-router-dom";

import dateFormat from "dateformat";
import styled from "styled-components";
import "chart.js/auto";

import { dateDiff, truncateText, errorCatcher } from "../../../utils/helpers";
import {
  acceptBid,
  cancelForSale,
} from "../../../blockchain/actions/MLMarketplaceAction";
import { markFullyPayed } from "../../../blockchain/actions/MLNftAction";
import { buy } from "../../../blockchain/actions/MLInvestorsMarketplace";

import {
  getNftOffers,
  getNftTransactionsById,
  logNftTransaction,
  saveNftFavorited,
} from "../../../api/Nft";
import { fetchETHPrice } from "../../../api/Prices";
import { getNftInfoById } from "../../../api/Nft";
import { getMarketPlaceItemById } from "../../../api/Marketplace";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "../../../components/global/Accordion";
import { setRemoveHeaderBorder } from "../../../redux/utilReducer";
import { useModalContext } from "../../../hooks/ModalContext";
import { formatToUsd } from "../../../utils/currencyFormatter.helper";
import {
  IGetMarketItemResponse,
  NftAttribute,
} from "../../../interfaces/marketplace/GetMarketItemResponse";
import { IPropertyDetailedInformation } from "../../../interfaces/property/PropertyInfo";

import {
  Container,
  TabContent,
  NotFound,
  ContentBody,
  ContentBodyCol,
  ContentBodyJustify,
  LeftContent,
  RightContent,
  ImageBox,
  ImageHeader,
  Image,
  CurrentPrice,
  CoinIcon,
  LoadingWrap,
  CPLabel,
  CPValue,
  CPValueWrapRow,
  Button,
  Col,
  Spacing,
  Text,
  DetailsWrap,
  CellJustified,
  Row,
  SaleEndsDetail,
  PriceHistoryWrap,
  ButtonsWrap,
  ButtonDoubleSlideWrap,
  QuickResponsive,
  FullScreenQuickResponsive,
  FullImageContainer,
  FICloseButton,
  OwnedByRow,
  OwnedBySection,
  FavoriteButton,
  CommonImage,
  BuyButton,
  IHSearchSection,
  IHSearchInput,
  IHHeaderSection,
  IHHeaderLabel,
  IOContentSection,
  IOContentScrolling,
  IHItemCol,
  IOItemRow,
  IHImage,
  IHItemCell,
  AcceptButton,
  IHContentScrolling,
  IHContentSection,
  IHItemRow,
} from "./Styles/index.style";

import EtheIcon from "../../../assets/images/ethereum-icon.svg";
import EtheRedIcon from "../../../assets/images/ethereum-icon-red.svg";
import ViewIcon from "../../../assets/images/view.svg";
import FavoriteIcon from "../../../assets/images/favorite.svg";
import DescriptionAccordion from "./DescriptionAccordion";

import ModalImage from "./ModalImage";
import MoreButtons from "./MoreButtons";
import ModalSaveSearch from "./ModalSaveSearch";
import ModalShare from "./ModalShare";
import WarningMessage from "./WarningMessage";
import MakeBid from "../MakeBid";
import Transfer from "../Transfer";
import Burn from "../Burn";
import ListToMarket from "../ListToMarket";
import Offer from "../Offer";
import BuyProperty from "../BuyProperty";

const UserData = [
  {
    id: 1,
    year: 2016,
    userGain: 80000,
    userLost: 823,
  },
  {
    id: 2,
    year: 2017,
    userGain: 45677,
    userLost: 345,
  },
  {
    id: 3,
    year: 2018,
    userGain: 78888,
    userLost: 555,
  },
  {
    id: 4,
    year: 2019,
    userGain: 90000,
    userLost: 4555,
  },
  {
    id: 5,
    year: 2020,
    userGain: 4300,
    userLost: 234,
  },
];

/***
 * This is the component being render on this page path:
 * http://localhost:3000/marketplace/{contractAddress}/{tokenId}
 */
export default function MarketplaceNftDetail() {
  const { contractAddress, tokenId } = useParams();
  const refContainer = useRef<HTMLDivElement>(null);
  const refContentBody = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<
    IGetMarketItemResponse | IPropertyDetailedInformation
  >();
  const [flexible, setFlexible] = useState(false);
  const [histories, setHistories] = useState<any[]>([]);
  const [reload, setReload] = useState(0);
  const [nftAttributes, setNftAttributes] = useState<
    NftAttribute[] | undefined
  >();
  const [priceHistory, setPriceHistory] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [favorites, setFavorites] = useState(0);

  const [ethInUsd, setEthInUsd] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchETHPrice()
      .then((price) => {
        setEthInUsd(price?.data?.USD);
      })
      .catch((error) => {
        console.error("Error in getting ETH price:", error);
      });
  }, []);

  // LOL. TODO: Identify the correct types
  interface ModalContext {
    setOpen: any;
    setModalChildren: any;
    setFormScreen: any;
    setLoadingMessage: any;
    setErrorMessage: any;
    setSuccessMessage: any;
  }

  // @ts-ignore
  const {
    setOpen,
    setModalChildren,
    setFormScreen,
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
  }: ModalContext = useModalContext();

  // @ts-ignore
  const { utilState } = useSelector((state) => state);
  const { account } = useWeb3React();
  const role = localStorage.getItem("role");
  const mlContact = "(210) 806-7558";

  function handleShowFull() {
    setModalChildren(
      <ModalImage
        item={item}
        handleSetFavorite={setFavorites}
        isOpen={true}
        closeModal={() => setOpen(false)}
      />,
    );
    setOpen(true);
  }

  function handleNftPurchase() {
    if (item) {
      setFormScreen(
        <BuyProperty nft={item} closeModal={() => setFormScreen(null)} />,
      );
    }
  }

  function initEvents() {
    // @ts-ignore
    window.onscroll = () => {
      if (refContainer.current) {
        if (refContainer.current.getBoundingClientRect().y <= 52) {
          dispatch(setRemoveHeaderBorder(false));
        } else {
          dispatch(setRemoveHeaderBorder(true));
        }
      }
    };
  }

  async function handleCancelListingClick() {
    try {
      if (account) {
        setLoadingMessage("Cancelling for sale... transaction in process...");
        const tx = await cancelForSale(item?.propertyId, account);
        if (tx) {
          if (tx) {
            console.log(tx);
            const res = await logNftTransaction(
              item?.propertyId,
              "sale",
              "cancelled",
              tx.transactionHash,
              tx.from,
              tx.to,
              ethers.utils.formatUnits(tx.gasUsed),
              0,
              tx.events,
              tx.logs,
              "",
              "nft",
            );
            console.log(res);
            setSuccessMessage("Cancelled for sale!");
          } else {
            setErrorMessage("Cancelling for sale failed.");
          }
        }
      }
    } catch (e) {
      setErrorMessage(errorCatcher(e));
    }
  }

  async function handleMarkFullyPaidClick() {
    try {
      if (account) {
        setLoadingMessage("Marking as fully paid... transaction in process...");
        const tx = await markFullyPayed(item?.propertyId, account);
        if (tx) {
          console.log(tx);
          const res = await logNftTransaction(
            item?.propertyId,
            "mark",
            "fullyPaid",
            tx.transactionHash,
            tx.from,
            tx.to,
            ethers.utils.formatUnits(tx.gasUsed),
            0,
            tx.events,
            tx.logs,
            "",
            "nft",
          );
          console.log(res);
          setSuccessMessage("Marked as fully paid!");
        } else {
          setErrorMessage("Marking as fully paid failed.");
        }
      }
    } catch (e) {
      setErrorMessage(errorCatcher(e));
    }
  }

  async function handleTransferClick() {
    if (item?.propertyId) {
      setFormScreen(
        <Transfer nft={item} closeModal={() => setFormScreen(null)} />,
      );
    }
  }

  async function handleBurnClick() {
    if (item?.propertyId) {
      setFormScreen(<Burn nft={item} closeModal={() => setFormScreen(null)} />);
    }
  }

  function handleListToMarketClick() {
    if (item?.propertyId) {
      setFormScreen(
        <ListToMarket nft={item} closeModal={() => setFormScreen(null)} />,
      );
    }
  }

  async function handleOfferClick() {
    if (item?.propertyId) {
      setFormScreen(
        <Offer nft={item} closeModal={() => setFormScreen(null)} />,
      );
    }
  }

  async function handleBidClick() {
    if (item) {
      setFormScreen(
        <MakeBid nft={item} closeModal={() => setFormScreen(null)} />,
      );
    }
  }

  async function handleReloadData() {
    setReload((prev) => (prev === 1 ? 0 : 1));
  }

  function handleOpenShareModel() {
    setModalChildren(
      <ModalShare isOpen={true} closeModal={() => setOpen(false)} />,
    );
    setOpen(true);
  }

  function handleOpenSearchModal() {
    setModalChildren(
      <ModalSaveSearch isOpen={true} closeModal={() => setOpen(false)} />,
    );
    setOpen(true);
  }

  async function handleFavoriteClick() {
    try {
      if (role) {
        const respond = await saveNftFavorited({
          walletAddress: account,
          id: item?.propertyId,
        });
        setFavorites(respond?.data?.data?.favorites || 0);
      } else {
        setModalChildren(
          <WarningMessage
            message="You must be a ML member to add favorite."
            isOpen={true}
            closeModal={() => setOpen(false)}
          />,
        );
        setOpen(true);
      }
    } catch (e) {}
  }

  async function fetchData() {
    try {
      if (account) {
        if (localStorage.getItem("role")) {
          if (localStorage.getItem("role") === "admin") {
            const raw = await getNftInfoById(tokenId, account);
            setFavorites(raw?.data?.data?.favorites);
            setItem(raw?.data?.data);
            setNftAttributes(raw?.data?.data?.attributes);
          } else if (localStorage.getItem("role") === "home_owner") {
            const raw = await getNftInfoById(tokenId, account);
            if (raw?.data?.data) {
              setFavorites(raw?.data?.data?.favorites);
              setItem(raw.data.data);
              setNftAttributes(raw?.data?.data?.attributes);
            }
          }
        } else {
          const raw = await getNftInfoById(tokenId, account);
          if (raw?.data?.data) {
            setFavorites(raw?.data?.data?.favorites);
            setItem(raw.data.data);
            setNftAttributes(raw?.data?.data?.attributes);
          }
        }
      } else {
        const raw = await getMarketPlaceItemById(tokenId);
        if (raw?.data) {
          raw.data.tokenId = tokenId;
        }
        setItem(raw?.data);
        setNftAttributes(raw?.data?.data?.attributes);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchData();
      console.log(item);
    })();

    initEvents();

    setPriceHistory({
      labels: UserData.map((o) => o.year),
      datasets: [
        {
          label: "Users Gained",
          data: UserData.map((o) => o.userGain),
          type: "bar",
        },
        {
          label: "Users Gained",
          data: UserData.map((o) => o.userGain),
          type: "line",
        },
      ],
    });

    const data = {
      labels: UserData.map((o) => o.year),
      datasets: [
        {
          label: "Users Gained",
          data: UserData.map((o) => o.userGain),
        },
        {
          label: "Users Gained",
          data: UserData.map((o) => o.userGain),
          type: "line",
        },
      ],
    };
  }, [account]);

  const itemSalePrice = item?.minSalePrice ?? 0;
  const usdCost = formatToUsd(itemSalePrice * ethInUsd);

  const monthlyPaymentAttribute = nftAttributes?.filter(
    (item: NftAttribute) => item?.trait_type === "estimated_monthly_payment",
  );

  const saleAmount = item?.minSalePrice;
  const propertyId = item?.propertyId;

  // @note @todo Refactor this
  async function handleNftiSaleClick() {
    try {
      if (account) {
        setLoading(true);
        const tx = await buy(saleAmount, propertyId); // item?.minSalePrice, item?.propertyId)
        if (tx) {
          console.log(tx);
          const res = await logNftTransaction(
            propertyId,
            "sale",
            "sold",
            tx.transactionHash,
            tx.from,
            tx.to,
            ethers.utils.formatUnits(tx.gasUsed),
            saleAmount,
            tx.events,
            tx.logs,
            "",
            "nfti",
          );
          console.log(res);
          setSuccessMessage("NFT has been purchased successfully.");
        } else {
          setErrorMessage("Transaction failed");
        }

        setLoading(false);
      }
    } catch (e) {
      setErrorMessage(errorCatcher(e));
      setLoading(false);
    }
  }

  const monthlyPaymentValue = monthlyPaymentAttribute?.[0]?.value ?? 0;
  return (
    <Container isAdmin={utilState.isAdmin} ref={refContainer}>
      {loading && (
        <LoadingWrap>
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </LoadingWrap>
      )}
      {!loading && !item ? (
        <NotFound>Metadata not found.</NotFound>
      ) : (
        <TabContent>
          <ContentBody ref={refContentBody}>
            <ContentBodyCol>
              <QuickResponsive>
                <Col>
                  <CellJustified>
                    <Row>
                      <Text size={1.9} font="Poppins-SemiBold">
                        Mindoro Farm #7
                      </Text>
                    </Row>
                    <MoreButtons
                      openShareModal={handleOpenShareModel}
                      openSearchModal={handleOpenSearchModal}
                      handleRefresh={fetchData}
                    />
                  </CellJustified>
                  <Row>
                    <OwnedByRow>
                      <>
                        <Text size={0.9} font="Poppins-Light" color="gray">
                          Owned by&nbsp;
                        </Text>
                        <NavLink
                          // to={`/ownedby/0xx`}
                          to="/marketplace/account"
                          style={({ isActive }) => ({
                            textDecoration: "none",
                            color: "#2C72A7",
                            fontSize: "0.9rem",
                          })}
                        >
                          {item?.ownerName}
                        </NavLink>
                      </>
                    </OwnedByRow>
                  </Row>
                  <Row marginTop={1} marginBottom={2}>
                    <OwnedBySection>
                      <OwnedByRow>
                        <CommonImage src={ViewIcon} h={1.3} />
                        &nbsp;
                        <Text size={0.9} font="Poppins-Light" color="gray">
                          {item?.views} views
                        </Text>
                      </OwnedByRow>
                      <Spacing w={1} />
                      <OwnedByRow>
                        <FavoriteButton
                          locked={!account}
                          onClick={() =>
                            account ? handleFavoriteClick() : null
                          }
                        >
                          <CommonImage src={FavoriteIcon} h={1.3} />
                          &nbsp;
                          <Text size={0.9} font="Poppins-Light" color="gray">
                            {favorites} favorite
                          </Text>
                        </FavoriteButton>
                      </OwnedByRow>
                    </OwnedBySection>
                  </Row>
                </Col>
              </QuickResponsive>

              <ContentBodyJustify>
                <LeftContent isflexible={flexible}>
                  <ImageBox>
                    <ImageHeader>
                      <CoinIcon
                        src={
                          require("../../../assets/images/ethereum-icon.svg")
                            .default
                        }
                      />
                    </ImageHeader>
                    <Image
                      src={"https://glenhill.co.nz/images/bfi_1.jpg"}
                      hasImage={true}
                      onClick={handleShowFull}
                    />
                  </ImageBox>

                  <DescriptionAccordion
                    item={item}
                    contractAddress={contractAddress}
                  />
                </LeftContent>
                <RightContent>
                  <FullScreenQuickResponsive>
                    <CellJustified>
                      <Row>
                        <Text size={1.9} font="Poppins-SemiBold">
                          Mindoro Farm #7
                        </Text>
                      </Row>
                      <MoreButtons
                        openShareModal={handleOpenShareModel}
                        openSearchModal={handleOpenSearchModal}
                        handleRefresh={fetchData}
                      />
                    </CellJustified>
                    <Row>
                      <OwnedByRow>
                        {account && (
                          <>
                            <Text size={0.9} font="Poppins-Light" color="gray">
                              Owned by&nbsp;
                            </Text>
                            <NavLink
                              to="/marketplace/account"
                              style={({ isActive }) => ({
                                textDecoration: "none",
                                color: "#2C72A7",
                                fontSize: "0.9rem",
                              })}
                            >
                              {item?.ownerName}
                            </NavLink>
                          </>
                        )}
                      </OwnedByRow>
                    </Row>
                    <Row marginTop={1} marginBottom={2}>
                      <OwnedBySection>
                        <OwnedByRow>
                          <CommonImage src={ViewIcon} h={1.3} />
                          &nbsp;
                          <Text size={0.9} font="Poppins-Light" color="gray">
                            {item?.views} views
                          </Text>
                        </OwnedByRow>
                        <Spacing w={1} />

                        <OwnedByRow>
                          <FavoriteButton
                            locked={!account}
                            onClick={() =>
                              account ? handleFavoriteClick() : null
                            }
                          >
                            <CommonImage src={FavoriteIcon} h={1.3} />
                            &nbsp;
                            <Text size={0.9} font="Poppins-Light" color="gray">
                              {favorites} favorite
                            </Text>
                          </FavoriteButton>
                        </OwnedByRow>
                      </OwnedBySection>
                    </Row>
                  </FullScreenQuickResponsive>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <Accordion noGap key="accordion-saleends">
                      <AccordionItem eventKey={5}>
                        <AccordionHeader eventKey={5} keepExpand>
                          Pledge Ends: December 25, 2024
                        </AccordionHeader>
                        <AccordionBody eventKey={5}>
                          <SaleEndsDetail>
                            <Row>
                              <CurrentPrice>
                                <CPLabel>Current price</CPLabel>
                                <CPValueWrapRow>
                                  <CPValue>{`PHP 2,000 = 1 Slot`}</CPValue>
                                </CPValueWrapRow>
                              </CurrentPrice>
                            </Row>
                            <Row>77/500 Slots left</Row>
                          </SaleEndsDetail>
                        </AccordionBody>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <ButtonsWrap>
                    <Button
                      color="#ffffff"
                      bg="#2A4FA7"
                      fontSize={role ? 10 : 12}
                      borderColor="rgba(0,0,0,0.1)"
                      onClick={handleBidClick}
                    >
                      Make Pledge
                    </Button>
                  </ButtonsWrap>

                  <PriceHistoryWrap>
                    <Accordion noGap key="accordion-pricehistory">
                      <AccordionItem eventKey={6}>
                        <AccordionHeader eventKey={6} expand>
                          Price History
                        </AccordionHeader>
                        <AccordionBody eventKey={6}>
                          <DetailsWrap>
                            {/* <Chart
                              type="bar"
                              data={priceHistory}
                              options={{
                                borderColor: "blue",
                                scales: {
                                  y: {
                                    beginAtZero: true,
                                  },
                                },
                              }}
                            /> */}
                            No data yet
                          </DetailsWrap>
                        </AccordionBody>
                      </AccordionItem>
                    </Accordion>
                  </PriceHistoryWrap>
                  <Accordion>
                    <AccordionItem eventKey={9}>
                      <AccordionHeader eventKey={9} keepExpand>
                        Contact
                      </AccordionHeader>
                      <AccordionBody eventKey={9}>
                        <Text size={0.9}>{mlContact}</Text>
                      </AccordionBody>
                    </AccordionItem>
                  </Accordion>
                </RightContent>
              </ContentBodyJustify>
            </ContentBodyCol>
          </ContentBody>
        </TabContent>
      )}
    </Container>
  );
}

export const FullImage = ({ imagePath, onClose }: any) => {
  return (
    <FullImageContainer>
      <FICloseButton onClick={onClose} />
      <img src={imagePath} style={{ height: "90%" }} />
    </FullImageContainer>
  );
};

const ItemBids = ({ tokenId, refresh }: any) => {
  const [bids, setBids] = useState<any[]>([]);
  // @ts-ignore
  const { setLoadingMessage, setSuccessMessage, setErrorMessage } =
    useModalContext();
  const { account } = useWeb3React();
  const role = localStorage.getItem("role");

  useEffect(() => {
    (async () => {
      await loadData();
    })();
  }, [account, refresh]);

  async function loadData() {
    try {
      const rawBids = await getNftOffers(tokenId);
      if (rawBids?.data?.data) {
        setBids(rawBids.data.data);
      }
    } catch (e) {}
  }

  async function handleAcceptBidClick(nft: any) {
    if (account) {
      try {
        console.log(nft, nft.id, nft.bidPrice, account);
        setLoadingMessage("Accepting bid...transaction in process...");
        const txBid = await acceptBid(nft.id, nft.bidPrice, account);
        console.log(txBid);
        if (txBid) {
          // const res = await acceptBidApi(bid.id, web3State.account, bid.fromWallet, tx.gasUsed, tx.transactionHash);
          // console.log(res)

          const res = await logNftTransaction(
            nft.property_id,
            "bid",
            "bidAwarded",
            txBid.transactionHash,
            txBid.from,
            txBid.to,
            ethers.utils.formatUnits(txBid.gasUsed),
            Number(nft.minSalePrice),
            txBid.events,
            txBid.logs,
            nft.bidId,
            "nft",
          );
          console.log(res);
          await loadData();
          setSuccessMessage("Accept bid success.");
        }
      } catch (e) {
        setErrorMessage(errorCatcher(e));
      }
    }
  }

  return (
    <Col w={100}>
      <IHHeaderSection>
        <IHHeaderLabel w={18}>Price</IHHeaderLabel>
        <IHHeaderLabel w={17}>USD Price</IHHeaderLabel>
        <IHHeaderLabel w={20}>Floor Difference</IHHeaderLabel>
        <IHHeaderLabel w={20}>TimeStamp</IHHeaderLabel>
        <IHHeaderLabel w={15}>From</IHHeaderLabel>
        {role && role === "admin" && (
          <IHHeaderLabel w={10}>Action</IHHeaderLabel>
        )}
      </IHHeaderSection>
      <IOContentSection activateH={bids?.length >= 5}>
        <IOContentScrolling>
          {bids?.map((item: any, i: number) => {
            return (
              <IHItemCol key={i}>
                <IOItemRow>
                  <IHItemCell w={18}>
                    <Text size={0.8} bold>
                      {item.bidPrice}
                    </Text>
                    <Text size={0.8}>&nbsp;ETH</Text>
                  </IHItemCell>
                  <IHItemCell w={17}>
                    <Text size={0.8}>{(item.usdValue || 0).toFixed(4)}</Text>
                  </IHItemCell>
                  <IHItemCell w={20}></IHItemCell>
                  <IHItemCell w={20}>
                    <Text size={0.8}>
                      {dateDiff(
                        new Date(),
                        new Date(dateFormat(item?.updatedAt, "yyyy-mm-dd")),
                      )}{" "}
                      days ago
                    </Text>
                  </IHItemCell>
                  <IHItemCell w={15}>
                    <Text size={0.8} color={"#2081E2"}>
                      {truncateText(item.from || "", 6)}
                    </Text>
                  </IHItemCell>
                  {role && role === "admin" && (
                    <IHItemCell w={10}>
                      <AcceptButton
                        onClick={() => handleAcceptBidClick(item)}
                      />
                    </IHItemCell>
                  )}
                </IOItemRow>
              </IHItemCol>
            );
          })}
        </IOContentScrolling>
      </IOContentSection>
    </Col>
  );
};

const ItemHistory = ({ tokenId }: any) => {
  const [items, setItems] = useState<any[]>([]);
  const { account } = useWeb3React();

  const min = Math.min.apply(
    Math,
    items.map((o: any) => {
      return o.minSalePrice;
    }),
  );
  const max = Math.max.apply(
    Math,
    items.map((o: any) => {
      return o.minSalePrice;
    }),
  );

  useEffect(() => {
    (async () => {
      try {
        const raw = await getNftTransactionsById(account, tokenId);
        if (raw?.data?.data) {
          setItems(raw.data.data);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <Col w={100}>
      <IHSearchSection>
        <IHSearchInput>
          <option value="">Filter</option>
          <option value="event">Event</option>
          <option value="price">Price</option>
          <option value="from">From</option>
          <option value="to">To</option>
          <option value="date">Date</option>
        </IHSearchInput>
      </IHSearchSection>
      <IHHeaderSection borderTop={1}>
        <IHHeaderLabel w={20}>Event</IHHeaderLabel>
        <IHHeaderLabel w={15}>Price</IHHeaderLabel>
        <IHHeaderLabel w={20}>From</IHHeaderLabel>
        <IHHeaderLabel w={20}>To</IHHeaderLabel>
        <IHHeaderLabel w={25}>Date</IHHeaderLabel>
      </IHHeaderSection>
      <IHContentSection activateH={items?.length >= 6}>
        <IHContentScrolling>
          {items.map((item: any, i: number) => {
            return (
              <IHItemCol key={i}>
                <IHItemRow>
                  <IHItemCell w={20}>
                    <Text size={0.8}>
                      {item.type &&
                        item.type[0].toUpperCase() + item.type.slice(1)}
                    </Text>
                  </IHItemCell>
                  <IHItemCell w={15}>
                    {item.minSalePrice === min ? (
                      <IHImage src={EtheRedIcon} />
                    ) : item.minSalePrice === max ? (
                      <IHImage src={EtheIcon} />
                    ) : (
                      <IHImage src={EtheIcon} />
                    )}
                    <Text size={0.8}>{item.minSalePrice}</Text>
                  </IHItemCell>
                  <IHItemCell w={20}>
                    <Text size={0.8} color={"#2081E2"}>
                      {truncateText(item.from || "Null", 6)}
                    </Text>
                  </IHItemCell>
                  <IHItemCell w={20}>
                    <Text size={0.8} color={"#2081E2"}>
                      {truncateText(item.to || "Null", 6)}
                    </Text>
                  </IHItemCell>
                  <IHItemCell w={25}>
                    <Text size={0.8}>
                      {dateDiff(
                        new Date(),
                        new Date(dateFormat(item?.updatedAt, "yyyy-mm-dd")),
                      )}{" "}
                      days ago
                    </Text>
                  </IHItemCell>
                </IHItemRow>
              </IHItemCol>
            );
          })}
        </IHContentScrolling>
      </IHContentSection>
    </Col>
  );
};
