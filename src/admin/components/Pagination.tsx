import { useEffect, useState } from "react"

import { Container, PaginationButton } from "./styles/Pagination.styles"

export default function Pagination({
  value,
  total,
  lock,
  pageSize,
  first,
  prev,
  next,
  last,
}: any) {
  const [totalPage, setTotalPage] = useState(0)
  const [loadingPage, setLoadingPage] = useState(false)
  const [prevLock, setPrevLock] = useState(false)
  const [nextLock, setNextLock] = useState(false)
  const [offset, setOffset] = useState(0)
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [buttonTriggered, setButtonTriggered] = useState("")

  useEffect(() => {
    if (value && Array.isArray(value) && value.length > 0) {
      if (buttonTriggered === "FIRST") {
        setLoadingPage(true)
        if (value && Array.isArray(value) && value.length > 0) {
          setStart(1)
          let totalPage_ = total / pageSize < 1 ? 1 : total / pageSize
          if (totalPage_ > 1) {
            if (totalPage_ % 2 === 0) {
              setTotalPage(totalPage_)
            } else {
              setTotalPage(Math.floor(totalPage_) + 1)
            }
            setEnd(pageSize)
          } else {
            setEnd(total)
          }

          setPrevLock(true)
          setNextLock(false)
        } else {
          setStart(0)
          setEnd(0)
          setOffset(0)
          setPrevLock(true)
          setNextLock(true)
        }
        setLoadingPage(false)
      } else if (buttonTriggered === "PREV") {
        setLoadingPage(true)
        if (offset > -1) {
          if (value && Array.isArray(value) && value.length > 0) {
            setStart((prev) => prev - pageSize)
            setEnd(offset + pageSize)

            if (start - 1 === pageSize) {
              setPrevLock(true)
            } else {
              setPrevLock(false)
            }
            setNextLock(false)
          }
        }
        setLoadingPage(false)
      } else if (buttonTriggered === "NEXT") {
        setLoadingPage(true)
        if (value && Array.isArray(value) && value.length > 0) {
          setStart((prev) => prev + pageSize)
          if (value.length + end >= total) {
            setEnd((prev) => prev + value.length)
            setPrevLock(false)
            setNextLock(true)
          } else {
            setEnd((prev) => prev + pageSize)
            setPrevLock(false)
            setNextLock(false)
          }
        }
        setLoadingPage(false)
      } else if (buttonTriggered === "LAST") {
        setLoadingPage(true)
        if (value && Array.isArray(value) && value.length > 0) {
          let a = Math.floor(total / pageSize)
          let b = a * pageSize
          let c = total - a * pageSize + b
          if (b === c) {
            setStart(total - (pageSize - 1))
            setEnd(total)
            setPrevLock(false)
            setNextLock(true)
          } else if (b < c) {
            setStart(b + 1)
            setEnd(c)
            setPrevLock(false)
            setNextLock(true)
          }
        }
        setLoadingPage(false)
      } else {
        setStart(1)
        let totalPage_ = total / pageSize < 1 ? 1 : total / pageSize
        if (totalPage_ > 1) {
          if (totalPage_ % 2 === 0) {
            setTotalPage(totalPage_)
          } else {
            setTotalPage(Math.floor(totalPage_) + 1)
          }
          setEnd(pageSize)
          setPrevLock(true)
          setNextLock(false)
        } else {
          setEnd(total)
          setPrevLock(true)
          setNextLock(true)
        }
      }
    }
  }, [value, buttonTriggered])

  async function handleFirstClick() {
    setOffset(0)

    first(0)
    setButtonTriggered("FIRST")
  }

  async function handlePrevClick() {
    const newOffset = offset - pageSize
    setOffset(newOffset)

    prev(newOffset)
    setButtonTriggered("PREV")
  }

  async function handleNextClick() {
    const newOffset = offset + pageSize
    setOffset(newOffset)

    next(newOffset)
    setButtonTriggered("NEXT")
  }

  function handleLastClick() {
    let a = Math.floor(total / pageSize)
    let b = a * pageSize
    let c = total - a * pageSize + b
    if (b === c) {
      setStart(total - (pageSize - 1))
      setEnd(total)
      setPrevLock(false)
      setNextLock(true)
      setOffset(total - pageSize)
      last(total - pageSize)
    } else if (b < c) {
      setStart(b + 1)
      setEnd(c)
      setPrevLock(false)
      setNextLock(true)
      setOffset(b)
      last(b)
    }

    setButtonTriggered("LAST")
  }

  return (
    <Container>
      <span style={{ fontSize: "10pt", margin: "0 1.5rem" }}>
        {lock ? 0 : start} to {lock ? 0 : end} of {lock ? 0 : total}
      </span>
      <PaginationButton
        locked={lock || loadingPage || prevLock}
        onClick={() =>
          lock || loadingPage || prevLock ? null : handleFirstClick()
        }
      >
        <i className="fa fa-caret-left"></i>
        <i className="fa fa-caret-left"></i>
      </PaginationButton>
      <PaginationButton
        locked={lock || loadingPage || prevLock}
        onClick={() =>
          lock || loadingPage || prevLock ? null : handlePrevClick()
        }
      >
        <i className="fa fa-caret-left"></i>
      </PaginationButton>
      <PaginationButton
        locked={lock || loadingPage || nextLock}
        onClick={() =>
          lock || loadingPage || nextLock ? null : handleNextClick()
        }
      >
        <i className="fa fa-caret-right"></i>
      </PaginationButton>
      <PaginationButton
        locked={lock || loadingPage || nextLock}
        onClick={() =>
          lock || loadingPage || nextLock ? null : handleLastClick()
        }
      >
        <i className="fa fa-caret-right"></i>
        <i className="fa fa-caret-right"></i>
      </PaginationButton>
    </Container>
  )
}
