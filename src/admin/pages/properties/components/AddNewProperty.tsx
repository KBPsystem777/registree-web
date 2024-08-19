import React, { useState } from "react"
import { useDispatch } from "react-redux"

import { setTriggerRefresh } from "../../../../redux/web3Reducer"

import { createProperty } from "../../../../api/Properties"
import { useModalContext } from "../../../../hooks/ModalContext"
import {
  ScrollableContainer,
  Col,
  Text,
  Input,
  PropertyTypeDropDown,
  Button,
} from "./AddNewProperty.style"

import Base from "../../../../user/pages/TransactionModalBase"

interface NewPropertFormData {
  propertyName: string
  address1: string
  address2?: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PropertyType {
  type: string
}

const AddNewPropertyForm = ({ closeModal }: any) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  // @ts-ignore
  const { setErrorMessage, setSuccessMessage } = useModalContext()

  const [formData, setFormData] = useState<NewPropertFormData>({
    propertyName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  const [propertyType, setPropertyType] = useState<PropertyType>({
    type: "",
  })

  const validateFormData = () => {
    // Check if any of the required fields are empty
    if (
      formData.propertyName.trim() === "" ||
      formData.address1.trim() === "" ||
      formData.city.trim() === "" ||
      formData.state.trim() === "" ||
      formData.zipCode.trim() === "" ||
      formData.country.trim() === "" ||
      propertyType.type.trim() === ""
    ) {
      return false
    }

    // Additional validation checks can be added here

    return true
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate the form data
    if (!validateFormData()) {
      setErrorMessage("Please fill in all the required fields.")
      return
    }

    setLoading(true)
    try {
      await createProperty({
        name: formData?.propertyName ?? "",
        country: formData?.country ?? "",
        city: formData?.city ?? "",
        address_1: formData?.address1 ?? "",
        address_2: formData?.address2 ?? "",
        state: formData?.state ?? "",
        enabled: true,
        zip_code: formData?.zipCode ?? "",
        property_type: 1,
        is_subscriber: false,
      })
      setSuccessMessage(`Success! ${formData?.propertyName} has been created`)

      // @note After submitting the POST request above, we need to trigger page refresh:
      dispatch(setTriggerRefresh(true))

      closeModal()
    } catch (error) {
      setErrorMessage(`Error in submitting: ${error}`)
    }
    closeModal()
  }

  const handleTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    key: keyof PropertyType
  ) => {
    setPropertyType({ ...propertyType, [key]: event.target.value })
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: keyof NewPropertFormData
  ) => {
    setFormData({ ...formData, [key]: event.target.value })
  }

  return (
    <Base
      title="Add new property"
      inProcess={loading}
      close={() => (loading ? null : closeModal())}
    >
      <ScrollableContainer>
        <Col>
          <Col marginTop={2}>
            <Text>Property name</Text>
          </Col>
          <Col marginTop={0.5}>
            <Input
              readOnly={loading}
              type="text"
              onChange={(e) => handleChange(e, "propertyName")}
              value={formData.propertyName}
            />
          </Col>
        </Col>
        <Col>
          <Col marginTop={2}>
            <PropertyTypeDropDown
              onChange={(e) => handleTypeChange(e, "type")}
              value={propertyType.type}
            >
              <option value="" disabled selected>
                Select a property type
              </option>
              <option value="4 Bedrooms / 3 Bathrooms">
                4 Bedrooms / 3 Bathrooms
              </option>
              <option value="3 Bedrooms / 2 Bathrooms">
                3 Bedrooms / 2 Bathrooms
              </option>
            </PropertyTypeDropDown>
          </Col>
        </Col>
        <Col>
          <Col marginTop={1}>
            <Text>Address 1</Text>
          </Col>
          <Col marginTop={0.5}>
            <Input
              readOnly={loading}
              type="text"
              required
              onChange={(e) => handleChange(e, "address1")}
              value={formData.address1}
            />
          </Col>
          <Col marginTop={1}>
            <Text>Address 2</Text>
          </Col>
          <Col marginTop={0.5}>
            <Input
              readOnly={loading}
              type="text"
              value={formData.address2}
              onChange={(e) => {
                handleChange(e, "address2")
              }}
            />
          </Col>
          <Col marginTop={1}>
            <Text>City</Text>
          </Col>
          <Col marginTop={0.5}>
            <Input
              readOnly={loading}
              type="text"
              required
              value={formData.city}
              onChange={(e) => handleChange(e, "city")}
            />
          </Col>
          <Col marginTop={1}>
            <Text>State</Text>
          </Col>
          <Col marginTop={0.5}>
            <Input
              readOnly={loading}
              type="text"
              required
              value={formData.state}
              onChange={(e) => handleChange(e, "state")}
            />
          </Col>
          <Col marginTop={1}>
            <Text>Zip code</Text>
          </Col>
          <Col marginTop={0.5}>
            <Input
              readOnly={loading}
              type="text"
              required
              value={formData.zipCode}
              onChange={(e) => handleChange(e, "zipCode")}
            />
          </Col>
          <Col marginTop={1}>
            <Text>Country</Text>
          </Col>
          <Col marginTop={0.5}>
            <Input
              readOnly={loading}
              type="text"
              required
              value={formData.country}
              onChange={(e) => handleChange(e, "country")}
            />
          </Col>
        </Col>
        <Col marginTop={2}>
          <Button
            disabled={loading}
            onClick={handleSubmit}
            color="#ffffff"
            bg="#2A72A7"
          >
            Submit
          </Button>
        </Col>
      </ScrollableContainer>
    </Base>
  )
}

export default AddNewPropertyForm
