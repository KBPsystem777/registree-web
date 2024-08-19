export interface IPropertyDetailedInformation {
  name: string
  description: string
  externalLink: string
  image: string
  youtubeUrl: string
  animationUrl: string
  ownerName: string
  doingBusinessAs: string
  propertyId: number
  geoId: string
  legalDescription: string
  stateCode: string
  taxJurisdictions: string
  appraisedValue: number | null
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
  hasNft: null
  views: number
  status: string
  _id: string
  attributes: Attribute[]
  standoutFeatures: string[]
  address: Address
  mlDescription: string
  favorites: number
  minSalePrice: number
  rooms: string[]
}

interface Attribute {
  trait_type: string
  display_type: string
  _id: string
  value: string | number | null
}

interface Address {
  address1: string
  address2: string
  city: string
  state: string
  country: string
  zipCode: string
  _id: string
}
