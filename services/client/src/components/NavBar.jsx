import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography, Box } from "@mui/material/";

const NavBar = (props) => {
  let menu = (
    <AppBar position="static">
      <Link to="/categories" data-testid="nav-categories">
        Categories
      </Link>
      <Link to="/datasets" data-testid="nav-datasets">
        Datasets
      </Link>
      <Link to="/users" data-testid="nav-categories">
        Users
      </Link>
      <Link to="/register" data-testid="nav-register">
        Register
      </Link>
      <Link to="/login" data-testid="nav-login">
        Log In
      </Link>
    </AppBar>
  );
  if (props.isAuthenticated()) {
    menu = (
      <AppBar>
        <Link to="/status" data-testid="nav-status">
          Account
        </Link>
        <Link to="/categories" data-testid="nav-categories">
          Categories
        </Link>
        <Link to="/datasets" data-testid="nav-datasets">
          Datasets
        </Link>
        <Link to="/users" data-testid="nav-categories">
          Users
        </Link>
        <Link to="/datasets/upload" className="navbar-item">
          Upload
        </Link>
        <span
          // eslint-disable-next-line react/jsx-handler-names
          onClick={props.logoutUser}
          data-testid="nav-logout"
        >
          Log Out
        </span>
      </AppBar>
    );
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Link to="/" className="title">
          {props.title}
        </Link>
        {menu}
      </AppBar>
    </Box>
  );
};

NavBar.propTypes = {
  title: PropTypes.string.isRequired,
  logoutUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
};

export default NavBar;
