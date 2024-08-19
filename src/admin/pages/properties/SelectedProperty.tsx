import { useEffect, useState } from "react"
import { Accordion, Button, Card, useAccordionButton } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import styled from "styled-components"

import { setTriggerRefresh } from "../../../redux/web3Reducer"
import { useModalContext } from "../../../hooks/ModalContext"
import { errorCatcher } from "../../../utils/helpers"
import { deactivateProperty, getPropertyById } from "../../../api/Properties"

import PropertyForm from "./PropertyForm"
import NftForm from "./NftForm"

type TRoomObject = {
  area: string
  dimension: string
  floor: string
  items: []
  name: string
  photo: string
  sequence: number
  standardRoom: string
  version: string | null
  _id: string
}

type TRoomInfo = TRoomObject[]

function ContextAwareToggle({ children, eventKey, callback }: any) {
  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey)
  )

  return (
    <AccordionHeaderLabel onClick={decoratedOnClick}>
      {children}
    </AccordionHeaderLabel>
  )
}

const AccordionHeaderLabel = styled.span`
  font-family: Poppins-Light;
  font-size: 11pt;
  color: #2a72a7;
  cursor: pointer;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  display: flex;
  align-self: flex-start;
`

/***
 * This is the component responsible in displaying the data on
 * http://localhost:3000/home/properties/{propertyId}
 */
export default function SelectedProperty({ offlineSelectedProperty }: any) {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedItem, setSelectedItem] = useState<any>()
  const [selectedNft, setSelectedNft] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [roomInfo, setRoomInfo] = useState<TRoomInfo>()

  const { id } = useParams()

  // @ts-ignore
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    useModalContext()
  // @ts-ignore
  const { web3State } = useSelector((state) => state)

  const dispatch = useDispatch()
  const needToTriggerRefresh: boolean = web3State?.triggerRefresh ?? false

  async function fetchData() {
    try {
      const result = await getPropertyById(id)
      if (result && result.data && result.data.data) {
        setSelectedItem(result.data.data)
        setSelectedNft(result.data.data?.nft)
        setRoomInfo(result?.data?.data?.rooms)
      }
      setLoading(false)
    } catch (e) {
      if (offlineSelectedProperty) {
        setSelectedItem({
          address: {
            address1: offlineSelectedProperty.address_1,
            address2: offlineSelectedProperty.address_2,
            city: offlineSelectedProperty.city,
            country: offlineSelectedProperty.country,
            state: offlineSelectedProperty.state,
            zipCode: offlineSelectedProperty.zip_code,
            _id: offlineSelectedProperty.id,
          },
          id: offlineSelectedProperty.id,
          lat: offlineSelectedProperty.lat,
          lng: offlineSelectedProperty.lng,
          name: offlineSelectedProperty.name,
          nft: [],
          notes: offlineSelectedProperty.notes,
          photo: offlineSelectedProperty.photo,
          propertyType: offlineSelectedProperty.property_type,
          version: offlineSelectedProperty.version,
          views: null,
        })
        setSelectedNft(null)
      }
      setLoading(false)
    }
  }

  const bedroomData = roomInfo?.filter((item) =>
    item?.standardRoom.includes("BEDROOM")
  )
  const bathroomData = roomInfo?.filter((item) =>
    item?.standardRoom.includes("BATHROOM")
  )

  async function handleReload() {
    await fetchData()
  }

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      await fetchData()
    })()
  }, [id, needToTriggerRefresh])

  const handlePropertyDeactivation = async (
    propertyId: number | string | undefined
  ) => {
    setLoadingMessage("Deactivating Property...")

    try {
      await deactivateProperty(propertyId)
      setSuccessMessage("Success!")
      // @note After submitting the POST deactivateProperty request above, we need to trigger page refresh:
      dispatch(setTriggerRefresh(!needToTriggerRefresh))
    } catch (error) {
      setErrorMessage(errorCatcher(error))
    }
  }
  return (
    <>
      {loading ? (
        <LoadingWrap>
          <i className="fa fa-circle-o-notch fa-spin"></i>
        </LoadingWrap>
      ) : selectedItem ? (
        <SelectedPropertyContainer>
          <Tab>
            <TabItem isactive={activeTab === 0} onClick={() => setActiveTab(0)}>
              Property Details
            </TabItem>
            {/*<TabItem isactive={activeTab === 1} onClick={() => setActiveTab(1)}>Household</TabItem>*/}
          </Tab>
          {activeTab === 0 ? (
            <TabContentProperty>
              <TabContentScrolling>
                <TabContentPropertyInner>
                  <br />
                  <br />
                  <Accordion defaultActiveKey="0">
                    <Card>
                      <Card.Header>
                        <AccordionHeaderLabel>Property</AccordionHeaderLabel>
                      </Card.Header>
                      <Card.Body>
                        <PropertyForm item={selectedItem} propertyId={id} />
                      </Card.Body>
                    </Card>
                    <Card>
                      <Card.Header>
                        <ContextAwareToggle
                          eventKey="1"
                          callback={(activeEvent: any) => {}}
                        >
                          MEMBER NFT
                        </ContextAwareToggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <NftForm
                            item={selectedNft}
                            propertyId={id}
                            reload={handleReload}
                            bedRoomCount={bedroomData?.length}
                            bathRoomCount={bathroomData?.length}
                          />
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <DeleteButton>
                      <Button
                        variant="danger"
                        size="lg"
                        onClick={() => {
                          handlePropertyDeactivation(id)
                        }}
                      >
                        DEACTIVATE PROPERTY
                      </Button>
                    </DeleteButton>
                  </Accordion>
                  <br />
                  <br />
                </TabContentPropertyInner>
              </TabContentScrolling>
            </TabContentProperty>
          ) : activeTab === 1 ? (
            <TabContentHousehold />
          ) : null}
        </SelectedPropertyContainer>
      ) : (
        <NoSelectedProperty>
          <i
            className="fa fa-hand-o-left"
            style={{ fontSize: "80pt", color: "#2a72a7" }}
          ></i>
          <br />
          <div style={{ fontSize: "18pt" }}>Please select a property</div>
        </NoSelectedProperty>
      )}
    </>
  )
}

const NoSelectedProperty = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: gray;
`
const SelectedPropertyContainer = styled.div`
  height: 100%;
`
const Tab = styled.div`
  text-align: left;
  padding-left: 8px;
  padding-right: 8px;
`
const TabItem = styled("div")<{ isactive?: boolean }>`
  font-family: ${(props) =>
    props.isactive ? "Poppins-SemiBold" : "Poppins-Light"};
  background: ${(props) => (props.isactive ? "#fff" : "#2A72A7")};
  color: ${(props) => (props.isactive ? "#000" : "#B1D3EC")};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  cursor: pointer;
  display: inline-block;
  font-size: 10pt;
  padding: 8px 24px;
  margin: 0px 1px;
`
const TabContentProperty = styled.div`
  height: calc(100% - 40px);
  background: white;
  overflow: auto;
  position: relative;
`
const TabContentScrolling = styled("div")<{}>`
  position: absolute;
  width: 100%;
`
const TabContentPropertyInner = styled.div`
  width: 53rem;
  margin: 0 auto;
`
const TabContentHousehold = styled.div`
  height: calc(100% - 40px);
  background: white;
  overflow: auto;
  padding: 64px 32px;
`
const LoadingWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
`
const DeleteButton = styled.div`
  padding-top: 2em;
`
