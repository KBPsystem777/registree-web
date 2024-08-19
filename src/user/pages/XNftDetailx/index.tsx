import React, { useEffect, useRef, useState } from "react"
import dateFormat from "dateformat"
import styled from "styled-components"
import { useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation, NavLink } from "react-router-dom"

import CloseIcon from "../../../assets/images/close-x-icon.svg"
import NoImageIcon from "../../assets/images/no-image.svg"
import EtheIcon from "../../../assets/images/ethereum-icon.svg"
import EtheRedIcon from "../../../assets/images/ethereum-icon-red.svg"
import RefreshIcon from "../../../assets/images/refresh.png"
import MaximizeIcon from "../../../assets/images/maximize.png"
import ViewIcon from "../../../assets/images/view.svg"
import FavoriteIcon from "../../../assets/images/favorite.svg"
import {
  getNftInfo,
  getNftOffers,
  getNftTransactionsById,
  logNftTransaction,
} from "../../../api/Nft"
import { Breakpoint } from "../../../constants"
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "../../../components/global/Accordion"
import {
  truncate,
  dateDiff,
  truncateText,
  errorCatcher,
} from "../../../utils/helpers"
import { setRemoveHeaderBorder } from "../../../redux/utilReducer"
import { useModalContext } from "../../../hooks/ModalContext"
import MakeBid from "../MakeBid"
import {
  acceptBid,
  cancelForSale,
} from "../../../blockchain/actions/MLMarketplaceAction"
import Transfer from "../Transfer"
import Burn from "../Burn"
import ListToMarket from "../ListToMarket"
import Offer from "../Offer"
import { markFullyPayed } from "../../../blockchain/actions/MLNftAction"
import { getNftInfoById } from "../../../api/Nft"
import { getMarketPlaceItemById } from "../../../api/Marketplace"
// import { Chart } from "react-chartjs-2";
// import {Chart as ChartJS} from "chart.js";
import "chart.js/auto"
import { Chart } from "react-chartjs-2"

