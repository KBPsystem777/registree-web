import { useEffect, useReducer, useState } from "react"

import $ from "jquery"

import { isValidEmail } from "../../../utils/emailValidator.util"

import {
  Container,
  Content,
  FieldCol,
  Text,
  TextArea,
  Footer,
  LinkButton,
  LinkCopiedMessage,
  SendButton,
  Input,
} from "./Styles/ModalImageShare.style"

import Base from "./../TransactionModalBase"

type Props = {
  isOpen: boolean
  closeModal: () => void
}

let clipboardTimeout: any

export default function ModalImageShare({ isOpen, closeModal }: Props) {
  const [locked, setLocked] = useState(true)
  const [isCopiedToClipboard, setCopiedToClipboard] = useState(false)
  const [fields, updateFields] = useReducer(
    (state: any, updates: any) => ({ ...state, ...updates }),
    {
      recipientsEmail: "",
      yourEmail: "",
      message: `Check out this home I found on ManageLife: ${window?.location?.href}`,
    }
  )

  useEffect(() => {
    if (isOpen) {
      $("#modal-image-share-container").fadeIn("fast")
    } else {
      $("#modal-image-share-container").fadeOut("fast")
    }
  }, [isOpen])

  function handleOnChange(e: any) {
    if (e.target.name === "yourEmail") {
      if (isValidEmail(e.target.value)) {
        setLocked(false)
      } else {
        setLocked(true)
      }
    }

    updateFields({ [e.target.name]: e.target.value })
  }

  function handleCopyToClipboard() {
    if (clipboardTimeout) {
      clearTimeout(clipboardTimeout)
    }

    navigator.clipboard.writeText(window.location.href)
    setCopiedToClipboard(true)
    clipboardTimeout = setTimeout(() => {
      setCopiedToClipboard(false)
    }, 4000)
  }

  return (
    <Container id="modal-image-share-container">
      <Base w={26} center={true} title="Email this home" close={closeModal}>
        <Content>
          <FieldCol>
            <Text font="Poppins-Regular">Recipient's email</Text>
            <Input
              type="text"
              name="recipientsEmail"
              value={fields.recipientsEmail}
              onChange={handleOnChange}
            />
            <Text font="Poppins-Regular" size={0.8} color="gray">
              Separate multiple addresses with a comma.
            </Text>
          </FieldCol>

          <FieldCol marginTop={1}>
            <Text font="Poppins-Regular">Your email</Text>
            <Input
              type="text"
              name="yourEmail"
              value={fields.yourEmail}
              onChange={handleOnChange}
            />
          </FieldCol>
          <FieldCol marginTop={1}>
            <Text font="Poppins-Regular">Include message (optional)</Text>
            <TextArea
              name="message"
              rows={3}
              value={fields.message}
              onChange={handleOnChange}
            />
          </FieldCol>

          <Footer>
            <SendButton locked={locked} />
            <LinkButton onClick={handleCopyToClipboard}>
              Get shareable link
            </LinkButton>
            {isCopiedToClipboard && (
              <LinkCopiedMessage>Link copied to clipboard</LinkCopiedMessage>
            )}
          </Footer>
        </Content>
      </Base>
    </Container>
  )
}
