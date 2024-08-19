import React from "react";
import styled, { keyframes } from "styled-components";

let bg = "#ffffff";

export default function WaveActivityIndicator(props: any) {
  bg = props.bg || "#ffffff";
  return (
    <Container>
      <Wave />
      <Wave />
      <Wave />
      <Wave />
      <Wave />
    </Container>
  );
}

const Container = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: space-between;
`;
const Wave = styled.div`
  background-color: ${(props) => bg};
  height: 100%;
  width: 15%;
  min-width: 15%;
  animation: ${(props) => waving} 1.2s infinite ease-in-out;
  &:nth-child(1) {
    animation-delay: -1.2s;
  }
  &:nth-child(2) {
    animation-delay: -1.1s;
  }
  &:nth-child(3) {
    animation-delay: -1s;
  }
  &:nth-child(4) {
    animation-delay: -0.9s;
  }
  &:nth-child(5) {
    animation-delay: -0.8s;
  }
`;
const waving = keyframes`
    0%, 40%, 100% {
        transform: scaleY(0.4);
    } 
    20% {
      transform: scaleY(1);
    }
`;
