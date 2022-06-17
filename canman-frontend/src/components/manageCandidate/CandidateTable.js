import React from "react";
import CandidateTableRow from "./CandidateTableRow";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

function CandidateTable({ candidates, setCandidates, handleErrors }) {
  // Handling Delete Candidate in local state
  const deleteCandidate = (value) => {
    const filteredCandidate = candidates.filter(
      (candidate) => candidate.email !== value.email
    );
    setCandidates(filteredCandidate);
  };

  return (
    <>
      <TableContainer component={Paper}>
        {/* Candidate Table start from here */}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Date Of Birth</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Result</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate, index) => (
              <CandidateTableRow
                candidate={candidate}
                deleteCandidate={deleteCandidate}
                handleErrors={handleErrors}
                index={index}
                key={index}
              />
            ))}
          </TableBody>
        </Table>
        {/* Candidate Table End here */}
      </TableContainer>
    </>
  );
}

export default CandidateTable;
