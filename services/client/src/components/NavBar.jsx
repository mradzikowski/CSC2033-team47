import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
// import { AppBar, Toolbar, Typography, Box } from "@mui/material/";

const NavBar = (props) => {
  let menu = (
    <div className="menu">
      <Link to="/" className="menuItem">
        CLIMATEXTRACTOR
      </Link>
      {/* <Link to="/datasets" data-testid="nav-datasets" className="menuItem">
        DATASETS
      </Link> */}
      {/* <Link to="/users" data-testid="nav-categories" className="menuItem">
        USERS
      </Link> */}
      <Link to="/data" className="menuItem">
        DATA
      </Link>
      <Link to="/register" data-testid="nav-register" className="menuItem">
        REGISTER
      </Link>
      <Link to="/login" data-testid="nav-login" className="menuItem">
        LOG IN
      </Link>
    </div>
  );
  if (props.isAuthenticated()) {
    menu = (
      <div className="menu">
        <Link to="/" className="menuItem">
          CLIMATEXTRACTOR
        </Link>
        <Link to="/status" data-testid="nav-status" className="menuItem">
          ACCOUNT
        </Link>
        {/* <Link to="/datasets" data-testid="nav-datasets" className="menuItem">
          DATASETS
        </Link> */}
        {/* <Link to="/users" data-testid="nav-categories" className="menuItem">
          USERS
        </Link> */}
        <Link to="/data" className="menuItem">
          DATA
        </Link>
        <Link to="/datasets/upload" className="menuItem">
          UPLOAD 
        </Link>
        <span
          // eslint-disable-next-line react/jsx-handler-names
          onClick={props.logoutUser}
          data-testid="nav-logout"
          className="menuItem"
        >
          LOG OUT
        </span>
      </div>
    );
  }
  return (
    <div>
      {menu}
    </div>
  );
};

NavBar.propTypes = {
  // title: PropTypes.string.isRequired,
  logoutUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
};

export default NavBar;
