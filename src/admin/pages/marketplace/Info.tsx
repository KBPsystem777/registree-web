import { useRef, useState } from "react"
import styled from "styled-components"
import { useParams } from "react-router-dom"

import { Breakpoint } from "../../../constants"
import SearchIcon from "../../../assets/images/search-icon.svg"
import NftDetail from "../../../user/pages/NftDetail"

export default function Info() {
  const refSearchWrap = useRef<HTMLDivElement>(null)
  const refContentBody = useRef<HTMLDivElement>(null)
  const refContentBodyScrolling = useRef<HTMLDivElement>(null)
  const refLeftContent = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<any>()
  const [flexible, setFlexible] = useState(false)

  function adjustLeftSection() {
    if (refContentBody.current && refContentBodyScrolling.current) {
      if (
        refContentBody.current.offsetWidth <=
        refContentBodyScrolling.current.offsetWidth
      ) {
        // @ts-ignore
        setFlexible(true)
        window.removeEventListener("resize", adjustLeftSection)
      } else {
        // @ts-ignore
        setFlexible(false)
      }
    }
  }

  function initEvents() {
    // @ts-ignore
    refContentBody.current.onscroll = () => {
      if (refSearchWrap.current && refContentBody.current) {
        if (refContentBody.current.scrollTop > 0) {
          refSearchWrap.current.style.boxShadow =
            "0px 10px 10px rgba(0, 0, 0, 0.04), 0px 20px 25px rgba(0, 0, 0, 0.04)"
        } else {
          refSearchWrap.current.style.boxShadow = "0 0 0, 0 0 0"
        }
      }
    }
    window.addEventListener("resize", adjustLeftSection)
  }

  // useEffect(() => {
  //
  //     (async() => {
  //         try {
  //             const raw = await getNFTMetadata('', id);
  //             if (raw && raw.data) {
  //                 if (raw.data.metadata) {
  //                     const _item = {...raw.data, ...{metadata: JSON.parse(raw.data.metadata)}};
  //                     setItem(_item);
  //                 } else {
  //                     setItem(raw.data.metadata);
  //                 }
  //             }
  //         } catch (e) {
  //             setLoading(false);
  //         } finally {
  //             setLoading(false);
  //         }
  //     })();
  //
  //     // adjustLeftSection();
  //     // initEvents();
  //
  // }, [])

  return (
    <Container>
      {/*{*/}
      {/*    loading && (*/}
      {/*        <LoadingWrap>*/}
      {/*            <i className="fa fa-circle-o-notch fa-spin"></i>*/}
      {/*        </LoadingWrap>*/}
      {/*    )*/}
      {/*}*/}
      <Tab>
        <Nav>Marketplace NFT Info</Nav>
      </Tab>
      <TabContent>
        <SearchSection ref={refSearchWrap}>
          <SearchInputWrap>
            <SearchInputImage src={SearchIcon} />
            <SearchInput placeholder="Search by name or attribute" />
          </SearchInputWrap>
        </SearchSection>
        <ContentBody ref={refContentBody}>
          <ContentBodyScrolling ref={refContentBodyScrolling}>
            <NftDetail />
            {/*<ContentBodyJustify>*/}
            {/*    <LeftContent isflexible={flexible}>*/}
            {/*        <ImageBox>*/}
            {/*            <ImageHeader>*/}
            {/*                <CoinIcon src={require('../../../assets/images/ethereum-icon.svg').default}/>*/}
            {/*            </ImageHeader>*/}
            {/*            /!*<Image src={item && item.token_uri.replace('https://ml-api-dev.herokuapp.com/api/v1/nfts/','')}/>*!/*/}
            {/*            <Image src={item?.metadata?.image || NoImageIcon} hasImage={item?.metadata?.image}/>*/}
            {/*            /!*<NftImage src={item?.metadata?.image || NoImageIcon} hasImage={item?.metadata?.image}/>*!/*/}
            {/*        </ImageBox>*/}

            {/*        <Accordion noGap>*/}
            {/*            <AccordionItem eventKey={0}>*/}
            {/*                <AccordionHeader eventKey={0} keepExpand>Description</AccordionHeader>*/}
            {/*                <AccordionBody eventKey={0}>*/}
            {/*                    <Col>*/}
            {/*                        <Row>*/}
            {/*                            <Text  size={0.9}>By&nbsp;</Text>*/}
            {/*                            <Text  size={0.9} font="Poppins-SemiBold">Creator of this NFT</Text>*/}
            {/*                        </Row>*/}
            {/*                        <Text size={0.9}>*/}
            {/*                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.*/}
            {/*                        </Text>*/}
            {/*                    </Col>*/}
            {/*                </AccordionBody>*/}
            {/*            </AccordionItem>*/}
            {/*            <AccordionItem eventKey={1}>*/}
            {/*                <AccordionHeader eventKey={1} expand>Properties</AccordionHeader>*/}
            {/*                <AccordionBody eventKey={1}>*/}
            {/*                    <MetadataFlexWrap>*/}
            {/*                        {*/}
            {/*                            METADATA.map((m, i) => {*/}
            {/*                                return (*/}
            {/*                                    <Metadata key={i}>*/}
            {/*                                        <Text size={0.7} color="#2A72A7" bold>{(m.label || '').toUpperCase()}</Text>*/}
            {/*                                        <Text size={0.9} color="#000000" bold>{m.value}</Text>*/}
            {/*                                        <Text size={0.8} color="rgba(0,0,0,0.5)">100% have this trait</Text>*/}
            {/*                                    </Metadata>*/}
            {/*                                )*/}
            {/*                            })*/}
            {/*                        }*/}
            {/*                    </MetadataFlexWrap>*/}
            {/*                </AccordionBody>*/}
            {/*            </AccordionItem>*/}
            {/*            <AccordionItem eventKey={2}>*/}
            {/*                <AccordionHeader eventKey={2}>About the ManageLife</AccordionHeader>*/}
            {/*                <AccordionBody eventKey={2}>*/}
            {/*                    <Text size={0.9}>*/}
            {/*                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.*/}
            {/*                    </Text>*/}
            {/*                </AccordionBody>*/}
            {/*            </AccordionItem>*/}
            {/*            <AccordionItem eventKey={3}>*/}
            {/*                <AccordionHeader eventKey={3}>Details</AccordionHeader>*/}
            {/*                <AccordionBody eventKey={3}>*/}
            {/*                    <DetailsWrap>*/}
            {/*                        <CellJustified>*/}
            {/*                            <Text size={0.9}>Contract Address</Text>*/}
            {/*                            <Text size={0.9} color="#2081E2">{truncate('0x0012345678901')}</Text>*/}
            {/*                        </CellJustified>*/}
            {/*                        <CellJustified>*/}
            {/*                            <Text size={0.9}>Token ID</Text>*/}
            {/*                            <Text size={0.9} color="#2081E2">1234</Text>*/}
            {/*                        </CellJustified>*/}
            {/*                        <CellJustified>*/}
            {/*                            <Text size={0.9}>Token Standard</Text>*/}
            {/*                            <Text size={0.9}>ERC-721</Text>*/}
            {/*                        </CellJustified>*/}
            {/*                        <CellJustified>*/}
            {/*                            <Text size={0.9}>Blockchain</Text>*/}
            {/*                            <Text size={0.9}>Ethereum</Text>*/}
            {/*                        </CellJustified>*/}
            {/*                        <CellJustified>*/}
            {/*                            <Text size={0.9}>Last Updated</Text>*/}
            {/*                            <Text size={0.9}>4 hours ago</Text>*/}
            {/*                        </CellJustified>*/}
            {/*                    </DetailsWrap>*/}
            {/*                </AccordionBody>*/}
            {/*            </AccordionItem>*/}
            {/*        </Accordion>*/}

            {/*    </LeftContent>*/}
            {/*    <RightContent>*/}
            {/*        <CurrentPriceBox>*/}
            {/*            <CurrentPrice>*/}
            {/*                <CPLabel>Current price</CPLabel>*/}
            {/*                <CPValueWrapRow>*/}
            {/*                    <CoinIcon src={require('../../../assets/images/ethereum-icon.svg').default} h={1.5}/>*/}
            {/*                    <CPValue>0.25</CPValue>*/}
            {/*                </CPValueWrapRow>*/}
            {/*                <ButtonGroupJustified>*/}
            {/*                    <Button color="#ffffff" bg="#2A72A7">Buy now</Button>*/}
            {/*                    <Button color="#2A72A7" bg="#ffffff" borderColor="rgba(0,0,0,0.1)">Make offer</Button>*/}
            {/*                </ButtonGroupJustified>*/}
            {/*            </CurrentPrice>*/}
            {/*        </CurrentPriceBox>*/}

            {/*        <Accordion>*/}
            {/*            <AccordionItem eventKey={4}>*/}
            {/*                <AccordionHeader eventKey={4} expand>Price History</AccordionHeader>*/}
            {/*                <AccordionBody eventKey={4}>PRICE HISTORY BODY</AccordionBody>*/}
            {/*            </AccordionItem>*/}
            {/*            <AccordionItem eventKey={5}>*/}
            {/*                <AccordionHeader eventKey={5}>Listings</AccordionHeader>*/}
            {/*                <AccordionBody eventKey={5}>LISTINGS BODY</AccordionBody>*/}
            {/*            </AccordionItem>*/}
            {/*            <AccordionItem eventKey={6}>*/}
            {/*                <AccordionHeader eventKey={6} expand>Offers</AccordionHeader>*/}
            {/*                <AccordionBody eventKey={6}>OFFERS BODY</AccordionBody>*/}
            {/*            </AccordionItem>*/}
            {/*        </Accordion>*/}

            {/*    </RightContent>*/}
            {/*</ContentBodyJustify>*/}
          </ContentBodyScrolling>
        </ContentBody>
      </TabContent>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
  position: relative;
`
const Tab = styled.div`
  padding-top: 16px;
  padding-left: 8px;
  padding-right: 8px;
`
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
`
const TabContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
`
const SearchWrap = styled.div`
  width: 100%;
  padding: 1rem 4rem;
  z-index: 10;
`
const SearchInputWrapOld = styled.div`
  width: 37rem;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`
const ContentBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: auto;
  // padding-top: 1rem;
`
const ContentBodyScrolling = styled.div`
  width: 100%;
  position: absolute;
  height: auto;
`
const ContentBodyJustify = styled.div`
  // width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 1.3rem;
  padding: 0 1rem;
  margin-bottom: 4rem;
  @media (max-width: ${(props) => Breakpoint.md}) {
    flex-direction: column;
  }
`
const LeftContent = styled("div")<{ isflexible?: boolean }>`
  // width: ${(props) => (props.isflexible ? "28vw !important" : "32rem")};
  width: 28vw;
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`
const RightContent = styled.div`
  width: 44rem;
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
const Image = styled("div")<{ src?: string; hasImage?: boolean }>`
  width: inherit;
  height: 31rem;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: ${(props) => (props.hasImage ? "cover" : "30%")};
  background-position: center;
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
  padding: 1rem;
`
const CoinIcon = styled("img")<{ h?: number }>`
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
  background: #fff;
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
`
const Button = styled("div")<{
  bg?: string
  color?: string
  borderColor?: string
}>`
  width: 100%;
  height: 3.5rem;
  border-radius: 0.8rem;
  font-family: Poppins-SemiBold;
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
`
const MetadataFlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`
const Metadata = styled.div`
  width: 9rem;
  height: 5.5rem;
  border-radius: 0.5rem;
  border: 1px solid #2a72a7;
  background-color: rgba(42, 114, 167, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
`
const Col = styled.div`
  display: flex;
  flex-direction: column;
`
const Text = styled("span")<{
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
const CellJustified = styled.div`
    width: 100%;
    display: flex;
    justify-content space-between;    
    margin: 0.2rem 0;
`
const SearchSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem 4rem;
  z-index: 10;
  @media (max-width: ${(props) => Breakpoint.md}) {
    flex-direction: column;
  }
`
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
`
const SearchInputImage = styled.img`
  height: 50%;
  padding: 0 1rem;
`
const SearchInput = styled.input`
  outline: none;
  border: none;
  width: 100%;
  height: 100%;
`