import ButtonDoubleSlide from "../../../components/global/ButtonDoubleSlide"
import DescriptionAccordion from "./DescriptionAccordion"
import FactsFeaturesAccordion from "./FactsFeaturesAccordion"
import PropertyDetailsAccordion from "./PropertyDetailsAccordion"
import ShareIcon from "../../../assets/images/share-icon.svg"
import MoreIcon from "../../../assets/images/more-icon.svg"
import { Dropdown } from "react-bootstrap"

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
]
export default function NftDetail() {
  const { contractAddress, tokenId } = useParams()
  const refContainer = useRef<HTMLDivElement>(null)
  const refContentBody = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<any>()
  const [flexible, setFlexible] = useState(false)
  const [histories, setHistories] = useState<any[]>([])
  const [reload, setReload] = useState(0)
  const [priceHistory, setPriceHistory] = useState<any>({
    labels: [],
    datasets: [],
  })
  const dispatch = useDispatch()

  // LOL. TODO: Identify the correct types
  interface ModalContext {
    setOpen: any
    setModalChildren: any
    setFormScreen: any
    setLoadingMessage: any
    setErrorMessage: any
    setSuccessMessage: any
  }

  // @ts-ignore
  const {
    setOpen,
    setModalChildren,
    setFormScreen,
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
  }: ModalContext = useModalContext()

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
            console.log(tx)
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
            console.log(res)
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
          console.log(tx)
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
          console.log(res)
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
              // const raw = await getNftInfo(tokenId)
              // console.log(raw?.data)
              // setItem(raw?.data)

              const raw = await getNftInfoById(tokenId, account)
              console.log(raw?.data?.data)
              setItem(raw?.data?.data)
            } else if (localStorage.getItem("role") === "home_owner") {
              const raw = await getNftInfoById(tokenId, account)
              // console.log(raw)
              if (raw?.data?.data) {
                console.log(raw.data.data)
                setItem(raw.data.data)
              }
            }
          } else {
            // console.log(tokenId, account)
            const raw = await getNftInfoById(tokenId, account)
            if (raw?.data?.data) {
              console.log(raw.data.data)
              setItem(raw.data.data)
            }
          }
        } else {
          const raw = await getMarketPlaceItemById(tokenId)
          console.log(raw?.data)
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
    })

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
    }
    const config = {
      type: "bar",
      data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    }
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
              <QuickResponsive>
                <Col>
                  <CellJustified>
                    <Row>
                      <Text size={1.9} font="Poppins-SemiBold">
                        {item?.name} -{" "}
                        {item?.property_id ||
                          item?.property_id ||
                          item?.id ||
                          tokenId}
                      </Text>
                    </Row>
                    <Row style={{ display: "flex", alignItems: "center" }}>
                      <QuickButton
                        src={ShareIcon}
                        text="Share"
                        style={{ marginRight: "1rem" }}
                      />
                      <Dropdown id="nftdetail-quick-dd">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          <QuickButton src={MoreIcon} text="More" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">
                            Get new listings in email
                          </Dropdown.Item>
                          <Dropdown.Item href="#/action-2">
                            View owner dashboard
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item href="#/action-3">
                            Report problem with listing
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Row>
                  </CellJustified>
                  <Row>
                    <OwnedByRow>
                      {account && (
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
                            {item?.owner_name || item?.ownerName}
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
                        <CommonImage src={FavoriteIcon} h={1.3} />
                        &nbsp;
                        <Text size={0.9} font="Poppins-Light" color="gray">
                          {item?.favorites} favorite
                        </Text>
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
                      // src={
                      //   item?.image
                      //     ? item.image.replaceAll(" ", "%20").replace('https://int.managelifeapi.co/api/managelife/v1/properties/photo/','')
                      //     : NoImageIcon
                      // }
                      src={
                        item?.image ||
                        "https://res.cloudinary.com/dbjlcflj0/image/upload/v1667559320/manage-life/default-NFT-image_jzvv6h.png"
                      }
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
                  {/*<Row>*/}
                  {/*  <ActionSection>*/}
                  {/*    <ActionGroup>*/}
                  {/*      <ActionImage*/}
                  {/*        src={RefreshIcon}*/}
                  {/*        hasBorderRight*/}
                  {/*        onClick={handleReloadData}*/}
                  {/*      />*/}
                  {/*      <ActionImage src={MaximizeIcon} hasBorderLeft/>*/}
                  {/*    </ActionGroup>*/}
                  {/*  </ActionSection>*/}
                  {/*</Row>*/}
                  <FullScreenQuickResponsive>
                    <CellJustified>
                      <Row>
                        <Text size={1.9} font="Poppins-SemiBold">
                          {item?.name} -{" "}
                          {item?.property_id ||
                            item?.property_id ||
                            item?.id ||
                            tokenId}
                        </Text>
                      </Row>
                      <Row style={{ display: "flex", alignItems: "center" }}>
                        <QuickButton
                          src={ShareIcon}
                          text="Share"
                          style={{ marginRight: "1rem" }}
                        />
                        <Dropdown id="nftdetail-quick-dd">
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
                          >
                            <QuickButton src={MoreIcon} text="More" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">
                              Get new listings in email
                            </Dropdown.Item>
                            <Dropdown.Item href="#/action-2">
                              View owner dashboard
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item href="#/action-3">
                              Report problem with listing
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Row>
                    </CellJustified>
                    <Row>
                      <OwnedByRow>
                        {account && (
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
                              {item?.owner_name || item?.ownerName}
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
                          <CommonImage src={FavoriteIcon} h={1.3} />
                          &nbsp;
                          <Text size={0.9} font="Poppins-Light" color="gray">
                            {item?.favorites} favorite
                          </Text>
                        </OwnedByRow>
                      </OwnedBySection>
                    </Row>
                  </FullScreenQuickResponsive>
                  {account && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      <Accordion noGap key="accordion-saleends">
                        <AccordionItem eventKey={5}>
                          <AccordionHeader eventKey={5} keepExpand>
                            Sale Ends: December 25, 2023
                          </AccordionHeader>
                          <AccordionBody eventKey={5}>
                            <SaleEndsDetail>
                              <Row>
                                <CurrentPrice>
                                  <CPLabel>Current price</CPLabel>
                                  <CPValueWrapRow>
                                    <CPValue>{item?.minSalePrice} ETH</CPValue>
                                  </CPValueWrapRow>
                                </CurrentPrice>
                              </Row>
                              <Row>ISO ETH... 400,000</Row>
                              <Row>Estimated Payment: $1,500/mo</Row>
                            </SaleEndsDetail>
                          </AccordionBody>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}

                  <ButtonsWrap>
                    {/*<Button*/}
                    {/*    color="#ffffff"*/}
                    {/*    bg="#2A72A7"*/}
                    {/*    fontSize={role ? 10 : 12}*/}
                    {/*>*/}
                    {/*    Add to Cart*/}
                    {/*</Button>*/}
                    <ButtonDoubleSlideWrap>
                      <ButtonDoubleSlide />
                    </ButtonDoubleSlideWrap>
                    <Button
                      color="#2A72A7"
                      bg="#ffffff"
                      fontSize={role ? 10 : 12}
                      borderColor="rgba(0,0,0,0.1)"
                      disabled={true}
                    >
                      Make Offer :)
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
                            <Chart
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
                            />

                            {/*<Chart type='bar' data={*/}
                            {/*    {*/}
                            {/*        labels: ['one','two'],*/}
                            {/*        datasets: [*/}
                            {/*            {*/}
                            {/*                data: [1,2],*/}
                            {/*                label: 'xxx'*/}
                            {/*            }*/}
                            {/*        ]*/}
                            {/*    }*/}
                            {/*} />*/}

                            {/*<Bar data={priceHistory} options={{*/}
                            {/*    plugins: {*/}
                            {/*        title: {*/}
                            {/*            display: false,*/}
                            {/*            text: 'Bar Chart',*/}
                            {/*        },*/}
                            {/*    },*/}
                            {/*    borderColor:'blue'*/}
                            {/*}}/>*/}
                          </DetailsWrap>
                        </AccordionBody>
                      </AccordionItem>
                    </Accordion>
                  </PriceHistoryWrap>

                  {/*
                      {role && (
                          <BidSection>
                            <Accordion key="accordion-2">
                              <AccordionItem eventKey={8}>
                                <AccordionHeader eventKey={8} expand>
                                  Offers
                                </AccordionHeader>
                                <AccordionBody eventKey={8} noPadding>
                                  <ItemBids tokenId={tokenId} refresh={reload}/>
                                </AccordionBody>
                              </AccordionItem>
                            </Accordion>
                          </BidSection>
                      )}
*/}

                  <CellJustifiedResponsive gap={1}>
                    <div style={{ width: "100%" }}>
                      <FactsFeaturesAccordion />
                    </div>
                    <div style={{ width: "100%" }}>
                      <PropertyDetailsAccordion />
                    </div>
                  </CellJustifiedResponsive>

                  <Accordion>
                    <AccordionItem eventKey={9}>
                      <AccordionHeader eventKey={9} keepExpand>
                        Contact
                      </AccordionHeader>
                      <AccordionBody eventKey={9}>
                        <Text size={0.9}>Not available</Text>
                      </AccordionBody>
                    </AccordionItem>
                  </Accordion>
                </RightContent>
              </ContentBodyJustify>
              {/*
                  {role && (
                      <HistorySection>
                        <Accordion key="accordion-3">
                          <AccordionItem eventKey={9}>
                            <AccordionHeader eventKey={9} expand>
                              Item History
                            </AccordionHeader>
                            <AccordionBody eventKey={9} noPadding>
                              <ItemHistory tokenId={tokenId} items={histories}/>
                            </AccordionBody>
                          </AccordionItem>
                        </Accordion>
                      </HistorySection>
                  )}
*/}
            </ContentBodyCol>
          </ContentBody>
        </TabContent>
      )}
    </Container>
  )
}

