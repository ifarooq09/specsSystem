import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SideBarItems = () => {
  const navigate = useNavigate(); // Correctly use useNavigate hook

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "User",
      icon: <FaUser />,
      path: "/createUser"
    },
  ];

  return (
    <>
      {menuItems.map((item) => (
        <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
          <div style={{ display: 'flex', alignItems: 'center'}}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </div>
        </ListItemButton>
      ))}
    </>
  );
};

export default SideBarItems;
