import { useEffect, useRef, useState } from "react"
import { useWeb3React } from "@web3-react/core"

import styled from "styled-components"
import OwlCarousel from "react-owl-carousel"

import { saveNftFavorited } from "../../../api/Nft"
import { useModalContext } from "../../../hooks/ModalContext"

import CloseIcon from "../../../assets/images/close-x-icon.svg"
import SaveHomeIcon from "../../../assets/images/save-home-icon.svg"
import ShareIcon from "../../../assets/images/mail-icon.svg"
import ArrowIcon from "../../../assets/images/arrow-up-white.svg"
import ModalImageShare from "./ModalImageShare"
import ModalImageSaveHome from "./ModalImageSaveHome"
import ModalImageRequestTour from "./ModalImageRequestTour"

import WarningMessage from "./WarningMessage"
import WalletConnect from "../../../components/global/WalletConnect"

import "owl.carousel/dist/assets/owl.carousel.css"
import "owl.carousel/dist/assets/owl.theme.default.css"

// @note if there is a need to use a placeholder image for property,
// use the ML_STOCK_IMAGE variable

interface ModalContext {
  setOpen: any
  setModalChildren: any
  setFormScreen: any
  setLoadingMessage: any
  setErrorMessage: any
  setSuccessMessage: any
}

export default function ModalImage({
  item,
  closeModal,
  handleSetFavorite,
}: Props) {
  const refModalCarousel = useRef(null)
  const [openRequestTourModal, setOpenRequestTourModal] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)
  const [openSaveHomeModal, setOpenSaveHomeModal] = useState(false)
  const { account } = useWeb3React()
  const role = localStorage.getItem("role")
  const [images, setImages] = useState<any[] | []>([])
  const [loading, setLoading] = useState(true)

  // @ts-ignore
  const { setOpen, setModalChildren }: ModalContext = useModalContext()

  const handleCalendlyRedirection = () => {
    window.open(
      "https://calendly.com/web3motors/managelife-property-tour",
      "_blank"
    )
  }
  function handleRequestTourClick() {
    handleCalendlyRedirection()
    // @note Turning this functionality off for now: `setOpenRequestTourModal(true)`
  }

  async function handleSaveHomeClick() {
    if (account) {
      if (role) {
        const respond = await saveNftFavorited({
          walletAddress: account,
          id: item.propertyId || item.tokenId,
        })
        const favStatus = respond?.data?.data?.favorites || 0
        handleSetFavorite(favStatus)
        setModalChildren(
          <WarningMessage
            message={`${favStatus > 0 ? "Added to" : "Removed from"
              } favorites.`}
            isOpen={true}
            closeModal={() => setOpen(false)}
          />
        )
        setOpen(true)
      } else {
        setModalChildren(
          <WarningMessage
            message="You must be a ML member to save home."
            isOpen={true}
            closeModal={() => setOpen(false)}
          />
        )
        setOpen(true)
      }
    } else {
      setModalChildren(<WalletConnect onClose={() => setOpen(false)} />)
      setOpen(true)
    }
  }

  function handleShareClick() {
    setOpenShareModal(true)
  }

  function handleSlideImage(direction: number) {
    if (direction === 0) {
      if (refModalCarousel.current) {
        // @ts-ignore
        refModalCarousel.current.prev(500)
      }
    } else {
      if (refModalCarousel.current) {
        // @ts-ignore
        refModalCarousel.current.next(500)
      }
    }
  }

  useEffect(() => {
    setImages((prev) => [...prev, { url: item.image, type: "image" }])
    setLoading(false)
  }, [])

  return (
    <Container>
      <Header>
        <HeaderCell justifyStart></HeaderCell>
        <HeaderCell justifyEnd style={{ gap: "2.5rem" }}>
          <RequestTour onClick={handleRequestTourClick} />
          <SaveHome onClick={handleSaveHomeClick} />
          <Share onClick={handleShareClick} />
          <CloseButton onClick={closeModal} />
        </HeaderCell>
      </Header>

      <Content>
        {loading ? (
          <>
            <LoadingWrap>
              <i className="fa fa-circle-o-notch fa-spin"></i>
            </LoadingWrap>
          </>
        ) : (
          <>
            <PrevButton onClick={() => handleSlideImage(0)} />
            <CarouselPanel>
              <OwlCarousel
                ref={refModalCarousel}
                loop={true}
                dots={false}
                items={1}
                style={{ position: "relative" }}
              >
                {(images || []).map((item: any, index: number) => {
                  return item.type === "image" ? (
                    <HouseImage key={index} src={item.url} />
                  ) : (
                    <HouseVideo key={index} src={item.url} frameBorder="0" />
                  )
                })}
              </OwlCarousel>
              <Description>
                For Sale: $2,290,000 (14 beds, 12 baths, 7,901 Square Feet)
              </Description>
            </CarouselPanel>
            <NextButton onClick={() => handleSlideImage(1)} />
          </>
        )}
      </Content>

      <ModalImageRequestTour
        isOpen={openRequestTourModal}
        closeModal={() => setOpenRequestTourModal(false)}
      />
      <ModalImageSaveHome
        isOpen={openSaveHomeModal}
        closeModal={() => setOpenSaveHomeModal(false)}
      />
      <ModalImageShare
        isOpen={openShareModal}
        closeModal={() => setOpenShareModal(false)}
      />
    </Container>
  )
}

