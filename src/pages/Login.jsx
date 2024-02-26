import { Grid, TextField, Paper, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useSnackbar from "../hooks/useSnackbar";
import { useAPI } from "../hooks/useAPI";
import Snackbar from "../components/Snackbar";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ userName: "", password: "" });
  const { isSnackbarVisible, showSnackbar, closeSnackbar } = useSnackbar();

  const {
    error: authError,
    isSuccess,
    makeRequest: authenticateUser,
    data: userData,
  } = useAPI({
    path: "UserManagement/AuthenticateUser",
    method: "post",
  });

  useEffect(() => {
    if (authError) {
      showSnackbar(true);
    }
  }, [authError, showSnackbar]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onLogin = async () => {
    if (user.userName === "" || user.password === "") {
      showSnackbar(true);
      return;
    }

    authenticateUser(null, {
      UserName: user.userName,
      Password: user.password,
    });
  };

  if (isSuccess && userData?.authToken) {
    localStorage.setItem("token", `Bearer ${userData.authToken}`);
    navigate("/customers");
  }

  return (
    <div style={{ padding: 30, marginTop: 100 }}>
      <Paper style={{ padding: 30 }}>
        <Grid
          container
          spacing={3}
          direction={"row"}
          justify={"center"}
          alignItems={"center"}
        >
          <Grid item xs={12} sm={6} style={{ textAlign: "center" }}>
            <Typography variant="h4">Bill Manager</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid
              container
              spacing={3}
              direction={"column"}
              justify={"center"}
              alignItems={"center"}
            >
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  value={user.userName}
                  name="userName"
                  label="Username"
                  type="text"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  name="password"
                  value={user.password}
                  label="Password"
                  type="password"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={onLogin} fullWidth>
                  Login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        message={authError}
        open={isSnackbarVisible}
        setOpen={showSnackbar}
        onClose={closeSnackbar}
      />
    </div>
  );
};

export default Login;
