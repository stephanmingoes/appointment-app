import React from "react";
import { Button } from "@mui/material";

import Link from "next/link";
export default function Home() {
  return (
    <>
      <div style={{ margin: "1rem 0" }}>
        <h1>Patient Appointment App 📑</h1>
        <p style={{ fontSize: "2rem", color: "grey" }}>
          This is an app that enables users to book appointment with doctors.
        </p>
        <Button sx={{ marginRight: "1rem" }} variant="contained">
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button variant="contained">
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    </>
  );
}
