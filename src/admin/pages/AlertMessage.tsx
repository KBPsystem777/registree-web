import React, {useEffect, useRef} from 'react';
import {Alert} from "react-bootstrap";
import styled, {keyframes} from "styled-components";

export default function AlertMessage(props:any) {
    const refNotification = useRef(null);

    useEffect(() => {
        if (props.show) {
            // @ts-ignore
            refNotification.current.classList.toggle('slideIn');
        } else {
            // @ts-ignore
            refNotification.current.classList.toggle('slideIn');
        }
    }, [props.show])

    return (
        <AlertContainer ref={refNotification}>
            <Alert show={true} variant="success">
                <div className="d-flex justify-content-end">
                    <button
                        type="button"
                        className="close"
                        data-bs-dismiss="alert"
                        aria-label="close"
                        // onClick={() => setShowAlert(false)}
                        onClick={props.hide}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <Alert.Heading><i className="bi-check-circle-fill"></i>&nbsp;Mint</Alert.Heading>
                <p>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
                    lacinia odio sem nec elit. Cras mattis consectetur purus sit amet
                    fermentum.
                </p>
                <hr/>
            </Alert>
        </AlertContainer>
    )
}

const AlertContainer = styled.div`
    position: absolute;
    top: 1%;
    width: 90%;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 2s ease;
    &.slideIn {
        animation: ${props => slideIn} 0.7s forwards;   
    }
    &.slideOut {
        animation: ${props => slideOut} 0.7s forwards;       
    }    
`
const slideIn = keyframes`
    0%{transform: translateX(-100%);}
    100%{transform: translateX(1%);}
`
const slideOut = keyframes`
    0%{transform: translateX(1%);}
    100%{transform: translateX(-100%);}
`
