import React, { useEffect, useReducer, useState } from 'react';
import ImageLogo from "../../assets/images/ML Logo Blue Inline.png";
import ModalWallet from "../../admin/components/ModalWallet";
import styled from "styled-components";
import ImageBG from "../../assets/images/login-background.jpg";
import { Breakpoint } from "../../constants";
import { clientAuthenticate, clientUserLookup, clientUpdateWallet } from "../../api/Client";
import * as Admin from "../../api/Properties";
import { useModalContext } from "../../hooks/ModalContext";
import Wallet from "../../components/global/Wallet";
import { useWeb3React } from "@web3-react/core";

export default function Login() {

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [attrValues, updateAttrValues] = useReducer((state: any, updates: any) => ({ ...state, ...updates }), {
        username: '',
        password: ''
    })
    // @ts-ignore
    const { setOpen, setModalChildren } = useModalContext();
    const { account } = useWeb3React();

    function openModalWallet() {
        setModalChildren(<Wallet close={() => {
            setOpen(false);
        }} />);
        setOpen(true);
    }

    function handleOnChange(e: any) {
        updateAttrValues({ [e.target.name]: e.target.value });
    }

    async function handleLogin(e: any) {
        e.preventDefault();
        setLoading(true)

        clientAuthenticate(attrValues.username, attrValues.password)
            .then(async res => {
                console.log(res.data.access_token)
                setErrorMessage('');
                // localStorage.setItem('access_token', res.data.access_token);
                // localStorage.setItem('refresh_token', res.data.refresh_token);
                const _clientUserLookup = await clientUserLookup(res.data.access_token);
                console.log(_clientUserLookup)
                if (_clientUserLookup && _clientUserLookup.data && _clientUserLookup.data.data && _clientUserLookup.data.data.token) {
                    // localStorage.setItem('token', _clientUserLookup.data.data.token);
                }

                // openModalWallet();
            })
            .catch(e => {
                if (e.response && e.response.data) {
                    if (e.response.data.error == 'invalid_grant') {
                        setErrorMessage('The username or password is incorrect');
                    } else {
                        setErrorMessage(e.response.data.error_description)
                    }
                }
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    // useEffect(() => {
    //     (async() => {
    //         const token = localStorage.getItem('user_token');
    //         console.log('WALLET CREATED', account, token)
    //         if (account && token) {
    //             const _clientUpdateWalletResult = await clientUpdateWallet(account, token);
    //             if (_clientUpdateWalletResult && _clientUpdateWalletResult.status === 200) {
    //             }
    //         }
    //     })()
    // }, [account])

    return (
        <Container>
            <LoginPanel>
                <Logo src={ImageLogo} />
                <Slogan className="slogan text-center">Life Made Simple</Slogan>
                <br />
                <TextLine className="text-line text-left">Login with your given credentials to enter the ManageLife Portal.</TextLine>
                {
                    errorMessage && (
                        <div className="alert alert-danger" role="alert" style={{ padding: '0.8rem 2rem' }}>
                            {errorMessage}
                        </div>
                    )
                }
                <form style={{ width: '80%' }} onSubmit={handleLogin}>
                    <div className="form-content">

                        <div className="form-group">
                            <input type="text" name="username" className="form-control" placeholder="Email address" onChange={handleOnChange} />
                            <div className="invalid-feedback">
                                <div>Username is required</div>
                            </div>
                        </div>

                        <div className="form-group">
                            <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleOnChange} />
                            <div className="invalid-feedback">
                                <div>Password is required</div>
                            </div>
                        </div>

                    </div>
                    <div className="text-center">
                        <button disabled={loading ? true : false} className=" btn btn-primary text-center" style={{ background: '#2a72a7', minWidth: '144px' }}>
                            {loading ? <i className="fa fa-circle-o-notch fa-spin"></i> : <span>LOGIN</span>}
                        </button>
                    </div>
                </form>
            </LoginPanel>
        </Container>
    );
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-image: url(${props => ImageBG});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top;
`
const LoginPanel = styled.div`
    background: white;
    border-radius: 8px;
    padding: 40px;
    width: 480px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 20vh;
    right: 15%;
    @media (max-width: ${props => Breakpoint.md}) {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -65%);        
    }    
    @media (max-width: ${props => Breakpoint.sm}) {
        width: 94%;
    }    
`
const Logo = styled.img`
    width: 280px;
`
const Slogan = styled.div`
    color: #2a72a7;
    font-size: 12pt;
    font-style: italic;
    font-family: Poppins-SemiBold;
    margin-top: -16px;
`
const TextLine = styled.div`
    font-size: 14pt;
    vertical-align: bottom;
    letter-spacing: 1pt;
    margin-bottom: 3vh;
`
const ConnectButton = styled.div`
    font-size: 14pt;
    font-weight: 200;
    letter-spacing: 1pt;
    background-color: #2a72a7;
    color: #fff;
    padding: 1rem;
    border-radius: 0.3rem;    
    width: 16rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
`

