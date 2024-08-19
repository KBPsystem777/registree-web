import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import LockedIcon from '../../../assets/images/locked.svg';
import ViewIcon from "../../../assets/images/view-white.svg";
import PriceIcon from '../../../assets/images/ML-home-logo.png';
import ArrowRightIcon from '../../../assets/images/rewards-arrow-details.svg';
import { truncate, truncateText } from "../../../utils/helpers";
import { useWeb3React } from "@web3-react/core";
import { getRewardsHistory, staking } from "../../../api/Nft";
import { queryRewards } from "../../../blockchain/actions/MLInvestorsNFTAction";
import { claimableStakingRewards } from "../../../blockchain/actions/MLTokenAction";
import { ethers } from "ethers";
import WaveActivityIndicator from "../../../components/global/WaveActivityIndicator";
import dateFormat from "dateformat";

export default function TabRewardsHistory() {

    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const { account } = useWeb3React()
    const refClaimDetailsButton = useRef<(HTMLDivElement | null)[]>([]);
    const refClaimDetails = useRef<(HTMLDivElement | null)[]>([]);

    const handleShowDetails = (i: number) => {
        const elButton = refClaimDetailsButton?.current[i];
        const el = refClaimDetails?.current[i];
        if (elButton) {
            elButton.classList.toggle('expand');
        }
        if (el) {
            el.classList.toggle('expand');
        }
    }

    async function fetchData() {
        try {
            const raw = await getRewardsHistory(account);
            if (raw?.data?.data) {
                console.log(raw.data.data)
                setItems(raw.data.data)
            }
            setLoading(false)
        } catch (e) {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (account) {
            setItems([])
            setLoading(true)
            setTimeout(async () => {
                await fetchData()
            }, 1000)
        }
    }, [account])

    return (
        <Container>
            <Header>
                <HeaderCell w={17} paddingLeft={1}>TXN</HeaderCell>
                <HeaderCell w={17} center>Address</HeaderCell>
                <HeaderCell w={20} center>Amount</HeaderCell>
                <HeaderCell w={17} center>From</HeaderCell>
                <HeaderCell w={17} center>To</HeaderCell>
                <HeaderCell w={12} center>Date Claimed</HeaderCell>
            </Header>
            <Content>
                {loading && <WaveActivityIndicator bg="lightgray" />}
                {
                    items.map((item, i) => {
                        return (
                            <Expandable key={`rewards-item-${i}`}>
                                <ClaimItem>
                                    <ClaimCell w={17}>{truncate(item?.transaction_hash)}</ClaimCell>
                                    <ClaimCell w={17} center>{truncate(item?.address)}</ClaimCell>
                                    <ClaimCell w={20} center>
                                        <PriceWithImage><PriceImage />{ethers.utils.formatEther((item?.value || '').toString())} <BlueText>LIFE</BlueText></PriceWithImage>
                                    </ClaimCell>
                                    <ClaimCell w={17} center>{truncate(item?.from_address)}</ClaimCell>
                                    <ClaimCell w={17} center>{truncate(item?.to_address)}</ClaimCell>
                                    <ClaimCell w={12} center>{dateFormat(new Date(item?.block_timestamp), 'mm dd, yyyy')}</ClaimCell>
                                </ClaimItem>
                            </Expandable>
                        )
                    })
                }
            </Content>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 3vh;
    margin-bottom: 3vh;
`
const Header = styled.div`
    width: 100%;
    height: 3rem;
    display: flex;
    justify-content: space-between;
    color: #ffffff;
    background-color: #2D72A7;
    border-radius: 0.7rem;
    padding: 0 1%;
`
const HeaderCell = styled('div') <{ w?: number, center?: boolean, paddingLeft?: number }>`
    width: ${props => props.w || 100}%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: ${props => props.center ? 'center' : 'flex-start'};
    padding-left: ${props => props.paddingLeft || 0}%;
    font-family: Poppins-SemiBold;
    font-size: 0.9rem;
`
const Content = styled.div`
    width: 100%;
    margin-top: 1rem;
`
const Expandable = styled.div`
    width: 100%;
    background: #FCFDFF;
    border: 1px solid rgba(0,0,0,0.1);
    margin-bottom: 0.4rem;
    display: flex;
    flex-direction: column;
`
const ClaimItem = styled.div`
    width: 100%;
    height: 3.3rem;
    display: flex;
    justify-content: center;
    padding: 0 1%;
`
const ClaimCell = styled('div') <{ w?: number, center?: boolean, paddingLeft?: number, flexStart?: boolean, flexEnd?: boolean }>`
    width: ${props => props.w || 100}%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: ${props => props.center ? 'center' : props.flexStart ? 'flex-start' : props.flexEnd ? 'flex-end' : 'flex-start'};
    padding-left: ${props => props.paddingLeft || 0}%;
    font-size: 0.9rem;
    line-height: 1;
`
const PriceWithImage = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;
`
const PriceImage = styled('div') <{ h?: number }>`
    display: inline-block;
    width: ${props => props.h || 1.2}rem;
    height: ${props => props.h || 1.2}rem;
    background-image: url(${props => PriceIcon});
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: center;
    margin-bottom: 3%;    
`
const DetailsButton = styled.div`
    width: 8rem;
    height: 2.2rem;
    border-radius: 0.3rem;
    background-color: gray;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:before {
        content: '';
        width: 2.2rem;
        height: 2.2rem;
        display: inline-block;
        background-image: url(${props => ViewIcon});
        background-repeat: no-repeat;
        background-size: 50%;
        background-position: center;
    }
    &:after {
        content: 'More Details';
        color: #ffffff;
        font-size: 9pt;
    }
    &.expand {
        background-color: #6A7BAE;
    }
`
const BlueText = styled.div`
    color: #2D72A7;
    line-height: 1;
    margin-left: 5%;
`
const ClaimDetails = styled.div`
    width: 100%;
    padding: 0.5rem 1rem;
    display: none;
    flex-direction: column;
    &.expand {
        display: flex;
    }
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const Text = styled('span') <{ font?: string, bold?: boolean, color?: string, size?: number, marginRight?: number }>`
    font-family: ${props => props.font || 'Poppins-Light'};
    color: ${props => props.color};
    font-size: ${props => props.size}rem;
    line-height: 1;
    margin-right: ${props => props.marginRight}%;
`
const ArrowRight = styled.img`

`