export interface IGetMarketItemResponse {
  name: string
  description: string
  externalLink: string
  image: string
  youtubeUrl: string
  animationUrl: string
  ownerName: string
  doingBusinessAs: string
  propertyId: any
  geoId: string
  legalDescription: string
  stateCode: string
  taxJurisdictions: string
  appraisedValue: number
  neighborhood: string
  abstractCode: string
  ccrDeclaration: string
  operatingAgreement: string
  membershipContract: string
  daoContract: string
  heating: string
  cooling: string
  from: string
  to: string
  hasNft: null | boolean
  views: number
  status: string
  _id: string
  attributes: NftAttribute[]
  standoutFeatures: string[]
  address: Address
  mlDescription: string
  favorites: number
  minSalePrice: any
}

export interface NftAttribute {
  trait_type: string
  display_type: string
  _id: string
  value: string | number | null
}

export interface Address {
  address1: string
  address2: string
  city: string
  state: string
  country: string
  zipCode: string
  _id: string
}
