import React, { Fragment, useState, useEffect } from "react"

import { unixToDate } from "../../utils/unixDateConverter"

import { FieldLabel, Item } from "./styles/Fields.styles"

interface IMetadataInputFields {
  sqFeet: number
  yrBuilt: string
  lotSize: number
  bedRooms: number
  bathRooms: number
  monthlyRevenue: number
  valuation: number
}

export const MetadataForm = (fields: any) => {
  const [sqFeet, setSqFeet] = useState<number>(0)
  const [yrBuilt, setYrBuilt] = useState<number>(0)
  const [lotSize, setLotSize] = useState<number>(0)
  const [bedRooms, setBedRooms] = useState<number>(0)
  const [bathRooms, setBathRooms] = useState<number>(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0)
  const [valuation, setValuation] = useState<number>(0)

  const handlesqFeetChange = (e: any) => {
    setSqFeet(e.target.value)
  }
  const handleYrBuiltChange = (e: any) => {
    setYrBuilt(e.target.value)
  }
  const handleBathroomChange = (e: any) => {
    setBathRooms(e.target.value)
  }
  const handleBedroomChange = (e: any) => {
    setBedRooms(e.target.value)
  }
  const handleLotSizeChange = (e: any) => {
    setLotSize(e.target.value)
  }
  const handleRevenueChange = (e: any) => {
    setMonthlyRevenue(e.target.value)
  }
  const handleValuationChange = (e: any) => {
    setValuation(e.target.value)
  }
  useEffect(() => {
    fields?.fields?.forEach((property: any) => {
      switch (property?.trait_type) {
        case "square_feet":
          setSqFeet(Number(property?.value))
          break
        case "year_built":
          setYrBuilt(property?.value ?? "")
          break
        case "lot_size":
          setLotSize(Number(property?.value))
          break
        case "bedrooms":
          setBedRooms(Number(property.value))
          break
        case "bathrooms":
          setBathRooms(Number(property.value))
          break
        case "monthly_revenue":
          setMonthlyRevenue(Number(property.value))
          break
        case "valuation":
          setValuation(Number(property.value))
          break
        default:
          break
      }
    })

    console.log("Current", fields.fields, fields)
  }, [])

  return (
    <Fragment>
      <FieldLabel className="form-control-sm">ATTRIBUTES</FieldLabel>

      <Item gtc={200}>
        <FieldLabel
          className="form-control-sm"
          style={{ marginLeft: "1.5rem" }}
        >
          Square feet
        </FieldLabel>
        <input
          type="text"
          name="sqFeet"
          className="form-input form-control form-control-sm"
          style={{ width: "40%" }}
          placeholder="Square feet"
          value={sqFeet}
          onChange={handlesqFeetChange}
        />
      </Item>
      <Item gtc={200}>
        <FieldLabel
          className="form-control-sm"
          style={{ marginLeft: "1.5rem" }}
        >
          Year built
        </FieldLabel>
        <input
          type="date"
          name="yrBuilt"
          className="form-input form-control form-control-sm"
          style={{ width: "40%" }}
          placeholder="Year built"
          value={unixToDate(yrBuilt)}
          onChange={handleYrBuiltChange}
        />
      </Item>
      <Item gtc={200}>
        <FieldLabel
          className="form-control-sm"
          style={{ marginLeft: "1.5rem" }}
        >
          Lot size
        </FieldLabel>
        <input
          type="number"
          name="lotSize"
          className="form-input form-control form-control-sm"
          style={{ width: "40%" }}
          placeholder="Lot size"
          value={lotSize}
          onChange={handleLotSizeChange}
        />
      </Item>
      <Item gtc={200}>
        <FieldLabel
          className="form-control-sm"
          style={{ marginLeft: "1.5rem" }}
        >
          Bedrooms
        </FieldLabel>
        <input
          type="text"
          name="bedRooms"
          className="form-input form-control form-control-sm"
          style={{ width: "40%" }}
          placeholder="Bedrooms"
          value={bedRooms}
          onChange={handleBedroomChange}
        />
      </Item>
      <Item gtc={200}>
        <FieldLabel
          className="form-control-sm"
          style={{ marginLeft: "1.5rem" }}
        >
          Bathrooms
        </FieldLabel>
        <input
          type="number"
          name="bathRooms"
          className="form-input form-control form-control-sm"
          style={{ width: "40%" }}
          placeholder="Bathrooms"
          value={bathRooms}
          onChange={handleBathroomChange}
        />
      </Item>
      <Item gtc={200}>
        <FieldLabel
          className="form-control-sm"
          style={{ marginLeft: "1.5rem" }}
        >
          Monthly revenue
        </FieldLabel>
        <input
          type="number"
          name="monthlyRevenue"
          className="form-input form-control form-control-sm"
          style={{ width: "40%" }}
          placeholder="Monthly revenue"
          value={monthlyRevenue}
          onChange={handleRevenueChange}
        />
      </Item>
      <Item gtc={200}>
        <FieldLabel
          className="form-control-sm"
          style={{ marginLeft: "1.5rem" }}
        >
          Valuation
        </FieldLabel>
        <input
          type="text"
          name="valuation"
          className="form-input form-control form-control-sm"
          style={{ width: "40%" }}
          placeholder="Valuation"
          value={valuation}
          onChange={handleValuationChange}
        />
      </Item>
    </Fragment>
  )
}