type Props = {
  item: any
  isOpen: boolean
  closeModal: () => void
  handleSetFavorite: (val: any) => void
}

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 6%;
  border-bottom: 0.05rem solid rgba(255, 255, 255, 0.2);
`
const Content = styled.div`
  width: 100%;
  height: 94%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`
const HeaderCell = styled("div") <{
  justifyStart?: boolean
  justifyEnd?: boolean
}>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  color: white;
  ${(props) => props.justifyStart && "justify-content: flex-start"};
  ${(props) => props.justifyEnd && "justify-content: flex-end"};
`
const RequestTour = styled.div`
  background-color: #2c72a7;
  display: flex;
  height: fit-content;
  padding: 0.3rem 0.6rem;
  border-radius: 0.3rem;
  align-self: center;
  cursor: pointer;
  &:after {
    content: "Request Tour";
    font-size: 0.9rem;
  }
`
const SaveHome = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  cursor: pointer;
  &:before {
    content: "";
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    background-image: url(${(props) => SaveHomeIcon});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    margin-right: 0.4rem;
  }
  &:after {
    content: "Save Home";
    font-size: 0.9rem;
  }
`
const Share = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  cursor: pointer;
  &:before {
    content: "";
    display: inline-block;
    width: 1.4rem;
    height: 1.4rem;
    background-image: url(${(props) => ShareIcon});
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    margin-right: 0.4rem;
  }
  &:after {
    content: "Share";
    font-size: 0.9rem;
  }
`
const CloseButton = styled.div`
  display: flex;
  align-self: center;
  &:after {
    content: "";
    display: inline-block;
    width: 1.7rem;
    height: 1.7rem;
    background-image: url(${(props) => CloseIcon});
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
  }
  cursor: pointer;
  margin-right: 2rem;
`

const PrevButton = styled.div`
  position: relative;
  width: 4vh;
  height: 5vh;
  z-index: 200;
  left: 3%;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #ffffff;
  opacity: 0.7;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  &:after {
    content: "";
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${(props) => ArrowIcon});
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: center;
    transform: rotate(-90deg);
  }
`
const NextButton = styled.div`
  position: relative;
  width: 4vh;
  height: 5vh;
  z-index: 200;
  right: 3%;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #ffffff;
  opacity: 0.7;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  &:after {
    content: "";
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url(${(props) => ArrowIcon});
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: center;
    transform: rotate(90deg);
  }
`

const CarouselPanel = styled.div`
  width: 60vw;
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`
const HouseImage = styled("div") <{ src?: string }>`
  width: 60vw;
  height: 60vh;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  display: block;
`
const HouseVideo = styled("iframe")`
  width: 60vw;
  height: 60vh;
`
const Description = styled.span`
  position: absolute;
  margin-top: 1rem;
  color: #ffffff;
  bottom: 1rem;
`
const LoadingWrap = styled.div`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  color: #ffffff;
`
