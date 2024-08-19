import { useEffect, useRef, useState } from "react"
import styled, { keyframes } from "styled-components"
import { Breakpoint, BreakpointInPx } from "../../constants"
import { useNavigate, useLocation, NavLink } from "react-router-dom"
import { getMoralisNftsByWallet } from "../../api/Nft"
import SearchIcon from "../../assets/images/search-icon.svg"
import NoImageIcon from "../../assets/images/no-image.svg"

import { useSelector, useDispatch } from "react-redux"
import {
  setProvider,
  setWeb3Modal,
  setChainId,
  setAccount,
} from "../../redux/web3Reducer"
import { useWeb3React } from "@web3-react/core"
import { IPFS_URI } from "../../config"
import WaveActivityIndicator from "../../components/global/WaveActivityIndicator"

import { ADDRESS } from "../../blockchain/abi/ManageLifeInvestorsNFT"

function useIsMounted() {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  })

  return isMounted
}

export default function UserInvestors() {
  const location: any = useLocation()
  const [, setBoxWidth] = useState(0)
  const refTabContent = useRef<HTMLDivElement>(null)
  const isMountedRef = useIsMounted()
  const [, setLoading] = useState(false)

  const refNftGridWrap = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const refSubHeader = useRef<HTMLDivElement>(null)

  const dispatch = useDispatch()
  // @ts-ignore
  const { utilState } = useSelector((state) => state)
  const { deactivate, account } = useWeb3React()

  function responsePage() {
    if (refTabContent.current) {
      let bw
      const xl = Number(BreakpointInPx.xl.slice(0, -2))
      const lg = Number(BreakpointInPx.lg.slice(0, -2))
      const md = Number(BreakpointInPx.md.slice(0, -2))
      const md2 = Number(BreakpointInPx.md2.slice(0, -2))
      const sm = Number(BreakpointInPx.sm.slice(0, -2))
      if (sm > window.innerWidth) {
        bw = (refTabContent.current.offsetWidth - 400) / 1
      } else if (md2 > window.innerWidth) {
        bw = (refTabContent.current.offsetWidth - 400) / 1
      } else if (md > window.innerWidth) {
        bw = (refTabContent.current.offsetWidth - 400) / 1
      } else if (lg > window.innerWidth) {
        bw = (refTabContent.current.offsetWidth - 400) / 2
      } else if (xl > window.innerWidth) {
        bw = (refTabContent.current.offsetWidth - 400) / 3
      } else {
        bw = (refTabContent.current.offsetWidth - 400) / 4
      }

      setBoxWidth(18)
    }
  }

  async function handleLogoutClick() {
    window.localStorage.clear()
    await deactivate()

    dispatch(setProvider(null))
    dispatch(setWeb3Modal(null))
    dispatch(setChainId(0))
    dispatch(setAccount(""))
  }

  function classnames(obj: any) {
    return Object.entries(obj)
      .map(([cls, enb]) => (enb ? cls : ""))
      .join(" ")
  }

  /*
        useEffect(() => {
            (async() => {
                try {
                    setLoading(true);
                    if (isMountedRef.current) {
                        const raw = await getAllTokenIds(location.state.address);
                        if (raw && raw.data && raw.data.result) {
                            const items = await Promise.all(raw.data.result.map((n:any, i:number) => {
                                if (n.metadata) {
                                    const m = JSON.parse(n.metadata);
                                    m.image = m.image.includes('ipfs://') ? `https://ipfs.io/ipfs/${m.image.replace('ipfs://','')}` : m.image;
                                    return {...n, ...{metadata:m}};
                                } else {
                                    return n;
                                }
                            }))

                            setList(items);
                        }
                    }

                    setLoading(false);
                } catch (e) {
                    setLoading(false);
                }
            })();
        }, [isMountedRef])
    */

  useEffect(() => {
    ; (async () => {
      try {
        // const rawx = await getAllTokenIds(location.state.address);
        setLoading(true)
        if (isMountedRef.current) {
          // const raw = await getMarketplaceItems();
          // console.log(raw)
        }
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    responsePage()
    window.onresize = () => {
      responsePage()
    }

    window.onscroll = async (e: any) => {
      if (refSubHeader.current && refTabContent.current) {
        // const currVh = pxToVh(window.scrollY);
        // console.log(x)
        if (window.scrollY >= 400) {
          refSubHeader.current.classList.add("box")
          refTabContent.current.classList.add("box")
        } else {
          refSubHeader.current.classList.remove("box")
          refTabContent.current.classList.remove("box")
        }
      }
    }
  }, [utilState.headerHeight])

  const isAccount = account && location.pathname === "/nft/investors"

  return (
    <Container>
      <SubHeader ref={refSubHeader}>
        <FeaturedImage>{isAccount && <ProfileImage />}</FeaturedImage>
        <HeaderSection
          className={classnames(isAccount ? { "account-dashboad": 1 } : {})}
        >
          <Row marginTop={isAccount ? 2 : 0}>
            <Text font="Poppins-SemiBold" size={1.5}>
              My NFTs
            </Text>
          </Row>
        </HeaderSection>
        <TabSection>
          {isAccount && (
            <TabWrap>
              <Tab active={true}>Inventory</Tab>
            </TabWrap>
          )}
        </TabSection>
      </SubHeader>
      <TabContent ref={refTabContent}>
        <ActiveTabWrap>
          <InverstorsNftsComponent />
        </ActiveTabWrap>
        <NftGridWrap ref={refNftGridWrap}></NftGridWrap>
      </TabContent>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const TabContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  &.box {
    margin-top: 56vh;
  }
`
const NftGridWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  background: #fff;
  padding: 0 4%;
`
const SubHeader = styled.div`
  position: relative;
  width: 100%;
  background: #ffffff;
  margin-top: 8vh;
  z-index: 9;
  transition: all 0.3s ease-in-out;
  &.box {
    position: fixed;
    top: -43vh;
    box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.04),
      0px 10px 10px rgba(0, 0, 0, 0.04);
  }
`
const FeaturedImage = styled.div`
  position: relative;
  width: 100%;
  height: 26vh;
  background-color: #2c72a7;
  background-image: url(${(props) =>
    require("../../assets/images/MLLogoWhite.png").default});
  background-repeat: no-repeat;
  background-size: 15%;
  background-position: center;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    height: 24vh;
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    height: 20vw;
  }
`
const ProfileImage = styled.div`
  position: absolute;
  width: 20vh;
  height: 20vh;
  border-radius: 1rem;
  border: 0.4rem solid #ffffff;
  background-color: #2c72a7;
  bottom: -26%;
  left: 4%;
  box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.04),
    0px 10px 10px rgba(0, 0, 0, 0.04);
  background-image: url(${(props) =>
    require("../../assets/images/MLLogoWhite.png").default});
  background-repeat: no-repeat;
  background-size: 90%;
  background-position: center;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    width: 16vh;
    height: 16vh;
    bottom: -26%;
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 17vw;
    height: 17vw;
    border-radius: 2.5vw;
    border: 0.8vw solid #ffffff;
    bottom: -26%;
  }
`
const HeaderSection = styled.div`
  padding: 2% 4% 0% 4%;
  width: 100%;
`
const Text = styled("span") <{
  font?: string
  bold?: boolean
  color?: string
  size?: number
}>`
  font-family: ${(props) => props.font || "Poppins-Light"};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}rem;
`
const Row = styled("div") <{ marginTop?: number; marginBottom?: number }>`
  margin-top: ${(props) => props.marginTop}rem;
  margin-bottom: ${(props) => props.marginBottom}rem;
  display: flex;
  flex-direction: row;
`
const TabSection = styled.div`
  width: 100%;
  padding: 0 4%;
`
const TabWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid lightgray;
`

const Tab = styled("div") <{ active?: boolean }>`
  font-family: ${(props) =>
    props.active ? "Poppins-SemiBold" : "Poppins-Regular"};
  font-size: 1rem;
  margin-right: 3rem;
  padding-bottom: 0.5rem;
  border-bottom: ${(props) => (props.active ? 3 : 0)}px solid #000000;
  cursor: pointer;
`
const ActiveTabWrap = styled.div`
  width: 100%;
  padding: 0 4%;
`

const InverstorsNftsComponent = () => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { account } = useWeb3React()

  useEffect(() => {
    ; (async () => {
      try {
        if (account) {
          setLoading(true)
          //MORALIS API
          const raw = await getMoralisNftsByWallet(account)
          if (raw?.data?.result) {
            const _items = await Promise.all(
              raw.data.result.map((n: any, i: number) => {
                if (n.metadata) {
                  return { ...n, ...{ metadata: JSON.parse(n.metadata) } }
                } else {
                  return n
                }
              })
            )
            setItems(_items)
          }
          setLoading(false)
        }
      } catch (e) {
        setLoading(false)
      }
    })()
  }, [])

  function handleInfoClick(tokenId: any, e: any) {
    e.stopPropagation()
    if (tokenId) {
      // setModalChildren(<NFTInfo tokenId={tokenId} close={() => setOpen(false)}/>)
      // setOpen(true);
    }
  }

  return (
    <InvestorsNftsContainer>
      <SearchSection>
        <SearchInputWrap>
          <SearchInputImage src={SearchIcon} />
          <SearchInput placeholder="Search by name or attribute" />
        </SearchInputWrap>
      </SearchSection>
      <NftGrid>
        {loading ? (
          <WaveActivityIndicator bg="lightgray" />
        ) : items.length > 0 ? (
          items.map((item, i) => {
            return (
              <NavLink
                key={`user-nft-investor-${item.token_id || item.tokenId}`}
                to={`/nft/investors/${ADDRESS}/${item?.token_id || item?.tokenId
                  }`}
                style={({ isActive }) => ({
                  color: "#000000",
                  textDecoration: "none",
                })}
              >
                <NftBox>
                  <NftImage
                    src={
                      item?.metadata?.image
                        ? `${IPFS_URI}/${item?.metadata?.image.replace(
                          "ipfs://",
                          ""
                        )}`
                        : NoImageIcon
                    }
                    hasImage={item?.metadata?.image}
                  />
                  <Attrs>
                    <PropertyName>
                      {item.name} - {item?.metadata?.name || item?.token_id}
                    </PropertyName>
                    <ContractType>{item?.contract_type}</ContractType>
                  </Attrs>
                </NftBox>
              </NavLink>
            )
          })
        ) : (
          <NoItems>No items to display</NoItems>
        )}
      </NftGrid>
    </InvestorsNftsContainer>
  )
}

let w = 14,
  h = 18

const InvestorsNftsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const SearchSection = styled.div`
  width: 100%;
  display: flex;
  // justify-content: space-between;
  @media (max-width: ${(props) => Breakpoint.md}) {
    // flex-direction: column;
  }
  margin: 2rem 0;
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
const NftGrid = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: auto auto auto auto auto auto;
  justify-content: flex-start;
  padding-bottom: 2rem;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    grid-template-columns: auto auto auto auto auto;
    ${(props) => NftBox} {
      width: ${(props) => w * 1.2}vw;
      height: ${(props) => h * 1.2}vw;
    }
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    grid-template-columns: auto auto auto auto;
    ${(props) => NftBox} {
      width: ${(props) => w * 1.5}vw;
      height: ${(props) => h * 1.5}vw;
    }
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    grid-template-columns: auto auto auto;
    ${(props) => NftBox} {
      width: ${(props) => w * 2}vw;
      height: ${(props) => h * 2}vw;
    }
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    grid-template-columns: auto;
    ${(props) => NftBox} {
      width: ${(props) => w * 4}vw;
      height: ${(props) => h * 4}vw;
    }
    justify-content: center;
  }
`
const NftBox = styled("div") <{ w?: number; h?: number; logged?: boolean }>`
  position: relative;
  background: #fff;
  border-radius: 0.8rem;
  box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.04),
    0px 10px 10px rgba(0, 0, 0, 0.04);
  width: ${(props) => w}vw;
  height: ${(props) => h}vw;
  overflow: hidden;
  animation: ${(props) => nftFadeIn} 500ms forwards;
  cursor: pointer;
  @media (max-width: ${(props) => Breakpoint.xl}) {
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
  }
`
const nftFadeIn = keyframes`
    0%{opacity:0;}
    100%{opacity:1;}
`
const NftImage = styled("div") <{ src?: string; hasImage?: boolean }>`
  width: 100%;
  height: 75%;
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
`
const Attrs = styled.div`
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  padding: 0.7vw;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    padding: calc(0.7vw * 1.2);
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    padding: calc(0.7vw * 1.5);
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    padding: calc(0.7vw * 2);
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    padding: calc(0.7vw * 4);
  }
`
const PropertyName = styled.div`
  font-family: Poppins-SemiBold;
  font-size: 0.8vw;
  line-height: 1;
  margin-bottom: 0.5vw;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    font-size: calc(0.8vw * 1.2);
    margin-bottom: calc(0.5vw * 1.2);
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: calc(0.8vw * 1.5);
    margin-bottom: calc(0.5vw * 1.5);
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    font-size: calc(0.8vw * 2);
    margin-bottom: calc(0.5vw * 2);
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    font-size: calc(0.8vw * 4);
    margin-bottom: calc(0.5vw * 4);
  }
`
const InfoIcon = styled.img`
  position: absolute;
  bottom: 0.5vw;
  right: 0.5vw;
  width: 1vw;
  height: 1vw;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  cursor: pointer;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    bottom: calc(0.5vw * 1.2);
    right: calc(0.5vw * 1.2);
    width: calc(1vw * 1.2);
    height: calc(1vw * 1.2);
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    bottom: calc(0.5vw * 1.5);
    right: calc(0.5vw * 1.5);
    width: calc(1vw * 1.5);
    height: calc(1vw * 1.5);
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    bottom: calc(0.5vw * 2);
    right: calc(0.5vw * 2);
    width: calc(1vw * 2);
    height: calc(1vw * 2);
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    bottom: calc(0.5vw * 4);
    right: calc(0.5vw * 4);
    width: calc(1vw * 4);
    height: calc(1vw * 4);
  }
`
const NoItems = styled.span`
  font-size: 1.2rem;
`
const ContractType = styled.div`
  font-size: 0.8vw;
  line-height: 1;
  @media (max-width: ${(props) => Breakpoint.xl}) {
    font-size: calc(0.8vw * 1.2);
    margin-bottom: calc(0.5vw * 1.2);
  }
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: calc(0.8vw * 1.5);
    margin-bottom: calc(0.5vw * 1.5);
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    font-size: calc(0.8vw * 2);
    margin-bottom: calc(0.5vw * 2);
  }
  @media (max-width: ${(props) => Breakpoint.sm}) {
    font-size: calc(0.8vw * 4);
    margin-bottom: calc(0.5vw * 4);
  }
`
