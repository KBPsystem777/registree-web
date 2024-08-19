import React from 'react';
import styled, {keyframes} from "styled-components";

export default function ActivityLoader() {
    return (
        <Container>
            <Indicator/>
        </Container>
    );
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: rgb(0 0 0 / 0.9);
    position: absolute;
    z-index: 300;    
`

const Indicator = (props:any) => {
    return (
        <IndicatorContainer>
            <Bar key={1} rotate={0} delay={0} />
            <Bar key={2} rotate={30} delay={-0.9167} />
            <Bar key={3} rotate={60} delay={-0.833} />
            <Bar key={4} rotate={90} delay={-0.7497} />
            <Bar key={5} rotate={120} delay={-0.667} />
            <Bar key={6} rotate={150} delay={-0.5837} />
            <Bar key={7} rotate={180} delay={-0.5} />
            <Bar key={8} rotate={210} delay={-0.4167} />
            <Bar key={9} rotate={240} delay={-0.333} />
            <Bar key={10} rotate={270} delay={-0.2497} />
            <Bar key={11} rotate={300} delay={-0.167} />
            <Bar key={12} rotate={330} delay={-0.0833} />
        </IndicatorContainer>
    )
}
const h = 7;
const bgColor = '#ffffff';
const IndicatorContainer = styled.div`
  width: ${props => h}rem;
  height: ${props => h}rem;
  position: relative;
  display: inline-block;
`
const Bar = styled('div')<{rotate?:number,delay?:number}>`
  width: calc(${props => h}rem * 0.05);
  height: calc(${props => h}rem * 0.15);
  left: 49%;
  top: 43%;
  opacity: 0;
  background-color: ${props => bgColor || '#000000'};
  position: absolute;
  -webkit-border-radius: calc(${props => h}rem * 0.04);
  -webkit-box-shadow: 0 0 calc(${props => h}rem * 0.02) rgba(0, 0, 0, 0.2);
  -webkit-animation: ${props => fade} 1s linear infinite;

  -webkit-transform: rotate(${props => props.rotate}deg) translate(0, -130%);
  -webkit-animation-delay: ${props => props.delay}s;
`

const fade = keyframes`
  from {opacity: 1;}
  to {opacity: 0.25;
`
