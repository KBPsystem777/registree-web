import React, {useState} from 'react';
import styled from "styled-components";
import {adminAuthenticate} from "../../api/Client";
import {useSelector,useDispatch} from "react-redux";
import {setTokenExpired} from "../../redux/web3Reducer";

export default function TokenExpired() {

    // @ts-ignore
    const {web3State} = useSelector(state => state);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    async function handleRequestTokenClick() {
        if (web3State.account) {
            try {
                setLoading(true);
                const auth = await adminAuthenticate(web3State.account);
                if (auth?.data?.data) {
                    localStorage.setItem("token", auth.data.data.token.key);
                    dispatch(setTokenExpired(false));
                }
            } catch (e) {
                setLoading(false);
            }
        }
    }

    return (
        <Container>
            <Message>The token has expired or is invalid.</Message>
            <RequestButton locked={loading} onClick={() => loading  ? null : handleRequestTokenClick()}>
                {loading ? (<i className="fa fa-circle-o-notch fa-spin"></i>) : 'REQUEST NEW TOKEN'}

            </RequestButton>
        </Container>
    );
}

const Container = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    justify-content: center;
    align-items: center;
`
const Message = styled.div`
    color: #ff0000;
    font-size: 1.5rem;
    margin-bottom: 1rem;
`

const RequestButton = styled('div')<{locked?:boolean}>`
    background: #2C72A7;
    color: #fff;
    font-size: 1.2rem;
    border-radius: 0.4rem;
    width: 15rem;
    height: 3.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${props => props.locked ? 'not-allowed' : 'pointer'};
`