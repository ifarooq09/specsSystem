import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Tooltip } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import { SiAwsorganizations } from "react-icons/si";
import { TbCategoryMinus } from "react-icons/tb";
import { MdDevicesOther } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SideBarItems = () => {
  const navigate = useNavigate(); // Correctly use useNavigate hook

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon style={{ height: 20, width: 20 }}/>,
      path: "/dashboard",
    },
    {
      text: "Users",
      icon: <FaRegUser style={{ height: 20, width: 20}}/>,
      path: "/users"
    },
    {
      text: "Directorates",
      icon: <SiAwsorganizations style={{ height: 20, width: 20}}/>,
      path: "/directorates"
    },
    {
      text: "Categories",
      icon: <TbCategoryMinus style={{ height: 20, width: 20}}/>,
      path: "/categories"
    },
    {
      text: "Specifications",
      icon: <MdDevicesOther style={{ height: 20, width: 20}}/>,
      path: "/specifications"
    },
  ];

  return (
    <>
      {menuItems.map((item) => (
        <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
          <div style={{ display: 'flex', alignItems: 'center'}}>
            <Tooltip title={item.text} placement="right">
              <ListItemIcon>{item.icon}</ListItemIcon>
            </Tooltip>
            <ListItemText primary={item.text} />
          </div>
        </ListItemButton>
      ))}
    </>
  );
};

export default SideBarItems;
