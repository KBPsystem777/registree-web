import React from "react";
import styled from "styled-components";

export default function WarningMessage({message, closeModal}:any) {
  return (
    <div style={{
      position:'absolute',
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      top:'50%',
      left:'50%',
      transform:'translate(-50%, -50%)'
    }}>
      <span style={{
        color:'#ffffff',
        fontSize:'1.4rem'
      }}>{message}</span>
      <OkButton onClick={closeModal}/>
    </div>
  )
}

const OkButton = styled('div')<{locked?:boolean}>`
  width: fit-content;
  margin-top: 2rem;
  padding: 0.7rem 3rem;
  background-color: #2C72A7;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: ${props => props.locked ? 'none' : 'auto'};
  opacity: ${props => props.locked ? 0.5 : 1};
  &:after {
    content: 'OK';
    color: #ffffff;
  }
  &:hover {
    background-color: #25608C;
  }
`
