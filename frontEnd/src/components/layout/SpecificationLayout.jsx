import Sidebar from "./Sidebar"
import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"

const SpecificationLayout = () => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Outlet />
      </Box>
    </>
  )
}

export default SpecificationLayout