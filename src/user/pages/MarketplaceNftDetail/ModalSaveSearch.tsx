import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Base from "../TransactionModalBase";
import $ from "jquery";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
}

export default function ModalSaveSearch ({isOpen, closeModal}: Props) {

  const [email, setEmail] = useState('')
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    if (isOpen) {
      $("#modal-image-savesearch-container").fadeIn("fast")
    } else {
      $("#modal-image-savesearch-container").fadeOut("fast")
    }

  }, [isOpen])

  function handleOnChange(e:any) {
    setEmail(e.target.value);
    if (validEmail(e.target.value)) {
      setLocked(false);
    } else {
      setLocked(true);
    }
  }

  return (
    <Container id="modal-image-savesearch-container">
      <Base w={28} center={true} title="Save Search" close={closeModal}>
        <Content>

          <SubHeader>
            <Text font="Poppins-SemiBold">Amost done...</Text>
            <Text font="Poppins-Regular" size={0.9}>You can modify your email later under Managelife</Text>
          </SubHeader>

          <FieldCol>
            <Text font="Poppins-Regular">Email</Text>
            <Input
              type="text"
              name="email"
              value={email}
              onChange={handleOnChange}
            />
          </FieldCol>
          <SubmitButton locked={locked}/>
          <Center>
            <Text font="Poppins-Regular" size={0.8}>By submitting, I accept Managelife's <a href="/terms">terms of use</a></Text>
          </Center>
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
const Text = styled('span')<{font?:string,bold?:boolean,color?:string,size?:number}>`
    font-family: ${props => props.font || 'Poppins-Light'};
    color: ${props => props.color};
    font-size: ${props => props.size}rem;
`
const FieldCol = styled('div')<{w?:number,marginTop?:number,marginBottom?:number}>`
    display: flex;
    flex-direction: column;
    width: ${props => props.w ? `${props.w}%` : 'auto'};
    margin-top: ${props => props.marginTop}rem;
    margin-bottom: ${props => props.marginBottom}rem;
    row-gap: 0.3rem;
`
const Input = styled.input`
    width: 100%;
    height: 2.5rem;
    border-radius: 0.5rem;
    outline: none;
    border: 0.1rem solid lightgray;
    padding-left: 1rem;
`
const SubmitButton = styled('div')<{locked?:boolean}>`
  margin-top: 2rem;
  padding: 0.7rem 1rem;
  background-color: #2C72A7;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: ${props => props.locked ? 'none' : 'auto'};
  opacity: ${props => props.locked ? 0.5 : 1};
  &:after {
    content: 'Submit';
    color: #ffffff;
  }
  &:hover {
    background-color: #25608C;
  }
`
const SubHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`

const Center = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 0.7rem;  
`

export const validEmail = (email:string) => {
  const reg = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
  return !!email && !!email.match(reg)
}
