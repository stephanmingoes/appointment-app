import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import { Box, Button, Paper, Typography } from "@mui/material";
import validator from "validator";
import UserLoggedIn from "../../hooks/UserLoggedIn";

type LoginType = {
  email: string;
  password: string;
};

export default function Login() {
  const { isLoggedIn } = UserLoggedIn();
  const router = useRouter();
  const [creds, setCreds] = useState<LoginType>({
    email: "",
    password: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const updateFields = (e: any) => {
    const { name, value } = e.target;
    setCreds((prev) => ({ ...prev, [name]: value }));
  };
  const textBoxSx = {
    marginBottom: "1rem",
  };
  const loginUser = async () => {
    try {
      if (!validator.isEmail(creds.email)) {
        enqueueSnackbar("Invalid Email");
        return;
      }
      enqueueSnackbar("Wait while we log you in", { variant: "info" });
      const signupdata = await axios.post("/api/user/login", creds);
      localStorage.setItem("profile", JSON.stringify(signupdata.data.data));
      enqueueSnackbar(signupdata.data.message, { variant: "success" });
      setCreds({
        email: "",
        password: "",
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Something went wrong logging you up", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) router.push("/profile");
  }, [isLoggedIn, router]);
  return (
    <>
      <Box
        sx={{
          maxWidth: 500,
          height: "auto",
          padding: "2rem 1rem",
          margin: "2rem auto",
        }}
        component={Paper}
      >
        <Typography marginBottom={"1rem"} textAlign="center" variant="h4">
          Login
        </Typography>

        <TextField
          required
          name="email"
          type="email"
          value={creds.email}
          onChange={updateFields}
          label="Email Address"
          variant="outlined"
          sx={textBoxSx}
          fullWidth
        />
        <TextField
          required
          name="password"
          label="Password"
          value={creds.password}
          onChange={updateFields}
          type="password"
          variant="outlined"
          sx={textBoxSx}
          fullWidth
        />
        <br />
        <br />
        <Button variant="contained" onClick={loginUser} fullWidth>
          Login
        </Button>
      </Box>
    </>
  );
}
