import React, {useContext, useEffect, useRef, useState} from "react";
import {Alert} from "react-bootstrap";
import styled, {keyframes} from "styled-components";

// @ts-ignore
const AlertContext = React.createContext();

export function useAlertContext() {
    return useContext(AlertContext);
}

// @ts-ignore
export function AlertProvider({ children }) {
    const refNotification = useRef(null);
    const [alertMessageValues, setAlertMessageValues] = useState(null);

    function handleHide() {
        setAlertMessageValues(null);
    }

    function alertValues(val:any) {
        setAlertMessageValues(val);
    }


    useEffect(() => {
        if (refNotification.current) {
            if (alertMessageValues) {
                // @ts-ignore
                refNotification.current.classList.toggle('slideIn');
            } else {
                // @ts-ignore
                refNotification.current.classList.toggle('slideIn');
            }
        }
    }, [alertMessageValues])


    return (
        <AlertContext.Provider value={alertValues}>
            <AlertMessage values={alertMessageValues} show={true} hide={handleHide} ref={refNotification}/>
            {children}
        </AlertContext.Provider>
    )
}


const AlertMessage = React.forwardRef((props:any, ref:any) => {

    if (!props.values) {
        return null;
    }

    const isSuccess = props.values.type === 'success';

    return (
        <AlertContainer ref={ref}>
            <Alert show={true} variant={isSuccess ? 'success' : 'danger'}>
                <div className="d-flex justify-content-end">
                    <button
                        type="button"
                        className="close"
                        data-bs-dismiss="alert"
                        aria-label="close"
                        onClick={props.hide}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <Alert.Heading><i className={isSuccess ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}></i>&nbsp;Mint</Alert.Heading>
                <p>
                    {props.values.message}
                </p>
            </Alert>
        </AlertContainer>
    )
})

const AlertContainer = styled.div`
    position: absolute;
    top: 2%;
    width: 50%;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 2s ease;
    &.slideIn {
        animation: ${props => slideIn} 0.7s forwards;   
    }
    &.slideOut {
        animation: ${props => slideOut} 0.7s forwards;       
    }    
    overflow: hidden;
`
const slideIn = keyframes`
    0%{transform: translateX(-100%);}
    100%{transform: translateX(1%);}
`
const slideOut = keyframes`
    0%{transform: translateX(1%);}
    100%{transform: translateX(-100%);}
`
