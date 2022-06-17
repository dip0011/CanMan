import React from "react";
import axios from "axios";

import { Modal, Box, TextField } from "@mui/material";
import SubmitButton from "../Buttons/SubmitButton";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

//Yup object for client side form validation
const schema = yup.object().shape({
  name: yup
    .string("That doesn't look like a name")
    .required("Name is required"),
  DOB: yup
    .string("That doesn't look like date of birth")
    .required("Date of Birth is required"),
});

function PopupModal({
  candidate,
  handleErrors,
  open,
  handleClose,
  setTempCandidate,
}) {
  const token = localStorage.getItem("myToken");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Candidate update handling
  const handleEdit = (value) => {
    const data = { ...value, email: candidate.email };
    axios
      .put(`${process.env.REACT_APP_SERVER_URL}/landing/candidate`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success) {
          handleErrors({
            error: false,
            message: response.data.message || "Candidate Updated Successfully!",
          });
          setTempCandidate({
            ...value,
            email: candidate.email,
            result: candidate.result,
          });
        } else {
          handleErrors({
            error: true,
            message: response.data.message || "Failed to Update the Candidate!",
          });
        }
      })
      .catch((error) => {
        handleErrors({
          error: true,
          message:
            error.response.data.message || "Failed to Update the Candidate!",
        });
      });
    // PopUpModal close after a Attempt
    handleClose();
  };
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box className="boxStyle">
          <div className="card-body p-4 text-center d-flex flex-column align-items-between gap-5">
            <div className="title">Update Candidate</div>
            <form
              onSubmit={handleSubmit(handleEdit)}
              className="d-flex flex-column gap-4 align-items-center"
            >
              <TextField
                variant="outlined"
                type="text"
                name="name"
                defaultValue={candidate.name}
                label="Name"
                {...register("name")}
                helperText={errors.name?.message}
              />
              <TextField
                variant="outlined"
                type="text"
                defaultValue={candidate.DOB}
                name="DOB"
                label="DateOfBirth"
                helperText={errors.DOB?.message}
                {...register("DOB")}
              />
              <SubmitButton>Update</SubmitButton>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default PopupModal;
