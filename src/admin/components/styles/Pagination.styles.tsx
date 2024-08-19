import styled from "styled-components"

export const Container = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
`
export const PaginationButton = styled("div")<{ locked?: boolean }>`
  width: 2rem;
  height: 2rem;
  background-color: ${(props) => (props.locked ? "#A0A6AA" : "#6C757D")};
  margin-right: 0.5rem;
  border-radius: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0.8;
  cursor: ${(props) => (props.locked ? "default" : "pointer")};
  color: #fff;
`
