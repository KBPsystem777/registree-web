import React from 'react';
import styled from "styled-components";
import {useWeb3React} from "@web3-react/core";

function Home() {

    const { deactivate } = useWeb3React();

    function handleLogoutClick() {
        deactivate();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem("provider");
        localStorage.removeItem("token");
    }

    return (
        <Container>
            <img src={require('../../assets/images/check.png').default} width="75" height="75"/>
            <br/>
            <span>SUCCESS!</span>
            <br/>
            <ButtonLogout onClick={handleLogoutClick}/>
        </Container>
    );
}

export default Home;

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
const ButtonLogout = styled.div`
    background: gray;
    padding: 0.75rem 2rem;
    border-radius: 0.2rem;
    cursor: pointer;
    &:after {
        content: 'Logout';
        color: #fff;
    }
    &:hover {
        opacity: 0.8;
    }
`
