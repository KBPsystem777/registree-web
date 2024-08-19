import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import { useUtilStateAction } from "../../redux/actions/useUtilStateAction";
import { Breakpoint } from "../../constants";
import CollectionItem from "./CollectionItem";
import { useSelector } from "react-redux";
import { getAdminNftCollections } from "../../api/Nft";
import WaveActivityIndicator from "../../components/global/WaveActivityIndicator";

export default function Collections() {

    const [loading, setLoading] = useState(false);
    const refContent = useRef<HTMLDivElement>(null);
    const { updateRemoveHeaderBorder } = useUtilStateAction();
    // @ts-ignore
    const { web3State } = useSelector(state => state);
    const [collections, setCollections] = useState<(any[] | [])>([]);


    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const _collections = await getAdminNftCollections();
                setCollections(_collections);
                setLoading(false);
            } catch (e) {
                console.log(e)
                setLoading(false);
            }
        })();

    }, [web3State.account]);

    useEffect(() => {
        window.onscroll = (e: any) => {
            if (refContent.current) {
                if (window.scrollY >= 20) {
                    updateRemoveHeaderBorder(false);
                } else {
                    updateRemoveHeaderBorder(true);
                }
            }
        }

        updateRemoveHeaderBorder(true);

    }, []);

    return (
        <Container>
            <Content ref={refContent}>
                <HeaderText>My Collections</HeaderText>
                <GridWrap>
                    <Grid>
                        {
                            loading ? (
                                <WaveActivityIndicator bg="lightgray" />
                            ) : (
                                collections.map((c, i) => {
                                    return (
                                        <CollectionItem key={i} item={c} />
                                    )
                                })
                            )
                        }
                    </Grid>
                </GridWrap>
            </Content>
        </Container>
    );
}


const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`
const Content = styled.div`
    position: absolute;
    width: 95rem;
    background: #ffffff;
    margin-top: 8vh;   
    z-index: 9;
    display: flex;
    flex-direction: column;
    right: 0;
    padding: 2rem 1.5rem;
    @media (max-width: ${props => Breakpoint.xl}) {
        width: 100%;
    }    
`
const HeaderText = styled.span`
    font-size: 2.5rem;
    font-family: Poppins-SemiBold;
`
const GridWrap = styled.div`
    display: flex;
    margin-top: 5vh;
`
const Grid = styled.div`
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: auto auto auto;
    @media (max-width: ${props => Breakpoint.lg}) {
        width: 100%;
    }    
    @media (max-width: ${props => Breakpoint.md}) {
        width: 100%;
        grid-template-columns: auto auto;
    }    
    @media (max-width: ${props => Breakpoint.sm}) {
        width: 100%;
        grid-template-columns: auto;
    }    
`