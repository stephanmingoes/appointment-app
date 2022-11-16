import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import UserLoggedIn from "../hooks/UserLoggedIn";

export default function Component() {
  const { isLoggedIn } = UserLoggedIn();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/"> Appointment App</Link>
          </Typography>

          {isLoggedIn ? (
            <>
              <Button color="inherit">
                <Link href="/profile"> Profile</Link>
              </Button>

              <Button color="inherit">
                <Link href="/doctors"> Doctors </Link>
              </Button>

              <Button
                color="inherit"
                onClick={() => {
                  localStorage.removeItem("profile");
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button color="inherit">Signup</Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
