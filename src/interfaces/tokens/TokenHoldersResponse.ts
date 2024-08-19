export type ITokenHoldersResponse = {
  success: boolean
  records: Record[]
}

type Record = {
  address: string
  balance: string
}
