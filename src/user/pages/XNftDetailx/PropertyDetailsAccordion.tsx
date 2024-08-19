import React from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "../../../components/global/Accordion";
import styled from "styled-components";

export default function PropertyDetailsAccordion({ }: any) {
  return (
    <Accordion key="accordion-property-details">
      <AccordionItem eventKey={8}>
        <AccordionHeader eventKey={8} expand>Property Details</AccordionHeader>
        <AccordionBody eventKey={8}>
          <Col w={100}>
            <Col>
              <Text size={0.9} bold>Parking</Text>
              <ul>
                <li>Total spaces, parking features</li>
              </ul>
            </Col>
            <Col>
              <Text size={0.9} bold>Property</Text>
              <ul>
                <li>Levels</li>
                <li>Stories</li>
                <li>Pool features</li>
                <li>Community exterior features</li>
                <li>Patio & porch details</li>
                <li>Covered fencing</li>
              </ul>
            </Col>
            <Col>
              <Text size={0.9} bold>Lot</Text>
              <ul>
                <li>Lot size</li>
                <li>Lot size dimensions</li>
                <li>Lot features</li>
              </ul>
            </Col>
          </Col>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
}

const Col = styled("div") <{ w?: number }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
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
