import React, { useContext, useEffect, useState } from "react"

import $ from "jquery"

import {
  Container,
  FormScreenContainer,
  MessageContainer,
  LoadingText,
  ErrorText,
  CloseButton,
  Row,
  MessageImage,
} from "./styles/ModalContext.style"

import SuccessIcon from "../assets/images/success.png"
import FailedIcon from "../assets/images/failed.png"

// @ts-ignore
const ModalContext = React.createContext()

export function useModalContext() {
  return useContext(ModalContext)
}

export function ModalProvider({ children }: any) {
  const [isOpen, setOpen] = useState(false)
  const [modalChildren, setModalChildren] = useState<any>()
  const [loadingMessage, setLoadingMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorMessageNoClose, setErrorMessageNoClose] = useState(null)
  const [disableKeyboard, setDisableKeyboard] = useState(false)
  const [formScreen, setFormScreen] = useState<any>(null)

  useEffect(() => {
    if (isOpen) {
      $("#modal-container").fadeIn("fast")
    } else {
      $("#modal-container").fadeOut("fast")
      setModalChildren(null)
      setDisableKeyboard(false)
    }

    if (!disableKeyboard) {
      window.addEventListener("keydown", (e: any) => {
        if (e.key === "Escape") {
          $("#modal-container").fadeOut("fast")
          setOpen(false)
          setModalChildren(null)
        }
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (loadingMessage || errorMessage || successMessage) {
      const body = document.body
      body.style.height = "100vh"
      body.style.overflowY = "hidden"
    } else {
      const body = document.body
      body.style.height = ""
      body.style.overflowY = ""
    }

    if (successMessage) {
      setLoadingMessage(null)
      setErrorMessage(null)
    }
    if (errorMessage) {
      setLoadingMessage(null)
      setSuccessMessage(null)
    }
  }, [loadingMessage, successMessage, errorMessage])

  const value = {
    isOpen,
    setOpen,
    modalChildren,
    setModalChildren,
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage,
    setDisableKeyboard,
    setFormScreen,
    setErrorMessageNoClose,
  }

  return (
    <ModalContext.Provider value={value}>
      <Container id="modal-container">{modalChildren}</Container>
      {loadingMessage && !errorMessage && (
        <ActivityIndicator message={loadingMessage} />
      )}
      {errorMessage && (
        <ErrorIndicator
          message={errorMessage}
          close={() => setErrorMessage(null)}
        />
      )}
      {errorMessageNoClose && (
        <ErrorIndicator message={errorMessageNoClose} noclose />
      )}
      {successMessage && !errorMessage && (
        <SuccessIndicator
          message={successMessage}
          close={() => {
            setSuccessMessage(null)
          }}
        />
      )}
      {formScreen && <FormScreen children={formScreen} />}
      {children}
    </ModalContext.Provider>
  )
}

const ActivityIndicator = (props: any) => {
  return (
    <MessageContainer>
      <LoadingText>{props.message}</LoadingText>
    </MessageContainer>
  )
}
const ErrorIndicator = (props: any) => {
  return (
    <MessageContainer>
      <Row>
        <MessageImage src={FailedIcon} />
        <ErrorText>{props.message}</ErrorText>
      </Row>
      {!props.noclose && <CloseButton onClick={props.close}>CLOSE</CloseButton>}
    </MessageContainer>
  )
}
const SuccessIndicator = (props: any) => {
  return (
    <MessageContainer>
      {/*<LoadingText static>{props.message}</LoadingText>*/}
      <Row>
        <MessageImage src={SuccessIcon} />
        <LoadingText static>{props.message}</LoadingText>
      </Row>
      <CloseButton onClick={props.close}>CLOSE</CloseButton>
    </MessageContainer>
  )
}

const FormScreen = (props: any) => {
  return <FormScreenContainer>{props.children}</FormScreenContainer>
}
