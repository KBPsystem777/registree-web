import React, {useEffect} from 'react';
import styled from "styled-components";
import {getAllTokenIds} from "../../../api/Nft";

export default function Properties() {
    useEffect(() => {
        (async() => {
            const nfts = await getAllTokenIds();
            console.log(nfts)
        })();
    }, []);
    return (
        <Container>NFTs</Container>
    );
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: #ffffff;
`
