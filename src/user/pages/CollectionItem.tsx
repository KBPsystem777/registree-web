import React from 'react';
import styled, {keyframes} from "styled-components";
import {Breakpoint} from "../../constants";
import {useNavigate} from "react-router-dom";
import {CLIENT_DIR} from "../../config";

export default function CollectionItem({item}:any) {
    const navigate = useNavigate();
    return (
        <Container
            onClick={() =>
                navigate(
                    `${CLIENT_DIR}/collection/${item.name.toLowerCase()}`, {
                        state:
                            {
                                name:item.name, address:item.address
                            }
                    })
        }>
            <Header src={item.image}/>
            <Footer>
                <Thumb src={item.image}/>
                <NftName>{item.name}</NftName>
            </Footer>
        </Container>
    );
}

const Container = styled.div`
    width: 19rem;
    height: 16rem;
    border-radius: 0.9rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0px 20px 25px rgba(0, 0, 0, 0.02), 0px 5px 5px rgba(0, 0, 0, 0.02);    
    cursor: pointer;
    @media (max-width: ${props => Breakpoint.lg}) {
        width: 100%;
    }    
`
const Header = styled('div')<{src?:string}>`
    width: 100%;
    height: 65%;
    background-color: lightgray;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;        
`
const Footer = styled.div`
    position: relative;
    width: 100%;
    height: 35%;
    display: flex;
    align-items: center;
`
const Thumb = styled('div')<{src?:string}>`
    position: absolute;
    width: 5.5rem;
    height: 5.5rem;
    border-radius: 0.8rem;
    overflow: hidden;
    background-color: lightgray;
    left: 5%;
    bottom: 18%;
    border: 0.3rem solid #ffffff;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;        
`
const NftName = styled.span`
    font-family: Poppins-SemiBold;
    margin-left: 7.3rem;
`