import React, {useEffect, useRef} from 'react';
import styled from "styled-components";
import {Breakpoint} from "../../constants";
import {useDispatch, useSelector} from "react-redux";
import {setOpenMobileNav} from "../../redux/utilReducer";
import Sidebar from "./Sidebar";
import {NavLink} from "react-router-dom";
import {DropdownButton} from "react-bootstrap";
import {truncate} from "../../utils/helpers";
import {setAccount, setChainId, setProvider, setWeb3Modal} from "../../redux/web3Reducer";
import {useWeb3React} from "@web3-react/core";

export function MobileNavbar() {

    // @ts-ignore
    const {web3State} = useSelector(state => state)
    const dispatch = useDispatch();
    const {deactivate} = useWeb3React();

    async function handleLogoutClick() {
        // await logout();
        window.localStorage.clear();
        await deactivate();

        dispatch(setProvider(null));
        dispatch(setWeb3Modal(null));
        dispatch(setChainId(0));
        dispatch(setAccount(""));
    }

    return (
        <Container>
            <Wrapper>
                <Left>
                    <LogoImage src={require('../../assets/images/ML Logo White.png').default}/>
                </Left>
                <Right>
                    <DropdownButton id="ml-dropdown-basic-button-mobile" title={truncate(web3State.account || '')}>
                        {/*<Dropdown.Item className="ml-dropdown-item">Change Password</Dropdown.Item>*/}
                        {/*<Dropdown.Item className="ml-dropdown-item" onClick={handleLogoutClick}>Logout</Dropdown.Item>*/}
                        {/*<DDItem>Change Password</DDItem>*/}
                        <DDItem onClick={handleLogoutClick}>Logout</DDItem>
                    </DropdownButton>
                </Right>
            </Wrapper>
        </Container>
    );
}

export const Hamburger = () => {
    const refToggleButton = useRef(null);
    // @ts-ignore
    const {isOpenMobileNav} = useSelector(state => state.utilState);
    const dispatch = useDispatch();

    function handleToggleButtonClick() {
        dispatch(setOpenMobileNav(!isOpenMobileNav));
    }
    return (
        <ToggleButton
            ref={refToggleButton}
            className="toggle-button"
            onClick={handleToggleButtonClick}
        >
            <Bar/>
            <Bar/>
            <Bar/>
        </ToggleButton>
    )
}

const Container = styled.div`
    position: absolute;
    display: none;
    top: 0;
    width: 100%;
    background: #ffffff;
    z-index: 50;
    @media (max-width: ${props => Breakpoint.md}) {
        display: fixed;
    }
`
const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 1.2rem;
    height: 4rem;
    background: #2C72A7;            
`
const Left = styled.div`
    display: flex;
    align-items: center;
`
const Right = styled.div`
    display: flex;
    align-items: center;
    padding-right: 3rem;
`
const ToggleButton = styled('div')<{}>`
    position: absolute;
    right: 0;
    top: 0;
    margin-top: 1.2rem;
    margin-right: 1.2rem;
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 2rem;
    height: 1.3rem;
    cursor: pointer;
    z-index: 70;
    @media (max-width: ${props => Breakpoint.md}) {
        display: flex;
    }
    &.active {
        ${props => Bar} {
            &:nth-of-type(1) {
                transition: transform 0.2s ease 0s;
                transform: translate(0%,200%) rotate(45deg);
            }                    
            &:nth-of-type(3) {
                transition: transform 0.2s ease 0s;
                transform: translate(0%,-200%) rotate(-45deg);
            }
            &:nth-of-type(2) {
                visibility: hidden;
            }                    
        }            
    }
`
const Bar = styled('div')<{isActive?:boolean}>`
    height: 0.25rem;
    width: inherit;
    background-color: #fff;      
    transition: transform 0.2s ease 0s;
`
const LogoImage = styled.img`
    width: 4rem;
`
const DDItem = styled.div`
    width: 100%;
    background-color: transparent;
    color: rgba(0,0,0,0.5);
    font-family: Poppins-Light;
    font-size: 14px;
    cursor: pointer;
    padding: 4px 24px;
    white-space: nowrap;
    &:hover {
        background-color:  rgba(242,242,242, 0.5);
    }
`

export const MobileNavMenu = () => {

    const refContainer = useRef(null);
    // @ts-ignore
    const {isOpenMobileNav} = useSelector(state => state.utilState);

    useEffect(() => {
        if (refContainer.current) {
            // @ts-ignore
            refContainer.current.style.transform = `translateX(${isOpenMobileNav ? '0%' : '100%'})`;
        }
    }, [isOpenMobileNav]);
    return (
        <MenuContainer ref={refContainer}>
            <Sidebar/>
        </MenuContainer>
    )
}

const MenuContainer = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    height: 100vh;
    // background: rgba(26,223,50,0.6);
    background: #2C72A7;
    display: none;
    flex-direction: column;
    z-index: 60;
    transform: translateX(100%);
    transition: all 0.2s ease-in-out;
    @media (max-width: ${props => Breakpoint.md}) {
        display: flex;
    }
`
