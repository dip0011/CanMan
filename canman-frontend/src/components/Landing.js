import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import CandidateTable from "./manageCandidate/CandidateTable";
import ClickButton from "./Buttons/ClickButton";
import Link from "@mui/material/Link";

function Landing({ handleErrors }) {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const token = localStorage.getItem("myToken");

  // Take all candidate from database and set in local state
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/landing`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setCandidates(response.data.candidates);
        } else {
          handleErrors({
            error: true,
            message: response.data.message || "Please Authenticate",
          });
          return navigate("/login");
        }
      })
      .catch((error) => {
        handleErrors({
          error: true,
          message: error.response.data.message || "Please Authenticate",
        });
        navigate("/login");
      });
  }, [handleErrors, navigate, token]);

  // Logout handler
  const logoutHandler = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.success) {
          handleErrors({
            error: false,
            message: response.data.message || "Sucessfully Logout!",
          });
          localStorage.removeItem("myToken");
          return navigate("/login");
        } else {
          handleErrors({
            error: true,
            message: response.data.message || "Failed to Logout!",
          });
        }
      })
      .catch((error) => {
        handleErrors({
          error: true,
          message: error.response.data.message || "Failed to Logout!",
        });
      });
  };

  return (
    <>
      <section className="vh-100">
        <div className="container py-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg">
              <div className="card shadow" style={{ borderRadius: "0.2rem" }}>
                <CandidateTable
                  candidates={candidates}
                  setCandidates={setCandidates}
                  handleErrors={handleErrors}
                />
              </div>
            </div>
          </div>
        </div>
        <Link href="/create-candidate" className="p-4">
          Create New candidate
        </Link>
      </section>

      {/* Logout Button */}
      <ClickButton handler={logoutHandler}>Logout</ClickButton>
    </>
  );
}

export default Landing;
