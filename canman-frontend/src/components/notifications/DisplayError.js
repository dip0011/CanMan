import React, { useEffect } from "react";
import { Alert, AlertTitle } from "@mui/material";

function DisplayError({ open, handleClose, errorMessage }) {
  // Notifications close after 1000ms
  useEffect(() => {
    setTimeout(() => {
      handleClose();
    }, 1000);
  });
  return (
    <>
      {/* Show only is errorMessage is set */}
      {errorMessage.message ? (
        <Alert
          className="errorBox shadow"
          onClose={() => handleClose()}
          severity={errorMessage.error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          <AlertTitle>{errorMessage.error ? "Error" : "Success"}</AlertTitle>
          <strong>
            {errorMessage.message && <span>{errorMessage.message}</span>}
          </strong>
        </Alert>
      ) : null}
    </>
  );
}

export default DisplayError;
