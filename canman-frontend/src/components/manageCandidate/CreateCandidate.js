import React from "react";
import axios from "axios";

import { TextField } from "@mui/material";
import SubmitButton from "../Buttons/SubmitButton";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

//Yup object for client side form validation
const schema = yup.object().shape({
  email: yup
    .string("That doesn't look like an Email Address")
    .email("Email is not Valid")
    .required("An Email Address is required"),
  name: yup
    .string("That doesn't look like a name")
    .required("Name is required"),
  result: yup.string(),
  DOB: yup
    .string("That doesn't look like date of birth")
    .required("Date of Birth is required"),
});

function CreateCandidate({ handleErrors }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("myToken");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Creation Form handling
  const submitForm = (data) => {
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/landing/candidate`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          handleErrors({
            error: false,
            message: response.data.message || "Candidate created successfully!",
          });
          return navigate("/landing");
        } else {
          handleErrors({
            error: true,
            message: response.data.message || "Failed to create the Candidate!",
          });
        }
      })
      .catch((error) => {
        handleErrors({
          error: true,
          message:
            error.response.data.message || "Failed to create the Candidate!",
        });
      });
  };

  return (
    <>
      <section className="vh-100">
        <div className="container py-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-sm-3 col-md-6 col-lg-4">
              <div className="card shadow" style={{ borderRadius: "0.2rem" }}>
                <div className="card-body p-4 text-center d-flex flex-column align-items-between gap-5">
                  <div className="title">Create Candidate</div>
                  <form
                    onSubmit={handleSubmit(submitForm)}
                    className="d-flex flex-column gap-4 align-items-center"
                  >
                    <TextField
                      variant="outlined"
                      type="text"
                      name="name"
                      label="Name"
                      {...register("name")}
                      helperText={errors.name?.message}
                    />
                    <TextField
                      variant="outlined"
                      type="text"
                      name="email"
                      label="Email"
                      {...register("email")}
                      helperText={errors.email?.message}
                    />
                    <TextField
                      variant="outlined"
                      type="text"
                      name="DOB"
                      label="Date of Birth"
                      placeholder="DD/MM/YYYY"
                      helperText={errors.DOB?.message}
                      {...register("DOB")}
                    />
                    <select
                      className="form-select-sm form-select"
                      style={{ width: "75%" }}
                      name="result"
                      {...register("result")}
                    >
                      <option value="SHORTLIST">SHORTLIST</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                    <SubmitButton>Create</SubmitButton>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CreateCandidate;
