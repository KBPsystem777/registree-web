import styled, { keyframes } from "styled-components"

export const FormScreenContainer = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100vw;
  height: 100vh;
  z-index: 200;
`

export const Container = styled.div`
  display: none;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.9);
  width: 100vw;
  height: 100vh;
  z-index: 200;
`

export const MessageContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgba(34, 34, 34, 0.9);
  backdrop-filter: blur(0.3rem);
  z-index: 1200;
`
export const LoadingText = styled("span")<{ static?: boolean }>`
  animation: ${(props) => (props.static ? "" : loading)} infinite 2s ease-in-out;
  color: #fff;
  font-size: 1.5rem;
`
export const loading = keyframes`
    0%{opacity:1;}
    50%{opacity:0;}
    100%{opacity:1;}
`
export const ErrorText = styled.div`
  font-size: 1.5rem;
  // color: #FF1E1E;
  color: #ffffff;
`
export const CloseButton = styled.div`
  width: 10rem;
  height: 3rem;
  border-radius: 0.5rem;
  background-color: #2c72a7;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  font-size: 1.1rem;
  color: #fff;
  line-height: 1;
  margin-top: 2rem;
`
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
export const MessageImage = styled.img`
  height: 2rem;
  margin-right: 1rem;
`
