import axios from "axios"
import { HOST_URI } from "../config"

const url = `${HOST_URI}/properties`

/*** @note
 * THERE IS A DELAY IN GETTING THE LOCALSTORAGE VALUE SO I JUST DECIDED TO
 * PUT THE LOCALSTORAGE BY EACH FUNCTION.
 */

export const getProperties = async (limit: number, offset: number) => {
  const jwt = localStorage.getItem("token")
  return axios({
    method: "GET",
    url: `${url}/${limit}/${offset}`,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  })
}

export const getPropertyById = async (id: any) => {
  const jwt = localStorage.getItem("token")
  return axios({
    method: "GET",
    url: `${url}/${id}`,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  })
}

export const getPropertyJson = async (link: string) => {
  const jwt = localStorage.getItem("token")
  return axios({
    method: "GET",
    url: link,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  })
}

export const updateProperty = (id: any, data: any) => {
  const jwt = localStorage.getItem("token")
  return axios({
    method: "PUT",
    url: `${url}/${id}/info`,
    data,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  })
}

export const createProperty = (data: any) => {
  const jwt = localStorage.getItem("token")
  return axios({
    method: "POST",
    url: `${url}/new/property`,
    data,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  })
}

export const deactivateProperty = (id: number | string | undefined) => {
  const jwt = localStorage.getItem("token")
  return axios({
    method: "POST",
    url: `${url}/deactivate/${id}`,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  })
}

export const updatePropertyNft = (id: any, data: any) => {
  const jwt = localStorage.getItem("token")
  return axios({
    method: "PUT",
    url: `${url}/${id}/info/nft`,
    data,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  })
}

export const uploadPropertyImage = (
  formData: any,
  propertyId: String | number
) => {
  const jwt = localStorage.getItem("token")
  return axios({
    method: "POST",
    data: formData,
    url: `${HOST_URI}/tools/uploader/image/${propertyId}`,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "multipart/form-data",
    },
  })
}
