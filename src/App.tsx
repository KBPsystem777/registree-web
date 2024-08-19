import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

import "./App.css"
import RouteAdmin from "./RouteAdmin"
import RouteLookup from "./RouteLookup"

const useOptimizedComponentWillMount = (callback: any) => {
  const mounted = useRef(false)
  if (!mounted.current) callback()

  useEffect(() => {
    mounted.current = true
  }, [])
}

export default function App() {
  const location = useLocation()

  useOptimizedComponentWillMount(async () => {
    //componentWillMount todo:
  })

  return (
    <>
      {location.pathname.includes("/user/connect/") ? (
        <RouteLookup />
      ) : (
        <RouteAdmin />
      )}
    </>
  )
}
