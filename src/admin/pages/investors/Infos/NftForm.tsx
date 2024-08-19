import { useEffect, useRef, useState, Fragment } from "react"
import { useWeb3React } from "@web3-react/core"
import { useSelector } from "react-redux"
import { State } from "country-state-city"

import { useAlertContext } from "../../../../hooks/AlertContext"
import {
  updatePropertyNft,
  uploadPropertyImage,
} from "../../../../api/Properties"
import { errorCatcher, format, isValidUrl } from "../../../../utils/helpers"
import { useModalContext } from "../../../../hooks/ModalContext"
import { updateLifeTokenIssuanceRate } from "../../../../blockchain/actions/MLNftAction"

import {
  Info,
  Singular,
  Item,
  FieldLabel,
  ButtonGroup,
  ImageFileButton,
  ImageButton,
  Row,
  UpdateTokenRateButton,
} from "./styles/NftForm.styles"

import NftMint from "./NftMint"

function validateNumber(n: any) {
  const validNumber = new RegExp(/^\d*\.?\d*$/)
  if (validNumber.test(n)) {
    return true
  }
  return false
}

export default function NftForm({ item, propertyId, reload }: any) {
  // @ts-ignore
  const { web3State } = useSelector((state) => state)
  const alertContext: any = useAlertContext()
  const [isUpdatingNftValues, setUpdatingNftValues] = useState(false)
  const [isUpdating, setUpdating] = useState(false)
  const [nftImage, setNftImage] = useState<any>()
  const [show, setShow] = useState(false)
  const refNftFields = useRef<(HTMLInputElement | null)[]>([])

  const currentUrl = window.location.href
  const adminUrl = new URL(currentUrl)
  const pathName = adminUrl.pathname
  const splitString = pathName.split("/")
  const tokenID = splitString[3]
  const { account } = useWeb3React()
  // @ts-ignore
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    useModalContext()
  const [nftValues, updateNftValues] = useState({
    name: {
      type: "text",
      label: "NAME",
      maxlength: 255,
      value: "",
      required: true,
    },
    description: {
      type: "text",
      label: "DESCRIPTION",
      maxlength: 255,
      value: "",
      required: true,
    },
    // externalLink: {type: "text", label: "EXTERNAL LINK", maxlength: 255, value: '', isUrl:true},
    image: {
      type: "file",
      label: "IMAGE",
      maxlength: 255,
      value: undefined,
      accept: ".jpg,.jpeg,.png,.gif,.avif,.jfif",
    },
    tokenIssuanceRate: {
      type: "number",
      label: "TOKEN RATE",
      maxlength: 255,
      value: "",
      required: false,
    },
    youtubeUrl: {
      type: "text",
      label: "YOUTUBE URL",
      maxlength: 255,
      value: "",
      isUrl: true,
    },
    animationUrl: {
      type: "text",
      label: "ANIMATION_URL",
      maxlength: 255,
      value: "",
      isUrl: true,
    },
    ownerName: {
      type: "text",
      label: "OWNER NAME",
      maxlength: 255,
      value: "",
      required: true,
    },
    doingBusinessAs: {
      type: "text",
      label: "DOING BUSINESS AS",
      maxlength: 15,
      value: "",
      required: true,
    },
    propertyId: {
      type: "text",
      label: "PROPERTY ID",
      maxlength: 15,
      value: tokenID,
      readOnly: true,
      required: true,
    },
    geoId: {
      type: "text",
      label: "GEO ID",
      maxlength: 255,
      value: "",
      required: true,
    },
    legalDescription: {
      type: "text",
      label: "LEGAL DESCRIPTION",
      maxlength: 255,
      value: "",
      required: true,
    },
    stateCode: {
      type: "text",
      label: "STATE CODE",
      maxlength: 255,
      value: "",
      required: true,
    },
    taxJurisdictions: {
      type: "text",
      label: "TAX JURISDICTIONS",
      maxlength: 255,
      value: "",
      required: true,
    },
    appraisedValue: {
      type: "text",
      label: "APPRAISED VALUE",
      maxlength: 100,
      value: "",
      maskingValue: 0,
      masking: true,
    },
    neighborhood: {
      type: "text",
      label: "NEIGHBORHOOD",
      maxlength: 255,
      value: "",
    },
    abstractCode: {
      type: "text",
      label: "ABSTRACT CODE",
      maxlength: 15,
      value: "",
      required: true,
    },
    ccrDeclaration: {
      type: "text",
      label: "CCR DECLARATION",
      maxlength: 50,
      value: "",
      required: true,
    },
    operatingAgreement: {
      type: "text",
      label: "OPERATING AGRMT.",
      placeholder: "OPERATING AGREEMENT",
      maxlength: 50,
      value: "",
      required: true,
    },
    membershipContract: {
      type: "text",
      label: "MEM. CONTRACT",
      placeholder: "MEMBERSHIP CONTRACT",
      maxlength: 50,
      value: "",
      required: true,
    },
    daoContract: {
      type: "text",
      label: "DAO CONTRACT",
      maxlength: 50,
      value: "",
      required: true,
    },
    heating: { type: "text", label: "HEATING", maxlength: 50, value: "" },
    cooling: { type: "text", label: "COOLING", maxlength: 50, value: "" },
    _id: {
      type: "text",
      label: "ID",
      maxlength: 100,
      value: "631e5fbc07b5e6f888430f7b",
      hidden: true,
    },
    address: {
      hidden: true,
      address1: {
        type: "text",
        label: "ADDRESS 1",
        maxlength: 255,
        value: "",
        hidden: true,
      },
      address2: {
        type: "text",
        label: "ADDRESS 2",
        maxlength: 255,
        value: "",
        hidden: true,
      },
      city: {
        type: "text",
        label: "CITY",
        maxlength: 100,
        value: "",
        hidden: true,
      },
      state: {
        type: "text",
        label: "STATE",
        maxlength: 100,
        value: "",
        hidden: true,
      },
      country: {
        type: "text",
        label: "COUNTRY",
        maxlength: 100,
        value: "",
        hidden: true,
      },
      zipCode: {
        type: "text",
        label: "ZIP CODE",
        maxlength: 50,
        value: "",
        hidden: true,
      },
      _id: {
        type: "text",
        label: "ID",
        maxlength: 100,
        value: "",
        hidden: true,
      },
    },
  })
  const [attrValues, updateAttrValues] = useState({
    square_feet: { type: "number", label: "Square Feet", value: 0 },
    year_built: { type: "date", label: "Year Built", value: "" },
    lot_size: { type: "number", label: "Lot Size", value: 0 },
    bedrooms: {
      type: "number",
      label: "Bedrooms",
      value: 0,
    },
    bathrooms: {
      type: "number",
      label: "Bathrooms",
      value: 0,
    },
    monthly_revenue: {
      type: "number",
      label: "Monthly revenue",
      value: 0,
    },
    property_valuation: {
      type: "number",
      label: "Property Valuation",
      value: 0,
    },
  })

  const [sqFeet, setSqFeet] = useState<number>(0)
  const [yrBuilt, setYrBuilt] = useState<number | string>(0)
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
    item?.attributes.forEach((property: any) => {
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
        case "bed_bath_dimensions":
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
  }, [])

  function handleNftChange(e: any) {
    let newValue: any
    if (e.target.name === "appraisedValue") {
      newValue = e.target.value.replaceAll(",", "")
      if (!validateNumber(newValue)) {
        return
      }
    } else {
      newValue = e.target.value
    }

    updateNftValues((current: any) => {
      return {
        ...current,
        [e.target.name]: {
          ...current[e.target.name],
          value: e.target.name === "image" ? e.target.files[0] : newValue,
        },
      }
    })
  }

  function handleAttrChange(e: any) {
    setSqFeet(e.target.value)
  }

  async function validateNftFields() {
    let reqCtr = 0
    await Promise.all([
      refNftFields.current.map(async (f: any, i: number) => {
        if (f) {
          const isrequired = await f?.getAttribute("isRequired")
          const isurl = await f?.getAttribute("isurl")
          if (!f?.value && isrequired) {
            f.style.border = "1px solid #ff0000"
            f.focus()
            reqCtr++
          } else if (f?.value && isurl) {
            if (isValidUrl(f?.value)) {
              f.style.border = "1px solid #ccc"
            } else {
              f.style.border = "1px solid #ff0000"
              f.focus()
              reqCtr++
            }
          } else {
            f.style.border = "1px solid #ccc"
          }
        }
      }),
    ])

    await Promise.all(
      Object.keys(attrValues).map((k, i) => {
        if (k === "year_built") {
          const el = document.getElementById(`properties-attribute-${k}`)
          if (el) {
            // @ts-ignore
            if (
              isNaN(
                parseInt(
                  (new Date(attrValues[k].value).getTime() / 1000).toFixed(0)
                )
              )
            ) {
              el.style.border = "1px solid #ff0000"
              el.focus()
              reqCtr++
            } else {
              el.style.border = "1px solid #ccc"
            }
          }
        }
      })
    )

    if (reqCtr > 0) {
      return false
    } else {
      return true
    }
  }

  async function handleUpdateNftClick() {
    if (!(await validateNftFields())) {
      return
    }

    const nftAttrsToUpdate = []
    for (let key in attrValues) {
      // @ts-ignore
      const obj = attrValues[key]
      if (obj.value) {
        let d
        if (key === "year_built") {
          d = parseInt((new Date(obj.value).getTime() / 1000).toFixed(0))
          if (isNaN(d)) {
            d = null
          }
        }
        nftAttrsToUpdate.push({
          trait_type: key,
          value: key === "year_built" ? d : Number(obj.value),
          display_type: obj.type,
        })
      }
    }

    setLoadingMessage("updating property nft... transaction in process...")
    try {
      const attrsToUpdate = {
        name: nftValues["name"].value,
        description: nftValues["description"].value,
        // externalLink: nftValues['externalLink'].value,
        image: "",
        tokenIssuanceRate: nftValues["tokenIssuanceRate"].value,
        youtubeUrl: nftValues["youtubeUrl"].value,
        animationUrl: nftValues["animationUrl"].value,
        ownerName: nftValues["ownerName"].value,
        doingBusinessAs: nftValues["doingBusinessAs"].value,
        propertyId: nftValues["propertyId"].value,
        geoId: nftValues["geoId"].value,
        legalDescription: nftValues["legalDescription"].value,
        stateCode: nftValues["stateCode"].value,
        taxJurisdictions: nftValues["taxJurisdictions"].value,
        appraisedValue: nftValues["appraisedValue"].value,
        neighborhood: nftValues["neighborhood"].value,
        abstractCode: nftValues["abstractCode"].value,
        ccrDeclaration: nftValues["ccrDeclaration"].value,
        operatingAgreement: nftValues["operatingAgreement"].value,
        membershipContract: nftValues["membershipContract"].value,
        daoContract: nftValues["daoContract"].value,
        heating: "",
        cooling: "",
        _id: nftValues["_id"].value,
        attributes: [
          {
            display_type: "date",
            trait_type: "year_built",
            value: yrBuilt,
          },
          {
            display_type: "number",
            trait_type: "square_feet",
            value: sqFeet,
          },
          {
            display_type: "number",
            trait_type: "lot_size",
            value: lotSize,
          },
          {
            display_type: "number",
            trait_type: "bed_bath_dimensions",
            value: bedRooms,
          },
          {
            display_type: "number",
            trait_type: "bathrooms",
            value: bathRooms,
          },
          {
            display_type: "number",
            trait_type: "monthly_revenue",
            value: monthlyRevenue,
          },
          {
            display_type: "number",
            trait_type: "valuation",
            value: valuation,
          },
        ],
        standoutFeatures: [],
        address: {
          address1: nftValues.address["address1"].value,
          address2: nftValues.address["address2"].value,
          city: nftValues.address["city"].value,
          state: nftValues.address["state"].value,
          country: nftValues.address["country"].value,
          zipCode: nftValues.address["zipCode"].value,
          _id: nftValues.address["_id"].value,
        },
      }

      await updatePropertyNft(
        propertyId || nftValues["propertyId"].value,
        attrsToUpdate
      )
      setSuccessMessage("Property NFT has been updated!")
      if (reload) {
        reload()
      }
    } catch (e) {
      console.log(e)
      // setUpdatingNftValues(false)
      // alertContext({ type: "error", message: "Property NFT update failed!" })
      setErrorMessage("Property NFT update failed!")
    } finally {
      // setUpdatingNftValues(false)
    }
  }

  async function handlePhotoChange(e: any) {
    try {
      setLoadingMessage("uploading image... transaction in process...")
      if (e.target.files[0] && (item.propertyId || propertyId)) {
        const extension = e.target.files[0].name.substring(
          e.target.files[0].name.lastIndexOf(".") + 1,
          e.target.files[0].name.length
        )
        if (extension) {
          const formData = new FormData()
          formData.append("nftArtImage", e.target.files[0])

          const respond = await uploadPropertyImage(
            formData,
            item.propertyId || propertyId
          )
          setSuccessMessage("Image has been uploaded!")
        }
      }
    } catch (e: any) {
      // @ts-ignore
      if (
        e?.response?.data?.message &&
        e?.response?.data?.message.includes("key does not exist")
      ) {
        setErrorMessage(
          'Image upload failed. Please update the record by clicking "UPDATE NFT" button, then try to upload image again.'
        )
      }
    }
  }

  async function handleUpdateTokenRate() {
    if (
      !nftValues?.tokenIssuanceRate?.value ||
      (nftValues?.tokenIssuanceRate?.value &&
        Number(nftValues?.tokenIssuanceRate?.value) < 0.00001)
    ) {
      setErrorMessage("Token issuance rate is required")
      return
    }

    try {
      if (account) {
        setLoadingMessage(
          "updating token issuance rate... transaction in process..."
        )
        const res = await updateLifeTokenIssuanceRate(
          item.propertyId,
          nftValues["tokenIssuanceRate"].value
        )
        console.log(res)
        await handleUpdateNftClick()
      }
    } catch (e) {
      console.log(e)
      if (errorCatcher(e).toLowerCase().includes("invalid token id")) {
        setErrorMessage(
          "Token issuance rate update failed. Please mint NFTi first."
        )
      } else {
        setErrorMessage(errorCatcher(e))
      }
    }
  }

  useEffect(() => {
    for (let key in item) {
      if (key === "address") {
        for (let addrkey in item.address) {
          updateNftValues((current: any) => {
            return {
              ...current,
              address: {
                ...current.address,
                [addrkey]: {
                  ...current.address[addrkey],
                  value:
                    item.address[addrkey] === null ? "" : item.address[addrkey],
                },
              },
            }
          })
        }
      } else if (key === "attributes" || key === "standoutFeatures") {
        const attrsFromDB = item[key]
        for (let i = 0; i < attrsFromDB.length; i++) {
          const attr = attrsFromDB[i]

          if (attr.trait_type === "year_built") {
            if (attr.display_type !== "date") {
              attr.display_type = "date"
            } else {
              const formattedDate = attr?.value
              // @ts-ignore
              attrValues[attr.trait_type].value = formattedDate
            }
          } else {
            if (attr.display_type !== "number") {
              attr.display_type = "number"
            }
          }
        }
      } else {
        // @ts-ignore
        const keyExists = nftValues[key]
        if (keyExists) {
          if (key === "propertyId") {
            updateNftValues((current: any) => {
              return {
                ...current,
                [key]: {
                  ...current[key],
                  value: propertyId,
                },
              }
            })
          } else {
            updateNftValues((current: any) => {
              return {
                ...current,
                [key]: {
                  ...current[key],
                  value: item[key] === null ? "" : item[key],
                },
              }
            })
          }
        }
      }
    }
  }, [])

  useEffect(() => {
    for (let key in item) {
      if (key === "address") {
        for (let addrkey in item.address) {
          updateNftValues((current: any) => {
            return {
              ...current,
              address: {
                ...current.address,
                [addrkey]: {
                  ...current.address[addrkey],
                  value:
                    item.address[addrkey] === null ? "" : item.address[addrkey],
                },
              },
            }
          })
        }
      } else if (key === "attributes" || key === "standoutFeatures") {
        const attrsFromDB = item[key]
        for (let i = 0; i < attrsFromDB.length; i++) {
          const attr = attrsFromDB[i]
          if (attr.trait_type === "year_built") {
            if (attr.display_type !== "date") {
              attr.display_type = "date"
            } else {
              const formattedDate = attr.value
              // @ts-ignore
              attrValues[attr.trait_type].value = formattedDate
            }
          } else {
            if (attr.display_type !== "number") {
              attr.display_type = "number"
            }
          }
        }
      } else {
        // @ts-ignore
        const keyExists = nftValues[key]
        if (keyExists) {
          if (key === "propertyId") {
            updateNftValues((current: any) => {
              return {
                ...current,
                [key]: {
                  ...current[key],
                  value: propertyId || item[key],
                },
              }
            })
          } else {
            updateNftValues((current: any) => {
              return {
                ...current,
                [key]: {
                  ...current[key],
                  value: item[key] === null ? "" : item[key],
                },
              }
            })
          }
        }
      }
    }
  }, [])

  const locked =
    !item?.ccrDeclaration ||
    !item?.ownerName ||
    !item?.operatingAgreement ||
    !item?.legalDescription

  return (
    <Info>
      <Singular>
        {Object.keys(nftValues).map((k, i) => {
          // @ts-ignore
          const field = nftValues[k]

          let photo
          try {
            photo = window.URL.createObjectURL(field.value)
          } catch (e) {
            photo = field.value
          }

          if (k === "stateCode") {
            if (!field.value) {
              field.value = State.getStatesOfCountry("US")[0].isoCode
            }
          }

          return (
            !field.hidden &&
            k !== "address" &&
            (field.type === "file" ? (
              <Item key={k}>
                <FieldLabel className="form-control-sm">
                  {field.label}
                </FieldLabel>
                <ImageFileButton isempty={!field.value}>
                  {field.value ? (
                    <ImageButton src={photo} />
                  ) : (
                    <i
                      className="fa fa-cloud-upload"
                      aria-hidden="true"
                      style={{
                        fontSize: "calc(8rem * 0.3)",
                        color: "lightgray",
                      }}
                    ></i>
                  )}
                </ImageFileButton>

                {/*** @note This is an initial choose file for new image of the nft art.
                 * This is a draft code only and needs to be finished by adding an upload button
                 * once the file was uploaded, it should be displayed on the NFT's metadata
                 */}
                <div style={{ width: "100%" }}>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.avif,.jfif"
                    onChange={handlePhotoChange}
                  />
                </div>
              </Item>
            ) : k === "stateCode" ? (
              <Item key={k}>
                <FieldLabel className="form-control-sm">
                  {field.label}
                </FieldLabel>
                <select
                  className="form-select form-input form-control form-control-sm"
                  name={k}
                  value={field.value}
                  onChange={handleNftChange}
                  required={field.required}
                  {...{ isrequired: (field.required || "").toString() }}
                  {...{ isurl: (field.isUrl || "").toString() }}
                >
                  {State.getStatesOfCountry("US").map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Item>
            ) : (
              <Item key={k}>
                <FieldLabel className="form-control-sm">
                  {field.label}
                </FieldLabel>
                <Row>
                  <input
                    type={field.type}
                    readOnly={field.readOnly}
                    className="form-input form-control form-control-sm"
                    placeholder={field.placeholder || field.label}
                    name={k}
                    value={field.masking ? format(field.value) : field.value}
                    onChange={handleNftChange}
                    required={field.required}
                    ref={(el) => (refNftFields.current[i] = el)}
                    {...{ isrequired: (field.required || "").toString() }}
                    {...{ isurl: (field.isUrl || "").toString() }}
                    maxLength={field.maxlength}
                    style={{
                      width: `${k === "tokenIssuanceRate" ? "40%" : "100%"}`,
                    }}
                    min={field.type === "number" ? "0.00001" : ""}
                    step={field.type === "number" ? "0.00001" : ""}
                  />
                  {k === "tokenIssuanceRate" && (
                    <UpdateTokenRateButton onClick={handleUpdateTokenRate} />
                  )}
                </Row>
              </Item>
            ))
          )
        })}

        {/* <MetadataForm fields={item?.attributes} /> */}

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
              value={yrBuilt}
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
        <Item>
          <ButtonGroup>
            <button
              className="btn btn-primary"
              style={{
                minWidth: "164px",
                marginRight: "0.2rem",
                backgroundColor: "#2A72A7",
              }}
              disabled={isUpdatingNftValues}
              onClick={handleUpdateNftClick}
            >
              {isUpdatingNftValues ? (
                <i className="fa fa-circle-o-notch fa-spin"></i>
              ) : (
                <span>UPDATE NFT</span>
              )}
            </button>
            <button
              className="btn btn-primary"
              style={{
                minWidth: "164px",
                marginRight: "0.2rem",
                backgroundColor: "#2A72A7",
              }}
              disabled={isUpdating || locked}
              onClick={() => setShow(true)}
            >
              {isUpdating ? (
                <i className="fa fa-circle-o-notch fa-spin"></i>
              ) : (
                <span>MINT NFTi</span>
              )}
            </button>
          </ButtonGroup>
        </Item>
      </Singular>

      <NftMint
        onShow={show}
        onHide={() => setShow(false)}
        onMessage={(msg: any) => alertContext(msg)}
        selectedNftData={item}
      />
    </Info>
  )
}

const convertBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve(fileReader.result)
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}
