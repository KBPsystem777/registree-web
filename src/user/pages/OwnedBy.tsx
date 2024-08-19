import React, { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from "styled-components";
import { Breakpoint, BreakpointInPx } from "../../constants";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getAllTokenIds } from "../../api/Nft";
import Logo from '../../assets/images/ML Logo Blue Inline.png';
import SearchIcon from '../../assets/images/search-icon.svg';
import NoImageIcon from '../../assets/images/no-image.svg';
import { DropdownButton } from "react-bootstrap";
import { pxToVh, truncate } from "../../utils/helpers";
import { useSelector, useDispatch } from "react-redux";
import { setProvider, setWeb3Modal, setChainId, setAccount } from '../../redux/web3Reducer';
import { useWeb3React } from "@web3-react/core";
import Wallet from "../../components/global/Wallet";
import { useModalContext } from "../../hooks/ModalContext";
import { CLIENT_DIR } from "../../config";
import WaveActivityIndicator from "../../components/global/WaveActivityIndicator";
import TabInventory from "./tabs/TabInventory";
import TabFavorited from "./tabs/TabFavorited";
import PublicMarket from "./PublicMarket";
import TabOffers from "./tabs/TabOffers";
import TabBids from "./tabs/TabBids";

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

export default function OwnedBy() {

    const Tabs = [
        <TabInventory />,
        <TabFavorited />,
        <TabOffers />,
        <TabBids />,
    ]

    const { walletAddress } = useParams();
    const location: any = useLocation();
    const [boxWidth, setBoxWidth] = useState(0);
    const refTabContent = useRef<HTMLDivElement>(null);
    const isMountedRef = useIsMounted();
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<object>();
    const [activeTab, setActiveTab] = useState(0);
    const refNftGridWrap = useRef<HTMLDivElement>(null);
    const refSearchWrap = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const refHeader = useRef<HTMLDivElement>(null);
    const refSubHeader = useRef<HTMLDivElement>(null);
    const refSearchHeader = useRef<HTMLDivElement>(null);
    const refBlankBox = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    // @ts-ignore
    const { web3State, utilState } = useSelector(state => state);
    const { deactivate, account } = useWeb3React();
    // @ts-ignore
    const { setOpen, setModalChildren } = useModalContext();
    const role = localStorage.getItem('role');

    async function handleShowInfoClick(item: any, e: any) {
        navigate(`${CLIENT_DIR}/assets/${item.token_id}`, {
            state: {
                collectionName: item?.name,
                address: item?.token_address,
                tokenStandard: item?.contract_type,
                symbol: item?.symbol,
            }
        })
    }

    function handleLoginClick(e: any) {
        e.stopPropagation();
        setModalChildren(<Wallet close={() => {
            setOpen(false);
        }} />);
        setOpen(true);
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

    async function handleLogoutClick() {

        window.localStorage.clear();
        await deactivate();

        dispatch(setProvider(null));
        dispatch(setWeb3Modal(null));
        dispatch(setChainId(0));
        dispatch(setAccount(""));
    }

    function classnames(obj: any) {
        return Object.entries(obj).map(([cls, enb]) => enb ? cls : '').join(' ');
    }

    useEffect(() => {
        (async () => {
            try {
                // const rawx = await getAllTokenIds(location.state.address);
                setLoading(true);
                if (isMountedRef.current) {
                    // const raw = await getMarketplaceItems();
                    // console.log(raw)
                }
                setLoading(false);
            } catch (e) {
                setLoading(false);
            }
        })();
    }, [])

    useEffect(() => {
        responsePage();
        window.onresize = () => {
            responsePage();
        }

        window.onscroll = async (e: any) => {
            if (refSubHeader.current && refTabContent.current) {
                // const currVh = pxToVh(window.scrollY);
                // console.log(x)
                if (window.scrollY >= 400) {
                    refSubHeader.current.classList.add('box');
                    refTabContent.current.classList.add('box');
                } else {
                    refSubHeader.current.classList.remove('box');
                    refTabContent.current.classList.remove('box');
                }
            }
        }

    }, [utilState.headerHeight])

    const isAccount = (account && location.pathname.includes('/ownedby'));

    return (
        <Container>
            <SubHeader ref={refSubHeader}>
                <FeaturedImage>
                    {
                        isAccount && (
                            <ProfileImage />
                        )
                    }
                </FeaturedImage>
                <HeaderSection className={classnames(isAccount ? { 'account-dashboad': 1 } : {})}>
                    <Row marginTop={isAccount ? 2 : 0}>
                        <Text font="Poppins-SemiBold" size={1.5}>{truncate((walletAddress || '').toString())} NFTs</Text>
                    </Row>
                </HeaderSection>
                <TabSection>
                    {
                        isAccount && (
                            <TabWrap>
                                <Tab active={true}>Inventory</Tab>
                            </TabWrap>
                        )
                    }
                </TabSection>
            </SubHeader>
            <TabContent ref={refTabContent}>
                <ActiveTabWrap>
                    <TabInventory wallet={walletAddress} />
                </ActiveTabWrap>
                <NftGridWrap ref={refNftGridWrap}>
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
        box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.04), 0px 10px 10px rgba(0, 0, 0, 0.04);    
    }
`
const FeaturedImage = styled.div`
    position: relative;
    width: 100%;
    height: 26vh;
    background-color: #2C72A7;
    background-image: url(${props => require('../../assets/images/MLLogoWhite.png').default});
    background-repeat: no-repeat;
    background-size: 15%;
    background-position: center;
    @media (max-width: ${props => Breakpoint.lg}) {
        height: 24vh;
    }    
    @media (max-width: ${props => Breakpoint.md}) {
        height: 20vw;
    }    
`
const ProfileImage = styled.div`
    position: absolute;
    width: 20vh;
    height: 20vh;
    border-radius: 1rem;
    border: 0.4rem solid #ffffff;
    background-color: #2C72A7;
    bottom: -26%;
    left: 4%;
    box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.04), 0px 10px 10px rgba(0, 0, 0, 0.04);    
    background-image: url(${props => require('../../assets/images/MLLogoWhite.png').default});
    background-repeat: no-repeat;
    background-size: 90%;
    background-position: center;
    @media (max-width: ${props => Breakpoint.lg}) {
        width: 16vh;
        height: 16vh;
        bottom: -26%;
    }    
    @media (max-width: ${props => Breakpoint.md}) {
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
const Text = styled('span') <{ font?: string, bold?: boolean, color?: string, size?: number }>`
    font-family: ${props => props.font || 'Poppins-Light'};
    color: ${props => props.color};
    font-size: ${props => props.size}rem;
`
const Row = styled('div') <{ marginTop?: number, marginBottom?: number }>`
    margin-top: ${props => props.marginTop}rem;
    margin-bottom: ${props => props.marginBottom}rem;
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

const Tab = styled('div') <{ active?: boolean }>`
    font-family: ${props => props.active ? 'Poppins-SemiBold' : 'Poppins-Regular'};
    font-size: 1rem;
    margin-right: 3rem;
    padding-bottom: 0.5rem;
    border-bottom: ${props => props.active ? 3 : 0}px solid #000000;
    cursor: pointer;
`
const ActiveTabWrap = styled.div`
    width: 100%;
    padding: 0 4%;
`
