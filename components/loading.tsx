import { Paper, CircularProgress } from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <>
      {" "}
      <Paper
        sx={{
          marginTop: "1rem",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Paper>
    </>
  );
}
