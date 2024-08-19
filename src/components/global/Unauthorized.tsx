import React from 'react';
import styled from "styled-components";

export default function Unauthorized() {
    return (
        <Container>
            <ErrorMessage>UNAUTHORIZED WALLET!</ErrorMessage>
        </Container>
    );
}

const Container = styled.div`
    display: fixed;
    width: 100%;
    height: 100%;
    background: #222222;
    display: flex;
    justify-content: center;
    align-items: center;
`
const ErrorMessage = styled.span`
    color: #fff;
    font-size: 1.3rem;
    letter-spacing: 0.05rem;
`