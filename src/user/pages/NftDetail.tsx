import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

import dateFormat from "dateformat"

import { ML_STOCK_IMG } from "../../constants"

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
  CurrentPriceBox,
  CoinIcon,
  LoadingWrap,
  CPLabel,
  CPValue,
  CPValueWrapRow,
  Button,
  ButtonGroupJustified,
  Metadata,
  MetadataFlexWrap,
  Col,
  Text,
  DetailsWrap,
  CellJustified,
  Row,
  ActionSection,
  ActionGroup,
  ActionImage,
  FullImage,
  HistorySection,
  BidSection,
  OwnedByRow,
  OwnedBySection,
  AbsoluteWrap,
  CommonImage,
  IHSearchSection,
  IHSearchInput,
  IHHeaderSection,
  IHHeaderLabel,
  IHContentSection,
  IHContentScrolling,
  IHImage,
  IHItemCell,
  IHItemCol,
  IHItemRow,
  IOContentScrolling,
  IOContentSection,
  IOItemRow,
  AcceptButton,
} from "./styles/NftDetail.style"

import { IModalContext } from "../../interfaces/ModalContext.interface"

import {
  getNftOffers,
  getNftTransactionsById,
  logNftTransaction,
} from "../../api/Nft"
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "../../components/global/Accordion"
import {
  truncate,
  dateDiff,
  truncateText,
  errorCatcher,
} from "../../utils/helpers"
import { setRemoveHeaderBorder } from "../../redux/utilReducer"
import { useModalContext } from "../../hooks/ModalContext"
import { markFullyPayed } from "../../blockchain/actions/MLNftAction"
import { getNftInfoById } from "../../api/Nft"
import { getMarketPlaceItemById } from "../../api/Marketplace"
import {
  acceptBid,
  cancelForSale,
} from "../../blockchain/actions/MLMarketplaceAction"

import MakeBid from "./MakeBid"
import Transfer from "./Transfer"
import Burn from "./Burn"
import Retract from "./Retract"
import ListToMarket from "./ListToMarket"
import Offer from "./Offer"
import EtheIcon from "../../assets/images/ethereum-icon.svg"
import EtheRedIcon from "../../assets/images/ethereum-icon-red.svg"
import RefreshIcon from "../../assets/images/refresh.png"
import MaximizeIcon from "../../assets/images/maximize.png"
import ViewIcon from "../../assets/images/view.svg"
import FavoriteIcon from "../../assets/images/favorite.svg"

/*** This component is responsible and being displayed
 * on http://localhost:3000/home/nfts/{contractAddress}/{tokenId}
 */
