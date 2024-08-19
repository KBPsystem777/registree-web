import React from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "../../../components/global/Accordion";
import dateFormat from "dateformat";
import { dateDiff, truncate } from "../../../utils/helpers";
import styled from "styled-components";

export default function DescriptionAccordion({ item, contractAddress }: any) {
  return (
    <Accordion noGap key="accordion-0">
      <AccordionItem eventKey={1}>
        <AccordionHeader eventKey={1} expand>
          Description of {item?.name}
        </AccordionHeader>
        <AccordionBody eventKey={1}>
          <Col w={100}>
            {
              (item?.attributes && Array.isArray(item?.attributes)) ? (
                item?.attributes || []).map(
                  (m: any, i: number) => {
                    let mValue =
                      m.display_type === "date"
                        ? dateFormat(
                          new Date(m.value * 1000),
                          "mmm dd, yyyy"
                        )
                        : m.value;

                    return (
                      <AttributeJustified key={`attr-${i}`}>
                        <AttributeCell paddingLeft={1}>
                          <Text size={0.9} color="#000000">
                            {(m.trait_type.replaceAll("_", " ") || "").toUpperCase()}
                          </Text>
                        </AttributeCell>
                        <AttributeCell pos="right" paddingRight={1}>
                          <Text size={0.9} color="#000000" bold>
                            {!isNaN(mValue) ? Number(mValue).toLocaleString() : mValue}
                          </Text>
                        </AttributeCell>
                      </AttributeJustified>
                    )
                  }
                ) : (
                <div>Not Available</div>
              )
            }
          </Col>
        </AccordionBody>
      </AccordionItem>

      <AccordionItem eventKey={2}>
        <AccordionHeader eventKey={2}>
          About ManageLife
        </AccordionHeader>
        <AccordionBody eventKey={2}>
          <Col>
            <Row>
              <Text size={0.9}>By&nbsp;</Text>
              <Text size={0.9} font="Poppins-SemiBold">
                {item?.name}
              </Text>
            </Row>
            <Text size={0.9}>
              {item?.nft?.description || item?.description}
            </Text>
          </Col>
        </AccordionBody>
      </AccordionItem>
      {/*
                          {(item?.attributes && item?.attributes.length) > 0 && (
                              <AccordionItem eventKey={3}>
                                  <AccordionHeader eventKey={3}>
                                      Properties
                                  </AccordionHeader>
                                  <AccordionBody eventKey={3}>
                                      <MetadataFlexWrap>
                                          {(item?.attributes || []).map(
                                              (m: any, i: number) => {
                                                  let mValue =
                                                      m.display_type === "date"
                                                          ? dateFormat(
                                                          new Date(m.value * 1000),
                                                          "mmm dd, yyyy"
                                                          )
                                                          : m.value
                                                  return (
                                                      <Metadata key={i}>
                                                          <Text size={0.63} color="#2A72A7" bold>
                                                              {(
                                                                  m.trait_type.replaceAll("_", " ") || ""
                                                              ).toUpperCase()}
                                                          </Text>
                                                          <Text size={0.8} color="#000000" bold>
                                                              {!isNaN(mValue) ? Number(mValue).toLocaleString() : mValue}
                                                          </Text>
                                                          <Text size={0.75} color="rgba(0,0,0,0.5)">
                                                              Good to have this trait
                                                          </Text>
                                                      </Metadata>
                                                  )
                                              }
                                          )}
                                      </MetadataFlexWrap>
                                  </AccordionBody>
                              </AccordionItem>
                          )}
*/}
      <AccordionItem eventKey={4}>
        <AccordionHeader eventKey={4}>Details</AccordionHeader>
        <AccordionBody eventKey={4}>
          <DetailsWrap>
            <CellJustified>
              <Text size={0.9}>Contract Address</Text>
              <Text size={0.9} color="#2081E2">
                {truncate(contractAddress || "")}
              </Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}>Token ID</Text>
              <Text size={0.9} color="#2081E2">
                {item?.property_id}
              </Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}>Token Standard</Text>
              <Text size={0.9}>ERC-721</Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}>Blockchain</Text>
              <Text size={0.9}>Ethereum</Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}>Creator Fee</Text>
              <Text size={0.9}>0 ETH</Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}>Last Updated</Text>
              <Text size={0.9}>
                {dateDiff(
                  new Date(),
                  new Date(
                    dateFormat(item?.updatedAt, "yyyy-mm-dd")
                  )
                )}
              </Text>
            </CellJustified>
          </DetailsWrap>
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
const AttributeJustified = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const AttributeCell = styled('div') <{ pos?: string, paddingLeft?: number, paddingRight?: number }>`
  width: 100%;
  display: flex;
  ${props => props.pos === 'right' ? 'justify-content:flex-end' : props.pos === 'center' ? 'justify-content:center' : 'justify-content:flex-start'};
  padding-left: ${props => props.paddingLeft}rem;
  padding-right: ${props => props.paddingRight}rem;
  margin-bottom: 0.5rem;
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
const Row = styled("div") <{ marginTop?: number; marginBottom?: number }>`
  margin-top: ${(props) => props.marginTop}rem;
  margin-bottom: ${(props) => props.marginBottom}rem;
  display: flex;
  flex-direction: row;
`
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
