import dateFormat from "dateformat";
import styled from "styled-components";

import { truncate } from "../../../utils/helpers";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "../../../components/global/Accordion";
import { IGetMarketItemResponse } from "../../../interfaces/marketplace/GetMarketItemResponse";

export default function DescriptionAccordion({
  item,
  contractAddress,
}: {
  item: IGetMarketItemResponse | any;
  contractAddress: string | undefined;
}) {
  return (
    <Accordion noGap key="accordion-0">
      <AccordionItem eventKey={2}>
        <AccordionHeader eventKey={2}>Overview</AccordionHeader>
        <AccordionBody eventKey={2}>
          <Col>
            <Text size={0.9}>{item?.description}</Text>
          </Col>
        </AccordionBody>
      </AccordionItem>
      <AccordionItem eventKey={1}>
        <AccordionHeader eventKey={1} expand>
          Description of Mindoro Farm
        </AccordionHeader>
        <AccordionBody eventKey={1}>
          <Col w={100}>
            {item?.attributes && Array.isArray(item?.attributes) ? (
              (item?.attributes || []).map((m: any, i: number) => {
                // @note @todo Make this variable a helper function
                let mValue =
                  m?.trait_type === "estimated_monthly_payment"
                    ? `$${Number(m.value).toLocaleString()}`
                    : m.value && m?.trait_type === "market_value_of_home"
                      ? `$${Number(m.value).toLocaleString()}`
                      : m.value && m?.trait_type === "price_per_sqft"
                        ? `$${Number(m.value).toLocaleString()}`
                        : m.value;

                return (
                  <AttributeJustified key={`attr-${i}`}>
                    <AttributeCell paddingLeft={1}>
                      <Text size={0.9} color="#000000">
                        {(
                          m.trait_type.replaceAll("_", " ") || ""
                        ).toUpperCase()}
                      </Text>
                    </AttributeCell>
                    <AttributeCell pos="right" paddingRight={1}>
                      <Text size={0.9} color="#000000" bold>
                        {mValue}
                      </Text>
                    </AttributeCell>
                  </AttributeJustified>
                );
              })
            ) : (
              <div>Not Available</div>
            )}
          </Col>
        </AccordionBody>
      </AccordionItem>

      <AccordionItem eventKey={4}>
        <AccordionHeader eventKey={4}>NFT Details</AccordionHeader>
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
                {item?.propertyId}
              </Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}>Token Standard</Text>
              <Text size={0.9}>ERC-721</Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}>Blockchain</Text>
              <Text size={0.9}>{`${process.env.REACT_APP_NETWORK_NAME}`}</Text>
            </CellJustified>
            <CellJustified>
              <Text size={0.9}>Creator Fee</Text>
              <Text size={0.9}>0 ETH</Text>
            </CellJustified>
          </DetailsWrap>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
}

const Col = styled("div")<{ w?: number }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
`;
const AttributeJustified = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const AttributeCell = styled("div")<{
  pos?: string;
  paddingLeft?: number;
  paddingRight?: number;
}>`
  width: 100%;
  display: flex;
  ${(props) =>
    props.pos === "right"
      ? "justify-content:flex-end"
      : props.pos === "center"
        ? "justify-content:center"
        : "justify-content:flex-start"};
  padding-left: ${(props) => props.paddingLeft}rem;
  padding-right: ${(props) => props.paddingRight}rem;
  margin-bottom: 0.5rem;
`;
const Text = styled("span")<{
  font?: string;
  bold?: boolean;
  color?: string;
  size?: number;
}>`
  font-family: ${(props) =>
    props.font || (props.bold ? "Poppins-Medium" : "Poppins-Light")};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}rem;
`;
const Row = styled("div")<{ marginTop?: number; marginBottom?: number }>`
  margin-top: ${(props) => props.marginTop}rem;
  margin-bottom: ${(props) => props.marginBottom}rem;
  display: flex;
  flex-direction: row;
`;
const DetailsWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const CellJustified = styled("div")<{ gap?: number }>`
    width: 100%;
    display: flex;
    justify-content space-between;    
    margin: 0.2rem 0;
    ${(props) => (props.gap ? `gap:${props.gap}rem` : "")};
`;
