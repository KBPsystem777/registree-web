import styled from "styled-components"

export const Info = styled.div`
  background: white;
  display: grid;
  grid-template-columns: 50% 50%;
  min-width: 800px;
`
export const Singular = styled.div`
  background: white;
  display: block;
  min-width: 800px;
  padding: 10px 50px;
`
export const Item = styled("div") <{ gtc?: number }>`
  display: grid;
  grid-template-columns: ${(props) => props.gtc || 165}px auto;
  margin: 4px auto;
  column-gap: 20px;
`
export const FieldLabel = styled.div`
  display: flex;
  align-self: flex-start;
  font-weight: 300;
  letter-spacing: 0.02rem;
  color: rgb(0 0 0 / 0.5);
`
export const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 1rem;
`
export const ImageFileButton = styled("label") <{
    locked?: boolean
    isempty?: boolean
}>`
  width: 8rem;
  height: 8rem;
  border: ${(props) =>
        props.isempty ? "0.1rem solid rgba(0,0,0,0.1)" : "none"};
  border-radius: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`
export const InputFile = styled.input`
  display: none;
`
export const ImageButton = styled("div") <{ src?: string }>`
  width: inherit;
  height: inherit;
  display: inline-block;
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
`
export const Row = styled.div`
  display: flex;
  flex-direction: row;
`
export const UpdateTokenRateButton = styled.div`
  height: 100%;
  background-color: #2c72a7;
  display: flex;
  align-items: center;
  border-radius: 0.2rem;
  padding: 0 0.5rem;
  margin-left: 0.5rem;
  cursor: pointer;
  &:after {
    content: "Update token rate";
    color: white;
    font-size: 0.8rem;
  }
  &:hover {
    opacity: 0.9;
  }
`