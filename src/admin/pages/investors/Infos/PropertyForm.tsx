 // @ts-nocheck
import React, {useEffect, useReducer, useState} from 'react';
import styled from "styled-components";
import {Card} from "react-bootstrap";
import {updateProperty} from "../../../api/Properties";

export default function PropertyForm({item, propertyId}: any) {

    const [attrValues, updateAttrValues] = useReducer((state: any, updates: any) => ({...state, ...updates}), {
        propertyId: '',
        name: '',
        address1: '',
        address2: '',
        county: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
    })

    const generatePropNumber = id => {
        var propertyBaseNumber = 'PRP00000000000'
        const idLength = String(id).length
        const index = -idLength
        var propertyNo = propertyBaseNumber.match(/.{1,3}/g).join('-')
        propertyNo = propertyNo.split('-')
    
        if (propertyNo.length > 0 && propertyNo[4].length == idLength) {
            propertyNo = propertyNo.slice(0, -1) 
            propertyNo = propertyNo.join('-') + String(id)
        } else if (propertyNo.length > 0 && idLength > propertyNo[4].length) {
            var last5 = propertyNo[3] + propertyNo[4]
            propertyNo = propertyNo.splice(0, 2)
            propertyNo = propertyNo.join('-') + '-' + last5.slice(0, index) + String(id)
        }

        return propertyNo
    }

    useEffect(() => {
        updateAttrValues({
            propertyId: propertyId,
            name: item.name || '',
            address1: item?.address?.address1 || '',
            address2: item?.address?.address2 || '',
            county: item?.address?.county || '',
            city: item?.address?.city || '',
            state: item?.address?.state || '',
            country: item?.address?.country || '',
            zipCode: item?.address?.zipCode || ''
        })
    }, [item])

    return (
        <Info>
            <Singular>
                <Item>
                    <FieldLabel className="form-control-sm">PROPERTY ID</FieldLabel>
                    <ReadOnlyText>{generatePropNumber(attrValues.propertyId)}</ReadOnlyText>
                </Item>
                <Item>
                    <FieldLabel className="form-control-sm">NAME</FieldLabel>
                    <ReadOnlyText>{attrValues.name}</ReadOnlyText>
                </Item>
                <Item>
                    <FieldLabel className="form-control-sm">ADDRESS 1</FieldLabel>
                    <ReadOnlyText>{attrValues.address1}</ReadOnlyText>
                </Item>
                <Item>
                    <FieldLabel className="form-control-sm">ADDRESS 2</FieldLabel>
                    <ReadOnlyText>{attrValues.address2}</ReadOnlyText>
                </Item>
                <Item>
                    <FieldLabel className="form-control-sm">COUNTRY</FieldLabel>
                    <ReadOnlyText>{attrValues.country}</ReadOnlyText>
                </Item>
                <Item>
                    <FieldLabel className="form-control-sm">CITY</FieldLabel>
                    <ReadOnlyText>{attrValues.city}</ReadOnlyText>
                </Item>
                <Item>
                    <FieldLabel className="form-control-sm">STATE</FieldLabel>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <ReadOnlyText>{attrValues.state}</ReadOnlyText>&nbsp;
                        <FieldLabel className="form-control-sm">ZIP</FieldLabel>
                        <ReadOnlyText>{attrValues.zipCode}</ReadOnlyText>
                    </div>
                </Item>
            </Singular>
        </Info>
    );
}

const Info = styled.div`
    background: white;
    display: grid;
    grid-template-columns: 50% 50%;
    min-width: 800px;
`
const Singular = styled.div`
    background: white;
    display: block;
    min-width: 800px;
    padding: 10px 50px;
`
const Item = styled.div`
    display: grid;
    grid-template-columns: 128px auto;
    margin: 4px auto;
    column-gap: 20px;
`
const FieldLabel = styled.div`
    display: flex;
    align-self: flex-start;
    font-weight: 300;
    letter-spacing: 0.02rem;
    color: rgb(0 0 0 / 0.5);
`
const ReadOnlyText = styled.div`
    width: 100%;
    height: 2rem;
    border-radius: 0.3rem;
    border: none;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    padding-left: 0.4rem;
`