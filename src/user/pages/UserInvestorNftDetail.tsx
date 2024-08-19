import { forwardRef, useEffect, useRef, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import dateFormat from "dateformat"

import { getNftTransactionsById } from "../../api/Nft"
import { ML_STOCK_IMG } from "../../constants"

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "../../components/global/Accordion"
import { truncate, dateDiff, truncateText } from "../../utils/helpers"
import { setRemoveHeaderBorder } from "../../redux/utilReducer"
import { useModalContext } from "../../hooks/ModalContext"
import {
  getUnlockDate,
  setLockDate,
} from "../../blockchain/actions/MLInvestorsNFTAction"
import { errorCatcher } from "../../utils/helpers"
import { getNftInfoById } from "../../api/Nft"

import {
  Container,
  Wrapper,
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
  ButtonGroupJustified,
  Button,
  Metadata,
  MetadataFlexWrap,
  Col,
  Text,
  DetailsWrap,
  CellJustified,
  Row,
  ActionGroup,
  ActionImage,
  ActionSection,
  FullImage,
  HistorySection,
  OwnedByRow,
  OwnedBySection,
  IHSearchInput,
  IHSearchSection,
  IHHeaderSection,
  IHContentScrolling,
  IHContentSection,
  IHHeaderLabel,
  IHImage,
  IHItemCell,
  IHItemCol,
  IHItemRow,
  LockupContainer,
  PreferredDateWrap,
  SubmitButton,
  Close,
  AbsoluteWrap,
} from "./styles/UserInvestorNftDetail.style"

import Transfer from "./Transfer"
import NoImageIcon from "../../assets/images/no-image.svg"
import EtheIcon from "../../assets/images/ethereum-icon.svg"
import EtheRedIcon from "../../assets/images/ethereum-icon-red.svg"
import RefreshIcon from "../../assets/images/refresh.png"
import MaximizeIcon from "../../assets/images/maximize.png"
import DatePicker from "react-datepicker"
import ListToMarket from "./ListToMarket"

/***
 * @note This is the component responsible
 * for the rendering of this path:
 * http://localhost:3000/investors/nfts/{nftiContractAddress}/{tokenId}
 */
export default function UserInvestorNftDetail() {
  // @ts-ignore
  const { web3State } = useSelector((state) => state)

  const { contractAddress, tokenId } = useParams()
  const refContainer = useRef<HTMLDivElement>(null)
  const refContentBody = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<any>()
  const [flexible, setFlexible] = useState(false)
  const [histories, setHistories] = useState<any[]>([])
  const [reload, setReload] = useState(0)
  const dispatch = useDispatch()
  const [unlockDate, setUnlockDate] = useState<Date>()

  // @ts-ignore
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    useModalContext()

  // @ts-ignore
  const { setOpen, setModalChildren, setFormScreen } = useModalContext()

  // @ts-ignore
  const { utilState } = useSelector((state) => state)
  const { account } = useWeb3React()
  const role = localStorage.getItem("role")

  function handleShowFull() {
    setModalChildren(
      <FullImage
        imagePath={item?.image ?? NoImageIcon}
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

  async function handleTransferClick() {
    if (item?.token_id || item?.tokenId) {
      setFormScreen(
        <Transfer nft={item} closeModal={() => setFormScreen(null)} />
      )
    }
  }

  async function handleBurnClick() {
    // if (item?.property_id || item?.propertyId) {
    //     setFormScreen(
    //         <Burn
    //             nft={item}
    //             closeModal={() => setFormScreen(null)}
    //         />
    //     )
    // }
  }

  function listToMarket() {
    setFormScreen(
      <ListToMarket
        nftType={"nfti"}
        nft={item}
        closeModal={() => setFormScreen(null)}
      />
    )
  }

  const nftId = tokenId ?? ""

  function openLockupDateModal() {
    setModalChildren(
      <LockupDateModal
        close={() => setOpen(false)}
        passLockupDate={async (v: any) => {
          setOpen(false)
          const timestamp = (new Date(v).getTime() / 1000).toFixed(0)
          if (timestamp) {
            await handleLockUpNft(nftId, timestamp)
          }
        }}
      />
    )

    setOpen(true)
  }

  async function handleLockUpNft(token_id: string, lockUpDate: string) {
    if (!web3State?.account) {
      setErrorMessage("Authentication expired! Please re-login.")
      return
    }

    try {
      setLoadingMessage("Locking up... transaction in process...")
      setLoading(true)

      await setLockDate(nftId, lockUpDate)
      setUnlockDate(new Date(Number(lockUpDate) * 1000))
      setSuccessMessage("Lockup up date has been set")
    } catch (error) {
      setErrorMessage(errorCatcher(error))
      setLoading(false)
    }
  }

  async function handleReloadData() {
    setReload((prev) => (prev === 1 ? 0 : 1))
  }

  useEffect(() => {
    const body = document.body
    body.style.overflow = "hidden"
    return () => {
      body.style.overflow = "auto"
      body.style.overflowX = "hidden"
    }
  }, [])

  useEffect(() => {
    ; (async () => {
      try {
        if (account) {
          if (localStorage?.getItem("role")) {
            if (localStorage?.getItem("role") === "admin") {
              const raw = await getNftInfoById(tokenId, account)
              if (raw?.data) {
                if (raw.data?.metadata) {
                  setItem({
                    ...raw.data,
                    ...{ metadata: JSON.parse(raw.data.metadata) },
                  })
                } else {
                  setItem(raw.data)
                }
              }
              setItem(raw?.data?.data)
            }
          }
        }

        const unlockDate = await getUnlockDate(tokenId ?? "0")
        if (unlockDate && Number(unlockDate.toString()) > 0) {
          setUnlockDate(new Date(Number(unlockDate.toString()) * 1000))
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
    <Container>
      <Wrapper isAdmin={utilState.isAdmin} ref={refContainer}>
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
                        hasImage={item?.image}
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
                                <Text
                                  size={0.9}
                                  font="Poppins-Light"
                                  color="#2C72A7"
                                >
                                  {item?.owner_name ||
                                    item?.ownerName ||
                                    truncate(item?.owner_of || "")}
                                </Text>
                              </>
                            )}
                          </OwnedByRow>
                          <OwnedByRow>
                            {account && (
                              <>
                                <Text
                                  size={0.9}
                                  font="Poppins-Light"
                                  color="gray"
                                >
                                  Unlock date&nbsp;
                                </Text>
                                <Text
                                  size={0.9}
                                  font="Poppins-Light"
                                  color="#2C72A7"
                                >
                                  {unlockDate
                                    ? dateFormat(unlockDate, "yyyy-mm-dd")
                                    : "NA"}
                                </Text>
                              </>
                            )}
                          </OwnedByRow>
                        </AbsoluteWrap>
                      </OwnedBySection>
                    </Row>
                    {account && (
                      <CurrentPriceBox>
                        <CurrentPrice>
                          {role === "admin" ? (
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
                                onClick={openLockupDateModal}
                              >
                                Update Lock up
                              </Button>
                              <Button
                                color="#ffffff"
                                bg="#f67159"
                                fontSize={role ? 10 : 12}
                                onClick={handleBurnClick}
                              >
                                Burn
                              </Button>
                              <Button
                                color="#2A72A7"
                                bg="#ffffff"
                                fontSize={role ? 10 : 12}
                                borderColor="rgba(0,0,0,0.1)"
                                onClick={listToMarket}
                              >
                                List to Market
                              </Button>
                              <Button
                                color="#2A72A7"
                                bg="#ffffff"
                                fontSize={role ? 10 : 12}
                                borderColor="rgba(0,0,0,0.1)"
                                onClick={() => { }}
                              >
                                Offer
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
                      {(item?.attributes && item?.attributes?.length) > 0 && (
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
                                          m.trait_type.replaceAll("_", " ") ||
                                          ""
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
                          <ItemHistory
                            tokenId={tokenId}
                            isReload={reload}
                            items={histories}
                          />
                        </AccordionBody>
                      </AccordionItem>
                    </Accordion>
                  </HistorySection>
                )}
              </ContentBodyCol>
            </ContentBody>
          </TabContent>
        )}
      </Wrapper>
    </Container>
  )
}

const ItemHistory = ({ tokenId, isReload }: any) => {
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

  const handleFilterChange = async () => { }

  useEffect(() => {
    ; (async () => {
      try {
        const raw = await getNftTransactionsById(account, tokenId)
        if (raw?.data?.data) {
          const filteredItems = await raw.data.data.filter(
            (o: any) => o?.category === "nfti"
          )
          setItems(filteredItems)
        }
      } catch (e) {
        console.log(e)
      }
    })()
  }, [isReload])

  return (
    <Col w={100}>
      <IHSearchSection>
        <IHSearchInput onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="date">Transfer</option>
          <option value="date">Burn</option>
        </IHSearchInput>
      </IHSearchSection>
      <IHHeaderSection borderTop={1}>
        <IHHeaderLabel w={20}>Event</IHHeaderLabel>
        <IHHeaderLabel w={15}>Issuance Rate</IHHeaderLabel>
        <IHHeaderLabel w={20}>From</IHHeaderLabel>
        <IHHeaderLabel w={20}>To</IHHeaderLabel>
        <IHHeaderLabel w={25}>Date</IHHeaderLabel>
      </IHHeaderSection>
      <IHContentSection activateH={items?.length >= 6}>
        <IHContentScrolling>
          {items.map((item: any, i: number) => {
            return (
              <IHItemCol key={`investor-nft-history-${i}`}>
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
                    <Text size={0.8}>{item.lifeTokenIssuanceRate}</Text>
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

const LockupDateModal = ({ close, passLockupDate }: any) => {
  const [startDate, setStartDate] = useState(new Date())
  const PreferredDate = forwardRef(({ value, onClick }: any, _ref) => (
    <PreferredDateWrap onClick={onClick}>
      <Text font={"Poppins-SemiBold"} size={1.5}>
        {dateFormat(value, "ddd").toUpperCase()},&nbsp;
      </Text>
      <Text font={"Poppins-SemiBold"} size={1.5}>
        {dateFormat(value, "mmm")}&nbsp;
      </Text>
      <Text font={"Poppins-SemiBold"} size={1.5}>
        {dateFormat(value, "dd")}&nbsp;
      </Text>
      <Text font={"Poppins-SemiBold"} size={1.5}>
        {dateFormat(value, "yyyy")}
      </Text>
    </PreferredDateWrap>
  ))

  return (
    <LockupContainer>
      <Text font="Poppins-Regular">Select Lockup Date</Text>
      <Close onClick={close} />
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
        customInput={<PreferredDate />}
      />
      <SubmitButton onClick={() => passLockupDate(startDate)} />
    </LockupContainer>
  )
}
