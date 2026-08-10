import { Outlet } from "react-router"
import { CssBaseline } from "@mui/material"

const Root = () => {
  return (
    <>
    <CssBaseline />
    <Outlet />
    </>
  )
}

export default Root