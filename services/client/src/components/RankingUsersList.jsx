import React from "react";
import Paper from "@mui/material/Paper";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

class RankingUsersList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userRanking: [],
    };
  }

  componentDidMount() {
    this.getUserRankings();
  }

  getUserRankings() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/ranking`)
      .then((res) => {
        this.setState({ userRanking: res.data });
      }) // updated
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    if (this.state.userRanking.length > 0) {
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
              {this.state.userRanking.map((user) => (
                <TableRow
                  key={user.user_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.username}
                  </TableCell>
                  <TableCell align="right">
                    {user.dataset_upload_counter}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      return <div />;
    }
  }
}

export default RankingUsersList;
