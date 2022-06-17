import React from "react";
import axios from "axios";

import { TextField, Link } from "@mui/material";
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

function Register({ handleErrors }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Register form handle
  const submitForm = (data) => {
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}`, data)
      .then((response) => {
        if (response.data.success) {
          handleErrors({
            error: false,
            message: "Successfully Registered",
          });
          return navigate("/login");
        } else {
          handleErrors({
            error: true,
            message: response.data.message,
          });
        }
      })
      .catch((error) => {
        handleErrors({
          error: true,
          message: error.response.data.message || "Registration Failed!",
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
                  <div className="title">Sign Up</div>
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
                      type="text"
                      name="phoneNumber"
                      label="Phone Number"
                      {...register("phoneNumber")}
                      helperText={errors.phoneNumber?.message}
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
                    <SubmitButton>Sign Up</SubmitButton>
                  </form>
                  <Link href="/login" className="p-4">
                    Login Here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;