const Container = styled("div") <{ isAdmin?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  top: ${(props) => (props.isAdmin ? "1vh" : "8vh")};
`
const TabContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`
const NotFound = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 5vh;
`
const ContentBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: auto;
  padding-top: 1rem;
`
const ContentBodyCol = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0 1rem;
  // margin-bottom: 4rem;
`
const ContentBodyJustify = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 1.3rem;
  // padding: 0 1rem;
  margin-bottom: 3rem;
  @media (max-width: ${(props) => Breakpoint.md}) {
    flex-direction: column;
  }
`
const LeftContent = styled("div") <{ isflexible?: boolean }>`
  width: 28vw;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`
const RightContent = styled.div`
  // width: 50rem;
  width: 45vw;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`
const ImageBox = styled.div`
    width: inherit;
    border 1px solid rgba(0,0,0,0.1);
    border-radius: 0.8rem;
    overflow:hidden;
    margin-bottom: 1rem;
`
const ImageHeader = styled.div`
  width: inherit;
  height: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.9rem;
`
const Image = styled("div") <{ src?: string; hasImage?: boolean }>`
  width: inherit;
  height: 31rem;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: ${(props) => (props.hasImage ? "cover" : "30%")};
  background-position: center;
  cursor: pointer;
`
const CurrentPriceBox = styled.div`
    border 1px solid rgba(0,0,0,0.1);
    border-radius: 0.8rem;
    overflow:hidden;
    margin-bottom: 1rem;
`
const CurrentPrice = styled.div`
  width: inherit;
  background: #fbfdff;
`
const CoinIcon = styled("img") <{ h?: number }>`
  height: ${(props) => props.h || 1}rem;
  margin-right: 0.4rem;
`
const LoadingWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  background: #ffffff;
  position: absolute;
`
const CPLabel = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-family: Poppins-Regular;
  font-size: 0.9rem;
`
const CPValueWrapRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const CPValue = styled.div`
  font-family: Poppins-SemiBold;
  font-size: 1.8rem;
`
const ButtonGroupJustified = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.5rem;
  @media (max-width: ${(props) => Breakpoint.sm}) {
    flex-direction: column;
  }
`
const Button = styled("div") <{
  bg?: string
  color?: string
  borderColor?: string
  fontSize?: number
  disabled?: boolean
}>`
  width: 50%;
  height: 3.2rem;
  border-radius: 0.8rem;
  font-family: Poppins-SemiBold;
  font-size: ${(props) => props.fontSize}pt;
  color: ${(props) => props.color};
  background: ${(props) => props.bg};
  ${(props) =>
    props.borderColor ? `border: 0.15rem solid ${props.borderColor}` : ""};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
    opacity: 0.95;
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    width: 100%;
  }
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  ${(props) =>
    !props.disabled
      ? `
        &:hover {
            box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
            opacity: 0.95;    
        }    
    `
      : ""}
