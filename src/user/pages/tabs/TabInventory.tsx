import React, { useEffect, useState } from 'react';
import styled, { keyframes } from "styled-components";
import { Breakpoint } from "../../../constants";
import SearchIcon from '../../../assets/images/search-icon.svg';
import NoImageIcon from '../../../assets/images/no-image.svg';
import { getNftByWallet } from "../../../api/Nft";
import WaveActivityIndicator from "../../../components/global/WaveActivityIndicator";
import { useWeb3React } from "@web3-react/core";
import NFTInfo from "../../../admin/pages/nfts/NFTInfo";
import { useModalContext } from "../../../hooks/ModalContext";
import { useNavigate, NavLink, useParams, useLocation } from "react-router-dom";
import { IPFS_URI } from "../../../config";

// let w = 15, h = 22;
let w = 14, h = 18;
export default function TabInventory({ wallet }: any) {

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { account } = useWeb3React();
    // @ts-ignore
    const { setModalChildren, setOpen } = useModalContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        (async () => {
            try {
                if (account) {
                    setLoading(true);
                    const raw = await getNftByWallet(wallet || account);
                    if (raw?.data?.data) {
                        const formattedItems = await Promise.all(raw.data.data.map((n: any, i: number) => {
                            if (n?.metadata) {
                                return { ...n, ...{ metadata: JSON.parse(n.metadata) } };
                            } else {
                                return n;
                            }
                        }))
                        setItems(formattedItems);
                    }
                    setLoading(false);
                }
            } catch (e) {
                setLoading(false);
            }
        })()
    }, [account])

    function handleInfoClick(tokenId: any, e: any) {
        e.stopPropagation();
        if (tokenId) {
            setModalChildren(<NFTInfo tokenId={tokenId} close={() => setOpen(false)} />)
            setOpen(true);
        }
    }

    const nftDetailRoute = location.pathname.includes('/collections') ? 'collections' : 'marketplace';

    return (
        <Container>
            <SearchSection>
                <SearchInputWrap>
                    <SearchInputImage src={SearchIcon} />
                    <SearchInput placeholder="Search by name or attribute" />
                </SearchInputWrap>
            </SearchSection>
            <NftGrid>
                {
                    loading ? (
                        <WaveActivityIndicator bg="lightgray" />
                    ) : (
                        items.length > 0 ?
                            (items.map((item, i) => {
                                let nftImage;
                                if (item?.image) {
                                    nftImage = item.image;
                                } else {
                                    if (item?.metadata?.image) {
                                        if (item.metadata.image.includes('ipfs')) {
                                            nftImage = `${IPFS_URI}/${item?.metadata?.image.replace('ipfs://', '')}`;
                                        } else {
                                            nftImage = item.metadata.image;
                                        }
                                    } else {
                                        nftImage = "https://res.cloudinary.com/dbjlcflj0/image/upload/v1667559320/manage-life/default-NFT-image_jzvv6h.png";
                                    }
                                }
                                return (
                                    <NavLink
                                        key={`user-nft-inventory-${item.token_id || item.tokenId}`}
                                        to={`/${nftDetailRoute}/${item?.token_address}/${item?.token_id}/${item?.symbol?.toLowerCase()}`}
                                        style={({ isActive }) => ({
                                            color: '#000000',
                                            textDecoration: 'none'
                                        })}
                                    >
                                        <NftBox key={i}>
                                            <NftImage src={nftImage} hasImage={true} />
                                            <Attrs>
                                                <PropertyName>{item?.name || item?.metadata?.name} - {item?.token_id || item?.tokenId}</PropertyName>
                                                <ContractType>{item?.contract_type}</ContractType>
                                                {/*<PriceLabel>Price</PriceLabel>*/}
                                                {/*<PropertyPriceWrap>*/}
                                                {/*    <CoinIcon src={require('../../../assets/images/ethereum-icon.svg').default}/>*/}
                                                {/*    <PropertyPrice>{item.minSalePrice}</PropertyPrice>*/}
                                                {/*</PropertyPriceWrap>*/}


                                                {/*<InfoIcon*/}
                                                {/*    src={require('../../../assets/images/nft-info.svg').default}*/}
                                                {/*    onClick={(e) => handleInfoClick(item?.token_id, e)}*/}
                                                {/*/>*/}
                                            </Attrs>
                                        </NftBox>
                                    </NavLink>
                                )
                            }
                            )) : (
                                <NoItems>No items to display</NoItems>
                            )
                    )
                }
            </NftGrid>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`
const SearchSection = styled.div`
    width: 100%;
    display: flex;
    // justify-content: space-between;
    @media (max-width: ${props => Breakpoint.md}) {
        // flex-direction: column;
    }
    margin: 2rem 0;
`
const SearchInputWrap = styled.div`
    width: 55%;
    height: 2.6rem;
    border: 2px solid rgba(0,0,0,0.1);
    border-radius: 0.6rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    @media (max-width: ${props => Breakpoint.md}) {
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
const FlexWrap = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
`

const NftGrid = styled.div`
    width: 100%;
    display: grid;
    grid-gap: 1.5rem;
    grid-template-columns: auto auto auto auto auto auto;
    justify-content: flex-start;  
    padding-bottom: 2rem;
    @media (max-width: ${props => Breakpoint.xl}) {
       grid-template-columns: auto auto auto auto auto;
       ${props => NftBox} {
            width: ${props => w * 1.2}vw;
            height: ${props => h * 1.2}vw;       
       }
    }        
    @media (max-width: ${props => Breakpoint.lg}) {
       grid-template-columns: auto auto auto auto;
       ${props => NftBox} {
            width: ${props => w * 1.5}vw;
            height: ${props => h * 1.5}vw;       
       }
    }        
    @media (max-width: ${props => Breakpoint.md}) {
       grid-template-columns: auto auto auto;
       ${props => NftBox} {
            width: ${props => w * 2}vw;
            height: ${props => h * 2}vw;       
       }
    }
    @media (max-width: ${props => Breakpoint.sm}) {
       grid-template-columns: auto;
       ${props => NftBox} {
            width: ${props => w * 4}vw;
            height: ${props => h * 4}vw;       
       }
        justify-content: center;
    }
`
const NftBox = styled('div') <{ w?: number, h?: number, logged?: boolean }>`
    position: relative;
    background: #fff;
    border-radius: 0.8rem;
    box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.04), 0px 10px 10px rgba(0, 0, 0, 0.04);    
    width: ${props => w}vw;
    height: ${props => h}vw;
    overflow: hidden;
    animation: ${props => nftFadeIn} 500ms forwards;
    cursor: pointer;
    @media (max-width: ${props => Breakpoint.xl}) {
    }        
    @media (max-width: ${props => Breakpoint.lg}) {
    }        
    @media (max-width: ${props => Breakpoint.md}) {
    }        
`
const nftFadeIn = keyframes`
    0%{opacity:0;}
    100%{opacity:1;}
`

const NftImage = styled('div') <{ src?: string, hasImage?: boolean }>`
    width: 100%;
    height: 75%;
    overflow: hidden;
    &:after {
        content: '';
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url(${props => props.src});
        background-repeat: no-repeat;
        background-size: ${props => props.hasImage ? 'cover' : '30%'};
        background-position: ${props => props.hasImage ? 'top' : 'center'};
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
    @media (max-width: ${props => Breakpoint.xl}) {
        padding: calc(0.7vw * 1.2);
    }        
    @media (max-width: ${props => Breakpoint.lg}) {
        padding: calc(0.7vw * 1.5);
    }        
    @media (max-width: ${props => Breakpoint.md}) {
        padding: calc(0.7vw * 2);
    }
    @media (max-width: ${props => Breakpoint.sm}) {
        padding: calc(0.7vw * 4);
    }
`
const PropertyName = styled.div`
    font-family: Poppins-SemiBold;
    font-size: 0.8vw;
    line-height: 1;
    margin-bottom: 0.5vw;    
    @media (max-width: ${props => Breakpoint.xl}) {
        font-size: calc(0.8vw * 1.2);
        margin-bottom: calc(0.5vw * 1.2);    
    }        
    @media (max-width: ${props => Breakpoint.lg}) {
        font-size: calc(0.8vw * 1.5);
        margin-bottom: calc(0.5vw * 1.5);    
    }        
    @media (max-width: ${props => Breakpoint.md}) {
        font-size: calc(0.8vw * 2);
        margin-bottom: calc(0.5vw * 2);    
    }
    @media (max-width: ${props => Breakpoint.sm}) {
        font-size: calc(0.8vw * 4);
        margin-bottom: calc(0.5vw * 4);    
    }
`
const PriceLabel = styled.div`
    font-family: Poppins-SemiBold;
    font-size: 0.6vw;
    margin-bottom: 0.1vw;    
    @media (max-width: ${props => Breakpoint.xl}) {
        font-size: calc(0.6vw * 1.2);
        margin-bottom: calc(0.1vw * 1.2);    
    }        
    @media (max-width: ${props => Breakpoint.lg}) {
        font-size: calc(0.6vw * 1.5);
        margin-bottom: calc(0.1vw * 1.5);    
    }        
    @media (max-width: ${props => Breakpoint.md}) {
        font-size: calc(0.6vw * 2);
        margin-bottom: calc(0.1vw * 2);    
    }
    @media (max-width: ${props => Breakpoint.sm}) {
        font-size: calc(0.6vw * 4);
        margin-bottom: calc(0.1vw * 4);    
    }
`
const PropertyPriceWrap = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const CoinIcon = styled.img`
    height: 1rem;
    margin-right: 0.3vw;
    @media (max-width: ${props => Breakpoint.xl}) {
        margin-right: calc(0.3vw * 1.2);
    }        
    @media (max-width: ${props => Breakpoint.lg}) {
        margin-right: calc(0.3vw * 1.5);
    }        
    @media (max-width: ${props => Breakpoint.md}) {
        margin-right: calc(0.3vw * 2);
    }
    @media (max-width: ${props => Breakpoint.sm}) {
        margin-right: calc(0.3vw * 4);
    }
`
const PropertyPrice = styled.div`
    font-family: Poppins-SemiBold;
    font-size: 0.9vw;
    line-height: 1;
    @media (max-width: ${props => Breakpoint.xl}) {
        font-size: calc(0.9vw * 1.2);
    }        
    @media (max-width: ${props => Breakpoint.lg}) {
        font-size: calc(0.9vw * 1.5);
    }        
    @media (max-width: ${props => Breakpoint.md}) {
        font-size: calc(0.9vw * 2);
    }
    @media (max-width: ${props => Breakpoint.sm}) {
        font-size: calc(0.9vw * 4);
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
    @media (max-width: ${props => Breakpoint.xl}) {
        bottom: calc(0.5vw * 1.2);
        right: calc(0.5vw * 1.2);
        width: calc(1vw * 1.2);
        height: calc(1vw * 1.2);
    }        
    @media (max-width: ${props => Breakpoint.lg}) {
        bottom: calc(0.5vw * 1.5);
        right: calc(0.5vw * 1.5);
        width: calc(1vw * 1.5);
        height: calc(1vw * 1.5);
    }        
    @media (max-width: ${props => Breakpoint.md}) {
        bottom: calc(0.5vw * 2);
        right: calc(0.5vw * 2);
        width: calc(1vw * 2);
        height: calc(1vw * 2);
    }
    @media (max-width: ${props => Breakpoint.sm}) {
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
    @media (max-width: ${props => Breakpoint.xl}) {
        font-size: calc(0.8vw * 1.2);
        margin-bottom: calc(0.5vw * 1.2);    
    }        
    @media (max-width: ${props => Breakpoint.lg}) {
        font-size: calc(0.8vw * 1.5);
        margin-bottom: calc(0.5vw * 1.5);    
    }        
    @media (max-width: ${props => Breakpoint.md}) {
        font-size: calc(0.8vw * 2);
        margin-bottom: calc(0.5vw * 2);    
    }
    @media (max-width: ${props => Breakpoint.sm}) {
        font-size: calc(0.8vw * 4);
        margin-bottom: calc(0.5vw * 4);    
    }
`
