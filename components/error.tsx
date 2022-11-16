import { Alert } from "@mui/material";
import React from "react";

export default function Error() {
  return (
    <>
      <Alert sx={{ marginTop: "1rem" }} severity="error">
        Error Loading Page - try logging in
      </Alert>
    </>
  );
}
