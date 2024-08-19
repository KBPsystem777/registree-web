import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import * as mlStyle from "../../../../MLStyles";
import {Breakpoint} from "../../../../constants";
import {mint, transfer} from "../../../../blockchain/actions/MLTokenAction";
import {addTransCount, setLoadingTransferToken} from "../../../../redux/web3Reducer";
import {useWeb3React} from "@web3-react/core";
import {useDispatch, useSelector} from "react-redux";
import {useModalContext} from "../../../../hooks/ModalContext";
import {getTokenTransfers, getTokenTransferTransactions, logTransaction} from "../../../../api/Token";
import {useMoralis} from "react-moralis";
import {useAlertContext} from "../../../../hooks/AlertContext";
import {dateDiff, errorCatcher, truncate, truncateText} from "../../../../utils/helpers";
import dateFormat from "dateformat";
import {logNftTransaction} from "../../../../api/Nft";
import {ethers} from "ethers";

export default function TabTransfer() {

    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false)
    const {account} = useWeb3React();
    // @ts-ignore
    const {web3State} = useSelector(state => state);
    const dispatch = useDispatch();
    const [transferAddress, setTransferAddress] = useState('');
    const [transferAmount, setTransferAmount] = useState(0);
    const [locked, setLocked] = useState(true);
    const [tokenTransfers, setTokenTransfers] = useState<any[]>([]);
    // @ts-ignore
    const {setLoadingMessage, setErrorMessage, setSuccessMessage} = useModalContext();

    async function fetchData() {
        setLoading(true);
        try {
            const raw = await getTokenTransferTransactions();
            setTransactions(raw?.data?.data?.transactions);

            const rawTokenTransfers = await getTokenTransfers()
            if (rawTokenTransfers?.data?.data && Array.isArray(rawTokenTransfers?.data?.data)) {
                setTokenTransfers(rawTokenTransfers.data.data);
            }
        } catch (e) {}
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            await fetchData();
        })();
    }, [])


    function handleInputChange(e:any) {
        switch (e.target.name) {
            case "transferAddress":
                setTransferAddress(e.target.value);
                if (!e.target.value || transferAmount < 1) {
                    setLocked(true);
                } else {
                    setLocked(false);
                }
                break;
            case "transferAmount":
                setTransferAmount(e.target.value);
                if (e.target.value < 1 || !transferAddress) {
                    setLocked(true);
                } else {
                    setLocked(false);
                }
                break;
        }
    }

    async function handleTransferClick() {

        // if (!web3State.account) {
        //     alertContext({type:'error', message: 'Authentication expired! Please re-login.'});
        //     return;
        // }

        try {
            if (account) {
                setLoadingMessage('Transferring token...transaction in process...');
                dispatch(setLoadingTransferToken(true));
                const tx = await transfer(transferAddress, transferAmount);
                await logNftTransaction(
                    0,
                    'transfer',
                    'transferred',
                    tx.transactionHash,
                    tx.from,
                    tx.to,
                    ethers.utils.formatUnits(tx.gasUsed),
                    transferAmount,
                    tx.events,
                    tx.logs,
                    '',
                    'token',
                );
                dispatch(setLoadingTransferToken(false));
                setSuccessMessage('Token has been transferred!');
                await fetchData();

                //giving time to update the smart contract
                setTimeout(() => dispatch(addTransCount(1)), 5000);
            }
        }catch (e) {
            setErrorMessage(errorCatcher(e));
            dispatch(setLoadingTransferToken(false));
        }
    }

    return (
        <Container>
            <Left>
                <Header>
                    Transfer Tokens
                </Header>
                <Content padding={1.5}>
                    <Col>
                        <Row marginBottom={0.5}>
                            <Label>Address:</Label>
                            <Input
                                type="text"
                                name="transferAddress"
                                w={25}
                                value={transferAddress}
                                onChange={handleInputChange}
                            />
                        </Row>
                        <Row  marginBottom={1}>
                            <Label>Amount:</Label>
                            <Input
                                type="number"
                                name="transferAmount"
                                value={transferAmount}
                                onChange={handleInputChange}
                                disabled={web3State.loadingTransferToken ? true : false}
                            />
                        </Row>
                        <Row>
                            <Label>&nbsp;</Label>
                            <TransButton
                                islocked={(locked || web3State.loadingTransferToken)}
                                onClick={() => (locked || web3State.loadingTransferToken) ? null : handleTransferClick()}
                            >
                                Transfer
                            </TransButton>
                        </Row>
                    </Col>
                </Content>
            </Left>

            <Right>
                <Header>
                    Transactions
                </Header>

                <Content>
                    <RowHeader>
                        <Cell wPct={25}>Txn Hash</Cell>
                        <Cell wPct={16}>Amount</Cell>
                        <Cell wPct={22}>From</Cell>
                        <Cell wPct={22}>To</Cell>
                        <Cell wPct={15}>TimeStamp</Cell>
                    </RowHeader>
                    {
                        loading ? (
                          <LoadingWrap>
                              <i className="fa fa-circle-o-notch fa-spin"></i>
                          </LoadingWrap>
                        ) : (
                          (tokenTransfers || []).map((tran, i) => {
                              return (
                                <RowData key={i}>
                                    <Cell wPct={25}>{truncateText(tran.transaction_hash, 15)}</Cell>
                                    <Cell wPct={16}>{ethers.utils.formatEther(tran.value.toString())}</Cell>
                                    <Cell wPct={22}>{truncate(tran.from_wallet)}</Cell>
                                    <Cell wPct={22}>{truncate(tran.to_wallet)}</Cell>
                                    <Cell wPct={15}>{dateDiff(new Date(), new Date(dateFormat(tran.block_timestamp, 'yyyy-mm-dd')))} days ago</Cell>
                                </RowData>
                              )
                          })
                        )
                    }
                </Content>
            </Right>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    column-gap: 1rem;
    margin-top: 2rem;
    @media (max-width: ${props => Breakpoint.lg}) {
        flex-direction: column;
    }    
`
const Left = styled.div`
    width: 40rem;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgb(0 0 0 / 0.1);
    border-left: 1px solid rgb(0 0 0 / 0.1);
    border-bottom: 1px solid rgb(0 0 0 / 0.1);
    border-radius: 0.3rem;
    overflow: hidden;
    @media (max-width: ${props => Breakpoint.lg}) {
        width: 100%;
        margin-bottom: 1rem;
    }    
`
const Right = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgb(0 0 0 / 0.1);
    border-left: 1px solid rgb(0 0 0 / 0.1);
    border-bottom: 1px solid rgb(0 0 0 / 0.1);
    border-radius: 0.3rem;
    overflow: hidden;
`

const Content = styled('div')<{padding?:number}>`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: ${props => props.padding}rem;
`
const Col = styled('div')<{}>`
    width: 100%;
    display: flex;
    flex-direction: column;
`
const Row = styled('div')<{marginTop?:number,marginBottom?:number}>`
    width: 100%;
    display: flex;
    // justify-content: center;
    flex-direction: row;
    align-items: center;
    margin-top: ${props => props.marginTop}rem;
    margin-bottom: ${props => props.marginBottom}rem;
`
const Text = styled('span')<{font?:string,bold?:boolean,color?:string,size?:number}>`
    font-family: ${props => props.font || 'Poppins-Light'};
    color: ${props => props.color};
    font-size: ${props => props.size}rem;
`
const Label = styled.div`
    font-size: 0.9rem;
    // width: calc(20% / 2);
    width: 30%;
    @media (max-width: ${props => Breakpoint.lg}) {
        // font-size: 10pt;
    }    
`

const Input = styled('input')<{w?:number}>`
    width: 100%;
    height: 2.4rem;
    outline: none;
    font-size: 0.9rem;
    border-radius: 0.3rem;
    border: 1px solid rgb(0 0 0 / 0.1);
    padding: 1rem;
    @media (max-width: ${props => Breakpoint.lg}) {
        font-size: 10pt;
    }
    // margin-left: 1rem;    
`
const Header = styled.div`
    width: 100%;
    height: ${props => mlStyle.HEADER_HEIGHT};
    background-color: #2A72A7;
    display: flex;
    align-items: center;
    color: #fff;
    font-family: Poppins-Medium;
    font-size: 0.9rem;
    font-weight: 400;
    padding-left: 1rem;
    @media (max-width: ${props => Breakpoint.lg}) {
        // font-size: 12pt;
    }    
`
const MintButton = styled('div')<{isloading?:boolean,islocked?:boolean}>`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14pt;
    font-weight: 200;
    letter-spacing: 1pt;
    background-color: #2a72a7;
    width: 100%;
    height: 2.5rem;
    cursor: ${props => props.isloading ? 'not-allowed' : 'pointer'};
    color: #ffffff;
    border-radius: 0.3rem;
    cursor: ${props => props.islocked ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.islocked ? 0.5 : 1};
`
const RowHeader = styled.div`
    width: 100%;
    height: ${props => mlStyle.HEADER_HEIGHT};
    background-color: rgb(0 0 0 / 0.1);
    display: flex;
    justify-content: space-between;
`
const Cell = styled('div')<{header?:boolean,wPct?:number}>`
    width: ${props => props.wPct || 100}%;
    height: ${props => mlStyle.HEADER_HEIGHT};
    font-family: ${props => props.header ? 'Poppins-Medium' : 'Poppins-Light'};    
    font-size: 0.8rem;
    font-weight: ${props => props.header ? 500 : 200};;
    display: flex;
    align-items: center;
    padding-left: 1rem;
`
const RowData = styled.div`
    width: 100%;
    height: ${props => mlStyle.HEADER_HEIGHT};
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgb(0 0 0 / 0.1);
`
const TransButton = styled('div')<{isloading?:boolean,islocked?:boolean}>`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14pt;
    font-weight: 200;
    letter-spacing: 1pt;
    background-color: #2a72a7;
    width: 100%;
    height: 2.5rem;
    cursor: ${props => props.isloading ? 'not-allowed' : 'pointer'};
    color: #ffffff;
    border-radius: 0.3rem;
    cursor: ${props => props.islocked ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.islocked ? 0.5 : 1};
`
const LoadingWrap = styled.div`
  width: 100%;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
`
