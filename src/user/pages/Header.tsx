import React, {useEffect, useRef} from 'react';
import styled from "styled-components";
import Logo from "../../assets/images/ML Logo Blue Inline.png";
import SearchIcon from "../../assets/images/search-icon.svg";
import {DropdownButton} from "react-bootstrap";
import {truncate} from "../../utils/helpers";
import {Breakpoint} from "../../constants";
import {useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';
import {useWeb3React} from "@web3-react/core";
import {useWeb3StateAction} from "../../redux/actions/useWeb3StateAction";
import {useUtilStateAction} from "../../redux/actions/useUtilStateAction";
import {CLIENT_DIR} from "../../config";

export default function Header() {
    const refContainer = useRef<HTMLDivElement>(null);
    // @ts-ignore
    const {web3State, utilState} = useSelector(state => state);
    const {deactivate} = useWeb3React();
    const navigate = useNavigate();
    const {
        updateAccount,
        updateProvider,
        updateChainId,
        updateWeb3Modal
    } = useWeb3StateAction();
    const {updateHeaderHeight} = useUtilStateAction();

    async function handleLogoutClick() {

        window.localStorage.clear();
        await deactivate();

        updateAccount("");
        updateProvider(null);
        updateChainId(0);
        updateWeb3Modal(null);
        navigate(`${CLIENT_DIR}`);
    }

    useEffect(() => {
        if (refContainer.current) {
            if (utilState.removeHeaderBorder) {
                refContainer.current.style.borderBottom = '1px solid rgba(0,0,0,0)';
            } else {
                refContainer.current.style.borderBottom = '1px solid rgba(0,0,0,0.1)';
            }
        }
        // @ts-ignore
        updateHeaderHeight(refContainer.current.offsetHeight);
    }, [utilState.removeHeaderBorder]);

    return (
        <Container ref={refContainer}>
            <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'row',alignItems:'center'}}>
                <HeaderImage src={Logo} onClick={() => navigate(`${CLIENT_DIR}`)}/>
                <SearchInputWrap>
                    <SearchInputImage src={SearchIcon}/>
                    <SearchInput placeholder="Search items, and accounts"/>
                </SearchInputWrap>
                <DropdownButtonWrap>
                    {
                        web3State.account && (
                            <DropdownButton id="ml-dropdown-basic-button" title={truncate(web3State.account || '')}>
                                <DDItem onClick={handleLogoutClick}>Logout</DDItem>
                            </DropdownButton>
                        )
                    }
                </DropdownButtonWrap>
            </div>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    height: 8vh;
    position: fixed;
    background: #ffffff;
    top: 0;
    z-index: 10;
    // border-bottom: 1px solid rgba(0,0,0,0.1);
    padding: 0 4%;
`
const HeaderImage = styled.img`
    height: 100%;
    margin-right: 3.3%;
    cursor: pointer;
`
const SearchInputWrap = styled.div`
    width: 50%;
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
const DropdownButtonWrap = styled.div`
    position: absolute;
    right: 4%;
`