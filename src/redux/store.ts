import { configureStore } from "@reduxjs/toolkit"

import web3Reducer from "../redux/web3Reducer"
import utilReducer from "../redux/utilReducer"

export default configureStore({
  reducer: {
    web3State: web3Reducer,
    utilState: utilReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
