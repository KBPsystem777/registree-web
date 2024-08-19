// @note Refactor this entire component and checkout if we still need this

import React, { forwardRef, useEffect, useState } from "react"

import $ from "jquery"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import dateFormat from "dateformat"
import styled from "styled-components"

import Base from "../TransactionModalBase"

type IModalImageRequestTourProps = {
  isOpen: boolean
  closeModal: () => void
}

const TIMES = [
  { key: "0900", value: "9:00 am" },
  { key: "0930", value: "9:30 am" },
  { key: "1000", value: "10:00 am" },
  { key: "1030", value: "10:30 am" },
  { key: "1100", value: "11:00 am" },
  { key: "1130", value: "11:30 am" },
  { key: "1200", value: "12:00 pm" },
  { key: "1230", value: "12:30 pm" },
  { key: "1300", value: "1:00 pm" },
  { key: "1330", value: "1:30 pm" },
  { key: "1400", value: "2:00 pm" },
  { key: "1430", value: "2:30 pm" },
  { key: "1500", value: "3:00 pm" },
  { key: "1530", value: "3:30 pm" },
  { key: "1600", value: "4:00 pm" },
  { key: "1630", value: "4:30 pm" },
  { key: "1700", value: "5:00 pm" },
  { key: "1730", value: "5:30 pm" },
  { key: "1800", value: "6:00 pm" },
  { key: "1830", value: "6:30 pm" },
  { key: "1900", value: "7:00 pm" },
]

export default function ModalImageRequestTour({
  isOpen,
  closeModal,
}: IModalImageRequestTourProps) {
  const [startDate, setStartDate] = useState(new Date())
  const PreferredDate = forwardRef(({ value, onClick }: any, _ref) => (
    <PreferredDateWrap onClick={onClick}>
      <Text font={"Poppins-SemiBold"} size={1.5}>
        {dateFormat(value, "ddd").toUpperCase()},&nbsp;
      </Text>
      <Text font={"Poppins-SemiBold"} size={1.5}>
        {dateFormat(value, "mmm")}&nbsp;
      </Text>
      <Text font={"Poppins-SemiBold"} size={1.5}>
        {dateFormat(value, "dd")}&nbsp;
      </Text>
      <Text font={"Poppins-SemiBold"} size={1.5}>
        {dateFormat(value, "yyyy")}
      </Text>
    </PreferredDateWrap>
  ))

  useEffect(() => {
    if (isOpen) {
      $("#modal-image-requesttour-container").fadeIn("fast")
    } else {
      $("#modal-image-requesttour-container").fadeOut("fast")
    }
  }, [isOpen])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.checked)
  }

  const allowedDates = [
    new Date("2023-01-30"),
    new Date("2023-01-31"),
    new Date("2023-02-01"),
    new Date("2023-02-02"),
    new Date("2023-02-03"),
  ]
  return (
    <Container id="modal-image-requesttour-container">
      <Base
        w={26}
        center={true}
        title="Tour with a Buyer's Agent"
        close={closeModal}
      >
        <Content>
          <FieldCol>
            <RadioButtonWrap>
              <RadioButtonItem>
                <RadioInput type="radio" name="radio" onChange={handleChange} />
                <Checkmark>In-person</Checkmark>
              </RadioButtonItem>

              <RadioButtonItem>
                <RadioInput type="radio" name="radio" onChange={handleChange} />
                <Checkmark>Video chat</Checkmark>
              </RadioButtonItem>
            </RadioButtonWrap>
          </FieldCol>

          <FieldCol marginTop={2}>
            <Text font="Poppins-Regular">Select a preferred date and time</Text>
            <DatePicker
              dateFormat="yyyy-MM-dd"
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              includeDates={allowedDates}
              customInput={<PreferredDate />}
            />
            <DDTimes>
              {TIMES.map((time: any) => (
                <option key={time.key} value={time.key}>
                  {time.value}
                </option>
              ))}
            </DDTimes>
            <SubmitButton />
          </FieldCol>
        </Content>
      </Base>
    </Container>
  )
}

const Container = styled.div`
  display: none;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  z-index: 210;
`
const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  margin-bottom: 2rem;
`
const FieldCol = styled("div")<{
  w?: number
  marginTop?: number
  marginBottom?: number
}>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.w ? `${props.w}%` : "auto")};
  margin-top: ${(props) => props.marginTop}rem;
  margin-bottom: ${(props) => props.marginBottom}rem;
`

const RadioButtonWrap = styled.div`
  width: 100%;
  height: 2.5rem;
  display: flex;
  justify-content: space-between;
  border-radius: 0.5rem;
  overflow: hidden;
`
const RadioButtonItem = styled.label`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`
const Checkmark = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    content: "";
    position: absolute;
    display: none;
    background: white;
  }
`
const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  &:checked ~ ${(props) => Checkmark} {
    background-color: lightgray;
    &:after {
      display: block;
    }
  }
`

const Text = styled("span")<{
  font?: string
  bold?: boolean
  color?: string
  size?: number
}>`
  font-family: ${(props) => props.font || "Poppins-Light"};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size}rem;
`

const PreferredDateWrap = styled.div`
  with: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 4rem;
  border: 0.1rem solid lightgray;
  border-radius: 0.5rem;
  margin-top: 1rem;
`
const DDTimes = styled.select`
  width: 100%;
  height: 2.5rem;
  border-radius: 0.5rem;
  outline: none;
  border: 0.1rem solid lightgray;
  padding-left: 1rem;
  margin-top: 1rem;
`

const SubmitButton = styled("div")<{ locked?: boolean }>`
  margin-top: 2rem;
  padding: 0.7rem 1rem;
  background-color: #2c72a7;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: ${(props) => (props.locked ? "none" : "auto")};
  opacity: ${(props) => (props.locked ? 0.5 : 1)};
  &:after {
    content: "Request this time";
    color: #ffffff;
  }
  &:hover {
    background-color: #25608c;
  }
`
