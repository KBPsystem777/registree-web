import styled from "styled-components"

import { IPropertyDetailedInformation } from "../../../interfaces/property/PropertyInfo"

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "../../../components/global/Accordion"
import { getMarketItemFullInfo } from "../../../api/Marketplace"
import { useEffect, useState } from "react"

interface IPropertyId {
  id: number
}
/*** This component is being displayed on
 * http://localhost:3000/marketplace/{contractAddress}/{tokenId}
 */
export default function FactsFeaturesAccordion({ id }: IPropertyId) {
  const [propertyInfo, setPropertyInfo] =
    useState<IPropertyDetailedInformation>()

  // @note This is a temporary computation only for NFTIs since
  // They are sharing a propertyId with regular NFTs
  const parsedPropertyId = (id: number) => {
    // @note Increment or add new conditions here if there are
    // new NFTIs are minted
    if (id === 0) {
      return 907
    }
    return id
  }

  const propertyDetail = async () => {
    try {
      const response = await getMarketItemFullInfo(parsedPropertyId(id))
      const propertyInfo = await response.data
      setPropertyInfo(propertyInfo?.data)
    } catch (error) {
      console.error("Error fetching property information:", error)
    }
  }

  useEffect(() => {
    propertyDetail()
  }, [id])

  return (
    <Accordion key="accordion-facts-features">
      <AccordionItem eventKey={7}>
        <AccordionHeader eventKey={7} expand>
          Property spaces
        </AccordionHeader>
        <AccordionBody eventKey={7}>
          <DetailsWrap>
            {propertyInfo?.rooms?.map((item: any) => (
              <CellJustified key={item?._id}>
                <Text size={0.9}>
                  <Text bold>{item?.name}</Text>
                  <>
                    <ul>
                      Items/Appliance(s):
                      <ol>
                        {item?.items.map((appliance: any) => (
                          <li>{appliance?.name ?? "NA"}</li>
                        ))}
                      </ol>
                    </ul>
                  </>
                </Text>
              </CellJustified>
            ))}
          </DetailsWrap>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  )
}

const DetailsWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const CellJustified = styled("div") <{ gap?: number }>`
    width: 100%;
    display: flex;
    justify-content space-between;    
    margin: 0.2rem 0;
    ${(props) => (props.gap ? `gap:${props.gap}rem` : "")};
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
