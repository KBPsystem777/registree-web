import { useEffect, useState } from "react"
import styled from "styled-components"
import dateFormat from "dateformat"

import { Breakpoint } from "../../../constants"
import { getNFTMetadata } from "../../../api/Nft"

export default function NftInfo({ tokenId, close }: any) {
  const [loading, setLoading] = useState(false)
  const [attributes, setAttributes] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const attrs = await getNFTMetadata("", tokenId)
        setAttributes(attrs?.nft?.attributes)
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <Container>
      <InfoWrap>
        <Header>
          <span
            style={{
              fontFamily: "Poppins-SemiBold",
              color: "#2A72A7",
              fontSize: "1.2rem",
            }}
          >
            Information
          </span>
          <XClose onClick={close} />
        </Header>
        <Content>
          <span style={{ fontSize: "1.4rem" }}>Traits</span>
          <Traits>
            {loading ? (
              <i className="fa fa-circle-o-notch fa-spin"></i>
            ) : attributes && attributes.length > 0 ? (
              attributes.map((m, i) => {
                let mValue =
                  m.display_type === "date"
                    ? dateFormat(new Date(m.value * 1000), "mmm dd, yyyy")
                    : m.value
                return (
                  <TraitBox key={i}>
                    <span
                      style={{
                        fontFamily: "Poppins-SemiBold",
                        color: "#2A72A7",
                      }}
                    >
                      {(
                        (m.trait_type || "").replaceAll("_", " ") || ""
                      ).toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontFamily: "Poppins-SemiBold",
                        color: "#000",
                        fontSize: "1.3rem",
                      }}
                    >
                      {mValue}
                    </span>
                  </TraitBox>
                )
              })
            ) : (
              <span
                style={{
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                  marginLeft: "1rem",
                }}
              >
                No attributes found
              </span>
            )}
          </Traits>
        </Content>
      </InfoWrap>
    </Container>
  )
}
// Object.keys(TRAITS).map((k,i) => {
//     // @ts-ignore
//     const field = TRAITS[k];
//     return (
//         <TraitBox key={i}>
//             <span style={{fontFamily:'Poppins-SemiBold',color:'#2A72A7'}}>{field.label}</span>
//             <span style={{fontFamily:'Poppins-SemiBold',color:'#000',fontSize:'1.4rem'}}>{field.value}</span>
//         </TraitBox>
//     )
// })

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  padding-top: 5%;
  position: relative;
  overflow-y: auto;
`

const InfoWrap = styled.div`
  width: 60%;
  background-color: #fff;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  position: absolute;
  @media (max-width: ${(props) => Breakpoint.lg}) {
  }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    padding-bottom: 4rem;
  }
`
const XClose = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-image: url(${require("../../../assets/images/x-close.svg")
    .default});
  background-repeat: no-repeat;
  background-size: 70%;
  background-position: center;
  border: 0.15rem solid #000;
  cursor: pointer;
`
const Traits = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`
const TraitBox = styled.div`
  width: 20rem;
  // height: 5rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
`
