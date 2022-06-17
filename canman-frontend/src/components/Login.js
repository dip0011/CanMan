import React from "react";
import axios from "axios";

import { TextField } from "@mui/material";
import SubmitButton from "./Buttons/SubmitButton";

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
  password: yup
    .string("That doesn't look like a strong Password")
    .min(8, "Password must be Min 8 Alpha Numeric")
    .required("Password is required"),
});

function Login({ handleErrors }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Login form handle
  const submitForm = (data) => {
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/login`, data)
      .then((response) => {
        if (response.data.success) {
          localStorage.setItem("myToken", response.data.token);
          handleErrors({
            error: false,
            message: "Successfully LoggedIn",
          });
          return navigate("/landing");
        } else {
          handleErrors({
            error: true,
            message: response.data.message || "Login failed!",
          });
        }
      })
      .catch((error) => {
        handleErrors({
          error: true,
          message: error.response.data.message || "Login failed!",
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
                  <div className="title">Login</div>
                  <form
                    onSubmit={handleSubmit(submitForm)}
                    className="d-flex flex-column gap-4 align-items-center"
                  >
                    <TextField
                      variant="outlined"
                      type="text"
                      name="email"
                      label="Email id"
                      {...register("email")}
                      helperText={errors.email?.message}
                    />
                    <TextField
                      variant="outlined"
                      type="password"
                      name="password"
                      label="Password"
                      helperText={
                        errors.password?.message || "Minimum 8 Alpha numeric"
                      }
                      {...register("password")}
                    />
                    <SubmitButton>Login</SubmitButton>
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

export default Login;
