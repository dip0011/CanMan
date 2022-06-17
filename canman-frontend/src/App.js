import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Landing from "./components/Landing";
import CreateCandidate from "./components/manageCandidate/CreateCandidate";
import PageNotFound from "./components/PageNotFound";
import DisplayError from "./components/notifications/DisplayError";

function App() {
  const [errorMessage, setErrorMessage] = useState("");

  //Error Alert Open/Close handler
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setErrorMessage("");
    setOpen(false);
  };
  const handleErrors = (errors) => {
    setErrorMessage(errors);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Register handleErrors={handleErrors} />} />
        <Route
          path="/register"
          element={<Register handleErrors={handleErrors} />}
        />
        <Route path="login" element={<Login handleErrors={handleErrors} />} />
        <Route
          path="landing"
          element={<Landing handleErrors={handleErrors} />}
        />
        <Route
          path="create-candidate"
          element={<CreateCandidate handleErrors={handleErrors} />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <DisplayError
        open={open}
        handleClose={handleClose}
        errorMessage={errorMessage}
      />
    </>
  );
}

export default App;
