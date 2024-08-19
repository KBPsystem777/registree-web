import styled from "styled-components"

export const StyledMessage = styled.p`
  text-align: center;
  color: #333;
  padding-top: 5em;
  margin: 1em 3em 0 3em;
  font-size: 28px;
`

export const Button = styled.div`
  justify-content: center;
  font-size: 12pt;
  font-weight: 200;
  letter-spacing: 1pt;
  background-color: #2a72a7;
  width: 12rem;
  height: 2.5rem;
  color: #ffffff;
  border-radius: 0.3rem;
  text-align: center;
  align-items: center;
  display: flex;
`
export const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25vh; /* Adjust the height based on your layout requirements */
`

const TourConfirmationPage = () => {
  return (
    <>
      <StyledMessage>
        Thank you for scheduling a tour with us. We appreciate your interest,
        and our dedicated agents will promptly follow up with you to assist you
        further.
      </StyledMessage>

      <CenteredContainer>
        <Button
          onClick={() => {
            window.location.replace("/home")
          }}
        >
          Back to home
        </Button>
      </CenteredContainer>
    </>
  )
}

export default TourConfirmationPage
