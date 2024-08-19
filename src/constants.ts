require("dotenv").config()

export const enum Breakpoint {
  xs = "0rem",
  sm = "37.5rem",
  md = "56.25rem",
  md2 = "43.75rem",
  lg = "75rem",
  xl = "96rem",
  xxl = "1200rem",
}
export const enum BreakpointInPx {
  xl = "1536px",
  lg = "1200px",
  md = "900px",
  md2 = "700px",
  sm = "600px",
}

export const NETWORK_NAME =
  process.env.REACT_APP_NETWORK_NAME ?? "correct network"

export const aboutManageLife =
  "ManageLife is reinventing how people experience purchasing and living in a home. Through an innovative approach to home buying, coupled with our home services, we make living in a home both affordable and sustainable for all families."

export const ML_STOCK_IMG =
  "https://res.cloudinary.com/dbjlcflj0/image/upload/v1667559320/manage-life/default-NFT-image_jzvv6h.png"
