import { ethers } from "ethers"
import { MoralisProvider } from "react-moralis"
import { Provider } from "react-redux"
import { Web3ReactProvider } from "@web3-react/core"
import { BrowserRouter as Router } from "react-router-dom"

import ReactDOM from "react-dom/client"

import { SERVER_URL, APP_ID } from "./config"
import { AlertProvider } from "./hooks/AlertContext"
import { ModalProvider } from "./hooks/ModalContext"

import App from "./App"
import store from "./redux/store"
import "./index.css"
import reportWebVitals from "./reportWebVitals"

const getLibrary = (provider: any) => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 8000 // frequency provider is polling
  return library
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AlertProvider>
          <ModalProvider>
            <Router>
              <App />
            </Router>
          </ModalProvider>
        </AlertProvider>
      </Web3ReactProvider>
    </MoralisProvider>
  </Provider>
  // </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
