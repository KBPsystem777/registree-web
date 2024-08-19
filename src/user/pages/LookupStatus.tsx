import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {useWeb3React} from "@web3-react/core";
import {useSelector} from "react-redux";

export default function LookupStatus() {
    const { deactivate } = useWeb3React();
    // @ts-ignore
    const {utilState} = useSelector(state => state);

    function handleLogoutClick() {
        deactivate();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem("provider");
        localStorage.removeItem("token");
    }

    return (
        <Container>
            {
                utilState.lookupStatus === 'success' ? (
                    <>
                        <Text>Wallet successfully connected to your account</Text>
                        <br/>
                        <img src={require('../../assets/images/success.png').default} width="75" height="75"/>
                        <br/>
                    </>
                ) : utilState.lookupStatus === 'failed' ? (
                    <>
                        <Text>Error connecting wallet to your account</Text>
                        <br/>
                        <img src={require('../../assets/images/failed.png').default} width="100" height="100"/>
                        <br/>
                    </>
                ) : (
                    <>
                        <Text>User account not found</Text>
                        <br/>
                        <img src={require('../../assets/images/failed.png').default} width="100" height="100"/>
                        <br/>
                    </>
                )
            }
        </Container>
    );
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
`

const Text = styled('span')<{bold?:boolean,color?:string,size?:number}>`
    font-family: ${props => props.bold ? 'Poppins-Medium' : 'Poppins-Light'};
    color: ${props => props.color};
    font-size: 1.9rem;
`
