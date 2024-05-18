import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const UserLayout = () => {
  return (
    <>
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Outlet />
    </Box>
  </>
  )
}

export default UserLayout
