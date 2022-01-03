import React from "react";
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const RankingUsersList = (props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell align="right">Upload counter</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.usersRanking.map((user) => (
            <TableRow
              key={user.user_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {user.username}
              </TableCell>
              <TableCell align="right">{user.dataset_upload_counter}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

RankingUsersList.propTypes = {
  usersRanking: PropTypes.array.isRequired,
};

export default RankingUsersList;
