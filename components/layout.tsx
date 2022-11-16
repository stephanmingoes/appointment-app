import React from "react";
import Navbar from "./navbar";
import CssBaseline from "@mui/material/CssBaseline";
import { Container } from "@mui/material";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="lg">{children}</Container>
    </>
  );
}
