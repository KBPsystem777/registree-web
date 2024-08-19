import React from 'react';
import styled from "styled-components";
import ShareIcon from "../../../assets/images/share-icon.svg";
import {Dropdown} from "react-bootstrap";
import MoreIcon from "../../../assets/images/more-icon.svg";
import RefreshIcon from "../../../assets/images/refresh16x16.svg";
import EmailListingIcon from "../../../assets/images/email-listing.svg";

type Props = {
  openShareModal: () => void;
  openSearchModal: () => void;
  handleRefresh: () => void;
}

export default function MoreButtons({openShareModal, openSearchModal, handleRefresh}: Props) {

  return (
    <Container>
      <CommonButton src={ShareIcon} text="Share" marginRight={1} onClick={openShareModal}/>
      <Dropdown id="nftdetail-quick-dd">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          <CommonButton src={MoreIcon} text="More"/>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={openSearchModal}><EmailListing/></Dropdown.Item>
          {/*<Dropdown.Item>View owner dashboard</Dropdown.Item>*/}
          {/*<Dropdown.Divider />*/}
          {/*<Dropdown.Item>Report problem with listing</Dropdown.Item>*/}
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleRefresh}><Refresh /></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const CommonButton = styled('div')<{src?:string,text?:string,marginRight?:number}>`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: ${props => props.marginRight}rem;
  &:before {
    content: '';
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background-image: url(${props => props.src});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    margin-right: 0.2rem;
  }
  &:after {
    content: '${props => props.text}';
    font-size: 0.9rem;
  }
`

const EmailListing = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:before {
    content: '';
    display: inline-block;
    width: 1.4rem;
    height: 1.4rem;
    background-image: url(${EmailListingIcon});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin-right: 0.5rem;
  }
  &:after {
    content: 'Get new listings in email'
  }
`

const Refresh = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  &:before {
    content: '';
    display: inline-block;
    width: 1.4rem;
    height: 1rem;
    background-image: url(${RefreshIcon});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin-right: 0.5rem;
  }
  &:after {
    content: 'Refresh Metadata'
  }
`
