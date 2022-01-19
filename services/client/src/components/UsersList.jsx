import React from "react";
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";

// Unused component for displaying a list of all users

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
            <Paper className="username">{user.username}</Paper>
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