export default function NftDetail() {
  const { contractAddress, tokenId } = useParams()
  const refContainer = useRef<HTMLDivElement>(null)
  const refContentBody = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<any>()
  const [flexible, setFlexible] = useState(false)
  const [histories, setHistories] = useState<any[]>([])
  const [reload, setReload] = useState(0)
  const dispatch = useDispatch()

  // @ts-ignore
  const {
    setOpen,
    setModalChildren,
    setFormScreen,
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
  }: IModalContext = useModalContext()

  // @ts-ignore
  const { utilState, web3State } = useSelector((state) => state)
  const { account } = useWeb3React()
  const role = localStorage.getItem("role")

  function handleShowFull() {
    setModalChildren(
      <FullImage
        // imagePath={
        //   item?.image ? item.image.replaceAll(" ", "%20").replace('https://int.managelifeapi.co/api/managelife/v1/properties/photo/','') : NoImageIcon
        // }
        imagePath={
          item?.image ||
          "https://res.cloudinary.com/dbjlcflj0/image/upload/v1667559320/manage-life/default-NFT-image_jzvv6h.png"
        }
        onClose={() => {
          setOpen(false)
        }}
      />
    )
    setOpen(true)
  }

  function initEvents() {
    // @ts-ignore
    window.onscroll = () => {
      if (refContainer.current) {
        if (refContainer.current.getBoundingClientRect().y <= 52) {
          dispatch(setRemoveHeaderBorder(false))
        } else {
          dispatch(setRemoveHeaderBorder(true))
        }
      }
    }
  }

  async function handleCancelListingClick() {
    try {
      if (account) {
        setLoadingMessage("Cancelling for sale... transaction in process...")
        const tx = await cancelForSale(item.property_id, account)
        if (tx) {
          if (tx) {
            const res = await logNftTransaction(
              item.property_id,
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
              "nft"
            )
            setSuccessMessage("Cancelled for sale!")
          } else {
            setErrorMessage("Cancelling for sale failed.")
          }
        }
      }
    } catch (e) {
      setErrorMessage(errorCatcher(e))
    }
  }
  async function handleUpdatePriceClick() { }

  async function handleMarkFullyPaidClick() {
    try {
      if (account) {
        setLoadingMessage("Marking as fully paid... transaction in process...")
        const tx = await markFullyPayed(item.property_id, account)
        if (tx) {
          const res = await logNftTransaction(
            item.property_id,
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
            "nft"
          )
          setSuccessMessage("Marked as fully paid!")
        } else {
          setErrorMessage("Marking as fully paid failed.")
        }
      }
    } catch (e) {
      setErrorMessage(errorCatcher(e))
    }
  }

  async function handleTransferClick() {
    if (item?.property_id || item?.propertyId) {
      setFormScreen(
        <Transfer nft={item} closeModal={() => setFormScreen(null)} />
      )
    }
  }

  async function handleBurnClick() {
    if (item?.property_id || item?.propertyId) {
      setFormScreen(<Burn nft={item} closeModal={() => setFormScreen(null)} />)
    }
  }

  async function handleNftRetraction() {
    if (item?.property_id || item?.propertyId) {
      setFormScreen(
        <Retract nft={item} closeModal={() => setFormScreen(null)} />
      )
    }
  }

  function handleListToMarketClick() {
    if (item?.property_id || item?.propertyId) {
      setFormScreen(
        <ListToMarket nft={item} closeModal={() => setFormScreen(null)} />
      )
    }
  }

  async function handleOfferClick() {
    if (item?.property_id || item?.propertyId) {
      setFormScreen(<Offer nft={item} closeModal={() => setFormScreen(null)} />)
    }
  }

  async function handleBidClick() {
    if (item?.property_id || item?.propertyId) {
      setFormScreen(
        <MakeBid nft={item} closeModal={() => setFormScreen(null)} />
      )
    }
  }

  async function handleReloadData() {
    setReload((prev) => (prev === 1 ? 0 : 1))
  }

  useEffect(() => {
    ; (async () => {
      try {
        if (account) {
          if (localStorage.getItem("role")) {
            if (localStorage.getItem("role") === "admin") {
              const raw = await getNftInfoById(tokenId, account)
              setItem(raw?.data?.data)
            } else if (localStorage.getItem("role") === "home_owner") {
              const raw = await getNftInfoById(tokenId, account)
              if (raw?.data?.data) {
                setItem(raw.data.data)
              }
            }
          } else {
            const raw = await getNftInfoById(tokenId, account)
            if (raw?.data?.data) {
              setItem(raw.data.data)
            }
          }
        } else {
          const raw = await getMarketPlaceItemById(tokenId)
          setItem(raw?.data)
        }
      } catch (e) {
        console.log(e)
        setLoading(false)
      } finally {
        setLoading(false)
      }
    })()

    initEvents()
  }, [account])

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
              <ContentBodyJustify>
                <LeftContent isflexible={flexible}>
                  <ImageBox>
                    <ImageHeader>
                      <CoinIcon
                        src={
                          require("../../assets/images/ethereum-icon.svg")
                            .default
                        }
                      />
                    </ImageHeader>
                    <Image
                      src={item?.image ?? ML_STOCK_IMG}
                      hasImage={true}
                      onClick={handleShowFull}
                    />
                  </ImageBox>
                </LeftContent>
                <RightContent>
                  <Row>
                    <ActionSection>
                      <ActionGroup>
                        <ActionImage
                          src={RefreshIcon}
                          hasBorderRight
                          onClick={handleReloadData}
                        />
                        <ActionImage src={MaximizeIcon} hasBorderLeft />
                      </ActionGroup>
                    </ActionSection>
                  </Row>
                  <Row>
                    {/*<Text size={1.9} font="Poppins-SemiBold">{item?.name} - {item?.property_id ? `#${item.property_id}` : ''}</Text>*/}
                    <Text size={1.9} font="Poppins-SemiBold">
                      {item?.name} -{" "}
                      {item?.property_id ||
                        item?.property_id ||
                        item?.id ||
                        tokenId}
                    </Text>
                  </Row>
                  <Row marginTop={1} marginBottom={2}>
                    <OwnedBySection>
                      <AbsoluteWrap>
                        <OwnedByRow>
                          {account && (
                            <>
                              <Text
                                size={0.9}
                                font="Poppins-Light"
                                color="gray"
                              >
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
                                {item?.owner_name || item?.ownerName}
                              </NavLink>
                            </>
                          )}
                        </OwnedByRow>
                        <OwnedByRow>
                          <CommonImage src={ViewIcon} h={1.3} />
                          &nbsp;
                          <Text size={0.9} font="Poppins-Light" color="gray">
                            {item?.views} views
                          </Text>
                        </OwnedByRow>
                        <OwnedByRow>
                          <CommonImage src={FavoriteIcon} h={1.3} />
                          &nbsp;
                          <Text size={0.9} font="Poppins-Light" color="gray">
                            {item?.favorites} favorite
                          </Text>
                        </OwnedByRow>
                      </AbsoluteWrap>
                    </OwnedBySection>
                  </Row>
                  {account && (
                    <CurrentPriceBox>
                      <CurrentPrice>
                        <CPLabel>Current price</CPLabel>
                        <CPValueWrapRow>
                          <CoinIcon
                            src={
                              require("../../assets/images/ethereum-icon.svg")
                                .default
                            }
                            h={1.5}
                          />
                          <CPValue>{item?.minSalePrice}</CPValue>
                        </CPValueWrapRow>
                        {role === "admin" ? (
                          item?.status === "listed" ? (
                            <ButtonGroupJustified>
                              <Button
                                color="#ffffff"
                                bg="#2A72A7"
                                fontSize={12}
                                onClick={handleCancelListingClick}
                              >
                                Cancel Listing
                              </Button>
                              <Button
                                color="#2A72A7"
                                bg="#ffffff"
                                fontSize={role ? 10 : 12}
                                borderColor="rgba(0,0,0,0.1)"
                                onClick={handleUpdatePriceClick}
                              >
                                Update Price
                              </Button>
                            </ButtonGroupJustified>
                          ) : item?.status === "bought" ? (
                            <ButtonGroupJustified>
                              <Button
                                color="#ffffff"
                                bg="#2A72A7"
                                fontSize={12}
                                onClick={handleMarkFullyPaidClick}
                              >
                                Mark as Fully Paid
                              </Button>
                            </ButtonGroupJustified>
                          ) : (
                            <ButtonGroupJustified>
                              <Button
                                color="#ffffff"
                                bg="#2A72A7"
                                fontSize={role ? 10 : 12}
                                onClick={handleTransferClick}
                              >
                                Transfer
                              </Button>
                              <Button
                                color="#ffffff"
                                bg="#2A72A7"
                                fontSize={role ? 10 : 12}
                                onClick={handleBurnClick}
                              >
                                Burn
                              </Button>
                              <Button
                                color="#ffffff"
                                bg="#f67159"
                                fontSize={role ? 10 : 12}
                                onClick={handleNftRetraction}
                              >
                                Revoke
                              </Button>
                              <Button
                                color="#2A72A7"
                                bg="#ffffff"
                                fontSize={role ? 10 : 12}
                                borderColor="rgba(0,0,0,0.1)"
                                onClick={handleListToMarketClick}
                              >
                                List to Market
                              </Button>
                              <Button
                                color="#2A72A7"
                                bg="#ffffff"
                                fontSize={role ? 10 : 12}
                                borderColor="rgba(0,0,0,0.1)"
                                onClick={handleOfferClick}
                              >
                                Offer
                              </Button>
                            </ButtonGroupJustified>
                          )
                        ) : (
                          <ButtonGroupJustified>
                            <Button
                              color="#2A72A7"
                              bg="#ffffff"
                              fontSize={role ? 10 : 12}
                              borderColor="rgba(0,0,0,0.1)"
                              onClick={handleListToMarketClick}
                            >
                              List to marketplace
                            </Button>
                          </ButtonGroupJustified>
                        )}
                      </CurrentPrice>
                    </CurrentPriceBox>
                  )}
                  <Accordion noGap key="accordion-0">
                    <AccordionItem eventKey={0}>
                      <AccordionHeader eventKey={0} keepExpand>
                        Description
                      </AccordionHeader>
                      <AccordionBody eventKey={0}>
                        <Col>
                          <Row>
                            <Text size={0.9}>By&nbsp;</Text>
                            <Text size={0.9} font="Poppins-SemiBold">
                              {item?.name}
                            </Text>
                          </Row>
                          <Text size={0.9}>
                            {item?.nft?.description || item?.description}
                          </Text>
                        </Col>
                      </AccordionBody>
                    </AccordionItem>
                    {(item?.attributes && item?.attributes.length) > 0 && (
                      <AccordionItem eventKey={1}>
                        <AccordionHeader eventKey={1}>
                          Properties
                        </AccordionHeader>
                        <AccordionBody eventKey={1}>
                          <MetadataFlexWrap>
                            {(item?.attributes || []).map(
                              (m: any, i: number) => {
                                let mValue =
                                  m.display_type === "date"
                                    ? dateFormat(
                                      new Date(m.value * 1000),
                                      "mmm dd, yyyy"
                                    )
                                    : m.value
                                return (
                                  <Metadata key={i}>
                                    <Text size={0.63} color="#2A72A7" bold>
                                      {(
                                        m.trait_type.replaceAll("_", " ") || ""
                                      ).toUpperCase()}
                                    </Text>
                                    <Text size={0.8} color="#000000" bold>
                                      {!isNaN(mValue)
                                        ? Number(mValue).toLocaleString()
                                        : mValue}
                                    </Text>
                                    <Text size={0.75} color="rgba(0,0,0,0.5)">
                                      Good to have this trait
                                    </Text>
                                  </Metadata>
                                )
                              }
                            )}
                          </MetadataFlexWrap>
                        </AccordionBody>
                      </AccordionItem>
                    )}
                    {/*
                                            {
                                                item?.address?.address1 && (
                                                    <AccordionItem eventKey={2}>
                                                        <AccordionHeader eventKey={2}>About ManageLife</AccordionHeader>
                                                        <AccordionBody eventKey={2}>
                                                            <Text size={0.9}>
                                                                {item?.address?.address1},&nbsp;
                                                                {item?.address?.address2}&nbsp;
                                                                {item?.address?.city},&nbsp;
                                                                {item?.address?.state}&nbsp;
                                                                {item?.address?.country}&nbsp;
                                                                {item?.address?.zipCode}
                                                            </Text>
                                                        </AccordionBody>
                                                    </AccordionItem>
                                                )
                                            }
*/}
                    <AccordionItem eventKey={3}>
                      <AccordionHeader eventKey={3}>Details</AccordionHeader>
                      <AccordionBody eventKey={3}>
                        <DetailsWrap>
                          <CellJustified>
                            <Text size={0.9}>Contract Address</Text>
                            <Text size={0.9} color="#2081E2">
                              {truncate(contractAddress || "")}
                            </Text>
                          </CellJustified>
                          <CellJustified>
                            <Text size={0.9}>Token ID</Text>
                            <Text size={0.9} color="#2081E2">
                              {item?.property_id}
                            </Text>
                          </CellJustified>
                          <CellJustified>
                            <Text size={0.9}>Token Standard</Text>
                            <Text size={0.9}>ERC-721</Text>
                          </CellJustified>
                          <CellJustified>
                            <Text size={0.9}>Blockchain</Text>
                            <Text size={0.9}>Ethereum</Text>
                          </CellJustified>
                          <CellJustified>
                            <Text size={0.9}>Last Updated</Text>
                            <Text size={0.9}>
                              {dateDiff(
                                new Date(),
                                new Date(
                                  dateFormat(item?.updatedAt, "yyyy-mm-dd")
                                )
                              )}
                            </Text>
                          </CellJustified>
                        </DetailsWrap>
                      </AccordionBody>
                    </AccordionItem>
                  </Accordion>

                  {role && (
                    <BidSection>
                      <Accordion key="accordion-1">
                        <AccordionItem eventKey={4}>
                          <AccordionHeader eventKey={4} expand>
                            Offers
                          </AccordionHeader>
                          <AccordionBody eventKey={4} noPadding>
                            <ItemBids tokenId={tokenId} refresh={reload} />
                          </AccordionBody>
                        </AccordionItem>
                      </Accordion>
                    </BidSection>
                  )}
                </RightContent>
              </ContentBodyJustify>
              {role && (
                <HistorySection>
                  <Accordion key="accordion-2">
                    <AccordionItem eventKey={5}>
                      <AccordionHeader eventKey={5} expand>
                        Item History
                      </AccordionHeader>
                      <AccordionBody eventKey={5} noPadding>
                        <ItemHistory tokenId={tokenId} items={histories} />
                      </AccordionBody>
                    </AccordionItem>
                  </Accordion>
                </HistorySection>
              )}
            </ContentBodyCol>
          </ContentBody>
        </TabContent>
      )}
    </Container>
  )
}

