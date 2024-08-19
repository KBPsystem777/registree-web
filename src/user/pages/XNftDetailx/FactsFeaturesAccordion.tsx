import React from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "../../../components/global/Accordion";
import styled from "styled-components";

export default function FactsFeaturesAccordion({ }: any) {
  return (
    <Accordion key="accordion-facts-features">
      <AccordionItem eventKey={7}>
        <AccordionHeader eventKey={7} expand>Facts & Features</AccordionHeader>
        <AccordionBody eventKey={7}>
          <DetailsWrap>
            <CellJustified>
              <Text size={0.9}># of Beds and Baths</Text>
              <Text size={0.9} bold>2</Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}># of Full Baths</Text>
              <Text size={0.9} bold>1</Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}>Interior Dimension by Room</Text>
              <Text size={0.9} bold>65</Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}>Appliances</Text>
              <Text size={0.9} bold>23</Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}>Interior Features</Text>
              <Text size={0.9} bold>2</Text>
            </CellJustified>
          </DetailsWrap>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
}

const DetailsWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const CellJustified = styled('div') <{ gap?: number }>`
    width: 100%;
    display: flex;
    justify-content space-between;    
    margin: 0.2rem 0;
    ${props => props.gap ? `gap:${props.gap}rem` : ''};
`
const Text = styled("span") <{
  font?: string
  bold?: boolean
  color?: string
  size?: number
}>`
  font-family: ${(props) =>
    props.font || (props.bold ? "Poppins-Medium" : "Poppins-Light")};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}rem;
`
