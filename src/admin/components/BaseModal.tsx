import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";

export const BaseModal = ({ children, isOpen, onClose }: any) => {
  const isChrome = /chrome/.test((navigator.userAgent || "").toLowerCase());

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={true}
      closeOnEsc={true}
    >
      <ModalOverlay
        backgroundColor={isChrome ? "rgba(0,0,0, 0.8)" : "rgba(0,0,0, 0.9)"}
        backdropFilter="blur(5px)"
      />
      <ModalContent
        backgroundColor="transparent"
        maxW="100vw"
        margin="0"
        padding="0"
      >
        {children}
        <ModalBody maxW="100vw" padding="0" margin="0"></ModalBody>
      </ModalContent>
    </Modal>
  );
};