const ItemBids = ({ tokenId, refresh }: any) => {
  const [bids, setBids] = useState<any[]>([])
  // @ts-ignore
  const { setLoadingMessage, setSuccessMessage, setErrorMessage } =
    useModalContext()
  const { account } = useWeb3React()
  const role = localStorage.getItem("role")

  useEffect(() => {
    ; (async () => {
      await loadData()
    })()
  }, [account, refresh])

  async function loadData() {
    try {
      const rawBids = await getNftOffers(tokenId)
      if (rawBids?.data?.data) {
        setBids(rawBids.data.data)
      }
    } catch (e) { }
  }

  async function handleAcceptBidClick(nft: any) {
    if (account) {
      try {
        setLoadingMessage("Accepting bid...transaction in process...")
        const txBid = await acceptBid(nft.id, nft.bidPrice, account)
        if (txBid) {
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
            "nft"
          )
          await loadData()
          setSuccessMessage("Accept bid success.")
        }
      } catch (e) {
        setErrorMessage(errorCatcher(e))
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
                        new Date(dateFormat(item?.updatedAt, "yyyy-mm-dd"))
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
            )
          })}
        </IOContentScrolling>
      </IOContentSection>
    </Col>
  )
}

const ItemHistory = ({ tokenId }: any) => {
  const [items, setItems] = useState<any[]>([])
  const { account } = useWeb3React()

  const min = Math.min.apply(
    Math,
    items.map((o: any) => {
      return o.minSalePrice
    })
  )
  const max = Math.max.apply(
    Math,
    items.map((o: any) => {
      return o.minSalePrice
    })
  )

  useEffect(() => {
    ; (async () => {
      try {
        const raw = await getNftTransactionsById(account, tokenId)
        if (raw?.data?.data) {
          setItems(raw.data.data)
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [])

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
                        new Date(dateFormat(item?.updatedAt, "yyyy-mm-dd"))
                      )}{" "}
                      days ago
                    </Text>
                  </IHItemCell>
                </IHItemRow>
              </IHItemCol>
            )
          })}
        </IHContentScrolling>
      </IHContentSection>
    </Col>
  )
}
