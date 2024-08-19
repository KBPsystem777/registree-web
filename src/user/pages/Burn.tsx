import {useState} from 'react';
import Base from "./TransactionModalBase";
import styled from "styled-components";
import {useWeb3React} from "@web3-react/core";
import {burn} from "../../blockchain/actions/MLNftAction";
import {logNftTransaction} from "../../api/Nft";
import {ethers} from "ethers";
import {useModalContext} from "../../hooks/ModalContext";
import {errorCatcher} from "../../utils/helpers";

export default function Burn({nft,closeModal}:any) {

    const [loading, setLoading] = useState(false);
    const {account} = useWeb3React();
    // @ts-ignore
    const {setErrorMessage, setSuccessMessage} = useModalContext();

    async function handleBurnClick() {
        try {
            if (account) {
                setLoading(true);
                const tx = await burn(nft.property_id || nft.propertyId, account);
                if (tx) {
                    console.log(tx);
                    const res = await logNftTransaction(
                        nft.property_id || nft.propertyId,
                        'burn',
                        'burned',
                        tx.transactionHash,
                        tx.from,
                        tx.to,
                        ethers.utils.formatUnits(tx.gasUsed),
                        0,
                        tx.events,
                        tx.logs,
                        '',
                        'nft',
                    );
                    console.log(res)
                    setSuccessMessage('Burn NFT success.');
                } else {
                    setErrorMessage('Burn NFT failed.');
                }

                setLoading(false);
                closeModal();
            }
        } catch (e) {
            setErrorMessage(errorCatcher(e));
            setLoading(false);
        }
    }

    function handleCancelClick() {
        closeModal();
    }

    return (
        <Base title="Burn NFT" inProcess={loading} close={() => loading ? null : closeModal()}>
            <Col marginTop={2}>
                <Text font="Poppins-Regular">Are you sure you want to burn this NFT?</Text>
            </Col>
            <RowJustified>
                <Button color="#ffffff" bg="#2A72A7" disabled={loading} onClick={() => loading ? null : handleBurnClick()}>Burn</Button>
                <Button color="#2A72A7" bg="#ffffff" disabled={loading} borderColor="#2A72A7" onClick={() => loading ? null : handleCancelClick()}>Cancel</Button>
            </RowJustified>
        </Base>
    );
}

const Col = styled('div')<{w?:number,marginTop?:number,marginBottom?:number}>`
    display: flex;
    flex-direction: column;
    width: ${props => props.w ? `${props.w}%` : 'auto'};
    margin-top: ${props => props.marginTop}rem;
    margin-bottom: ${props => props.marginBottom}rem;
`
const Text = styled('span')<{font?:string,bold?:boolean,color?:string,size?:number}>`
    font-family: ${props => props.font || 'Poppins-Light'};
    color: ${props => props.color};
    font-size: ${props => props.size}rem;
`

const RowJustified = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 0.7rem;
    margin-top: 1rem;
`

const Button = styled('div')<{bg?:string,color?:string,borderColor?:string,disabled?:boolean}>`
    width: 50%;
    height: 3.2rem;
    border-radius: 0.7rem;
    font-family: Poppins-SemiBold;
    color: ${props => props.color};
    background: ${props => props.bg};
    ${props => props.borderColor ? `border: 0.15rem solid ${props.borderColor}` : ''};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${props => props.disabled ? 'default' : 'pointer'};
    opacity: ${props => props.disabled ? 0.5 : 1};
    ${props => !props.disabled ? `
        &:hover {
            box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
            opacity: 0.95;    
        }    
    ` : ''}   
`
