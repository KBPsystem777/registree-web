import { useEffect, useState, useRef } from "react"
import styled from "styled-components"

import { Breakpoint } from "../../../constants"

import { useTokenStore } from "../../../stores/token/useTokenStore"

import * as mlStyle from "../../../MLStyles"

const pageSize = 10

function useIsMounted() {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  })

  return isMounted
}

export default function Holders() {
  const [holders, setHolders] = useState<object[]>([])
  const [totalQty, setTotalQty] = useState(0)
  const [loading, setLoading] = useState(false)
  const [transferList, setTransferList] = useState<object[]>([])
  const [totalPage, setTotalPage] = useState(0)
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [showPagination, setShowPagination] = useState(false)

  const { tokenHoldersCount, getTokenHoldersData, tokenHolderData } =
    useTokenStore()

  const isMountedRef = useIsMounted()

  useEffect(() => {
    getTokenHoldersData()
  }, [getTokenHoldersData])

  const tokenData = useTokenStore((state) => state.tokenHolderData)
  const isloading = useTokenStore((state) => state.tokenDataLoading)

  function handleFirstClick() {
    const start = 0
    const end = pageSize

    setHolders(transferList.slice(start, end))

    setCurrentPage(1)
  }

  function handlePrevClick() {
    const nextCurrentPage = currentPage - 1
    const start = nextCurrentPage * pageSize - pageSize
    const end = nextCurrentPage * pageSize

    setHolders(transferList.slice(start, end))

    if (currentPage >= 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  function handleNextClick() {
    const start = currentPage * pageSize
    const end = currentPage * pageSize + pageSize

    setHolders(transferList.slice(start, end))

    if (currentPage <= totalPage) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  function handleLastClick() {
    const start = totalPage * pageSize - pageSize
    const end = totalPage * pageSize

    setHolders(transferList.slice(start, end))

    setCurrentPage(totalPage)
  }

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)

        const tokenHolders = tokenHolderData
        if (isMountedRef.current) {
          if (
            tokenHolders?.data?.records &&
            Array.isArray(tokenHolders?.data?.records)
          ) {
            const sorted = await tokenHolders.data.records.sort(
              (a: any, b: any) => Number(b.balance) - Number(a.balance)
            )
            let totalQty_: number = 0
            const transferList_ = await Promise.all(
              sorted.map((item: any, i: number) => {
                totalQty_ += Number(item.balance)
                return {
                  rank: i + 1,
                  address: item.address,
                  balance: item.balance,
                  percentage: "pct",
                }
              })
            )
            setTransferList(transferList_)

            let totalPage_ = transferList_.length / pageSize

            setTotalPage(totalPage_ < 1 ? 1 : totalPage_)

            if (totalPage_ < 1) {
              setTotalPage(1)
            } else {
              if (totalPage_ % 2 === 0) {
                setTotalPage(totalPage_)
              } else {
                setTotalPage(Math.floor(totalPage_) + 1)
              }
            }
            setHolders(transferList_.slice(0, pageSize))
            setOffset(currentPage * pageSize)
            setTotalQty(totalQty_)
          }

          setTimeout(() => {
            setLoading(false)
          }, 2000)
        }
      } catch (e) {
        setLoading(false)
      }
    })()
  }, [isMountedRef])

  const lockPrev = currentPage <= 1
  const lockNext = currentPage >= totalPage

  return (
    <Container>
      <Wrapper>
        <Header>Holders</Header>
        {!loading && totalPage > 1 && (
          <Pagination>
            {!showPagination ? (
              <PaginationLoadMore
                onClick={() => {
                  setShowPagination(true)
                  handleNextClick()
                }}
              >
                <Blue>Load more...</Blue>
              </PaginationLoadMore>
            ) : (
              <>
                <PaginationButton
                  locked={lockPrev || loading}
                  onClick={() =>
                    lockPrev || loading ? null : handleFirstClick()
                  }
                >
                  <i className="fa fa-caret-left"></i>
                  <i className="fa fa-caret-left"></i>
                </PaginationButton>
                <PaginationButton
                  locked={lockPrev || loading}
                  onClick={() =>
                    lockPrev || loading ? null : handlePrevClick()
                  }
                >
                  <i className="fa fa-caret-left"></i>
                </PaginationButton>
                <PaginationButton
                  locked={lockNext || loading}
                  onClick={() =>
                    lockNext || loading ? null : handleNextClick()
                  }
                >
                  <i className="fa fa-caret-right"></i>
                </PaginationButton>
                <PaginationButton
                  locked={lockNext || loading}
                  onClick={() =>
                    lockNext || loading ? null : handleLastClick()
                  }
                >
                  <i className="fa fa-caret-right"></i>
                  <i className="fa fa-caret-right"></i>
                </PaginationButton>
              </>
            )}
          </Pagination>
        )}
        <RowHeader>
          <Cell header wPct={7}>
            Rank
          </Cell>
          <Cell header wPct={53}>
            Address
          </Cell>
          <Cell header wPct={20}>
            Balance
          </Cell>
          <Cell header wPct={20}>
            Percentage
          </Cell>
        </RowHeader>
        <Content>
          {loading ? (
            <LoadingWrap>
              <i className="fa fa-circle-o-notch fa-spin"></i>
            </LoadingWrap>
          ) : (
            (holders || []).map((holder: any, i) => {
              return (
                <RowData key={i}>
                  <Cell wPct={7}>{holder.rank}</Cell>
                  <Cell wPct={53}>
                    <Blue>{holder.address}</Blue>
                  </Cell>
                  <Cell wPct={20}>{holder.balance}</Cell>
                  <Cell wPct={20}>
                    {(
                      (Number(holder.balance) / Number(totalQty)) *
                      100
                    ).toFixed(6)}
                    %
                  </Cell>
                </RowData>
              )
            })
          )}
        </Content>
      </Wrapper>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 4%;
  margin-bottom: 1rem;
`
const Wrapper = styled.div`
  width: 100%;
  border-right: 1px solid rgb(0 0 0 / 0.1);
  border-left: 1px solid rgb(0 0 0 / 0.1);
  border-radius: 0.3rem;
  overflow: hidden;
`

const Header = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: #2a72a7;
  display: flex;
  align-items: center;
  color: #fff;
  font-family: ${(props) => mlStyle.HEADER_FONT};
  font-size: ${(props) => mlStyle.HEADER_FONT_SIZE};
  font-weight: 400;
  padding-left: 1vw;
  @media (max-width: ${(props) => Breakpoint.lg}) {
    font-size: 12pt;
  }
`
const Pagination = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`
const PaginationLoadMore = styled.span`
  font-size: 0.9rem;
  margin-right: 1rem;
  letter-spacing: 0.09rem;
  cursor: pointer;
`

const PaginationButton = styled("div")<{ locked?: boolean }>`
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
const RowHeader = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  background-color: rgb(0 0 0 / 0.1);
  display: flex;
  justify-content: space-between;
`
const Cell = styled("div")<{ header?: boolean; wPct?: number }>`
  width: ${(props) => props.wPct || 100}%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  font-size: ${(props) => mlStyle.FONT_SIZE};
  font-weight: ${(props) => (props.header ? 500 : 200)};
  display: flex;
  align-items: center;
  padding-left: 1vw;
  @media (max-width: ${(props) => Breakpoint.sm}) {
    font-size: 0.6rem;
  }
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
`
const RowData = styled.div`
  width: 100%;
  height: ${(props) => mlStyle.HEADER_HEIGHT};
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
`
const Blue = styled.span`
  color: #3498db;
`
const LoadingWrap = styled.div`
  width: 100%;
  height: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid rgb(0 0 0 / 0.1);
`
