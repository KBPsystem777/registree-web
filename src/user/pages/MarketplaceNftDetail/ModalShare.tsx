import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Base from "../TransactionModalBase";
import $ from "jquery";
import EmailIcon from "../../../assets/images/mail-icon-gray.svg";
import FacebookIcon from "../../../assets/images/facebook.svg";
import TwitterIcon from "../../../assets/images/twitter.svg";
import LinkedInIcon from "../../../assets/images/linkedin.svg";
import {truncateText} from "../../../utils/helpers";

let clipboardTimeout:any;

type Props = {
  isOpen: boolean;
  closeModal: () => void;
}

export default function ModalShare ({isOpen, closeModal}: Props) {

  const [locked, setLocked] = useState(true);
  const [shareOption, setShareOption] = useState('')
  const [isCopiedToClipboard, setCopiedToClipboard] = useState(false);

  useEffect(() => {
    if (isOpen) {
      $("#modal-image-savesearch-container").fadeIn("fast")
    } else {
      $("#modal-image-savesearch-container").fadeOut("fast")
    }

  }, [isOpen])


  function handleShareOptionChange(e:any) {
    setShareOption(e.target.value);
    console.log(e.target.value)
  }

  function handleCopyToClipboard () {
    if (clipboardTimeout) {
      clearTimeout(clipboardTimeout);
    }

    navigator.clipboard.writeText(window.location.href);
    setCopiedToClipboard(true);
    clipboardTimeout = setTimeout(() => {
      setCopiedToClipboard(false);
    }, 4000)
  }

  return (
    <Container id="modal-image-savesearch-container">
      <Base w={28} center={true} title="Share this home" close={closeModal}>
        <Content>
          <Grid>
            <RadioButtonItem>
              {/*<RadioInput type="radio" name="radio" value="facebook" onChange={handleShareOptionChange}/>*/}
              <ShareButton src={FacebookIcon} text="Facebook"/>
            </RadioButtonItem>
            <RadioButtonItem>
              {/*<RadioInput type="radio" name="radio" value="twitter" onChange={handleShareOptionChange}/>*/}
              <ShareButton src={TwitterIcon} text="Twitter"/>
            </RadioButtonItem>
            <RadioButtonItem>
              {/*<RadioInput type="radio" name="radio" value="twitter" onChange={handleShareOptionChange}/>*/}
              <ShareButton src={LinkedInIcon} text="LinkeIn"/>
            </RadioButtonItem>
            <RadioButtonItem active={true}>
              <RadioInput type="radio" name="radio" value="email" onChange={handleShareOptionChange}/>
              <ShareButton src={EmailIcon} text="Email"/>
            </RadioButtonItem>
          </Grid>

          <Clipboard>
            <LinkText>{truncateText(window.location.href, 35)}</LinkText>
            <CopyLinkButton onClick={handleCopyToClipboard}/>
          </Clipboard>
          {
            isCopiedToClipboard && (
              <LinkCopiedMessage>Link copied to clipboard</LinkCopiedMessage>
            )
          }

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
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0.8rem;  
`

const ShareButton = styled('div')<{src?:string,text?:string}>`
  width: 100%;
  height: 2.4rem;
  background-color: #ffffff;
  border: 0.08rem solid lightgray;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  &:before {
    content: '';
    width: 10%;
    height: 100%;
    display: inline-block;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: right center;
  }
  &:after {
    content: '${props => props.text}';
    font-size: 0.9rem;
  }
`

const RadioButtonItem = styled('label')<{active?:boolean}>`
  display: block;
  height: 2rem;
  cursor: ${props => props.active ? 'pointer' : 'not-allowed'};
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`
const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  &:checked ~ ${props => ShareButton} {
    background-color: lightgray;
    &:after {
      display: block;    
    }
  }  
`

const Clipboard = styled.div`
  width: 100%;
  height: 2.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: lightgray;
  padding: 0.5rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
`
const LinkText = styled.div`
  width: 100%;
  font-size: 0.9rem;
  overflow: hidden;
`
const CopyLinkButton = styled.div`
  display: flex;
  background-color: #ffffff;
  border: 0.08rem solid gray;
  padding: 0.1rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  &:after{
    content: 'Copy Link';
    font-size: 0.9rem;
    white-space: nowrap;
  }
`
const LinkCopiedMessage = styled.span`
  position: absolute;
  font-size: 0.9rem;
  right: 5%;
  bottom: 5%;
  color: gray;
`
