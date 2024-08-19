import React, {useReducer, useState} from 'react';
import styled from "styled-components";
import * as mlStyle from "../../../MLStyles";
import {Breakpoint} from "../../../constants";

export default function AdminSettings() {


  const [settings, updateSettings] = useReducer((state:any, updates:any) => ({...state, ...updates}), {
    percentageFee: '10.5',
    burningRate: '13.2',
    allowUserToTransact: 'true',
    description: 'ManageLife is reinventing how people experience purchasing and living in a home. Through an innovative approach to home buying, coupled with our home services, we make living in a home both affordable and sustainable for all families.',
    mlContact: '(210) 806-7558',
  })

  const handleSettingChange = (e:any) => {
    updateSettings({[e.target.name]: e.target.value});
  }

  return (
    <Container>
      <Header>Admin Settings</Header>
      <Content>
        <Cell>
          <CellContent>
            <Row>
              <Label>Percentage Fee:</Label>
              <Input
                type="number"
                name="percentageFee"
                w={24}
                value={settings.percentageFee}
                onChange={handleSettingChange}
                min={0.00}
                step={0.01}
              />
            </Row>
            <Row>
              <Label>Burning Rate:</Label>
              <Input
                type="number"
                name="burningRate"
                w={24}
                value={settings.burningRate}
                onChange={handleSettingChange}
                min={0.00}
                step={0.01}
              />
            </Row>
            <Row>
              <Label>Allow User to Transact:</Label>
              <Select
                name="allowUserToTransact"
                value={settings.allowUserToTransact}
                w={24}
                onChange={handleSettingChange}
              >
                <option value={'true'}>True</option>
                <option value={'false'}>False</option>
              </Select>
            </Row>
            <Row>
              <Label>Description:</Label>
              <TextArea
                name="description"
                w={24}
                rows={4}
                value={settings.description}
                onChange={handleSettingChange}
              />
            </Row>
            <Row>
              <Label>ManageLife Contact:</Label>
              <Input
                type="text"
                name="mlContact"
                w={24}
                value={settings.mlContact}
                onChange={async (e:any) => {
                  updateSettings({"mlContact": formatPhoneNumber(e)})
                }}
              />
            </Row>
          </CellContent>
        </Cell>
      </Content>

    </Container>
  );
}

const Container = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgb(0 0 0 / 0.1);
  border-left: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 0.3rem;
  overflow: hidden;
  margin-bottom: 1rem;
`
const Header = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: #2a72a7;
  display: flex;
  align-items: center;
  color: #fff;
  font-family: ${(props) => mlStyle.HEADER_FONT};
  font-size: ${(props) => mlStyle.HEADER_FONT_SIZE};
  font-weight: 400;
  padding-left: 1vw;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: 12pt;
  }
`
const Content = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
  padding-bottom: 1vh;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    flex-direction: column;
  }
`
const Cell = styled("div")<{ rightBorder?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  ${(props) =>
  props.rightBorder ? "border-right: 1px solid rgb(0 0 0 / 0.1)" : ""};
`
const CellContent = styled("div")`
  display: flex;
  flex-direction: column;
  padding: 1vw 1vw 0 1vw;
`
const Row = styled("div")<{ marginBottom?: number }>`
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  @media (max-width: ${(props) => Breakpoint.md}) {
    flex-direction: column;
  }
`
const Input = styled("input")<{ w?: number }>`
  width: ${(props) => props.w || 12}vw;
  height: 2.4rem;
  outline: none;
  font-size: ${(props) => mlStyle.FONT_SIZE};
  border-radius: 0.3rem;
  border: 1px solid rgb(0 0 0 / 0.1);
  padding: 1vw;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    width: 50%;
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`
const TextArea = styled('textarea')<{w?:number}>`
  width: ${(props) => props.w || 12}vw;
  outline: none;
  font-size: ${(props) => mlStyle.FONT_SIZE};
  border-radius: 0.3rem;
  border: 1px solid rgb(0 0 0 / 0.1);
  padding: 1vw;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    width: 50%;
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`
const Select = styled('select')<{w?:number}>`
  width: ${(props) => props.w || 12}vw;
  height: 2.4rem;
  outline: none;
  font-size: ${(props) => mlStyle.FONT_SIZE};
  border-radius: 0.3rem;
  border: 1px solid rgb(0 0 0 / 0.1);
  padding: 0 0 0 1vw;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    width: 50%;
  }
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`
const Label = styled.div`
  font-size: ${(props) => mlStyle.FONT_SIZE};
  width: calc(20% / 2);
  @media (max-width: ${(props) => Breakpoint.md}) {
    width: 100%;
  }
`

const Button = styled("div")<{ isloading?: boolean; islocked?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14pt;
  font-weight: 200;
  letter-spacing: 1pt;
  background-color: #2a72a7;
  width: 12rem;
  height: 2.5rem;
  cursor: ${(props) => (props.isloading ? "not-allowed" : "pointer")};
  color: #ffffff;
  border-radius: 0.3rem;
  cursor: ${(props) => (props.islocked ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.islocked ? 0.5 : 1)};
`

const formatPhoneNumber = (e:any) => {
  let formattedNumber;
  const { name, value } = e.target;
  const { length } = value;
  // Filter non numbers
  const regex = () => value.replace(/[^0-9\.]+/g, "");
  // Set area code with parenthesis around it
  const areaCode = () => `(${regex().slice(0, 3)})`;

  // Set formatting for first six digits
  const firstSix = () => `${areaCode()} ${regex().slice(3, 6)}`;

  // Dynamic trail as user types
  const trailer = (start:any) => `${regex().slice(start, regex().length)}`;
  if (length <= 3) {
    // First 3 digits
    formattedNumber = regex();
  } else if (length === 4) {
    // After area code
    formattedNumber = `${areaCode()} ${trailer(3)}`;
  } else if (length === 5) {
    // When deleting digits inside parenthesis
    formattedNumber = `${areaCode().replace(")", "")}`;
  } else if (length > 5 && length < 9) {
    // Before dash
    formattedNumber = `${areaCode()} ${trailer(3)}`;
  } else if (length >= 10) {
    // After dash
    formattedNumber = `${firstSix()}-${trailer(6)}`;
  } else {
    formattedNumber = value;
  }

  return formattedNumber;
  // const formattedObject = {
  //   target: { name: name, value: formattedNumber }
  // };
  // handleChange(formattedObject);
};
