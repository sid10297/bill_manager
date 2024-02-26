import { AppBar, MenuItem, Stack, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <MenuItem onClick={() => navigate("customers")}>Customers</MenuItem>
        <MenuItem onClick={() => navigate("bills")}>Bills</MenuItem>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          alignItems="center"
          flexGrow={1}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
