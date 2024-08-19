import { useEffect, useState } from "react"

import styled from "styled-components"

import { Header, ArrowImage, Body } from "./styles/Accordion.styles"

let eventKeys: Array<any> = []
let withoutGap: boolean = true
const lastAccordionNoGap = 10

const Accordion = ({ children, noGap }: any) => {
  withoutGap = noGap
  return <Container className="ml-accordion-base">{children}</Container>
}

const AccordionItem = ({ children, eventKey }: any) => {
  const idx = eventKeys.findIndex((x) => x.key === eventKey)
  if (idx == -1) {
    eventKeys.push({ key: eventKey, withoutGap: withoutGap })
  }

  return (
    <ContainerItem className={`ml-accordion-item-${eventKey}`}>
      {children}
    </ContainerItem>
  )
}

const ContainerItem = styled("div")<{}>`
  width: 100%;
  margin-bottom: ${(props) => (withoutGap ? "0" : "1rem")};
`

const AccordionHeader = ({ children, eventKey, expand, keepExpand }: any) => {
  const [collapse, setCollapse] = useState(!expand)
  const [noGap, setNoGap] = useState(false)
  const [kExpand, setKExpand] = useState(false)

  useEffect(() => {
    const exists = eventKeys.filter((x) => x.key === eventKey)[0]
    if (exists && exists.withoutGap) {
      setNoGap(true)
    } else {
      setNoGap(false)
    }

    if (eventKey === lastAccordionNoGap) {
      const elHeader = document.querySelector(
        `.ml-accordion-header-${eventKey}`
      )
      if (elHeader) {
        // @ts-ignore
        elHeader.style.border = "0"
      }
    }

    if (expand) {
      initialExpand(exists && exists.withoutGap)
    }

    setKExpand(keepExpand)
    if (keepExpand) {
      initialExpand(exists && exists.withoutGap)
    }
  }, [])

  const initialExpand = (thisNoGap: boolean) => {
    const elHeader = document.querySelector(`.ml-accordion-header-${eventKey}`)
    const elBody = document.querySelector(`.ml-accordion-body-${eventKey}`)
    if (elHeader && elBody) {
      if (thisNoGap) {
        // @ts-ignore
        elBody.style.display = "flex"

        if (eventKey === lastAccordionNoGap) {
          // @ts-ignore
          elHeader.style.borderBottom = "1px solid rgba(0,0,0,0.1)"
        } else {
          // @ts-ignore
          elBody.style.borderBottom = "1px solid rgba(0,0,0,0.1)"
        }
      } else {
        // @ts-ignore
        elHeader.style.borderBottomLeftRadius = "0"
        // @ts-ignore
        elHeader.style.borderBottomRightRadius = "0"
        // @ts-ignore
        elHeader.style.borderBottom = "0"
        // @ts-ignore
        elBody.style.display = "flex"
      }
    }
  }

  const toggle = async () => {
    if (kExpand) {
      return
    }

    const elHeader = document.querySelector(`.ml-accordion-header-${eventKey}`)
    const elBody = document.querySelector(`.ml-accordion-body-${eventKey}`)

    if (elHeader && elBody) {
      if (noGap) {
        // @ts-ignore
        if (!elBody.style.display || elBody.style.display === "none") {
          // @ts-ignore
          elBody.style.display = "flex"

          if (eventKey === lastAccordionNoGap) {
            // @ts-ignore
            elHeader.style.borderBottom = "1px solid rgba(0,0,0,0.1)"
          } else {
            // @ts-ignore
            elBody.style.borderBottom = "1px solid rgba(0,0,0,0.1)"
          }

          setCollapse(false)
        } else {
          // @ts-ignore
          elBody.style.display = "none"
          // @ts-ignore
          elBody.style.borderBottom = "0"

          if (eventKey === lastAccordionNoGap) {
            // @ts-ignore
            elHeader.style.borderBottom = "0"
          }

          setCollapse(true)
        }
      } else {
        // @ts-ignore
        if (!elBody.style.display || elBody.style.display === "none") {
          // @ts-ignore
          elHeader.style.borderBottomLeftRadius = "0"
          // @ts-ignore
          elHeader.style.borderBottomRightRadius = "0"
          // @ts-ignore
          elHeader.style.borderBottom = "0"
          // @ts-ignore
          elBody.style.display = "flex"
          setCollapse(false)
        } else {
          // @ts-ignore
          elHeader.style.borderBottomLeftRadius = "0.8rem"
          // @ts-ignore
          elHeader.style.borderBottomRightRadius = "0.8rem"
          // @ts-ignore
          elHeader.style.borderBottom = "1px solid rgba(0,0,0,0.1)"
          // @ts-ignore
          elBody.style.display = "none"
          setCollapse(true)
        }
      }
    }
  }

  const handleToggleClick = () => {
    toggle()
  }

  return (
    <div style={{ width: "100%" }}>
      <Header
        className={`ml-accordion-header-${eventKey}`}
        nogap={noGap}
        lock={kExpand}
        onClick={handleToggleClick}
      >
        {children}
        <ArrowImage isCollapsed={collapse} lock={kExpand} />
      </Header>
    </div>
  )
}

const AccordionBody = ({ children, eventKey, noPadding }: any) => {
  const [noGap, setNoGap] = useState(false)

  useEffect(() => {
    const exists = eventKeys.filter((x) => x.key === eventKey)[0]
    if (exists && exists.withoutGap) {
      setNoGap(true)
    } else {
      setNoGap(false)
    }
  }, [])

  return (
    <Body
      className={`ml-accordion-body-${eventKey}`}
      nogap={noGap}
      nopadding={noPadding}
    >
      {children}
    </Body>
  )
}

const Container = styled.div`
  width: 100%;
  overflow: hidden;
  ${(props) =>
    withoutGap
      ? "border:1px solid rgba(0,0,0,0.1);;border-radius:0.8rem;"
      : ""};
`

export { Accordion, AccordionItem, AccordionHeader, AccordionBody }