`
const MetadataFlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`
const Metadata = styled.div`
  width: 10rem;
  height: 5.5rem;
  border-radius: 0.5rem;
  border: 1px solid #2a72a7;
  background-color: rgba(42, 114, 167, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`
const Col = styled("div") <{ w?: number }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
`
const Spacing = styled("div") <{ w?: number }>`
  width: ${(props) => props.w}rem;
`
const Text = styled("span") <{
  font?: string
  bold?: boolean
  color?: string
  size?: number
}>`
  font-family: ${(props) =>
    props.font || (props.bold ? "Poppins-Medium" : "Poppins-Light")};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}rem;
`
const DetailsWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const CellJustified = styled("div") <{ gap?: number }>`
    width: 100%;
    display: flex;
    justify-content space-between;    
    margin: 0.2rem 0;
    ${(props) => (props.gap ? `gap:${props.gap}rem` : "")};
`
const Row = styled("div") <{ marginTop?: number; marginBottom?: number }>`
  margin-top: ${(props) => props.marginTop}rem;
  margin-bottom: ${(props) => props.marginBottom}rem;
  display: flex;
  flex-direction: row;
`
const CellJustifiedResponsive = styled("div") <{ gap?: number }>`
    width: 100%;
    display: flex;
    justify-content space-between;    
    margin: 0.2rem 0;
    ${(props) => (props.gap ? `gap:${props.gap}rem` : "")};
  @media (max-width: ${(props) => Breakpoint.lg}) {
    flex-direction: column;
  }
`
const ActionSection = styled.div`
  position: relative;
  width: 100%;
  height: 2.2rem;
  display: flex;
`
const ActionGroup = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: row;
  border: 0.1rem solid lightgray;
  border-radius: 0.7rem;
`

const SaleEndsDetail = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const AttributeJustified = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const AttributeCell = styled("div") <{
  pos?: string
  paddingLeft?: number
  paddingRight?: number
}>`
  width: 100%;
  display: flex;
  ${(props) =>
    props.pos === "right"
      ? "justify-content:flex-end"
      : props.pos === "center"
        ? "justify-content:center"
        : "justify-content:flex-start"};
  padding-left: ${(props) => props.paddingLeft}rem;
  padding-right: ${(props) => props.paddingRight}rem;
  margin-bottom: 0.5rem;
`
const ActionImage = styled("div") <{
  src?: string
  hasBorderLeft?: boolean
  hasBorderRight?: boolean
}>`
  width: 2.5rem;
  height: 2rem;
  border-left: ${(props) => (props.hasBorderLeft ? 0.07 : 0)}rem solid lightgray;
  border-right: ${(props) => (props.hasBorderRight ? 0.07 : 0)}rem solid
    lightgray;
  display: flex;
  justify-content: center;
  cursor: pointer;
  &:after {
    width: 2rem;
    height: 2rem;
    content: "";
    display: inline-block;
    background-image: url(${(props) => props.src});
    background-repeat: no-repeat;
    background-size: 50%;
    background-position: center;
  }
  &:hover {
    opacity: 0.6;
  }
`
const PriceHistoryWrap = styled.div`
  margin-bottom: 1.5rem;
`
const ButtonsWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 1.5rem 0;
  @media (max-width: ${(props) => Breakpoint.sm}) {
    flex-direction: column;
  }
