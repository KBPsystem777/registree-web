import { useEffect, useRef, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { getAllNftis } from "../../../../api/Nfti";

import Pagination from "../../../components/Pagination"
import SelectedProperty from "./SelectedProperty"
import {HOST_URI_PHOTO} from "../../../../config";

const pageSize = 500

function useIsMounted() {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  })

  return isMounted
}

export default function Infos() {
  const refTableSection = useRef(null)
  const [loading, setLoading] = useState(false)
  const isMountedRef = useIsMounted()
  const [pList, setPList] = useState<object[]>([])
  const [selectedProperty, setSelectedProperty] = useState<object>()
  const [total, setTotal] = useState(0)
  const [loadingPage, setLoadingPage] = useState(false)
  const navigate = useNavigate()

  async function handleFirstClick(offset: any) {
    try {
      setLoadingPage(true)
      const raw = await getAllNftis(pageSize, 0)
      const sortedList = await raw.data.data.properties.sort((a:any,b:any) => a.name.localeCompare(b.name))
      setPList(sortedList)
      setSelectedProperty(raw.data.data.properties[0])
      if (
        raw.data.data.properties[0] &&
        Object.keys(raw.data.data.properties[0]).length > 0
      ) {
        navigate("/home/properties/" + raw.data.data.properties[0].id)
      }
    } catch (e) {
    } finally {
      setLoadingPage(false)
    }
  }

  async function handlePrevClick(offset: any) {
    try {
      setLoadingPage(true)
      const raw = await getAllNftis(pageSize, offset)
      const sortedList = await raw.data.data.properties.sort((a:any,b:any) => a.name.localeCompare(b.name))
      setPList(sortedList)
      setSelectedProperty(raw.data.data.properties[0])
      if (
        raw.data.data.properties[0] &&
        Object.keys(raw.data.data.properties[0]).length > 0
      ) {
        navigate("/home/properties/" + raw.data.data.properties[0].id)
      }
    } catch (e) {
    } finally {
      setLoadingPage(false)
    }
  }

  async function handleNextClick(offset: any) {
    try {
      setLoadingPage(true)
      const raw = await getAllNftis(pageSize, offset)
      const sortedList = await raw.data.data.properties.sort((a:any,b:any) => a.name.localeCompare(b.name))
      setPList(sortedList)
      setSelectedProperty(raw.data.data.properties[0])
      if (
        raw.data.data.properties[0] &&
        Object.keys(raw.data.data.properties[0]).length > 0
      ) {
        navigate("/home/properties/" + raw.data.data.properties[0].id)
      } else {
        setSelectedProperty(undefined)
      }
    } catch (e) {
    } finally {
      setLoadingPage(false)
    }
  }

  async function handleLastClick(offset: any) {
    try {
      setLoadingPage(true)
      const raw = await getAllNftis(pageSize, offset)
      const sortedList = await raw.data.data.properties.sort((a:any,b:any) => a.name.localeCompare(b.name))
      setPList(sortedList)
      setSelectedProperty(raw.data.data.properties[0])
      if (
        raw.data.data.properties[0] &&
        Object.keys(raw.data.data.properties[0]).length > 0
      ) {
        navigate("/home/properties/" + raw.data.data.properties[0].id)
      } else {
        setSelectedProperty(undefined)
      }
    } catch (e) {
    } finally {
      setLoadingPage(false)
    }
  }

  async function handleSelectClick(i: number, p: any) {
    setSelectedProperty(p)
  }

  useEffect(() => {
    // document.body.style.overflow = 'hidden';
    // @ts-ignore
    refTableSection.current.style.overflow = "hidden"
    ;(async () => {
      try {
        setLoading(true)
        const raw = await getAllNftis(pageSize, 0)
        if (isMountedRef.current) {
          if (raw && raw.data && raw.data.data && raw.data.data.total) {
            setTotal(raw.data.data.total)
          }
          if (
            raw &&
            raw.data &&
            raw.data.data &&
            raw.data.data.properties &&
            Array.isArray(raw.data.data.properties)
          ) {
            const sortedList = await raw.data.data.properties.sort((a:any,b:any) => a.name.localeCompare(b.name))
            setPList(sortedList)
            if (
              raw.data.data.properties[0] &&
              Object.keys(raw.data.data.properties[0]).length > 0
            ) {
              navigate("/investors/info/" + raw.data.data.properties[0].id)
            }
          }
        }
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    })()

    return () => {
      navigate("/investors")
    }
  }, [isMountedRef])

  return (
    <Container>
      <FilteredTable>
        <FilterSection>
          <Navigation className="pull-right form-inline">
            <select
              className="form-control-sm"
              style={{
                borderColor: "rgb(0 0 0 / 0.2)",
                outline: "none",
                marginRight: "0.3rem",
              }}
            >
              <option value="active">ACTIVE PROPERTIES</option>
              <option value="inactive">INACTIVE PROPERTIES</option>
            </select>

            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="search"
                aria-label="search"
                aria-describedby="basic-addon2"
                style={{ width: "240px", outline: "none" }}
              />
              <div className="input-group-append">
                <button className="btn btn-sm btn-secondary" type="button">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>

            <Pagination
              value={pList}
              total={total}
              pageSize={pageSize}
              lock={loading}
              first={handleFirstClick}
              prev={handlePrevClick}
              next={handleNextClick}
              last={handleLastClick}
            />
          </Navigation>
          <ClearFix />
        </FilterSection>

        <TableSection ref={refTableSection}>
          <PropertyListWrap>
            {loading ? (
              <LoadingWrap>
                <i className="fa fa-circle-o-notch fa-spin"></i>
              </LoadingWrap>
            ) : pList.length > 0 ? (
              pList.map((p: any, i) => {
                const currPhoto = p.photo ?
                                    p.photo.includes('http') ? p.photo
                                      : `${HOST_URI_PHOTO}/api/managelife/v1/properties/photo/${p.photo}`
                                        : require('../../../../assets/images/properties-blue-icon.png').default
                return (
                  <NavLink
                    key={i}
                    to={"/investors/info/" + p.id}
                    style={({ isActive }) => ({
                      textDecoration: "none",
                    })}
                    onClick={() => handleSelectClick(i, p)}
                  >
                    <PropertyItem>
                      <PropertyContent>
                        <IconContainer>
                          <PropertyImage src={currPhoto} />
                        </IconContainer>
                        <InfoContainer>
                          <Name>{p.name}</Name>
                          {/*<Address>{p.address_1} {p.address_2}, {p.city}</Address>*/}
                          <Address>{p.fullAddress}</Address>
                          {/*<Address color="gray">{p.state} {p.zip_code}</Address>*/}
                        </InfoContainer>
                      </PropertyContent>
                      <ClearFix />
                    </PropertyItem>
                  </NavLink>
                )
              })
            ) : (
              <NotFound>
                <i className="fa fa-warning" style={{ fontSize: "60px" }}></i>
                <div>No properties found.</div>
              </NotFound>
            )}
          </PropertyListWrap>

          <PropertyPanel>
            <SelectedProperty offlineSelectedProperty={selectedProperty} />
          </PropertyPanel>
        </TableSection>
      </FilteredTable>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 94vh;
  background-color: #ffffff;
  font-family: Poppins-Light;
`
const LoadingWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
`
const FilteredTable = styled.div`
  width: 100%;
  height: 100%;
`
const FilterSection = styled.div`
  height: 48px;
  padding: 16px 16px 0px 16px;
  width: 100%;
`
const Navigation = styled.div`
  margin-bottom: 8px;
`
const ClearFix = styled.div`
  clear: left;
  clear: right;
`
const TableSection = styled.div`
  border: 1px solid lightgray;
  border-radius: 4px;
  height: calc(100% - 52px);
  overflow: auto;
  padding: 16px;
  width: 100%;
  border: none !important;
  display: flex;
  justify-content: space-between;
`
const PropertyListWrap = styled.div`
  display: inline-block;
  height: calc(100% - 8px);
  overflow: auto;
  width: 360px;
`
const PropertyItem = styled.div`
  background: white;
  border: 1px solid lightgray;
  border-radius: 4px;
  box-shadow: 2px 2px 2px lightgray;
  margin-bottom: 4px;
  padding: 8px 16px;
  position: relative;
`
const PropertyContent = styled.div`
  display: grid;
  grid-column-gap: 8px;
  grid-template-columns: 56px auto;
`
const IconContainer = styled.div`
  width: 56px;
  display: flex;
  justify-content: center;
`
const PropertyImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`
const InfoContainer = styled.div`
  margin-left: 16px;
  font-size: 9pt;
`
const Name = styled.div`
  color: #2a72a7;
  font-size: 10pt;
  font-weight: bold;
  font-family: Poppins-SemiBold;
`
const Address = styled("div")<{ color?: string }>`
  color: ${(props) => props.color || "#000000"};
`

const PropertyPanel = styled.div`
  background: #eee;
  border: 1px solid lightgray;
  border-radius: 8px;
  display: inline-block;
  font-size: 12pt;
  height: calc(100% - 4px);
  margin-left: 16px;
  padding-top: 16px;
  text-align: center;
  width: calc(100% - 376px);
  vertical-align: top;
`
const NotFound = styled.div`
  height: 100%;
  border: 1px solid lightgray;
  border-radius: 4px;
  padding: 120px 0px;
  color: lightgray;
  display: flex;
  flex-direction: column;
  align-items: center;
`
