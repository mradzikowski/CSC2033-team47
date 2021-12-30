import React from "react";
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";

const UsersList = (props) => {
  return (
    <div>
      {props.users.map((user) => {
        return (
          <Box
            key={user.user_id}
            sx={{
              display: "grid",
              gridTemplateColumns: { md: "1fr 1fr" },
            }}
          >
            <Paper className="box title is-4 username">{user.username}</Paper>
          </Box>
        );
      })}
    </div>
  );
};

UsersList.propTypes = {
  users: PropTypes.array.isRequired,
};

export default UsersList;
