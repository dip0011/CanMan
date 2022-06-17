import React, { useState, useEffect } from "react";
import axios from "axios";

import { TableRow, TableCell } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import PopupModal from "../modals/PopupModal";

function CandidateTableRow({
  candidate,
  deleteCandidate,
  handleErrors,
  index,
}) {
  const [selection, setSelection] = useState("");
  const [tempCandidate, setTempCandidate] = useState("");

  // PopupModal open and close handle
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const token = localStorage.getItem("myToken");

  // Result value ['SHORTLIST', 'REJECTED'] handles in local state as well as databse from here
  const handleSelect = (value, email) => {
    setSelection(value);
    const data = { result: value, email };
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
            message: response.data.message || "Result Updated Successfully!",
          });
        } else {
          handleErrors({
            error: true,
            message: response.data.message || "Failed to Update the Result!",
          });
        }
      })
      .catch((error) => {
        handleErrors({
          error: true,
          message:
            error.response.data.message || "Failed to Update the Result!",
        });
      });
  };

  // Delete Candidate data from database
  const handleDelete = () => {
    axios
      .delete(
        `${process.env.REACT_APP_SERVER_URL}/landing/candidate/${candidate.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          handleErrors({
            error: false,
            message: response.data.message || "Candidate deleted Successfully!",
          });
          deleteCandidate(candidate);
        } else {
          handleErrors({
            error: true,
            message: response.data.message || "Failed to delete the Candidate!",
          });
        }
      })
      .catch((error) => {
        handleErrors({
          error: true,
          message:
            error.response.data.message || "Failed to delete the Candidate!",
        });
      });
  };

  // Set candidate data in local state
  useEffect(() => {
    setTempCandidate(candidate);
  }, [candidate]);

  return (
    <>
      {/* Candidate Table Row Starts from Here */}
      <TableRow
        key={tempCandidate.email}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}
      >
        <TableCell component="th" scope="row">
          {index + 1}
        </TableCell>
        <TableCell component="th" scope="row" align="left">
          {tempCandidate.name}
        </TableCell>
        <TableCell align="left">{tempCandidate.DOB}</TableCell>
        <TableCell align="left">{tempCandidate.email}</TableCell>
        <TableCell align="left">
          <select
            className="form-select-sm form-select"
            style={{ width: "50%" }}
            value={selection}
            onChange={(e) => {
              handleSelect(e.target.value, tempCandidate.email);
            }}
          >
            <option value={tempCandidate.result}>{tempCandidate.result}</option>
            <option
              value={
                tempCandidate.result === "SHORTLIST" ? "REJECTED" : "SHORTLIST"
              }
            >
              {tempCandidate.result === "SHORTLIST" ? "REJECTED" : "SHORTLIST"}
            </option>
          </select>
        </TableCell>
        <TableCell align="left">
          <EditIcon className="m-1 my-color" onClick={handleOpen} />
          <DeleteOutlinedIcon className="m-1 my-color" onClick={handleDelete} />
        </TableCell>
      </TableRow>
      {/* Candidate Table Row Ends Here */}

      {/* PopupModal for candidate data edit */}
      <PopupModal
        candidate={candidate}
        setTempCandidate={setTempCandidate}
        handleErrors={handleErrors}
        open={open}
        handleClose={handleClose}
      />
    </>
  );
}

export default CandidateTableRow;