`
const ButtonDoubleSlideWrap = styled.div`
  width: 50%;
  @media (max-width: ${(props) => Breakpoint.sm}) {
    width: 100%;
  }
`

const ShareButton = styled.div`
  display: flex;
  align-items: center;
  &:before {
    content: "";
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background-image: url(${(props) => ShareIcon});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    margin-right: 0.2rem;
  }
  &:after {
    content: "Share";
    font-size: 0.8rem;
  }
`
const QuickButton = styled("div") <{ src?: string; text?: string }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:before {
    content: "";
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background-image: url(${(props) => props.src});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    margin-right: 0.2rem;
  }
  &:after {
    content: "${(props) => props.text}";
    font-size: 0.9rem;
  }
`
const QuickResponsive = styled.div`
  display: none;
  @media (max-width: ${(props) => Breakpoint.md}) {
    display: block;
  }
`
const FullScreenQuickResponsive = styled.div`
  display: block;
  @media (max-width: ${(props) => Breakpoint.md}) {
    display: none;
  }
`

const FullImage = ({ imagePath, onClose }: any) => {
  return (
    <FullImageContainer>
      <FICloseButton onClick={onClose} />
      <img src={imagePath} style={{ height: "90%" }} />
    </FullImageContainer>
  )
}
const FullImageContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
const FICloseButton = styled.div`
  position: absolute;
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background-image: url(${(props) => CloseIcon});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  top: 5%;
  right: 4%;
  cursor: pointer;
`
const HistorySection = styled.div`
  // width: 83rem;
  position: relative;
  left: 50%;
  transform: translateX(-50%);

  width: 74vw;
  margin-bottom: 3vh;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`
const BidSection = styled.div`
  width: 100%;
  margin-top: 3vh;
`

const OwnedBySection = styled.div`
  position: relative;
  width: 100%;
  display: flex;
`
const AbsoluteWrap = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  // right: 0;
`
const OwnedByRow = styled.div`
  display: flex;
  flex-direction: row;
  // margin-left: 1rem;
`
const CommonImage = styled("img") <{ h?: number }>`
  height: ${(props) => props.h}rem;
`

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
        console.log(nft, nft.id, nft.bidPrice, account)
        setLoadingMessage("Accepting bid...transaction in process...")
        const txBid = await acceptBid(nft.id, nft.bidPrice, account)
        console.log(txBid)
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
            "nft"
          )
          console.log(res)
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

const IHSearchSection = styled.div`
  width: 100%;
  padding: 0.8rem;
`
const IHSearchInput = styled.select`
  width: 100%;
  height: 2.5rem;
  outline: none;
  border-radius: 0.6rem;
  border: 2px solid lightgray;
  padding-left: 1rem;
  font-size: 0.9rem;
  color: gray;
`
const IHHeaderSection = styled("div") <{ borderTop?: number }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-top: ${(props) => props.borderTop || 0}px solid lightgray;
  border-bottom: 1px solid lightgray;
  background: #fff;
  padding: 0.4rem 1rem;
  margin-bottom: 0.9rem;
`
const IHHeaderLabel = styled("div") <{ w?: number }>`
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
  font-size: 0.8rem;
`
const IHContentSection = styled("div") <{ activateH?: boolean }>`
  position: relative;
  width: 100%;
  // height: 20rem;
  height: ${(props) => (props.activateH ? "20rem" : "auto")};
  overflow: auto;
`
const IHContentScrolling = styled.div`
  // position: absolute;
  width: 100%;
`
const IHItemCol = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-top: 1px solid lightgray;
`
const IHItemRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`
const IHItemCell = styled("div") <{ w?: number }>`
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
  display: flex;
  align-items: center;
`
const IHImage = styled.img`
  height: 0.8rem;
  margin-right: 0.2rem;
`

const IOContentSection = styled("div") <{ activateH?: boolean }>`
  width: 100%;
  position: relative;
  height: ${(props) => (props.activateH ? "15rem" : "auto")};
  overflow: auto;
`
const IOContentScrolling = styled.div`
  // position: absolute;
  width: 100%;
`

const IOItemRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 3rem;
  padding: 0 1rem;
`

const AcceptButton = styled.div`
  width: 4.5rem;
  min-width: 4.5rem;
  height: 2rem;
  background: #2081e2;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.4rem;
  cursor: pointer;
  &:after {
    content: "Accept";
    color: #ffffff;
    font-size: 0.8rem;
    font-family: Poppins-SemiBold;
  }
`
